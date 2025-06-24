# 📋 Guia de Migração para Produção - DashPMO

**Sistema de Gestão de Projetos PMO**  
**Versão:** 1.0 | **Data:** Junho 2025

---

## 🔄 ESTRATÉGIA DE MIGRAÇÃO EM DUAS FASES

### **FASE 1: Deploy Inicial com Supabase**
1. Subir aplicação em produção usando Supabase atual
2. Testar tudo funcionando perfeitamente
3. Validar performance e estabilidade

### **FASE 2: Migração para PostgreSQL Local**
1. Instalar e configurar PostgreSQL local
2. Migrar dados do Supabase para PostgreSQL
3. Atualizar .env para apontar para banco local
4. Validar funcionamento e fazer switch final

> ⚠️ **Importante:** Infra não terá acesso ao GitHub. Desenvolvedor enviará pacote com arquivos fonte compilados.

---

## 🎯 1. REQUISITOS DO AMBIENTE

### 1.1 Sistema Operacional
- **Suportados:** Windows Server 2019+, Ubuntu 20.04+, CentOS/RHEL 8+
- **Recomendado:** Ubuntu Server 22.04 LTS

### 1.2 PostgreSQL
- **Versão Mínima:** PostgreSQL 15.0
- **Versão Recomendada:** PostgreSQL 15.13
- **Configuração mínima:** 8GB RAM, 100GB SSD

### 1.3 Node.js e Runtime
- **Node.js:** Versão 18.17.0+ ou 20.0.0+
- **NPM:** Versão 9.0.0+

### 1.4 Servidor Web
- **Nginx:** 1.20+ (recomendado)
- **Certificado SSL:** Obrigatório

### 1.5 Hardware Mínimo
- **CPU:** 4 cores | **RAM:** 8GB | **Storage:** 200GB SSD

---

## 🚀 2. FASE 1: DEPLOY INICIAL COM SUPABASE

### 2.1 Preparação do Ambiente

```bash
# Instalar Node.js 20+
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Instalar Nginx
sudo apt update && sudo apt install nginx

# Instalar Certbot para SSL
sudo apt install certbot python3-certbot-nginx

# Criar usuário e diretórios
sudo useradd -m -s /bin/bash dashpmo
sudo mkdir -p /opt/dashpmo/{current,releases,shared}
sudo chown -R dashpmo:dashpmo /opt/dashpmo
```

### 2.2 Configuração .env FASE 1 (Supabase)

```bash
# /opt/dashpmo/shared/.env
NODE_ENV=production

# Supabase Configuration (Fase 1)
VITE_SUPABASE_URL=https://dzgxpcealclptocyjmjd.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR6Z3hwY2VhbGNscHRvY3lqbWpkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk5NDY0OTcsImV4cCI6MjA2NTUyMjQ5N30.m0-AKPsYR02w89_2riAxYr1-jt2ZraTu8nIVAKWVC8s

# Application Settings
APP_URL=https://seu-dominio.com
APP_NAME="DashPMO - Produção"

# Security (gerar novas chaves em produção)
JWT_SECRET=sua_jwt_secret_super_segura_aqui
ENCRYPTION_KEY=sua_encryption_key_aqui
```

### 2.3 Deploy da Aplicação FASE 1

```bash
# 1. Receber pacote do desenvolvedor (dashpmo-v1.0.0.tar.gz)
cd /opt/dashpmo/releases
tar -xzf dashpmo-v1.0.0.tar.gz
mv dashpmo-v1.0.0 v1.0.0

# 2. Configurar ambiente
cd v1.0.0
cp /opt/dashpmo/shared/.env .env

# 3. Verificar se o build já está incluído
ls -la dist/  # Deve existir pasta dist com arquivos

# 4. Ativar versão
ln -sfn /opt/dashpmo/releases/v1.0.0 /opt/dashpmo/current
```

---

