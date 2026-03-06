/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: [
    'playwright',
    'playwright-extra',
    'puppeteer-extra-plugin-stealth',
    'puppeteer-extra-plugin'
  ]
};

export default nextConfig;
