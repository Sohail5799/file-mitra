/** Canonical site origin (no trailing slash). Override with VITE_SITE_URL for custom domain. */
export const SITE_ORIGIN = (
  import.meta.env.VITE_SITE_URL?.replace(/\/+$/, "") || "https://file-mitra.vercel.app"
);

export const SITE_NAME = "File Mitra";
