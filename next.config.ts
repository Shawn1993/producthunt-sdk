import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      'ph-files.imgix.net',  // Product Hunt 的图片域名
    ],
  },
  /* config options here */
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: 'https://producthunt-sdk.vercel.app' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
        ],
      },
    ];
  },
};

export default nextConfig;
