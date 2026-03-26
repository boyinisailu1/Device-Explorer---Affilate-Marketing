import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Split large dependencies into separate chunks
          if (id.includes('three')) return 'three-vendor';
          if (id.includes('react') || id.includes('react-router')) return 'react-vendor';
          if (id.includes('lucide-react')) return 'ui-vendor';
          if (id.includes('supabase')) return 'supabase-vendor';
          if (id.includes('node_modules')) return 'vendor';
        },
      },
    },
    chunkSizeWarningLimit: 1000, // Increase warning limit since we're splitting properly
  },
})
