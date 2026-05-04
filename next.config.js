/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  output: 'export',
  distDir: 'dist',
  basePath: '/jtk-2026',
  assetPrefix: '/jtk-2026',
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error'] } : false,
  },
}

module.exports = nextConfig
