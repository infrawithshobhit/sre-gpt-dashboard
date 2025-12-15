const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { createServer } = require('http');
const { Server } = require('socket.io');
const cron = require('node-cron');
const path = require('path');
require('dotenv').config();

const DynatraceService = require('./dynatrace/dynatraceService');
const HealthAnalyzer = require('./analyzers/healthAnalyzer');
const ChatHandler = require('./chat/chatHandler');
const DynatraceWebhookHandler = require('./webhooks/dynatraceWebhook');
const logger = require('./utils/logger');

class SREGPTApp {
  constructor() {
    this.app = express();
    this.server = createServer(this.app);
    this.io = new Server(this.server, {
      cors: { origin: "*", methods: ["GET", "POST"] }
    });
    
    this.dynatraceService = new DynatraceService();
    this.healthAnalyzer = new HealthAnalyzer(this.dynatraceService);
    this.chatHandler = new ChatHandler(this.healthAnalyzer);
    this.webhookHandler = new DynatraceWebhookHandler(this.io);
    
    this.setupMiddleware();
    this.setupRoutes();
    this.setupSocketHandlers();
    this.setupCronJobs();
  }

  setupMiddleware() {
    this.app.use(helmet());
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(express.static('src/dashboard/dist'));
  }

  setupRoutes() {
    // Health check
    this.app.get('/health', (req, res) => {
      res.json({ status: 'healthy', timestamp: new Date().toISOString() });
    });

    // API routes
    this.app.use('/api/dynatrace', require('./routes/dynatraceRoutes'));
    this.app.use('/api/chat', require('./routes/chatRoutes'));
    this.app.use('/api/dashboard', require('./routes/dashboardRoutes'));
    this.app.use('/api/setup', require('./routes/setupRoutes'));
    
    // Webhook routes
    const { router: webhookRouter, setWebhookHandler } = require('./routes/webhookRoutes');
    setWebhookHandler(this.webhookHandler);
    this.app.use('/api/webhooks', webhookRouter);

    // Serve dashboard static files
    this.app.use(express.static(path.join(__dirname, 'dashboard')));

    // Serve dashboard for all other routes
    this.app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dashboard', 'index.html'));
    });
  }

  setupSocketHandlers() {
    this.io.on('connection', (socket) => {
      logger.info(`Client connected: ${socket.id}`);
      
      socket.on('chat_message', async (data) => {
        try {
          const response = await this.chatHandler.processMessage(data.message);
          socket.emit('chat_response', response);
        } catch (error) {
          logger.error('Chat error:', error);
          socket.emit('chat_error', { error: 'Failed to process message' });
        }
      });

      socket.on('disconnect', () => {
        logger.info(`Client disconnected: ${socket.id}`);
      });
    });
  }

  setupCronJobs() {
    // Monitor application health every 2 minutes
    cron.schedule('*/2 * * * *', async () => {
      try {
        const healthReport = await this.healthAnalyzer.generateHealthReport();
        this.io.emit('health_update', healthReport);
        logger.info('Health report generated and broadcasted');
      } catch (error) {
        logger.error('Health monitoring error:', error);
      }
    });

    // Generate detailed analysis every 15 minutes
    cron.schedule('*/15 * * * *', async () => {
      try {
        const analysis = await this.healthAnalyzer.generateDetailedAnalysis();
        this.io.emit('detailed_analysis', analysis);
      } catch (error) {
        logger.error('Detailed analysis error:', error);
      }
    });
  }

  start() {
    const port = process.env.PORT || 3000;
    this.server.listen(port, () => {
      logger.info(`SRE GPT server running on port ${port}`);
    });
  }
}

const app = new SREGPTApp();
app.start();

module.exports = SREGPTApp;