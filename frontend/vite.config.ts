import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://127.0.0.1:8000",
        changeOrigin: true
      },
      "/generate-image": {
        target: "http://127.0.0.1:8000",
        changeOrigin: true
      },
      "/generate": {
        target: "http://127.0.0.1:8000",
        changeOrigin: true
      },
      "/generated_images": {
        target: "http://127.0.0.1:8000",
        changeOrigin: true
      }
    }
  }
});

