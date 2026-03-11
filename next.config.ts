import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Web Worker files served from /public/workers/ need no special config.
  // Charts use dynamic imports with ssr:false to avoid Recharts SSR issues.
};

export default nextConfig;
