import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  // Force Next.js to use your custom tsconfig.json
  typescript: {
    tsconfigPath: "./tsconfig.json"
  }
};

export default nextConfig;
