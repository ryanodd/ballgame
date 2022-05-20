/** @type {import('next').NextConfig} */
const nextConfig = {
  // strict mode needs to be OFF because it does a test init to do some testy stuff.
  // so 2 games join the same session for each client, which breaks the game
  // I think this can be fixed (in game, check if session already full)
  reactStrictMode: false,
  webpack: function (config, options) {
    config.experiments = { asyncWebAssembly: true };
    return config;
  }
}

module.exports = nextConfig
