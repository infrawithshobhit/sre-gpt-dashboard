class DemoDataService {
  constructor() {
    this.demoMode = true;
  }

  // Generate realistic demo data for health monitoring
  generateDemoHealthData() {
    return {
      timestamp: new Date().toISOString(),
      overallHealth: 'healthy',
      summary: 'All systems are operating normally in demo mode. This is simulated data for demonstration purposes.',
      details: {
        services: {
          status: 'critical',
          summary: '1 service down, 1 critical, 3 healthy',
          services: [
            {
              name: 'User Authentication Service',
              status: 'healthy',
              metrics: { responseTime: 145, errorRate: 0.1 },
              issues: []
            },
            {
              name: 'Payment Processing API',
              status: 'critical',
              metrics: { responseTime: 3200, errorRate: 8.5 },
              issues: ['Critical response time detected', 'High error rate']
            },
            {
              name: 'Email Service',
              status: 'down',
              metrics: { responseTime: 0, errorRate: 100 },
              issues: ['Service unreachable', 'Connection timeout']
            },
            {
              name: 'Inventory Management',
              status: 'healthy',
              metrics: { responseTime: 234, errorRate: 0.0 },
              issues: []
            },
            {
              name: 'Notification Service',
              status: 'healthy',
              metrics: { responseTime: 67, errorRate: 0.2 },
              issues: []
            }
          ]
        },
        infrastructure: {
          status: 'healthy',
          summary: '8 hosts running optimally',
          hosts: [
            {
              name: 'web-server-01',
              status: 'healthy',
              metrics: { cpuUsage: 45, memoryUsage: 67 },
              issues: []
            },
            {
              name: 'api-server-02',
              status: 'warning',
              metrics: { cpuUsage: 78, memoryUsage: 85 },
              issues: ['High memory usage detected']
            },
            {
              name: 'db-server-01',
              status: 'healthy',
              metrics: { cpuUsage: 23, memoryUsage: 56 },
              issues: []
            }
          ]
        },
        databases: {
          status: 'healthy',
          summary: '3 database instances healthy',
          databases: [
            {
              name: 'Primary PostgreSQL',
              vendor: 'PostgreSQL',
              status: 'healthy'
            },
            {
              name: 'Redis Cache',
              vendor: 'Redis',
              status: 'healthy'
            },
            {
              name: 'Analytics MongoDB',
              vendor: 'MongoDB',
              status: 'healthy'
            }
          ]
        },
        kubernetes: {
          status: 'healthy',
          summary: '2 clusters running smoothly',
          clusters: [
            {
              name: 'production-cluster',
              status: 'healthy'
            },
            {
              name: 'staging-cluster',
              status: 'healthy'
            }
          ]
        },
        problems: {
          status: 'critical',
          total: 3,
          critical: 2,
          warnings: 1,
          problems: [
            {
              id: 'DEMO-001',
              title: 'Payment API Response Time Elevated',
              severity: 'WARNING',
              status: 'OPEN',
              startTime: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
              affectedEntities: 1
            },
            {
              id: 'DEMO-002',
              title: 'High Memory Usage on API Server',
              severity: 'WARNING',
              status: 'OPEN',
              startTime: new Date(Date.now() - 1800000).toISOString(), // 30 minutes ago
              affectedEntities: 1
            }
          ]
        },
        network: {
          status: 'healthy',
          summary: 'Network performance within normal parameters'
        },
        synthetic: {
          status: 'healthy',
          monitors: 5,
          summary: '5 synthetic monitors passing'
        }
      },
      recommendations: [
        'Consider scaling the Payment Processing API to handle increased load',
        'Monitor memory usage on api-server-02 and consider adding more RAM',
        'Review database query performance for optimization opportunities',
        'Set up additional monitoring for critical business transactions'
      ]
    };
  }

  // Generate demo webhook events
  generateDemoEvents() {
    const events = [];
    const now = Date.now();
    
    // Recent events (last 2 hours)
    const eventTypes = [
      { type: 'problem', severity: 'WARNING', title: 'API Response Time Alert' },
      { type: 'deployment', severity: 'INFO', title: 'User Service v2.1.3 Deployed' },
      { type: 'metric', severity: 'INFO', title: 'CPU Usage Normalized' },
      { type: 'problem', severity: 'CRITICAL', title: 'Database Connection Pool Exhausted' },
      { type: 'deployment', severity: 'INFO', title: 'Frontend v1.8.2 Deployed' }
    ];

    eventTypes.forEach((event, index) => {
      events.push({
        id: `demo-event-${index + 1}`,
        type: event.type,
        title: event.title,
        severity: event.severity,
        status: event.severity === 'CRITICAL' ? 'RESOLVED' : 'ACTIVE',
        timestamp: new Date(now - (index * 1800000)).toISOString(), // 30 min intervals
        source: 'demo_data'
      });
    });

    return events;
  }

  // Simulate real-time data updates
  getRealtimeUpdate() {
    const updates = [
      'CPU usage on web-server-01 decreased to 42%',
      'New deployment detected: Payment API v3.1.0',
      'Response time improved for User Authentication Service',
      'Memory usage stabilized on api-server-02',
      'All synthetic monitors passing successfully'
    ];

    return {
      timestamp: new Date().toISOString(),
      message: updates[Math.floor(Math.random() * updates.length)],
      type: 'info'
    };
  }
}

module.exports = DemoDataService;