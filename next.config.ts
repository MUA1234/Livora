import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Vercel handles image optimization natively
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;