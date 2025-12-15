const express = require('express');
const router = express.Router();
const DynatraceService = require('../dynatrace/dynatraceService');
const logger = require('../utils/logger');

const dynatraceService = new DynatraceService();

// Health check endpoint
router.get('/health', async (req, res) => {
  try {
    const health = await dynatraceService.healthCheck();
    res.json(health);
  } catch (error) {
    logger.error('Dynatrace health check failed:', error);
    res.status(500).json({ error: 'Health check failed' });
  }
});

// Get all entities
router.get('/entities', async (req, res) => {
  try {
    const { type } = req.query;
    const entities = await dynatraceService.getEntities(type);
    res.json(entities);
  } catch (error) {
    logger.error('Error fetching entities:', error);
    res.status(500).json({ error: 'Failed to fetch entities' });
  }
});

// Get service metrics
router.get('/services/:serviceId/metrics', async (req, res) => {
  try {
    const { serviceId } = req.params;
    const { timeframe = 'now-2h' } = req.query;
    const metrics = await dynatraceService.getServiceMetrics(serviceId, timeframe);
    res.json(metrics);
  } catch (error) {
    logger.error('Error fetching service metrics:', error);
    res.status(500).json({ error: 'Failed to fetch service metrics' });
  }
});

// Get infrastructure metrics
router.get('/infrastructure/metrics', async (req, res) => {
  try {
    const { timeframe = 'now-2h' } = req.query;
    const metrics = await dynatraceService.getInfrastructureMetrics(timeframe);
    res.json(metrics);
  } catch (error) {
    logger.error('Error fetching infrastructure metrics:', error);
    res.status(500).json({ error: 'Failed to fetch infrastructure metrics' });
  }
});

// Get active problems
router.get('/problems', async (req, res) => {
  try {
    const problems = await dynatraceService.getProblems();
    res.json(problems);
  } catch (error) {
    logger.error('Error fetching problems:', error);
    res.status(500).json({ error: 'Failed to fetch problems' });
  }
});

// Get Kubernetes metrics
router.get('/kubernetes/metrics', async (req, res) => {
  try {
    const { timeframe = 'now-2h' } = req.query;
    const metrics = await dynatraceService.getKubernetesMetrics(timeframe);
    res.json(metrics);
  } catch (error) {
    logger.error('Error fetching Kubernetes metrics:', error);
    res.status(500).json({ error: 'Failed to fetch Kubernetes metrics' });
  }
});

// Get database metrics
router.get('/databases/metrics', async (req, res) => {
  try {
    const { timeframe = 'now-2h' } = req.query;
    const metrics = await dynatraceService.getDatabaseMetrics(timeframe);
    res.json(metrics);
  } catch (error) {
    logger.error('Error fetching database metrics:', error);
    res.status(500).json({ error: 'Failed to fetch database metrics' });
  }
});

// Get network metrics
router.get('/network/metrics', async (req, res) => {
  try {
    const { timeframe = 'now-2h' } = req.query;
    const metrics = await dynatraceService.getNetworkMetrics(timeframe);
    res.json(metrics);
  } catch (error) {
    logger.error('Error fetching network metrics:', error);
    res.status(500).json({ error: 'Failed to fetch network metrics' });
  }
});

module.exports = router;