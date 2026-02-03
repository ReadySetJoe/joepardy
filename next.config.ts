import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Production optimizations
  poweredByHeader: false,

  // Strict mode for better error catching
  reactStrictMode: true,
};

export default nextConfig;