## 🔄 3. FASE 2: MIGRAÇÃO PARA POSTGRESQL LOCAL

### 3.1 Instalação PostgreSQL

```bash
# Ubuntu/Debian
sudo apt update
wget -qO- https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -
echo "deb http://apt.postgresql.org/pub/repos/apt/ $(lsb_release -cs)-pgdg main" | sudo tee /etc/apt/sources.list.d/pgdg.list
sudo apt update && sudo apt install postgresql-15 postgresql-contrib-15

# CentOS/RHEL
sudo dnf install -y https://download.postgresql.org/pub/repos/yum/reporpms/EL-9-x86_64/pgdg-redhat-repo-latest.noarch.rpm
sudo dnf install -y postgresql15-server postgresql15-contrib
sudo /usr/pgsql-15/bin/postgresql-15-setup initdb
sudo systemctl enable postgresql-15 && sudo systemctl start postgresql-15
```

### 3.2 Configuração PostgreSQL

```sql
-- Conectar como postgres
sudo -u postgres psql

-- Criar usuário e banco
CREATE USER dashpmo_user WITH PASSWORD 'DashPMO@2025!Prod#';
CREATE DATABASE dashpmo_prod WITH OWNER = dashpmo_user ENCODING = 'UTF8';
GRANT ALL PRIVILEGES ON DATABASE dashpmo_prod TO dashpmo_user;

-- Sair do psql
\q
```

### 3.3 Configurações de Produção PostgreSQL

```ini
# /var/lib/pgsql/15/data/postgresql.conf
max_connections = 200
shared_buffers = 4GB
effective_cache_size = 12GB
maintenance_work_mem = 1GB
checkpoint_completion_target = 0.9
log_min_duration_statement = 1000ms
log_checkpoints = on
log_connections = on
```

```bash
# /var/lib/pgsql/15/data/pg_hba.conf
# Adicionar linha para aplicação:
host    dashpmo_prod    dashpmo_user    127.0.0.1/32    md5
```

---

## 📊 4. SCRIPTS PARA MIGRAÇÃO DE DADOS

### 4.1 Aplicar Migrations

```bash
#!/bin/bash
# aplicar_migrations.sh

DB_HOST="localhost"
DB_USER="dashpmo_user"
DB_NAME="dashpmo_prod"
MIGRATION_DIR="./supabase/migrations"

echo "🚀 Aplicando migrations..."

for migration in $(ls -1 $MIGRATION_DIR/*.sql | sort); do
    echo "📄 Aplicando: $(basename $migration)"
    psql -h $DB_HOST -U $DB_USER -d $DB_NAME -f "$migration"
    
    if [ $? -eq 0 ]; then
        echo "✅ $(basename $migration) - OK"
    else
        echo "❌ Erro em $(basename $migration)"
        exit 1
    fi
done

echo "🎉 Migrations aplicadas com sucesso!"
```

### 4.2 Backup do Supabase

```bash
#!/bin/bash
# backup_supabase.sh

SUPABASE_URL="https://dzgxpcealclptocyjmjd.supabase.co"
SUPABASE_KEY="sua_service_key_aqui"
BACKUP_DIR="./backup_supabase"

mkdir -p $BACKUP_DIR

# Principais tabelas do sistema
TABLES=(
    "projetos" "status_projeto" "entregas_status"
    "carteiras" "tipos_projeto" "tipos_status_entrega"
    "responsaveis_asa" "usuarios" "mudancas"
    "licoes_aprendidas" "incidentes" "configuracoes_sistema"
    "notificacoes" "logs_alteracoes"
)

for table in "${TABLES[@]}"; do
    echo "📊 Backup: $table"
    curl -X GET \
        -H "apikey: $SUPABASE_KEY" \
        -H "Authorization: Bearer $SUPABASE_KEY" \
        "$SUPABASE_URL/rest/v1/$table?select=*" \
        > "$BACKUP_DIR/${table}.json"
done

echo "✅ Backup completo em: $BACKUP_DIR"
```

