import type { NextConfig } from "next";

const config: NextConfig = {
  reactStrictMode: true,
  output: 'export',
  basePath: '/volleyball_tournament',
  images: {
    unoptimized: true,
  },
};

export default config;
