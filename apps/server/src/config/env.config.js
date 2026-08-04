import dotenv from 'dotenv';

dotenv.config();

/**
 * Validates required environment variables on process boot natively.
 */
function validateEnv() {
  const isProduction = process.env.NODE_ENV === 'production';

  const baseRequiredKeys = [
    'NODE_ENV',
    'PORT',
    'MONGO_URI',
    'JWT_ACCESS_SECRET',
    'JWT_ACCESS_EXPIRES_IN',
    'JWT_REFRESH_SECRET',
    'JWT_REFRESH_EXPIRES_IN',
  ];

  const productionOnlyKeys = [
    'CLIENT_ORIGIN',
    'CONTACT_RECEIVER_EMAIL',
    'GEMINI_API_KEY',
  ];

  const requiredKeys = isProduction
    ? [...baseRequiredKeys, ...productionOnlyKeys]
    : baseRequiredKeys;

  const missingKeys = requiredKeys.filter((key) => !process.env[key] || !process.env[key].trim());

  if (missingKeys.length > 0) {
    const errorMsg = `[Developer OS Config Error] Missing required environment variables (${process.env.NODE_ENV || 'development'} mode): ${missingKeys.join(', ')}. Check your .env file or environment settings.`;
    console.error(errorMsg);
    throw new Error(errorMsg);
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
  rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
  rateLimitMax: parseInt(process.env.RATE_LIMIT_MAX || '100', 10),
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET,
  jwtAccessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN,
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
  contactReceiverEmail: process.env.CONTACT_RECEIVER_EMAIL || 'admin@developer-os.dev',
  trustProxy: process.env.TRUST_PROXY === '1' || process.env.TRUST_PROXY === 'true',
  geminiApiKey: process.env.GEMINI_API_KEY || '',
  geminiModel: process.env.GEMINI_MODEL || 'gemini-2.0-flash',
  aiRateLimitWindowMs: parseInt(process.env.AI_RATE_LIMIT_WINDOW_MS || '900000', 10),
  aiRateLimitMax: parseInt(process.env.AI_RATE_LIMIT_MAX || '15', 10),
});

export default config;
