import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const origin = (env.VITE_SITE_URL || "https://file-mitra.vercel.app").replace(/\/+$/, "");

  return {
    plugins: [
      react(),
      {
        name: "html-site-origin",
        transformIndexHtml(html: string) {
          return html.replaceAll("__SITE_ORIGIN__", origin);
        }
      }
    ],
    server: {
      proxy: {
        "/api": {
          target: "http://127.0.0.1:8000",
          changeOrigin: true
        }
      }
    }
  };
});
