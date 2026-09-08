/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  trailingSlash: true,
  basePath: process.env.GITHUB_ACTIONS ? '/dk-resume-builder' : '',
  assetPrefix: process.env.GITHUB_ACTIONS ? '/dk-resume-builder/' : '',
};

module.exports = nextConfig;