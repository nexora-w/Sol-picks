import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.nba.com',
        pathname: '/headshots/nba/latest/**',
      },
      {
        protocol: 'https',
        hostname: 'a.espncdn.com',
        pathname: '/i/headshots/nfl/players/**',
      },
      {
        protocol: 'https',
        hostname: 'img.mlbstatic.com',
        pathname: '/mlb-photos/image/upload/**',
      },
      {
        protocol: 'https',
        hostname: 'resources.premierleague.com',
        pathname: '/premierleague/photos/players/**',
      },
      {
        protocol: 'https',
        hostname: 'img.fcbayern.com',
        pathname: '/image/upload/**',
      },
      {
        protocol: 'https',
        hostname: 'assets.laliga.com',
        pathname: '/squad/**',
      },
    ],
  },
};

export default nextConfig;
