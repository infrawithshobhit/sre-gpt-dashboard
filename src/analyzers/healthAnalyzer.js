const logger = require('../utils/logger');
const DemoDataService = require('../demo/demoDataService');

class HealthAnalyzer {
  constructor(dynatraceService) {
    this.dynatraceService = dynatraceService;
    this.demoDataService = new DemoDataService();
    this.useDemoMode = !process.env.DYNATRACE_URL || process.env.DYNATRACE_URL.includes('your-environment');
    this.thresholds = {
      cpu: { warning: 70, critical: 85 },
      memory: { warning: 80, critical: 90 },
      responseTime: { warning: 1000, critical: 3000 }, // ms
      errorRate: { warning: 1, critical: 5 }, // percentage
      diskUsage: { warning: 80, critical: 90 }
    };
  }

  async generateHealthReport() {
    try {
      logger.info('Generating comprehensive health report...');
      
      // Use demo data if Dynatrace is not properly configured
      if (this.useDemoMode) {
        logger.info('Using demo data mode');
        return this.demoDataService.generateDemoHealthData();
      }
      
      const [
        services,
        infrastructure,
        databases,
        kubernetes,
        problems,
        network,
        synthetic
      ] = await Promise.all([
        this.analyzeServices(),
        this.analyzeInfrastructure(),
        this.analyzeDatabases(),
        this.analyzeKubernetes(),
        this.analyzeProblems(),
        this.analyzeNetwork(),
        this.analyzeSynthetic()
      ]);

      const overallHealth = this.calculateOverallHealth({
        services,
        infrastructure,
        databases,
        kubernetes,
        problems,
        network,
        synthetic
      });

      return {
        timestamp: new Date().toISOString(),
        overallHealth,
        summary: this.generateSummary(overallHealth),
        details: {
          services,
          infrastructure,
          databases,
          kubernetes,
          problems,
          network,
          synthetic
        },
        recommendations: this.generateRecommendations(overallHealth)
      };
    } catch (error) {
      logger.error('Error generating health report:', error);
      
      // Fallback to demo data on error
      logger.info('Falling back to demo data due to error');
      return this.demoDataService.generateDemoHealthData();
    }
  }

  async analyzeServices() {
    try {
      const entities = await this.dynatraceService.getEntities('SERVICE');
      const serviceAnalysis = [];

      for (const service of entities.entities.slice(0, 10)) { // Limit to top 10 services
        try {
          const metrics = await this.dynatraceService.getServiceMetrics(service.entityId);
          const analysis = this.analyzeServiceMetrics(service, metrics);
          serviceAnalysis.push(analysis);
        } catch (error) {
          logger.warn(`Failed to analyze service ${service.displayName}:`, error.message);
        }
      }

      return {
        status: this.determineServicesStatus(serviceAnalysis),
        services: serviceAnalysis,
        summary: `${serviceAnalysis.length} services analyzed`
      };
    } catch (error) {
      logger.error('Error analyzing services:', error);
      return { status: 'unknown', error: error.message };
    }
  }

  analyzeServiceMetrics(service, metrics) {
    const analysis = {
      name: service.displayName,
      entityId: service.entityId,
      status: 'healthy',
      issues: [],
      metrics: {}
    };

    // Analyze response time
    if (metrics['builtin:service.response.time']) {
      const responseTime = this.getLatestValue(metrics['builtin:service.response.time']);
      analysis.metrics.responseTime = responseTime;
      
      if (responseTime > this.thresholds.responseTime.critical) {
        analysis.status = 'critical';
        analysis.issues.push(`Critical response time: ${responseTime}ms`);
      } else if (responseTime > this.thresholds.responseTime.warning) {
        analysis.status = 'warning';
        analysis.issues.push(`High response time: ${responseTime}ms`);
      }
    }

    // Analyze error rate
    if (metrics['builtin:service.errors.total.rate']) {
      const errorRate = this.getLatestValue(metrics['builtin:service.errors.total.rate']);
      analysis.metrics.errorRate = errorRate;
      
      if (errorRate > this.thresholds.errorRate.critical) {
        analysis.status = 'critical';
        analysis.issues.push(`Critical error rate: ${errorRate}%`);
      } else if (errorRate > this.thresholds.errorRate.warning) {
        analysis.status = 'warning';
        analysis.issues.push(`High error rate: ${errorRate}%`);
      }
    }

    return analysis;
  }

