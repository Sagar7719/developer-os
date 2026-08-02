import dotenv from 'dotenv';

dotenv.config();

/**
 * Validates required environment variables on process boot natively.
 */
function validateEnv() {
  const requiredKeys = ['NODE_ENV', 'PORT', 'MONGO_URI'];
  const missingKeys = requiredKeys.filter((key) => !process.env[key]);

  if (missingKeys.length > 0) {
    throw new Error(
      `[Developer OS Config Error] Missing required environment variables: ${missingKeys.join(', ')}. Check your .env file.`
    );
  }
}

// Run lightweight check on load
validateEnv();

export const config = Object.freeze({
  env: process.env.NODE_ENV || 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isDevelopment: process.env.NODE_ENV === 'development',
  port: parseInt(process.env.PORT || '5000', 10),
  clientOrigin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  mongoUri: process.env.MONGO_URI,
  logLevel: process.env.LOG_LEVEL || 'info',
  rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10), // 15 mins default
  rateLimitMax: parseInt(process.env.RATE_LIMIT_MAX || '100', 10), // 100 requests per window
});

export default config;
