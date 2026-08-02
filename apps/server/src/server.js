import app from './app.js';
import { config } from './config/env.config.js';
import { logger } from './config/logger.js';
import { connectDatabase, disconnectDatabase } from './config/db.config.js';

// Catch uncaught synchronous exceptions at the top level
process.on('uncaughtException', (error) => {
  logger.error(`[Server] Uncaught Exception: ${error.message}`, { stack: error.stack });
  process.exit(1);
});

let server;

async function startServer() {
  try {
    // Initialize Database Connection
    await connectDatabase();

    // Start HTTP Server Listener
    server = app.listen(config.port, () => {
      logger.info(
        `[Developer OS Engine] Server running on port ${config.port} in ${config.env} mode`
      );
    });
  } catch (error) {
    logger.error(`[Server] Failed to initialize server bootstrap: ${error.message}`);
    process.exit(1);
  }
}

// Catch unhandled async promise rejections
process.on('unhandledRejection', (reason) => {
  logger.error(`[Server] Unhandled Rejection: ${reason instanceof Error ? reason.stack : reason}`);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});

// Graceful Shutdown Signal Handlers
const handleGracefulShutdown = async (signal) => {
  logger.info(`[Server] ${signal} signal received. Initiating graceful shutdown...`);
  if (server) {
    server.close(async () => {
      logger.info('[Server] HTTP server closed.');
      await disconnectDatabase();
      logger.info('[Server] Graceful shutdown completed. Process exiting.');
      process.exit(0);
    });
  } else {
    await disconnectDatabase();
    process.exit(0);
  }
};

process.on('SIGTERM', () => handleGracefulShutdown('SIGTERM'));
process.on('SIGINT', () => handleGracefulShutdown('SIGINT'));

startServer();
