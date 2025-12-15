const axios = require('axios');
const logger = require('../utils/logger');

class DynatraceService {
  constructor() {
    this.baseURL = process.env.DYNATRACE_URL;
    this.apiToken = process.env.DYNATRACE_API_TOKEN;
    this.client = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Authorization': `Api-Token ${this.apiToken}`,
        'Content-Type': 'application/json'
      },
      timeout: 30000
    });
  }

  // Get all entities (services, hosts, processes, etc.)
  async getEntities(entityType = null) {
    try {
      const params = entityType ? { entitySelector: `type("${entityType}")` } : {};
      const response = await this.client.get('/api/v2/entities', { params });
      return response.data;
    } catch (error) {
      logger.error('Error fetching entities:', error.message);
      throw error;
    }
  }

  // Get service health and performance metrics
  async getServiceMetrics(serviceId, timeframe = 'now-2h') {
    try {
      const metrics = [
        'builtin:service.response.time',
        'builtin:service.errors.total.rate',
        'builtin:service.requestCount.total',
        'builtin:service.cpu.time'
      ];

      const promises = metrics.map(metric => 
        this.client.get('/api/v2/metrics/query', {
          params: {
            metricSelector: metric,
            entitySelector: `entityId("${serviceId}")`,
            from: timeframe
          }
        })
      );

      const results = await Promise.all(promises);
      return this.formatMetricsResponse(results, metrics);
    } catch (error) {
      logger.error(`Error fetching service metrics for ${serviceId}:`, error.message);
      throw error;
    }
  }

  // Get infrastructure metrics (hosts, databases, etc.)
  async getInfrastructureMetrics(timeframe = 'now-2h') {
    try {
      const metrics = [
        'builtin:host.cpu.usage',
        'builtin:host.mem.usage',
        'builtin:host.disk.usedPct',
        'builtin:host.net.bytesRx',
        'builtin:host.net.bytesTx'
      ];

      const promises = metrics.map(metric =>
        this.client.get('/api/v2/metrics/query', {
          params: {
            metricSelector: metric,
            from: timeframe
          }
        })
      );

      const results = await Promise.all(promises);
      return this.formatMetricsResponse(results, metrics);
    } catch (error) {
      logger.error('Error fetching infrastructure metrics:', error.message);
      throw error;
    }
  }

  // Get database performance metrics
  async getDatabaseMetrics(timeframe = 'now-2h') {
    try {
      const response = await this.client.get('/api/v2/metrics/query', {
        params: {
          metricSelector: 'builtin:service.dbChildCallCount,builtin:service.dbChildCallTime',
          entitySelector: 'type("SERVICE"),databaseVendor.exists()',
          from: timeframe
        }
      });
      return response.data;
    } catch (error) {
      logger.error('Error fetching database metrics:', error.message);
      throw error;
    }
  }

  // Get Kubernetes metrics
  async getKubernetesMetrics(timeframe = 'now-2h') {
    try {
      const metrics = [
        'builtin:kubernetes.cluster.pods',
        'builtin:kubernetes.node.cpu.usage',
        'builtin:kubernetes.node.memory.usage',
        'builtin:kubernetes.workload.cpu.usage',
        'builtin:kubernetes.workload.memory.usage'
      ];

      const promises = metrics.map(metric =>
        this.client.get('/api/v2/metrics/query', {
          params: {
            metricSelector: metric,
            from: timeframe
          }
        })
      );

      const results = await Promise.all(promises);
      return this.formatMetricsResponse(results, metrics);
    } catch (error) {
      logger.error('Error fetching Kubernetes metrics:', error.message);
      throw error;
    }
  }

  // Get active problems/alerts
  async getProblems() {
    try {
      const response = await this.client.get('/api/v2/problems', {
        params: {
          problemSelector: 'status("OPEN")',
          fields: '+evidenceDetails,+recentComments,+impactAnalysis'
        }
      });
      return response.data;
    } catch (error) {
      logger.error('Error fetching problems:', error.message);
      throw error;
    }
  }

  // Get network performance
  async getNetworkMetrics(timeframe = 'now-2h') {
    try {
      const response = await this.client.get('/api/v2/metrics/query', {
        params: {
          metricSelector: 'builtin:host.net.bytesRx,builtin:host.net.bytesTx,builtin:host.net.packetsRx,builtin:host.net.packetsTx',
          from: timeframe
        }
      });
      return response.data;
    } catch (error) {
      logger.error('Error fetching network metrics:', error.message);
      throw error;
    }
  }

  // Get synthetic monitoring results
  async getSyntheticResults(timeframe = 'now-2h') {
    try {
      const response = await this.client.get('/api/v1/synthetic/monitors', {
        params: { from: timeframe }
      });
      return response.data;
    } catch (error) {
      logger.error('Error fetching synthetic results:', error.message);
      throw error;
    }
  }

  formatMetricsResponse(results, metricNames) {
    const formatted = {};
    results.forEach((result, index) => {
      const metricName = metricNames[index];
      formatted[metricName] = result.data;
    });
    return formatted;
  }

  // Health check for Dynatrace connectivity
  async healthCheck() {
    try {
      const response = await this.client.get('/api/v1/config/clusterversion');
      return {
        status: 'connected',
        version: response.data.version,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        status: 'disconnected',
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }
}

module.exports = DynatraceService;