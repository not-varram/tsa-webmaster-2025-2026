/** @type {import('next').NextConfig} */
const nextConfig = {
    // output: 'standalone', // Commented out due to Windows symlink permission issues
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**',
            },
        ],
    },
}

module.exports = nextConfig
