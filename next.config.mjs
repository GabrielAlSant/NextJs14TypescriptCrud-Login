/** @type {import('next').NextConfig} */
import dotenv from 'dotenv';
import path from 'path';

const env = dotenv.config({ path: path.resolve(process.cwd(), '.env.local') }).parsed;

const nextConfig = {
    images: {
        domains: ['drive.google.com'],
    },
    env: {
        NEXT_PUBLIC_DB_URL: env.NEXT_PUBLIC_DB_URL,
      },
};

export default nextConfig;
