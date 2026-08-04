import AILog from '../models/aiLog.model.js';

export class AILogRepository {
  /**
   * Creates a new AI execution audit log record.
   * @param {Object} logData
   * @returns {Promise<Document>}
   */
  async createLog(logData) {
    return AILog.create(logData);
  }

  /**
   * Retrieves paginated AI audit logs.
   * @param {Object} options
   * @param {number} [options.page=1]
   * @param {number} [options.limit=10]
   * @param {string} [options.userId]
   * @param {string} [options.promptType]
   * @returns {Promise<{ logs: Document[], total: number, page: number, totalPages: number }>}
   */
  async getLogsPaginated({ page = 1, limit = 10, userId = null, promptType = null } = {}) {
    const query = {};
    if (userId) query.user = userId;
    if (promptType) query.promptType = promptType;

    const skip = (page - 1) * limit;

    const [logs, total] = await Promise.all([
      AILog.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).exec(),
      AILog.countDocuments(query),
    ]);

    return {
      logs,
      total,
      page,
      totalPages: Math.ceil(total / limit) || 1,
    };
  }

  /**
   * Aggregates total usage stats grouped by promptType.
   * @returns {Promise<Array>}
   */
  async getUsageStats() {
    const stats = await AILog.aggregate([
      {
        $group: {
          _id: '$promptType',
          totalCalls: { $sum: 1 },
          successfulCalls: {
            $sum: { $cond: [{ $eq: ['$status', 'SUCCESS'] }, 1, 0] },
          },
          failedCalls: {
            $sum: { $cond: [{ $eq: ['$status', 'FAILED'] }, 1, 0] },
          },
          totalPromptTokens: { $sum: '$promptTokens' },
          totalCompletionTokens: { $sum: '$completionTokens' },
          totalTokens: { $sum: '$totalTokens' },
          avgLatencyMs: { $avg: '$latencyMs' },
        },
      },
      {
        $project: {
          promptType: '$_id',
          totalCalls: 1,
          successfulCalls: 1,
          failedCalls: 1,
          totalPromptTokens: 1,
          totalCompletionTokens: 1,
          totalTokens: 1,
          avgLatencyMs: { $round: ['$avgLatencyMs', 2] },
          _id: 0,
        },
      },
    ]);

    return stats;
  }
}

export const aiLogRepository = new AILogRepository();
export default aiLogRepository;
