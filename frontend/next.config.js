/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Ensure environment variables are available on the client
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1',
  },
  // Add trailing slash for better compatibility
  trailingSlash: false,
  // Optimize for production
  swcMinify: true,
}

module.exports = nextConfig
