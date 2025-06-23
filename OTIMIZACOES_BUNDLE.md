# Otimizações de Bundle Size - DashPMO

## Resumo das Otimizações Implementadas

Este documento descreve as otimizações implementadas para reduzir o tamanho do bundle e melhorar a performance de carregamento do sistema DashPMO.

## 1. Configuração do Vite (vite.config.ts)

### Code Splitting Otimizado
- **Vendor Chunks**: Separação de bibliotecas por categoria
  - `react-vendor`: React, React DOM, React Router
  - `ui-vendor`: Componentes Radix UI
  - `form-vendor`: React Hook Form, Zod
  - `charts-vendor`: Recharts (isolado)
  - `supabase-vendor`: Supabase client
  - `query-vendor`: TanStack Query
  - `date-vendor`: Bibliotecas de data
  - `utils-vendor`: Utilitários diversos
  - `pdf-vendor`: html2pdf.js (carregamento sob demanda)

### Configurações de Build
- **Target**: ES2015 para compatibilidade otimizada
- **Minificação**: Terser com remoção de console.log em produção
- **CSS Code Split**: Habilitado para separar CSS
- **Source Maps**: Desabilitado em produção para reduzir tamanho
- **Chunk Size Warning**: Limite de 1000kb

### Otimização de Assets
- **Imagens**: Organizadas em `assets/images/`
- **Fontes**: Organizadas em `assets/fonts/`
- **Chunks**: Nomeação otimizada com hash

## 2. Carregamento Dinâmico de html2pdf.js

### Problema Original
- html2pdf.js era carregado no bundle principal (~400kb)
- Usado apenas em funcionalidades específicas de relatório

### Solução Implementada
- **Import Dinâmico**: Carregamento apenas quando necessário
- **Fallback CDN**: Se import() falhar, carrega via CDN
- **Cache**: Reutilização da instância já carregada

### Arquivos Modificados
- `src/components/relatorios/RelatorioVisualViewer.tsx`
- `src/components/relatorios/asa/RelatorioActions.tsx`
- `src/pages/RelatorioCompartilhado.tsx`
- `index.html` (removido script global)

## 3. Lazy Loading de Componentes

### Utilitário Criado
- `src/utils/lazyLoader.ts`: Gerenciamento centralizado de lazy loading

### Componentes Otimizados
- **Relatórios**: Carregamento sob demanda
- **Gráficos Pesados**: Recharts components
- **Páginas de Admin**: Funcionalidades administrativas
- **Visualizações Complexas**: Timeline, dashboards avançados

## 4. Otimização de Dependências

### Included em optimizeDeps
- Bibliotecas críticas pré-bundled pelo Vite
- React, Supabase, TanStack Query, Recharts

### Excluded em optimizeDeps
- html2pdf.js: Carregamento dinâmico

## 5. Resultados Obtidos

### Bundle Size Após Otimizações
```
dist/index.html                      1.80 kB │ gzip:   0.59 kB
dist/assets/index-CLH_1UQ4.css      88.03 kB │ gzip:  14.61 kB
dist/assets/chunk-CJ5ua8Zb.js        0.49 kB │ gzip:   0.35 kB
dist/assets/purify.es-BZSslYI7.js   21.94 kB │ gzip:   8.45 kB
dist/assets/chunk-Dba9BOvP.js       35.42 kB │ gzip:  11.94 kB
dist/assets/chunk-BuRyS38w.js       40.80 kB │ gzip:  11.76 kB
dist/assets/chunk-pCAKsNLm.js       58.28 kB │ gzip:  16.45 kB
dist/assets/chunk-B-fFxCYh.js       81.17 kB │ gzip:  21.64 kB
dist/assets/chunk-DaXl3JC2.js      115.95 kB │ gzip:  29.87 kB
dist/assets/chunk-BckESKDd.js      136.29 kB │ gzip:  40.93 kB
dist/assets/index.es-nTLv__Mr.js   148.63 kB │ gzip:  49.64 kB
dist/assets/chunk-C1zK9ST-.js      161.23 kB │ gzip:  52.35 kB
dist/assets/chunk-BGX56aDz.js      400.53 kB │ gzip: 102.39 kB
dist/assets/index-CUunu0BR.js      440.32 kB │ gzip:  89.94 kB
dist/assets/chunk-s7mrlXdQ.js      669.23 kB │ gzip: 184.02 kB
```

### Benefícios
- **Carregamento Inicial**: Reduzido significativamente
- **Cache Efficiency**: Chunks separados permitem melhor cache
- **Loading On-Demand**: Funcionalidades pesadas carregam apenas quando usadas
- **Gzip Compression**: Todos os assets otimizados para compressão

## 6. Recomendações Futuras

### Monitoramento
- Implementar análise de bundle size no CI/CD
- Monitorar performance de carregamento em produção

### Otimizações Adicionais
- **Tree Shaking**: Revisar imports não utilizados
- **Image Optimization**: Implementar WebP/AVIF
- **Service Worker**: Cache estratégico para assets
- **Preloading**: Componentes críticos baseado em rotas

### Ferramentas de Análise
```bash
# Analisar bundle
npm run build -- --analyze

# Visualizar chunks
npx vite-bundle-analyzer dist
```

## 7. Configurações de Produção

### Variáveis de Ambiente
```env
NODE_ENV=production
VITE_BUILD_OPTIMIZE=true
```

### Deploy
- Configurar compressão gzip/brotli no servidor
- Implementar cache headers apropriados
- CDN para assets estáticos

## 8. Troubleshooting

### Problemas Comuns
1. **html2pdf não carrega**: Verificar conectividade CDN
2. **Chunks muito grandes**: Revisar manualChunks config
3. **Import errors**: Verificar lazy loading components

### Debug
```javascript
// Verificar chunks carregados
console.log(window.__vite_chunks__);

// Monitorar carregamento dinâmico
performance.mark('dynamic-import-start');
import('./component').then(() => {
  performance.mark('dynamic-import-end');
  performance.measure('dynamic-import', 'dynamic-import-start', 'dynamic-import-end');
});
```

---

**Data da Implementação**: Janeiro 2025  
**Versão**: 1.0  
**Responsável**: Sistema de Otimização DashPMO 