/** @type {import('next').NextConfig} */
module.exports = {
    reactStrictMode: true,
    webpack5: true,
    webpack: (config) => {
        config.resolve.fallback = { fs: false, process: false };
        return config;
    },
    async rewrites() {
        return [
            {
                source: '/socket.io',
                destination: 'http://localhost:3001/socket.io'
            },
            {
                source: '/api/:path*',
                destination: 'http://localhost:3001/api/:path*'
            }
        ]
    }
};
