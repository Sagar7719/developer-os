import winston from 'winston';

const logLevel = process.env.LOG_LEVEL || 'info';
const isProduction = process.env.NODE_ENV === 'production';

const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  isProduction
    ? winston.format.json()
    : winston.format.combine(
        winston.format.colorize(),
        winston.format.printf(({ timestamp, level, message, stack }) => {
          return `[${timestamp}] ${level}: ${stack || message}`;
        })
      )
);

export const logger = winston.createLogger({
  level: logLevel,
  format,
  transports: [new winston.transports.Console()],
});

export default logger;
