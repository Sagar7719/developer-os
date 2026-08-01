import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

const app = express();

// Core Middleware Initializers
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Base Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    service: 'Developer OS API Service',
    timestamp: new Date().toISOString(),
  });
});

export default app;
