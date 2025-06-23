// vite.config.ts
import { defineConfig } from "file:///D:/Dropbox/ASA/DashPMO/node_modules/vite/dist/node/index.js";
import react from "file:///D:/Dropbox/ASA/DashPMO/node_modules/@vitejs/plugin-react-swc/index.mjs";
import path from "path";
import { componentTagger } from "file:///D:/Dropbox/ASA/DashPMO/node_modules/lovable-tagger/dist/index.js";
var __vite_injected_original_dirname = "D:\\Dropbox\\ASA\\DashPMO";
var vite_config_default = defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080
  },
  plugins: [
    react(),
    mode === "development" && componentTagger()
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "./src")
    }
  },
  build: {
    // Configurações de otimização para reduzir bundle size
    target: "es2015",
    minify: "terser",
    sourcemap: false,
    cssCodeSplit: true,
    // Configurações de chunk splitting para otimizar carregamento
    rollupOptions: {
      output: {
        // Configuração de chunks para otimizar o bundle
        manualChunks: {
          // Vendor chunks - bibliotecas externas
          "react-vendor": ["react", "react-dom", "react-router-dom"],
          "ui-vendor": [
            "@radix-ui/react-dialog",
            "@radix-ui/react-dropdown-menu",
            "@radix-ui/react-select",
            "@radix-ui/react-tabs",
            "@radix-ui/react-toast",
            "@radix-ui/react-tooltip",
            "@radix-ui/react-popover",
            "@radix-ui/react-accordion",
            "@radix-ui/react-alert-dialog",
            "@radix-ui/react-checkbox",
            "@radix-ui/react-label",
            "@radix-ui/react-separator",
            "@radix-ui/react-switch"
          ],
          "form-vendor": [
            "react-hook-form",
            "@hookform/resolvers",
            "zod"
          ],
          "charts-vendor": ["recharts"],
          "supabase-vendor": ["@supabase/supabase-js"],
          "query-vendor": ["@tanstack/react-query"],
          "date-vendor": ["date-fns", "react-day-picker"],
          "utils-vendor": [
            "clsx",
            "class-variance-authority",
            "tailwind-merge",
            "lucide-react"
          ],
          // PDF chunk separado para carregamento sob demanda
          "pdf-vendor": ["html2pdf.js"]
        },
        // Configuração de nomes de chunks
        chunkFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId ? chunkInfo.facadeModuleId.split("/").pop()?.replace(/\.\w+$/, "") || "chunk" : "chunk";
          return `assets/${facadeModuleId}-[hash].js`;
        },
        // Configuração para assets
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name?.split(".") || [];
          const ext = info[info.length - 1];
          if (/\.(png|jpe?g|gif|svg|webp|ico)$/i.test(assetInfo.name || "")) {
            return `assets/images/[name]-[hash].${ext}`;
          }
          if (/\.(woff2?|eot|ttf|otf)$/i.test(assetInfo.name || "")) {
            return `assets/fonts/[name]-[hash].${ext}`;
          }
          return `assets/[name]-[hash].${ext}`;
        }
      }
    },
    // Configurações de terser para minificação
    terserOptions: {
      compress: {
        drop_console: mode === "production",
        drop_debugger: mode === "production",
        pure_funcs: mode === "production" ? ["console.log"] : []
      }
    },
    // Configurações de chunk size
    chunkSizeWarningLimit: 1e3
  },
  // Configurações de otimização de dependências
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "react-router-dom",
      "@supabase/supabase-js",
      "@tanstack/react-query",
      "recharts",
      "lucide-react",
      "date-fns",
      "clsx",
      "tailwind-merge"
    ],
    exclude: [
      "html2pdf.js"
      // Carregar sob demanda
    ]
  }
}));
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxEcm9wYm94XFxcXEFTQVxcXFxEYXNoUE1PXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJEOlxcXFxEcm9wYm94XFxcXEFTQVxcXFxEYXNoUE1PXFxcXHZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9EOi9Ecm9wYm94L0FTQS9EYXNoUE1PL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSBcInZpdGVcIjtcclxuaW1wb3J0IHJlYWN0IGZyb20gXCJAdml0ZWpzL3BsdWdpbi1yZWFjdC1zd2NcIjtcclxuaW1wb3J0IHBhdGggZnJvbSBcInBhdGhcIjtcclxuaW1wb3J0IHsgY29tcG9uZW50VGFnZ2VyIH0gZnJvbSBcImxvdmFibGUtdGFnZ2VyXCI7XHJcblxyXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xyXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoKHsgbW9kZSB9KSA9PiAoe1xyXG4gIHNlcnZlcjoge1xyXG4gICAgaG9zdDogXCI6OlwiLFxyXG4gICAgcG9ydDogODA4MCxcclxuICB9LFxyXG4gIHBsdWdpbnM6IFtcclxuICAgIHJlYWN0KCksXHJcbiAgICBtb2RlID09PSAnZGV2ZWxvcG1lbnQnICYmXHJcbiAgICBjb21wb25lbnRUYWdnZXIoKSxcclxuICBdLmZpbHRlcihCb29sZWFuKSxcclxuICByZXNvbHZlOiB7XHJcbiAgICBhbGlhczoge1xyXG4gICAgICBcIkBcIjogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCIuL3NyY1wiKSxcclxuICAgIH0sXHJcbiAgfSxcclxuICBidWlsZDoge1xyXG4gICAgLy8gQ29uZmlndXJhXHUwMEU3XHUwMEY1ZXMgZGUgb3RpbWl6YVx1MDBFN1x1MDBFM28gcGFyYSByZWR1emlyIGJ1bmRsZSBzaXplXHJcbiAgICB0YXJnZXQ6ICdlczIwMTUnLFxyXG4gICAgbWluaWZ5OiAndGVyc2VyJyxcclxuICAgIHNvdXJjZW1hcDogZmFsc2UsXHJcbiAgICBjc3NDb2RlU3BsaXQ6IHRydWUsXHJcbiAgICBcclxuICAgIC8vIENvbmZpZ3VyYVx1MDBFN1x1MDBGNWVzIGRlIGNodW5rIHNwbGl0dGluZyBwYXJhIG90aW1pemFyIGNhcnJlZ2FtZW50b1xyXG4gICAgcm9sbHVwT3B0aW9uczoge1xyXG4gICAgICBvdXRwdXQ6IHtcclxuICAgICAgICAvLyBDb25maWd1cmFcdTAwRTdcdTAwRTNvIGRlIGNodW5rcyBwYXJhIG90aW1pemFyIG8gYnVuZGxlXHJcbiAgICAgICAgbWFudWFsQ2h1bmtzOiB7XHJcbiAgICAgICAgICAvLyBWZW5kb3IgY2h1bmtzIC0gYmlibGlvdGVjYXMgZXh0ZXJuYXNcclxuICAgICAgICAgICdyZWFjdC12ZW5kb3InOiBbJ3JlYWN0JywgJ3JlYWN0LWRvbScsICdyZWFjdC1yb3V0ZXItZG9tJ10sXHJcbiAgICAgICAgICAndWktdmVuZG9yJzogW1xyXG4gICAgICAgICAgICAnQHJhZGl4LXVpL3JlYWN0LWRpYWxvZycsXHJcbiAgICAgICAgICAgICdAcmFkaXgtdWkvcmVhY3QtZHJvcGRvd24tbWVudScsXHJcbiAgICAgICAgICAgICdAcmFkaXgtdWkvcmVhY3Qtc2VsZWN0JyxcclxuICAgICAgICAgICAgJ0ByYWRpeC11aS9yZWFjdC10YWJzJyxcclxuICAgICAgICAgICAgJ0ByYWRpeC11aS9yZWFjdC10b2FzdCcsXHJcbiAgICAgICAgICAgICdAcmFkaXgtdWkvcmVhY3QtdG9vbHRpcCcsXHJcbiAgICAgICAgICAgICdAcmFkaXgtdWkvcmVhY3QtcG9wb3ZlcicsXHJcbiAgICAgICAgICAgICdAcmFkaXgtdWkvcmVhY3QtYWNjb3JkaW9uJyxcclxuICAgICAgICAgICAgJ0ByYWRpeC11aS9yZWFjdC1hbGVydC1kaWFsb2cnLFxyXG4gICAgICAgICAgICAnQHJhZGl4LXVpL3JlYWN0LWNoZWNrYm94JyxcclxuICAgICAgICAgICAgJ0ByYWRpeC11aS9yZWFjdC1sYWJlbCcsXHJcbiAgICAgICAgICAgICdAcmFkaXgtdWkvcmVhY3Qtc2VwYXJhdG9yJyxcclxuICAgICAgICAgICAgJ0ByYWRpeC11aS9yZWFjdC1zd2l0Y2gnXHJcbiAgICAgICAgICBdLFxyXG4gICAgICAgICAgJ2Zvcm0tdmVuZG9yJzogW1xyXG4gICAgICAgICAgICAncmVhY3QtaG9vay1mb3JtJyxcclxuICAgICAgICAgICAgJ0Bob29rZm9ybS9yZXNvbHZlcnMnLFxyXG4gICAgICAgICAgICAnem9kJ1xyXG4gICAgICAgICAgXSxcclxuICAgICAgICAgICdjaGFydHMtdmVuZG9yJzogWydyZWNoYXJ0cyddLFxyXG4gICAgICAgICAgJ3N1cGFiYXNlLXZlbmRvcic6IFsnQHN1cGFiYXNlL3N1cGFiYXNlLWpzJ10sXHJcbiAgICAgICAgICAncXVlcnktdmVuZG9yJzogWydAdGFuc3RhY2svcmVhY3QtcXVlcnknXSxcclxuICAgICAgICAgICdkYXRlLXZlbmRvcic6IFsnZGF0ZS1mbnMnLCAncmVhY3QtZGF5LXBpY2tlciddLFxyXG4gICAgICAgICAgJ3V0aWxzLXZlbmRvcic6IFtcclxuICAgICAgICAgICAgJ2Nsc3gnLFxyXG4gICAgICAgICAgICAnY2xhc3MtdmFyaWFuY2UtYXV0aG9yaXR5JyxcclxuICAgICAgICAgICAgJ3RhaWx3aW5kLW1lcmdlJyxcclxuICAgICAgICAgICAgJ2x1Y2lkZS1yZWFjdCdcclxuICAgICAgICAgIF0sXHJcbiAgICAgICAgICAvLyBQREYgY2h1bmsgc2VwYXJhZG8gcGFyYSBjYXJyZWdhbWVudG8gc29iIGRlbWFuZGFcclxuICAgICAgICAgICdwZGYtdmVuZG9yJzogWydodG1sMnBkZi5qcyddXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcclxuICAgICAgICAvLyBDb25maWd1cmFcdTAwRTdcdTAwRTNvIGRlIG5vbWVzIGRlIGNodW5rc1xyXG4gICAgICAgIGNodW5rRmlsZU5hbWVzOiAoY2h1bmtJbmZvKSA9PiB7XHJcbiAgICAgICAgICBjb25zdCBmYWNhZGVNb2R1bGVJZCA9IGNodW5rSW5mby5mYWNhZGVNb2R1bGVJZFxyXG4gICAgICAgICAgICA/IGNodW5rSW5mby5mYWNhZGVNb2R1bGVJZC5zcGxpdCgnLycpLnBvcCgpPy5yZXBsYWNlKC9cXC5cXHcrJC8sICcnKSB8fCAnY2h1bmsnXHJcbiAgICAgICAgICAgIDogJ2NodW5rJztcclxuICAgICAgICAgIHJldHVybiBgYXNzZXRzLyR7ZmFjYWRlTW9kdWxlSWR9LVtoYXNoXS5qc2A7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBcclxuICAgICAgICAvLyBDb25maWd1cmFcdTAwRTdcdTAwRTNvIHBhcmEgYXNzZXRzXHJcbiAgICAgICAgYXNzZXRGaWxlTmFtZXM6IChhc3NldEluZm8pID0+IHtcclxuICAgICAgICAgIGNvbnN0IGluZm8gPSBhc3NldEluZm8ubmFtZT8uc3BsaXQoJy4nKSB8fCBbXTtcclxuICAgICAgICAgIGNvbnN0IGV4dCA9IGluZm9baW5mby5sZW5ndGggLSAxXTtcclxuICAgICAgICAgIFxyXG4gICAgICAgICAgaWYgKC9cXC4ocG5nfGpwZT9nfGdpZnxzdmd8d2VicHxpY28pJC9pLnRlc3QoYXNzZXRJbmZvLm5hbWUgfHwgJycpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBgYXNzZXRzL2ltYWdlcy9bbmFtZV0tW2hhc2hdLiR7ZXh0fWA7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBcclxuICAgICAgICAgIGlmICgvXFwuKHdvZmYyP3xlb3R8dHRmfG90ZikkL2kudGVzdChhc3NldEluZm8ubmFtZSB8fCAnJykpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGBhc3NldHMvZm9udHMvW25hbWVdLVtoYXNoXS4ke2V4dH1gO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgXHJcbiAgICAgICAgICByZXR1cm4gYGFzc2V0cy9bbmFtZV0tW2hhc2hdLiR7ZXh0fWA7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgXHJcbiAgICAvLyBDb25maWd1cmFcdTAwRTdcdTAwRjVlcyBkZSB0ZXJzZXIgcGFyYSBtaW5pZmljYVx1MDBFN1x1MDBFM29cclxuICAgIHRlcnNlck9wdGlvbnM6IHtcclxuICAgICAgY29tcHJlc3M6IHtcclxuICAgICAgICBkcm9wX2NvbnNvbGU6IG1vZGUgPT09ICdwcm9kdWN0aW9uJyxcclxuICAgICAgICBkcm9wX2RlYnVnZ2VyOiBtb2RlID09PSAncHJvZHVjdGlvbicsXHJcbiAgICAgICAgcHVyZV9mdW5jczogbW9kZSA9PT0gJ3Byb2R1Y3Rpb24nID8gWydjb25zb2xlLmxvZyddIDogW11cclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIFxyXG4gICAgLy8gQ29uZmlndXJhXHUwMEU3XHUwMEY1ZXMgZGUgY2h1bmsgc2l6ZVxyXG4gICAgY2h1bmtTaXplV2FybmluZ0xpbWl0OiAxMDAwLFxyXG4gIH0sXHJcbiAgXHJcbiAgLy8gQ29uZmlndXJhXHUwMEU3XHUwMEY1ZXMgZGUgb3RpbWl6YVx1MDBFN1x1MDBFM28gZGUgZGVwZW5kXHUwMEVBbmNpYXNcclxuICBvcHRpbWl6ZURlcHM6IHtcclxuICAgIGluY2x1ZGU6IFtcclxuICAgICAgJ3JlYWN0JyxcclxuICAgICAgJ3JlYWN0LWRvbScsXHJcbiAgICAgICdyZWFjdC1yb3V0ZXItZG9tJyxcclxuICAgICAgJ0BzdXBhYmFzZS9zdXBhYmFzZS1qcycsXHJcbiAgICAgICdAdGFuc3RhY2svcmVhY3QtcXVlcnknLFxyXG4gICAgICAncmVjaGFydHMnLFxyXG4gICAgICAnbHVjaWRlLXJlYWN0JyxcclxuICAgICAgJ2RhdGUtZm5zJyxcclxuICAgICAgJ2Nsc3gnLFxyXG4gICAgICAndGFpbHdpbmQtbWVyZ2UnXHJcbiAgICBdLFxyXG4gICAgZXhjbHVkZTogW1xyXG4gICAgICAnaHRtbDJwZGYuanMnIC8vIENhcnJlZ2FyIHNvYiBkZW1hbmRhXHJcbiAgICBdXHJcbiAgfVxyXG59KSk7XHJcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBNFAsU0FBUyxvQkFBb0I7QUFDelIsT0FBTyxXQUFXO0FBQ2xCLE9BQU8sVUFBVTtBQUNqQixTQUFTLHVCQUF1QjtBQUhoQyxJQUFNLG1DQUFtQztBQU16QyxJQUFPLHNCQUFRLGFBQWEsQ0FBQyxFQUFFLEtBQUssT0FBTztBQUFBLEVBQ3pDLFFBQVE7QUFBQSxJQUNOLE1BQU07QUFBQSxJQUNOLE1BQU07QUFBQSxFQUNSO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDUCxNQUFNO0FBQUEsSUFDTixTQUFTLGlCQUNULGdCQUFnQjtBQUFBLEVBQ2xCLEVBQUUsT0FBTyxPQUFPO0FBQUEsRUFDaEIsU0FBUztBQUFBLElBQ1AsT0FBTztBQUFBLE1BQ0wsS0FBSyxLQUFLLFFBQVEsa0NBQVcsT0FBTztBQUFBLElBQ3RDO0FBQUEsRUFDRjtBQUFBLEVBQ0EsT0FBTztBQUFBO0FBQUEsSUFFTCxRQUFRO0FBQUEsSUFDUixRQUFRO0FBQUEsSUFDUixXQUFXO0FBQUEsSUFDWCxjQUFjO0FBQUE7QUFBQSxJQUdkLGVBQWU7QUFBQSxNQUNiLFFBQVE7QUFBQTtBQUFBLFFBRU4sY0FBYztBQUFBO0FBQUEsVUFFWixnQkFBZ0IsQ0FBQyxTQUFTLGFBQWEsa0JBQWtCO0FBQUEsVUFDekQsYUFBYTtBQUFBLFlBQ1g7QUFBQSxZQUNBO0FBQUEsWUFDQTtBQUFBLFlBQ0E7QUFBQSxZQUNBO0FBQUEsWUFDQTtBQUFBLFlBQ0E7QUFBQSxZQUNBO0FBQUEsWUFDQTtBQUFBLFlBQ0E7QUFBQSxZQUNBO0FBQUEsWUFDQTtBQUFBLFlBQ0E7QUFBQSxVQUNGO0FBQUEsVUFDQSxlQUFlO0FBQUEsWUFDYjtBQUFBLFlBQ0E7QUFBQSxZQUNBO0FBQUEsVUFDRjtBQUFBLFVBQ0EsaUJBQWlCLENBQUMsVUFBVTtBQUFBLFVBQzVCLG1CQUFtQixDQUFDLHVCQUF1QjtBQUFBLFVBQzNDLGdCQUFnQixDQUFDLHVCQUF1QjtBQUFBLFVBQ3hDLGVBQWUsQ0FBQyxZQUFZLGtCQUFrQjtBQUFBLFVBQzlDLGdCQUFnQjtBQUFBLFlBQ2Q7QUFBQSxZQUNBO0FBQUEsWUFDQTtBQUFBLFlBQ0E7QUFBQSxVQUNGO0FBQUE7QUFBQSxVQUVBLGNBQWMsQ0FBQyxhQUFhO0FBQUEsUUFDOUI7QUFBQTtBQUFBLFFBR0EsZ0JBQWdCLENBQUMsY0FBYztBQUM3QixnQkFBTSxpQkFBaUIsVUFBVSxpQkFDN0IsVUFBVSxlQUFlLE1BQU0sR0FBRyxFQUFFLElBQUksR0FBRyxRQUFRLFVBQVUsRUFBRSxLQUFLLFVBQ3BFO0FBQ0osaUJBQU8sVUFBVSxjQUFjO0FBQUEsUUFDakM7QUFBQTtBQUFBLFFBR0EsZ0JBQWdCLENBQUMsY0FBYztBQUM3QixnQkFBTSxPQUFPLFVBQVUsTUFBTSxNQUFNLEdBQUcsS0FBSyxDQUFDO0FBQzVDLGdCQUFNLE1BQU0sS0FBSyxLQUFLLFNBQVMsQ0FBQztBQUVoQyxjQUFJLG1DQUFtQyxLQUFLLFVBQVUsUUFBUSxFQUFFLEdBQUc7QUFDakUsbUJBQU8sK0JBQStCLEdBQUc7QUFBQSxVQUMzQztBQUVBLGNBQUksMkJBQTJCLEtBQUssVUFBVSxRQUFRLEVBQUUsR0FBRztBQUN6RCxtQkFBTyw4QkFBOEIsR0FBRztBQUFBLFVBQzFDO0FBRUEsaUJBQU8sd0JBQXdCLEdBQUc7QUFBQSxRQUNwQztBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUE7QUFBQSxJQUdBLGVBQWU7QUFBQSxNQUNiLFVBQVU7QUFBQSxRQUNSLGNBQWMsU0FBUztBQUFBLFFBQ3ZCLGVBQWUsU0FBUztBQUFBLFFBQ3hCLFlBQVksU0FBUyxlQUFlLENBQUMsYUFBYSxJQUFJLENBQUM7QUFBQSxNQUN6RDtBQUFBLElBQ0Y7QUFBQTtBQUFBLElBR0EsdUJBQXVCO0FBQUEsRUFDekI7QUFBQTtBQUFBLEVBR0EsY0FBYztBQUFBLElBQ1osU0FBUztBQUFBLE1BQ1A7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxJQUNGO0FBQUEsSUFDQSxTQUFTO0FBQUEsTUFDUDtBQUFBO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFDRixFQUFFOyIsCiAgIm5hbWVzIjogW10KfQo=
