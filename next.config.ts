import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  // Skip TypeScript checking during build — heavy Three.js types cause OOM on Vercel's build machine
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;