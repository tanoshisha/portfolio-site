import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "hayatonaoe.vercel.app" }],
        destination: "https://hayatonaoe.com/:path*",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "portfolio-site.vercel.app" }],
        destination: "https://hayatonaoe.com/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