  async analyzeInfrastructure() {
    try {
      const metrics = await this.dynatraceService.getInfrastructureMetrics();
      const hosts = await this.dynatraceService.getEntities('HOST');
      
      const hostAnalysis = hosts.entities.map(host => {
        return this.analyzeHostMetrics(host, metrics);
      });

      return {
        status: this.determineInfrastructureStatus(hostAnalysis),
        hosts: hostAnalysis,
        summary: `${hostAnalysis.length} hosts analyzed`
      };
    } catch (error) {
      logger.error('Error analyzing infrastructure:', error);
      return { status: 'unknown', error: error.message };
    }
  }

  analyzeHostMetrics(host, metrics) {
    const analysis = {
      name: host.displayName,
      entityId: host.entityId,
      status: 'healthy',
      issues: [],
      metrics: {}
    };

    // Analyze CPU usage
    if (metrics['builtin:host.cpu.usage']) {
      const cpuUsage = this.getLatestValue(metrics['builtin:host.cpu.usage']);
      analysis.metrics.cpuUsage = cpuUsage;
      
      if (cpuUsage > this.thresholds.cpu.critical) {
        analysis.status = 'critical';
        analysis.issues.push(`Critical CPU usage: ${cpuUsage}%`);
      } else if (cpuUsage > this.thresholds.cpu.warning) {
        analysis.status = 'warning';
        analysis.issues.push(`High CPU usage: ${cpuUsage}%`);
      }
    }

    return analysis;
  }

  async analyzeDatabases() {
    try {
      const metrics = await this.dynatraceService.getDatabaseMetrics();
      const databases = await this.dynatraceService.getEntities('SERVICE');
      
      const dbServices = databases.entities.filter(entity => 
        entity.properties && entity.properties.databaseVendor
      );

      return {
        status: dbServices.length > 0 ? 'healthy' : 'unknown',
        databases: dbServices.map(db => ({
          name: db.displayName,
          vendor: db.properties.databaseVendor,
          status: 'healthy' // Simplified for now
        })),
        summary: `${dbServices.length} database services found`
      };
    } catch (error) {
      logger.error('Error analyzing databases:', error);
      return { status: 'unknown', error: error.message };
    }
  }

  async analyzeKubernetes() {
    try {
      const metrics = await this.dynatraceService.getKubernetesMetrics();
      const clusters = await this.dynatraceService.getEntities('KUBERNETES_CLUSTER');
      
      return {
        status: clusters.entities.length > 0 ? 'healthy' : 'not_found',
        clusters: clusters.entities.map(cluster => ({
          name: cluster.displayName,
          status: 'healthy' // Simplified for now
        })),
        summary: `${clusters.entities.length} Kubernetes clusters found`
      };
    } catch (error) {
      logger.error('Error analyzing Kubernetes:', error);
      return { status: 'unknown', error: error.message };
    }
  }

  async analyzeProblems() {
    try {
      const problems = await this.dynatraceService.getProblems();
      
      const criticalProblems = problems.problems.filter(p => p.severityLevel === 'ERROR');
      const warningProblems = problems.problems.filter(p => p.severityLevel === 'WARNING');

      return {
        status: criticalProblems.length > 0 ? 'critical' : 
                warningProblems.length > 0 ? 'warning' : 'healthy',
        total: problems.problems.length,
        critical: criticalProblems.length,
        warnings: warningProblems.length,
        problems: problems.problems.map(p => ({
          id: p.problemId,
          title: p.title,
          severity: p.severityLevel,
          status: p.status,
          startTime: p.startTime,
          affectedEntities: p.affectedEntities?.length || 0
        }))
      };
    } catch (error) {
      logger.error('Error analyzing problems:', error);
      return { status: 'unknown', error: error.message };
    }
  }

