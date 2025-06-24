#!/bin/bash
# build-package.sh - Script para gerar pacote de deploy
# Executar no ambiente de desenvolvimento

VERSION=${1:-$(date +%Y%m%d_%H%M%S)}
PACKAGE_NAME="dashpmo-v$VERSION"

echo "📦 Criando pacote DashPMO v$VERSION"

# Verificar se estamos no diretório correto
if [ ! -f "package.json" ]; then
    echo "❌ Erro: Execute este script na raiz do projeto DashPMO"
    exit 1
fi

# 1. Build da aplicação
echo "🔧 Fazendo build da aplicação..."
npm ci && npm run build

if [ $? -ne 0 ]; then
    echo "❌ Erro no build da aplicação"
    exit 1
fi

# 2. Criar estrutura do pacote
echo "📁 Criando estrutura do pacote..."
mkdir -p $PACKAGE_NAME/{dist,supabase/migrations,scripts}

# 3. Copiar arquivos necessários
echo "📋 Copiando arquivos..."
cp -r dist/* $PACKAGE_NAME/dist/
cp -r supabase/migrations/* $PACKAGE_NAME/supabase/migrations/
cp package.json $PACKAGE_NAME/
cp README.md $PACKAGE_NAME/
cp GUIA_MIGRACAO_PRODUCAO.md $PACKAGE_NAME/

# 4. Criar .env de exemplo
cat > $PACKAGE_NAME/.env.example << 'EOF'
# Configuração para Produção - FASE 1 (Supabase)
NODE_ENV=production

# Supabase Configuration
VITE_SUPABASE_URL=https://dzgxpcealclptocyjmjd.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR6Z3hwY2VhbGNscHRvY3lqbWpkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk5NDY0OTcsImV4cCI6MjA2NTUyMjQ5N30.m0-AKPsYR02w89_2riAxYr1-jt2ZraTu8nIVAKWVC8s

# Application Settings
APP_URL=https://seu-dominio.com
APP_NAME="DashPMO - Produção"

# Security (gerar novas chaves em produção)
JWT_SECRET=sua_jwt_secret_super_segura_aqui
ENCRYPTION_KEY=sua_encryption_key_aqui
EOF

# 5. Criar script de deploy
cat > $PACKAGE_NAME/scripts/deploy.sh << 'EOF'
#!/bin/bash
# Script de deploy para infraestrutura
# Executar após descompactar o pacote

VERSION=${1:-$(basename $(pwd))}
TARGET="/opt/dashpmo/releases/$VERSION"

echo "🚀 Instalando DashPMO $VERSION"

# Verificar se estamos executando como root ou com sudo
if [ "$EUID" -ne 0 ]; then
    echo "⚠️  Execute este script com sudo"
    exit 1
fi

# Criar usuário dashpmo se não existir
if ! id "dashpmo" &>/dev/null; then
    useradd -m -s /bin/bash dashpmo
    echo "👤 Usuário dashpmo criado"
fi

# Criar estrutura de diretórios
mkdir -p /opt/dashpmo/{current,releases,shared}
mkdir -p $TARGET

# Copiar arquivos
echo "📁 Copiando arquivos..."
cp -r ./* $TARGET/

# Configurar .env se não existir
if [ ! -f "/opt/dashpmo/shared/.env" ]; then
    echo "⚙️  Criando configuração inicial..."
    cp $TARGET/.env.example /opt/dashpmo/shared/.env
    echo "⚠️  IMPORTANTE: Edite /opt/dashpmo/shared/.env com suas configurações"
fi

# Copiar configuração para a versão atual
cp /opt/dashpmo/shared/.env $TARGET/.env

# Configurar permissões
chown -R dashpmo:dashpmo /opt/dashpmo

# Ativar nova versão
rm -f /opt/dashpmo/current
ln -sfn $TARGET /opt/dashpmo/current

echo "✅ Deploy concluído!"
echo "📁 Aplicação ativa em: /opt/dashpmo/current"
echo "⚙️  Configuração em: /opt/dashpmo/shared/.env"
echo ""
echo "🔧 Próximos passos:"
echo "1. Configurar Nginx (ver GUIA_MIGRACAO_PRODUCAO.md)"
echo "2. Configurar SSL com Let's Encrypt"
echo "3. Testar aplicação"
EOF

chmod +x $PACKAGE_NAME/scripts/deploy.sh

# 6. Criar README de instalação
cat > $PACKAGE_NAME/INSTALL.md << 'EOF'
# 🚀 Instalação DashPMO - Produção

## Pré-requisitos
- Ubuntu 20.04+ ou CentOS 8+
- Acesso root/sudo
- Porta 80 e 443 liberadas

## Instalação Rápida

### 1. Descompactar pacote
```bash
tar -xzf dashpmo-v*.tar.gz
cd dashpmo-v*
```

### 2. Executar deploy
```bash
sudo ./scripts/deploy.sh
```

### 3. Instalar dependências do sistema
```bash
# Node.js 20+
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Nginx
sudo apt update && sudo apt install nginx

# Certbot
sudo apt install certbot python3-certbot-nginx
```

### 4. Configurar .env
```bash
sudo nano /opt/dashpmo/shared/.env
# Editar conforme necessário
```

### 5. Configurar Nginx
Ver arquivo `GUIA_MIGRACAO_PRODUCAO.md` seção 5.

## Estrutura
```
/opt/dashpmo/
├── current/           # Versão ativa (symlink)
├── releases/          # Histórico de versões
├── shared/           # Configurações compartilhadas
│   └── .env          # Configuração principal
```

## Suporte
Ver documentação completa em `GUIA_MIGRACAO_PRODUCAO.md`
EOF

# 7. Comprimir pacote
echo "📦 Comprimindo pacote..."
tar -czf $PACKAGE_NAME.tar.gz $PACKAGE_NAME

# 8. Cleanup
rm -rf $PACKAGE_NAME

# 9. Mostrar resultado
echo ""
echo "✅ Pacote criado com sucesso!"
echo "📦 Arquivo: $PACKAGE_NAME.tar.gz"
echo "📏 Tamanho: $(du -h $PACKAGE_NAME.tar.gz | cut -f1)"
echo ""
echo "📤 Envie este arquivo para a equipe de infraestrutura junto com:"
echo "   📄 GUIA_MIGRACAO_PRODUCAO.md"
echo ""
echo "🔧 Infra deve executar:"
echo "   1. tar -xzf $PACKAGE_NAME.tar.gz"
echo "   2. cd $PACKAGE_NAME"
echo "   3. sudo ./scripts/deploy.sh"
echo "   4. Seguir GUIA_MIGRACAO_PRODUCAO.md" 