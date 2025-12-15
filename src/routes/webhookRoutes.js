const express = require('express');
const router = express.Router();
const logger = require('../utils/logger');

// Webhook handler will be injected
let webhookHandler = null;

// Set webhook handler (called from app.js)
function setWebhookHandler(handler) {
  webhookHandler = handler;
}

// Middleware to verify webhook authenticity
function verifyWebhook(req, res, next) {
  const token = req.headers['x-sre-gpt-token'];
  const expectedToken = process.env.WEBHOOK_SECRET || 'sre-gpt-webhook';
  
  if (token !== expectedToken) {
    logger.warn('Unauthorized webhook attempt:', { 
      ip: req.ip, 
      headers: req.headers 
    });
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  next();
}

// Dynatrace webhook endpoint
router.post('/dynatrace', verifyWebhook, (req, res) => {
  try {
    if (!webhookHandler) {
      logger.error('Webhook handler not initialized');
      return res.status(500).json({ error: 'Webhook handler not available' });
    }

    const processedEvent = webhookHandler.handleWebhook(req.body);
    
    logger.info('Webhook processed successfully:', { 
      eventId: processedEvent.id,
      type: processedEvent.type,
      severity: processedEvent.severity
    });
    
    res.json({ 
      success: true, 
      eventId: processedEvent.id,
      message: 'Webhook processed successfully' 
    });
  } catch (error) {
    logger.error('Error processing webhook:', error);
    res.status(500).json({ error: 'Failed to process webhook' });
  }
});

// Get recent webhook events
router.get('/events', (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    let events = [];

    if (webhookHandler) {
      events = webhookHandler.getRecentEvents(limit);
    }
    
    // If no events or demo mode, provide demo events
    if (events.length === 0 || !process.env.DYNATRACE_URL || process.env.DYNATRACE_URL.includes('your-environment')) {
      const DemoDataService = require('../demo/demoDataService');
      const demoService = new DemoDataService();
      events = demoService.generateDemoEvents().slice(0, limit);
    }
    
    res.json({ events });
  } catch (error) {
    logger.error('Error fetching webhook events:', error);
    
    // Fallback to demo events
    try {
      const DemoDataService = require('../demo/demoDataService');
      const demoService = new DemoDataService();
      const events = demoService.generateDemoEvents().slice(0, parseInt(req.query.limit) || 20);
      res.json({ events });
    } catch (demoError) {
      res.status(500).json({ error: 'Failed to fetch events' });
    }
  }
});

// Get events by type
router.get('/events/:type', (req, res) => {
  try {
    if (!webhookHandler) {
      return res.status(500).json({ error: 'Webhook handler not available' });
    }

    const { type } = req.params;
    const limit = parseInt(req.query.limit) || 10;
    const events = webhookHandler.getEventsByType(type, limit);
    
    res.json({ events });
  } catch (error) {
    logger.error('Error fetching events by type:', error);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

// Get webhook configuration for Dynatrace setup
router.get('/config', (req, res) => {
  try {
    if (!webhookHandler) {
      return res.status(500).json({ error: 'Webhook handler not available' });
    }

    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const config = webhookHandler.generateWebhookConfig(baseUrl);
    
    res.json(config);
  } catch (error) {
    logger.error('Error generating webhook config:', error);
    res.status(500).json({ error: 'Failed to generate config' });
  }
});

module.exports = { router, setWebhookHandler };