### 4.3 Importar Dados

### 4.4 Atualizar .env FASE 2 (PostgreSQL Local)

```bash
# /opt/dashpmo/shared/.env
NODE_ENV=production

# PostgreSQL Configuration (Fase 2)
VITE_SUPABASE_URL=http://localhost:3001
VITE_SUPABASE_ANON_KEY=sua_jwt_key_local_gerada
DATABASE_URL=postgresql://dashpmo_user:DashPMO@2025!Prod#@localhost:5432/dashpmo_prod

# Application Settings  
APP_URL=https://seu-dominio.com
APP_NAME="DashPMO - Produção"

# Security
JWT_SECRET=sua_jwt_secret_super_segura_aqui
ENCRYPTION_KEY=sua_encryption_key_aqui
```

### 4.5 Switch para PostgreSQL

```bash
#!/bin/bash
# switch_to_postgresql.sh

echo "🔄 Fazendo switch para PostgreSQL local..."

# 1. Backup da configuração atual
cp /opt/dashpmo/shared/.env /opt/dashpmo/shared/.env.supabase.backup

# 2. Aplicar nova configuração
cat > /opt/dashpmo/shared/.env << 'EOF'
NODE_ENV=production

# PostgreSQL Configuration (Fase 2)
VITE_SUPABASE_URL=http://localhost:3001
VITE_SUPABASE_ANON_KEY=sua_jwt_key_local_gerada
DATABASE_URL=postgresql://dashpmo_user:DashPMO@2025!Prod#@localhost:5432/dashpmo_prod

APP_URL=https://seu-dominio.com
APP_NAME="DashPMO - Produção"
JWT_SECRET=sua_jwt_secret_super_segura_aqui
ENCRYPTION_KEY=sua_encryption_key_aqui
EOF

# 3. Copiar nova configuração para versão atual
cp /opt/dashpmo/shared/.env /opt/dashpmo/current/.env

# 4. Recarregar aplicação (se usar PM2 ou similar)
# pm2 restart dashpmo

echo "✅ Switch concluído! Aplicação agora usa PostgreSQL local"
```

---

## 🌐 5. CONFIGURAÇÃO NGINX E SSL

### 5.1 Configuração Nginx FASE 1

```nginx
# /etc/nginx/sites-available/dashpmo
server {
    listen 80;
    server_name seu-dominio.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name seu-dominio.com;
    
    ssl_certificate /etc/letsencrypt/live/seu-dominio.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/seu-dominio.com/privkey.pem;
    
    root /opt/dashpmo/current/dist;
    index index.html;
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
    
    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|eot|ttf)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        access_log off;
    }
    
    # Handle SPA routing
    location / {
        try_files $uri $uri/ /index.html;
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header X-XSS-Protection "1; mode=block" always;
    }
    
    # Health check
    location /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }
}
```

### 5.2 Ativar Site e SSL

```bash
# 1. Ativar site
sudo ln -s /etc/nginx/sites-available/dashpmo /etc/nginx/sites-enabled/
sudo nginx -t

# 2. Configurar SSL automático
sudo certbot --nginx -d seu-dominio.com --non-interactive --agree-tos --email admin@seu-dominio.com

# 3. Reload Nginx
sudo systemctl reload nginx

# 4. Verificar auto-renewal
sudo certbot renew --dry-run
```

---

## 📦 6. DEPLOY E VERSIONAMENTO

### 6.1 Estrutura de Deploy

```
/opt/dashpmo/
├── current/           # Versão ativa
├── releases/          # Histórico de versões
│   ├── v1.0.0/
│   └── v1.0.1/
├── shared/            # Arquivos compartilhados
│   ├── .env
│   └── uploads/
└── scripts/           # Scripts de deploy
```

### 6.2 Preparação de Pacote pelo Desenvolvedor

