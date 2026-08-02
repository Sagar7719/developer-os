import mongoose from 'mongoose';
import { config } from './env.config.js';
import { logger } from './logger.js';

// Setup connection lifecycle event listeners
mongoose.connection.on('connected', () => {
  logger.info('[Database] MongoDB connection established successfully.');
});

mongoose.connection.on('error', (err) => {
  logger.error(`[Database] MongoDB connection error: ${err.message}`);
});

mongoose.connection.on('disconnected', () => {
  logger.warn('[Database] MongoDB connection lost/disconnected.');
});

/**
 * Connect to MongoDB database.
 * @returns {Promise<typeof mongoose>}
 */
export const connectDatabase = async () => {
  try {
    const conn = await mongoose.connect(config.mongoUri);
    return conn;
  } catch (error) {
    logger.error(`[Database] Initial MongoDB connection failure: ${error.message}`);
    throw error;
  }
};

/**
 * Disconnect gracefully from MongoDB database.
 * @returns {Promise<void>}
 */
export const disconnectDatabase = async () => {
  try {
    await mongoose.connection.close();
    logger.info('[Database] Mongoose connection closed gracefully.');
  } catch (error) {
    logger.error(`[Database] Error while closing Mongoose connection: ${error.message}`);
  }
};

export default {
  connectDatabase,
  disconnectDatabase,
};
