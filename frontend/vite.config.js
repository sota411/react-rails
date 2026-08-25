import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// 開発中、ブラウザから /api へ送った通信をRailsへ中継します。
// proxy（代理転送）を使うと、React側にRailsのURLを何度も書かずに済みます。
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: process.env.VITE_PROXY_TARGET || "http://localhost:3000",
        changeOrigin: true,
      },
    },
  },
});
