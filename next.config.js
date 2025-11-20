/** @type {import('next').NextConfig} */
const fs = require('fs');
const dotenv = require('dotenv');

if (process.env.NODE_ENV === 'development') {
  const envPath = '.env.local';
  if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
  } else {
    console.warn(`${envPath} not found; skipping explicit dotenv load`);
  }
}

module.exports = {
  reactStrictMode: true,
  experimental: {
    serverActions: true,
  },
};
