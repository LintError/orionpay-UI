/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        os: false,
        crypto: false,
        module: false,
        'sodium-native': false,
        'require-addon': false,
      };
    }
    return config;
  },
  // Disable strict mode temporarily if needed, but main fix is dynamic import
};

module.exports = nextConfig;
