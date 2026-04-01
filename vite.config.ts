import { defineConfig } from "vite";
import { miaodaDevPlugin } from "miaoda-sc-plugin";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    miaodaDevPlugin(),
    svgr({
      svgrOptions: {
        icon: true,
        exportType: "named",
        namedExport: "ReactComponent",
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    headers: {
      "Content-Security-Policy": "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.supabase.co https://checkout.stripe.com https://checkout.razorpay.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://miaoda-font.cdn.bcebos.com; img-src 'self' data: https://*.supabase.co https://images.unsplash.com https://images.pexels.com; font-src 'self' https://fonts.gstatic.com https://miaoda-font.cdn.bcebos.com; connect-src 'self' https://*.supabase.co https://api.stripe.com https://api.razorpay.com; frame-src 'self' https://checkout.stripe.com https://api.razorpay.com;",
      "X-Frame-Options": "DENY",
      "X-Content-Type-Options": "nosniff",
      "Referrer-Policy": "strict-origin-when-cross-origin",
      "Permissions-Policy": "camera=(), microphone=(), geolocations=()",
    },
  },
});
