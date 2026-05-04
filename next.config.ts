import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "fnurxiqwysbribekrlnr.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "fnurxiqwysbribekrlnr.supabase.co",
        pathname: "/storage/v1/object/sign/**",
      },
    ],
  },
  async redirects() {
    return [
      // Legacy alias from the Vite app — /payment was a placeholder that
      // pointed at the inquiry questionnaire. Preserve so old links don't 404.
      {
        source: '/payment',
        destination: '/upitnik',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
