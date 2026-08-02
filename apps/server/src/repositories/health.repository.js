import mongoose from 'mongoose';

/**
 * Health Repository — Layer 4: Data access abstraction for database health ping.
 */
export class HealthRepository {
  /**
   * Pings the MongoDB database and returns connection state info.
   * @returns {Promise<{ isConnected: boolean, state: string, pingMs: number|null }>}
   */
  async pingDatabase() {
    const states = ['disconnected', 'connected', 'connecting', 'disconnecting'];
    const connectionState = mongoose.connection.readyState;
    const isConnected = connectionState === 1;

    let pingMs = null;
    if (isConnected && mongoose.connection.db) {
      const startTime = Date.now();
      await mongoose.connection.db.admin().ping();
      pingMs = Date.now() - startTime;
    }

    return {
      isConnected,
      state: states[connectionState] || 'unknown',
      pingMs,
    };
  }
}

export const healthRepository = new HealthRepository();
export default healthRepository;
