const path = require('path')
 
module.exports = {
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'media.dev.to',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'media2.dev.to',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'miro.medium.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'medium.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'cdn-images-1.medium.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'cdn-images-2.medium.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'cdn-images-3.medium.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'cdn-images-4.medium.com',
        pathname: '**',
      },
    ],
  },
}