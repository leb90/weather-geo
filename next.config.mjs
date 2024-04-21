/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
      return [
        {
          source: '/api/proxy/:path*',
          destination: 'https://api.weather.gov/:path*'
        }
      ];
    }
  };
  
  export default nextConfig;
  