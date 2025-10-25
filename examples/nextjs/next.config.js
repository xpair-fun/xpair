/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Turbopack is enabled by default in Next.js 16
  turbopack: {},
  // Transpile the local package for Next.js 16 compatibility
  transpilePackages: ['@solana-x402/connect'],
  webpack: (config) => {
    config.resolve.fallback = {
      fs: false,
      net: false,
      tls: false,
    };
    return config;
  },
};

module.exports = nextConfig;
