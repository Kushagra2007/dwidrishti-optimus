import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    // optimize package imports for icons and motion
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },
};

export default nextConfig;
