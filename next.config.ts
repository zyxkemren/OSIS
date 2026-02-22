import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ["@chakra-ui/react"],
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'mc-heads.net',
        port: '',
        pathname: '/avatar/**',
        search: '',
      },
      {
        protocol: 'https',
        hostname: 'qcvnmsroyrdatvmmkjiw.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
        search: '',
      },
    ],
  },
};

export default nextConfig;