```bash
#!/bin/bash
# build_package.sh (executar no ambiente de desenvolvimento)

VERSION=${1:-$(date +%Y%m%d_%H%M%S)}
PACKAGE_NAME="dashpmo-v$VERSION"

echo "📦 Criando pacote DashPMO v$VERSION"

# 1. Build da aplicação
npm ci && npm run build

# 2. Criar estrutura do pacote
mkdir -p $PACKAGE_NAME/{dist,supabase/migrations,scripts}

# 3. Copiar arquivos necessários
cp -r dist/* $PACKAGE_NAME/dist/
cp -r supabase/migrations/* $PACKAGE_NAME/supabase/migrations/
cp package.json $PACKAGE_NAME/
cp README.md $PACKAGE_NAME/
cp GUIA_MIGRACAO_PRODUCAO.md $PACKAGE_NAME/

# 4. Criar scripts de deploy
cat > $PACKAGE_NAME/scripts/deploy.sh << 'EOF'
#!/bin/bash
# Script de deploy para infra
VERSION=${1:-$(basename $(pwd))}
TARGET="/opt/dashpmo/releases/$VERSION"

echo "🚀 Instalando DashPMO $VERSION"

# Criar diretório de destino
sudo mkdir -p $TARGET
sudo cp -r ./* $TARGET/

# Configurar permissões
sudo chown -R dashpmo:dashpmo $TARGET

# Ativar versão
sudo rm -f /opt/dashpmo/current
sudo ln -sfn $TARGET /opt/dashpmo/current

# Copiar configuração
sudo cp /opt/dashpmo/shared/.env /opt/dashpmo/current/.env

echo "✅ Deploy concluído! Aplicação ativa em /opt/dashpmo/current"
EOF

chmod +x $PACKAGE_NAME/scripts/deploy.sh

# 5. Comprimir pacote
tar -czf $PACKAGE_NAME.tar.gz $PACKAGE_NAME

# 6. Cleanup
rm -rf $PACKAGE_NAME

echo "✅ Pacote criado: $PACKAGE_NAME.tar.gz"
echo "📤 Envie este arquivo para a equipe de infraestrutura"
```

### 6.3 Deploy pelo Infra

```bash
#!/bin/bash
# deploy.sh

VERSION=${1:-$(date +%Y%m%d_%H%M%S)}
REPO_URL="https://github.com/seu-usuario/DashPMO.git"
APP_PATH="/opt/dashpmo"

echo "🚀 Deploy DashPMO v$VERSION"

# 1. Baixar código
git clone $REPO_URL $APP_PATH/releases/$VERSION
cd $APP_PATH/releases/$VERSION

# 2. Instalar dependências e build
npm ci --production
npm run build

# 3. Configurar ambiente
cp $APP_PATH/shared/.env .env

# 4. Ativar nova versão
ln -sfn $APP_PATH/releases/$VERSION $APP_PATH/current

# 5. Recarregar servidor web
sudo systemctl reload nginx

echo "✅ Deploy concluído!"
```

### 6.4 Atualizações Futuras

```bash
# .env
NODE_ENV=production
VITE_SUPABASE_URL=http://localhost:3001
VITE_SUPABASE_ANON_KEY=sua_jwt_key_local
DATABASE_URL=postgresql://dashpmo_user:senha@localhost:5432/dashpmo_prod
APP_URL=https://seu-dominio.com
JWT_SECRET=sua_jwt_secret_segura
```

---

## 📝 7. RECOMENDAÇÕES GERAIS

### 7.1 Segurança

```bash
# Firewall
sudo ufw enable
sudo ufw allow 22,80,443/tcp

# SSL Let's Encrypt
sudo certbot --nginx -d seu-dominio.com

# Backup automático
0 2 * * * /opt/dashpmo/scripts/backup.sh
```

### 7.2 Monitoramento

