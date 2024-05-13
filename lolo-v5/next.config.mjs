/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'um-cdn.flipboard.com'
      },
    ]
  }
};

export default nextConfig;
