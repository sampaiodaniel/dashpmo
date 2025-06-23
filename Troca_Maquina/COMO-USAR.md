# 🚀 Como usar - Desenvolvimento Multi-Máquina DashPMO

## 📋 Processo simples para trocar de máquina:

### 🔄 PRIMEIRA VEZ na máquina OU depois de trocar de máquina:
```
🎯 Execute: dev-switch.bat
```
- ✅ Limpa todo o cache
- ✅ Instala dependências
- ✅ Inicia o servidor automaticamente

### ⚡ USO NORMAL (mesma máquina, dias seguintes):
```
🎯 Execute: quick-start.bat
```
- ✅ Verificação rápida
- ✅ Inicia o servidor diretamente

### 🆘 PROBLEMAS / ERROS / Não funciona:
```
🎯 Execute: emergency-clean.bat
```
- ✅ Limpeza completa
- ✅ Reset total do ambiente
- ✅ Reinstalação forçada

---

## 🖥️ Alternativa via terminal (se preferir):

```bash
# Para trocar de máquina:
npm run dev:switch

# Uso normal:
npm run dev

# Emergência/problemas:
npm run emergency
```

---

## 🔄 Fluxo ideal de trabalho:

### Máquina A → Máquina B:
1. 💾 Salve seu trabalho (commit se usar Git)
2. 📱 Aguarde sincronização do Dropbox
3. 🖥️ Na Máquina B: Execute `dev-switch.bat`
4. ✅ Pronto para desenvolver!

### Desenvolvimento contínuo (mesma máquina):
1. 🖥️ Execute `quick-start.bat`
2. 💻 Desenvolva normalmente
3. ✅ Repita quando necessário

---

## 📁 Arquivos que o Dropbox NÃO sincroniza:
- `node_modules/` - Dependências (geradas automaticamente)
- `.vite/` - Cache do Vite
- `dist/` - Build de produção
- `package-lock.json` - Lock file do NPM
- `bun.lockb` - Lock file do Bun

---

## 🌐 Endereços do servidor:
- 🎯 Principal: http://localhost:5173
- 🔄 Alternativo: http://localhost:3000
- 📱 Rede local: http://10.2.80.169:8080 (se configurado)

---

## ❓ Problemas comuns:

### ❌ "EBUSY: resource busy or locked"
**Solução:** Execute `dev-switch.bat`

### ❌ "Failed to fetch" ou tela branca
**Solução:** Execute `emergency-clean.bat`

### ❌ "Port already in use"
**Solução:** Execute `emergency-clean.bat` (mata processos)

### ❌ Qualquer outro erro
**Solução:** Execute `emergency-clean.bat`

---

## 📞 Suporte:
Se nada funcionar, verifique:
1. ✅ Internet funcionando
2. ✅ Node.js instalado (versão 18+)
3. ✅ NPM funcionando
4. ✅ Antivírus não bloqueando

**Em último caso:** Delete toda a pasta do projeto, baixe novamente do Dropbox e execute `dev-switch.bat` 