```bash
# Logs importantes
tail -f /var/log/nginx/error.log
tail -f /var/lib/pgsql/15/data/log/postgresql-*.log

# Status dos serviços
systemctl status postgresql-15 nginx
```

### 7.3 Backup Database

```bash
#!/bin/bash
# backup.sh

BACKUP_DIR="/opt/backups"
DATE=$(date +%Y%m%d_%H%M%S)

pg_dump -h localhost -U dashpmo_user dashpmo_prod | \
    gzip > $BACKUP_DIR/backup_$DATE.sql.gz

# Manter 30 dias
find $BACKUP_DIR -name "*.sql.gz" -mtime +30 -delete
```

### 7.4 Checklist Go-Live FASE 1 (Supabase)

- [ ] Node.js 20+ instalado
- [ ] Nginx instalado e configurado
- [ ] Certificado SSL ativo (Let's Encrypt)
- [ ] Aplicação buildada e deployada
- [ ] .env configurado com credenciais Supabase
- [ ] Firewall configurado (22, 80, 443)
- [ ] DNS apontando para servidor
- [ ] Backup automatizado configurado
- [ ] Testes de funcionalidade realizados
- [ ] Health check funcionando (/health)

### 7.5 Checklist Go-Live FASE 2 (PostgreSQL)

- [ ] PostgreSQL 15+ instalado
- [ ] Migrations aplicadas
- [ ] Dados migrados
- [ ] Aplicação buildada
- [ ] Nginx com SSL configurado
- [ ] Firewall configurado
- [ ] Backup automatizado
- [ ] DNS configurado
- [ ] Testes realizados

---

## 📞 8. SUPORTE E TROUBLESHOOTING

### 8.1 Comandos Úteis

```bash
# Verificar serviços
systemctl status postgresql-15 nginx

# Teste conectividade DB
psql -h localhost -U dashpmo_user -d dashpmo_prod -c "SELECT version();"

# Logs em tempo real
journalctl -u nginx -f
journalctl -u postgresql-15 -f

# Espaço em disco
df -h && du -sh /opt/dashpmo/*
```

### 8.2 Rollback de Emergência

```bash
#!/bin/bash
# rollback.sh

BACKUP_VERSION=$1
cd /opt/dashpmo

echo "🔄 Rollback para: $BACKUP_VERSION"
rm -rf current
cp -r $BACKUP_VERSION current
sudo systemctl reload nginx
echo "✅ Rollback concluído!"
```

---

---

## 📋 RESUMO EXECUTIVO

### **FASE 1 - Deploy Imediato (Supabase)**
1. **Tempo estimado:** 2-4 horas
2. **Risco:** Baixo (base já funcional)
3. **Dependências:** Node.js, Nginx, SSL
4. **Resultado:** Sistema 100% funcional em produção

### **FASE 2 - Migração PostgreSQL (Opcional)**
1. **Tempo estimado:** 4-8 horas
2. **Risco:** Médio (migração de dados)
3. **Dependências:** PostgreSQL, scripts de migração
4. **Resultado:** Sistema independente e seguro

### **Credenciais Atuais (FASE 1)**
```
VITE_SUPABASE_URL=https://dzgxpcealclptocyjmjd.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR6Z3hwY2VhbGNscHRvY3lqbWpkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk5NDY0OTcsImV4cCI6MjA2NTUyMjQ5N30.m0-AKPsYR02w89_2riAxYr1-jt2ZraTu8nIVAKWVC8s
```

### **Entrega do Desenvolvedor**
- **Pacote:** `dashpmo-vX.X.X.tar.gz` 
- **Contém:** Aplicação buildada + Scripts + Documentação
- **Deploy:** Descompactar e executar `scripts/deploy.sh`

---

**📄 Documento preparado pela equipe de desenvolvimento DashPMO**  
**🔄 Versão 1.0 - Junho 2025**  
**📧 Contato:** [email do desenvolvedor]**

*Manter este documento atualizado conforme evoluções do sistema.* 