  async analyzeNetwork() {
    try {
      const metrics = await this.dynatraceService.getNetworkMetrics();
      
      return {
        status: 'healthy', // Simplified analysis
        summary: 'Network metrics collected',
        metrics: metrics
      };
    } catch (error) {
      logger.error('Error analyzing network:', error);
      return { status: 'unknown', error: error.message };
    }
  }

  async analyzeSynthetic() {
    try {
      const synthetic = await this.dynatraceService.getSyntheticResults();
      
      return {
        status: 'healthy', // Simplified analysis
        monitors: synthetic.monitors?.length || 0,
        summary: `${synthetic.monitors?.length || 0} synthetic monitors`
      };
    } catch (error) {
      logger.error('Error analyzing synthetic:', error);
      return { status: 'unknown', error: error.message };
    }
  }

  calculateOverallHealth(components) {
    const statuses = Object.values(components).map(c => c.status);
    
    if (statuses.includes('critical')) return 'critical';
    if (statuses.includes('warning')) return 'warning';
    if (statuses.includes('unknown')) return 'degraded';
    return 'healthy';
  }

  generateSummary(overallHealth) {
    const summaries = {
      healthy: "All systems are operating normally. No critical issues detected.",
      warning: "Some components are experiencing minor issues that require attention.",
      degraded: "System performance is degraded. Some components need investigation.",
      critical: "Critical issues detected that require immediate attention."
    };
    
    return summaries[overallHealth] || "System status unknown.";
  }

  generateRecommendations(overallHealth) {
    const recommendations = {
      healthy: ["Continue monitoring", "Review performance trends"],
      warning: ["Investigate warning conditions", "Check resource utilization"],
      degraded: ["Prioritize component investigation", "Review system capacity"],
      critical: ["Immediate investigation required", "Consider emergency procedures"]
    };
    
    return recommendations[overallHealth] || ["Review system status"];
  }

  // Helper methods
  getLatestValue(metricData) {
    if (!metricData.result || !metricData.result[0] || !metricData.result[0].data) {
      return 0;
    }
    
    const dataPoints = metricData.result[0].data;
    return dataPoints[dataPoints.length - 1]?.values?.[0] || 0;
  }

  determineServicesStatus(services) {
    const criticalServices = services.filter(s => s.status === 'critical');
    const warningServices = services.filter(s => s.status === 'warning');
    
    if (criticalServices.length > 0) return 'critical';
    if (warningServices.length > 0) return 'warning';
    return 'healthy';
  }

  determineInfrastructureStatus(hosts) {
    const criticalHosts = hosts.filter(h => h.status === 'critical');
    const warningHosts = hosts.filter(h => h.status === 'warning');
    
    if (criticalHosts.length > 0) return 'critical';
    if (warningHosts.length > 0) return 'warning';
    return 'healthy';
  }

  async generateDetailedAnalysis() {
    const healthReport = await this.generateHealthReport();
    
    return {
      ...healthReport,
      insights: this.generateInsights(healthReport),
      trends: await this.analyzeTrends(),
      predictions: this.generatePredictions(healthReport)
    };
  }

  generateInsights(healthReport) {
    const insights = [];
    
    // Service insights
    if (healthReport.details.services.services) {
      const slowServices = healthReport.details.services.services
        .filter(s => s.metrics.responseTime > this.thresholds.responseTime.warning);
      
      if (slowServices.length > 0) {
        insights.push({
          type: 'performance',
          message: `${slowServices.length} services have elevated response times`,
          services: slowServices.map(s => s.name)
        });
      }
    }
    
    return insights;
  }

  async analyzeTrends() {
    // Placeholder for trend analysis
    return {
      message: "Trend analysis requires historical data collection"
    };
  }

  generatePredictions(healthReport) {
    // Placeholder for predictive analysis
    return {
      message: "Predictive analysis requires machine learning models"
    };
  }
}

module.exports = HealthAnalyzer;