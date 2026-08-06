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
      
      // Completely exclude sodium-native and require-addon from the client bundle
      config.externals = config.externals || [];
      config.externals.push({
        'sodium-native': 'sodium-native',
        'require-addon': 'require-addon',
      });
      
      // Ignore warnings for sodium-native and require-addon
      config.ignoreWarnings = [
        ...(config.ignoreWarnings || []),
        /require-addon/,
        /sodium-native/,
        /Critical dependency/,
      ];
    }
    return config;
  },
};

module.exports = nextConfig;
