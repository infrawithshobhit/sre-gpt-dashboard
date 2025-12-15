const express = require('express');
const router = express.Router();
const ChatHandler = require('../chat/chatHandler');
const HealthAnalyzer = require('../analyzers/healthAnalyzer');
const DynatraceService = require('../dynatrace/dynatraceService');
const logger = require('../utils/logger');

const dynatraceService = new DynatraceService();
const healthAnalyzer = new HealthAnalyzer(dynatraceService);
const chatHandler = new ChatHandler(healthAnalyzer);

// Process chat message
router.post('/message', async (req, res) => {
  try {
    const { message, sessionId } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }
    
    const response = await chatHandler.processMessage(message, sessionId);
    res.json(response);
  } catch (error) {
    logger.error('Error processing chat message:', error);
    res.status(500).json({ error: 'Failed to process message' });
  }
});

// Get conversation history
router.get('/history/:sessionId', (req, res) => {
  try {
    const { sessionId } = req.params;
    const context = chatHandler.getConversationContext(sessionId);
    res.json({ history: context.history });
  } catch (error) {
    logger.error('Error fetching conversation history:', error);
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

// Clear conversation history
router.delete('/history/:sessionId', (req, res) => {
  try {
    const { sessionId } = req.params;
    chatHandler.conversationContext.delete(sessionId);
    res.json({ message: 'History cleared' });
  } catch (error) {
    logger.error('Error clearing conversation history:', error);
    res.status(500).json({ error: 'Failed to clear history' });
  }
});

module.exports = router;