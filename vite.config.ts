import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    // 使用环境变量端口，避免硬编码
    port: parseInt(process.env.VITE_PORT || '3000'),
    host: true,
    // Docker 环境热更新支持
    hmr: {
      host: process.env.VITE_HMR_HOST || 'localhost',
      port: parseInt(process.env.VITE_HMR_PORT || '24678'),
    },
    // 代理配置 - 开发环境使用
    proxy: {
      '/api': {
        target: process.env.VITE_API_PROXY_TARGET || 'http://backend:3000',
        changeOrigin: true,
        secure: false
      },
      '/ws': {
        target: process.env.VITE_WS_PROXY_TARGET || 'ws://backend:3000',
        ws: true,
        changeOrigin: true
      }
    }
  },
  // 构建配置
  build: {
    outDir: 'dist',
    sourcemap: process.env.NODE_ENV === 'development'
  },
  // 环境变量配置
  define: {
    __API_BASE_URL__: JSON.stringify(process.env.VITE_API_BASE_URL || '/api'),
    __WS_URL__: JSON.stringify(process.env.VITE_WS_URL || '/ws')
  }
});