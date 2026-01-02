/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    // Expose env vars to client if needed, though mostly used in API routes
  },
}

module.exports = nextConfig
