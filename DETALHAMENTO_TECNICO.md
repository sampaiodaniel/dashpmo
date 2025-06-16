
# Detalhamento Técnico do Sistema PMO ASA

## Visão Geral
O Sistema DashPMO ASA é uma aplicação web moderna desenvolvida para gerenciar projetos de TI, controle de incidentes, lições aprendidas e relatórios gerenciais.

## Arquitetura Técnica

### Frontend
- **Framework**: React 18.3.1 com TypeScript
- **Build Tool**: Vite (desenvolvimento e build de produção)
- **Estilização**: Tailwind CSS 3.x com componentes shadcn/ui
- **Roteamento**: React Router DOM 6.26.2
- **Gerenciamento de Estado**: TanStack React Query 5.56.2
- **Formulários**: React Hook Form 7.53.0 com validação Zod 3.23.8
- **Gráficos**: Recharts 2.12.7
- **Ícones**: Lucide React 0.462.0

### Backend/Database
- **Backend as a Service**: Supabase
- **Banco de Dados**: PostgreSQL (gerenciado pelo Supabase)
- **Autenticação**: Supabase Auth
- **API**: REST API automática gerada pelo Supabase
- **Tempo Real**: Supabase Realtime (subscriptions)

### Tecnologias de UI/UX
- **Sistema de Design**: shadcn/ui baseado em Radix UI
- **Responsive Design**: Mobile-first com Tailwind CSS
- **Tipografia**: Inter (Google Fonts)
- **Temas**: Suporte a tema claro/escuro via next-themes

## Estrutura do Banco de Dados

### Principais Tabelas
1. **usuarios** - Gerenciamento de usuários do sistema
2. **projetos** - Cadastro e informações dos projetos
3. **status_projeto** - Histórico de status dos projetos
4. **incidentes** - Controle de incidentes por carteira
5. **licoes_aprendidas** - Base de conhecimento de lições
6. **mudancas_replanejamento** - Gestão de mudanças
7. **logs_alteracoes** - Auditoria do sistema

### Tipos Customizados (ENUMS)
- `tipo_usuario`: Admin, Gerente, Usuario
- `area_responsavel`: TI, Negocio, Externa
- `status_geral`: Verde, Amarelo, Vermelho
- `nivel_risco`: Baixo, Médio, Alto
- `categoria_licao`: Técnica, Processo, Comunicação, etc.
- `status_aplicacao`: Aplicada, Em andamento, Não aplicada

## Requisitos Técnicos de Hospedagem

### Ambiente de Desenvolvimento
- **Node.js**: 18.x ou superior
- **NPM**: 8.x ou superior (ou Yarn/PNPM)
- **Memória RAM**: Mínimo 4GB (recomendado 8GB)
- **Espaço em Disco**: 2GB livres

### Ambiente de Produção
- **Servidor Web**: Nginx ou Apache
- **Node.js**: 18.x ou superior (para build)
- **Memória RAM**: Mínimo 2GB
- **CPU**: 2 vCPUs recomendado
- **Espaço em Disco**: 1GB para aplicação
- **Banda**: 100Mbps recomendado
- **SSL**: Certificado válido obrigatório

### Hospedagem Recomendada
- **Vercel** (recomendado para React/Vite)
- **Netlify**
- **AWS S3 + CloudFront**
- **Azure Static Web Apps**
- **Google Cloud Storage**

## Configurações de Ambiente

### Variáveis de Ambiente Necessárias
```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anonima
```

### Build de Produção
```bash
npm run build
```
Gera arquivos estáticos na pasta `dist/`

## Recursos de Segurança

### Autenticação
- JWT tokens gerenciados pelo Supabase
- Row Level Security (RLS) no banco de dados
- Controle de sessão automático

### Autorização
- Controle por tipo de usuário (Admin, Gerente, Usuario)
- Políticas RLS específicas por tabela
- Logs de auditoria para todas as alterações

## Performance

### Otimizações Implementadas
- **Code Splitting**: Carregamento sob demanda de componentes
- **React Query**: Cache inteligente de dados
- **Lazy Loading**: Componentes carregados dinamicamente
- **Memoização**: React.memo e useMemo em componentes críticos
- **Debounce**: Em campos de busca e filtros

### Métricas de Performance
- **First Contentful Paint**: < 2s
- **Largest Contentful Paint**: < 3s
- **Time to Interactive**: < 4s
- **Bundle Size**: < 500KB (gzipped)

## Backup e Recuperação

### Supabase
- Backup automático diário
- Point-in-time recovery (últimos 7 dias)
- Replicação automática

### Recomendações
- Backup manual semanal dos dados críticos
- Documentação de procedimentos de restore
- Monitoramento de integridade dos dados

## Monitoramento

### Logs Disponíveis
- Logs de aplicação via console.log
- Logs de autenticação no Supabase
- Logs de alterações na tabela `logs_alteracoes`

### Ferramentas Recomendadas
- **Sentry** para monitoramento de erros
- **Google Analytics** para métricas de uso
- **Uptime Robot** para monitoramento de disponibilidade

## Deployment

### Build
```bash
npm install
npm run build
```

### Deploy Manual
1. Fazer build da aplicação
2. Upload da pasta `dist/` para servidor
3. Configurar servidor web (Nginx/Apache)
4. Configurar SSL
5. Testar funcionamento

### Deploy Automático (CI/CD)
- Integração com GitHub Actions
- Deploy automático via Vercel/Netlify
- Testes automatizados antes do deploy

## Manutenção

### Atualizações Regulares
- Dependências do NPM (mensal)
- Versões do React (trimestral)
- Políticas de segurança Supabase (conforme necessário)

### Limpeza de Dados
- Logs antigos (> 6 meses)
- Sessões expiradas
- Cache desnecessário

## Escalabilidade

### Limitações Atuais
- Supabase Free Tier: 500MB de dados, 2GB de banda/mês
- Sem limitações significativas de usuários concurrent

### Opções de Escala
- Upgrade para Supabase Pro ($25/mês)
- CDN para assets estáticos
- Cache em Redis para consultas frequentes
- Microserviços para módulos específicos

## Contatos Técnicos

### Suporte
- **Documentação**: https://docs.lovable.dev/
- **Supabase Docs**: https://supabase.com/docs
- **React Docs**: https://react.dev/

### Ferramentas de Debug
- React Developer Tools
- Supabase Dashboard
- Browser DevTools
- Network inspector para APIs

---

*Documento atualizado em: 16/06/2025*
*Versão do Sistema: 1.0.0*
