/** @type {import('next').NextConfig} */
const nextConfig = {
  staticPageGenerationTimeout: 120,
  experimental: {
    appDir: true,
    // largePageDataBytes: 128 * 10000,
  },
};

module.exports = nextConfig;
