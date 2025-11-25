import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  experimental: {
    // reactCompiler moved to top level in newer versions, but let's try top level as per error
  },
  reactCompiler: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
