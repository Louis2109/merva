import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Allow images from Supabase Storage
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'fuimqugdecmjgttseevk.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
};

export default nextConfig;
