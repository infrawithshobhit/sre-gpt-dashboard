const express = require('express');
const router = express.Router();
const HealthAnalyzer = require('../analyzers/healthAnalyzer');
const DynatraceService = require('../dynatrace/dynatraceService');
const logger = require('../utils/logger');

const dynatraceService = new DynatraceService();
const healthAnalyzer = new HealthAnalyzer(dynatraceService);

// Get dashboard data
router.get('/overview', async (req, res) => {
  try {
    const healthReport = await healthAnalyzer.generateHealthReport();
    res.json(healthReport);
  } catch (error) {
    logger.error('Error generating dashboard overview:', error);
    res.status(500).json({ error: 'Failed to generate overview' });
  }
});

// Get detailed analysis
router.get('/analysis', async (req, res) => {
  try {
    const analysis = await healthAnalyzer.generateDetailedAnalysis();
    res.json(analysis);
  } catch (error) {
    logger.error('Error generating detailed analysis:', error);
    res.status(500).json({ error: 'Failed to generate analysis' });
  }
});

// Get real-time metrics
router.get('/metrics/realtime', async (req, res) => {
  try {
    const { component } = req.query;
    let metrics;
    
    switch (component) {
      case 'services':
        metrics = await healthAnalyzer.analyzeServices();
        break;
      case 'infrastructure':
        metrics = await healthAnalyzer.analyzeInfrastructure();
        break;
      case 'kubernetes':
        metrics = await healthAnalyzer.analyzeKubernetes();
        break;
      case 'databases':
        metrics = await healthAnalyzer.analyzeDatabases();
        break;
      default:
        metrics = await healthAnalyzer.generateHealthReport();
    }
    
    res.json(metrics);
  } catch (error) {
    logger.error('Error fetching real-time metrics:', error);
    res.status(500).json({ error: 'Failed to fetch metrics' });
  }
});

module.exports = router;