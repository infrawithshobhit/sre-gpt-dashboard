const express = require('express');
const router = express.Router();
const SetupGuide = require('../setup/setupGuide');
const DynatraceService = require('../dynatrace/dynatraceService');
const logger = require('../utils/logger');

const dynatraceService = new DynatraceService();
const setupGuide = new SetupGuide(dynatraceService);

// Get setup status and configuration guide
router.get('/status', async (req, res) => {
  try {
    const healthReport = await setupGuide.generateHealthReport();
    res.json(healthReport);
  } catch (error) {
    logger.error('Error generating setup status:', error);
    res.status(500).json({ error: 'Failed to generate setup status' });
  }
});

// Validate current configuration
router.get('/validate', async (req, res) => {
  try {
    const validation = await setupGuide.validateConfiguration();
    res.json(validation);
  } catch (error) {
    logger.error('Error validating configuration:', error);
    res.status(500).json({ error: 'Failed to validate configuration' });
  }
});

// Get webhook configuration for Dynatrace
router.get('/webhook-config', (req, res) => {
  try {
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const config = {
      url: `${baseUrl}/api/webhooks/dynatrace`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-SRE-GPT-Token': process.env.WEBHOOK_SECRET || 'sre-gpt-webhook'
      },
      payload: {
        "ProblemNotification": {
          "PID": "{PID}",
          "ProblemTitle": "{ProblemTitle}",
          "State": "{State}",
          "ProblemDetailsText": "{ProblemDetailsText}",
          "ProblemURL": "{ProblemURL}",
          "ImpactedEntities": "{ImpactedEntities}",
          "Tags": "{Tags}"
        }
      },
      events: [
        "PROBLEM_OPENED",
        "PROBLEM_RESOLVED",
        "PROBLEM_UPDATED"
      ]
    };
    
    res.json(config);
  } catch (error) {
    logger.error('Error generating webhook config:', error);
    res.status(500).json({ error: 'Failed to generate webhook config' });
  }
});

// Test Dynatrace connection
router.post('/test-connection', async (req, res) => {
  try {
    const health = await dynatraceService.healthCheck();
    res.json(health);
  } catch (error) {
    logger.error('Error testing Dynatrace connection:', error);
    res.status(500).json({ error: 'Failed to test connection' });
  }
});

module.exports = router;