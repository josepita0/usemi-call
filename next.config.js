/** @type {import('next').NextConfig} */

// Configuration options for Next.js

const nextConfig = {
    images:{
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'utfs.io',
              },
        ]
        
    },
    webpack: (config) => {
        config.externals.push({
            "utf-8-validate": "commonjs utf-8-validate",
            bufferutil: "commonjs bufferutil"
        })

        return config;
    },
    reactStrictMode: true, // Enable React strict mode for improved error handling
    swcMinify: true,      // Enable SWC minification for improved performance
    compiler: {
      removeConsole: process.env.NODE_ENV !== "development", // Remove console.log in production
    },
}

  
  // Configuration object tells the next-pwa plugin 
  const withPWA = require("next-pwa")({
    dest: "public", // Destination directory for the PWA files
    disable: process.env.NODE_ENV === "development", // Disable PWA in development mode
    register: true, // Register the PWA service worker
    skipWaiting: true, // Skip waiting for service worker activation
  });
  
  // Export the combined configuration for Next.js with PWA support
  module.exports = withPWA(nextConfig);

  

// const nextConfig = {
//     images:{
//         remotePatterns: [
//             {
//                 protocol: 'https',
//                 hostname: 'utfs.io',
//               },
//         ]
        
//     },
//     webpack: (config) => {
//         config.externals.push({
//             "utf-8-validate": "commonjs utf-8-validate",
//             bufferutil: "commonjs bufferutil"
//         })

//         return config;
//     }
// }

// module.exports = nextConfig
