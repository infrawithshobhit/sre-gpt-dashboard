const logger = require('../utils/logger');

class ChatHandler {
  constructor(healthAnalyzer) {
    this.healthAnalyzer = healthAnalyzer;
    this.conversationContext = new Map();
  }

  async processMessage(message, sessionId = 'default') {
    try {
      logger.info(`Processing chat message: ${message}`);
      
      const intent = this.analyzeIntent(message);
      const context = this.getConversationContext(sessionId);
      
      let response;
      
      switch (intent.type) {
        case 'health_status':
          response = await this.handleHealthStatusQuery(intent, context);
          break;
        case 'service_specific':
          response = await this.handleServiceQuery(intent, context);
          break;
        case 'critical_services':
          response = await this.handleCriticalServicesQuery(intent, context);
          break;
        case 'infrastructure':
          response = await this.handleInfrastructureQuery(intent, context);
          break;
        case 'database':
          response = await this.handleDatabaseQuery(intent, context);
          break;
        case 'kubernetes':
          response = await this.handleKubernetesQuery(intent, context);
          break;
        case 'network':
          response = await this.handleNetworkQuery(intent, context);
          break;
        case 'problems':
          response = await this.handleProblemsQuery(intent, context);
          break;
        case 'recommendations':
          response = await this.handleRecommendationsQuery(intent, context);
          break;
        default:
          response = await this.handleGeneralQuery(message, context);
      }
      
      this.updateConversationContext(sessionId, message, response);
      
      return {
        message: response.message,
        data: response.data || null,
        suggestions: response.suggestions || [],
        timestamp: new Date().toISOString()
      };
      
    } catch (error) {
      logger.error('Error processing chat message:', error);
      return {
        message: "I'm sorry, I encountered an error while processing your request. Please try again.",
        error: true,
        timestamp: new Date().toISOString()
      };
    }
  }

  analyzeIntent(message) {
    const lowerMessage = message.toLowerCase();
    
    // Health status queries
    if (this.matchesPatterns(lowerMessage, [
      'health', 'status', 'how is', 'overall', 'system status', 'everything ok'
    ])) {
      return { type: 'health_status', confidence: 0.9 };
    }
    
    // Critical/Down application queries (high priority)
    if (this.matchesPatterns(lowerMessage, [
      'down', 'critical', 'failing', 'broken', 'not working', 'offline', 'crashed'
    ])) {
      return { type: 'critical_services', confidence: 0.95 };
    }
    
    // Service-specific queries
    if (this.matchesPatterns(lowerMessage, [
      'service', 'api', 'endpoint', 'microservice', 'application'
    ])) {
      const serviceName = this.extractServiceName(message);
      return { type: 'service_specific', serviceName, confidence: 0.8 };
    }
    
    // Infrastructure queries
    if (this.matchesPatterns(lowerMessage, [
      'server', 'host', 'cpu', 'memory', 'disk', 'infrastructure'
    ])) {
      return { type: 'infrastructure', confidence: 0.8 };
    }
    
    // Database queries
    if (this.matchesPatterns(lowerMessage, [
      'database', 'db', 'sql', 'mysql', 'postgres', 'mongodb'
    ])) {
      return { type: 'database', confidence: 0.8 };
    }
    
    // Kubernetes queries
    if (this.matchesPatterns(lowerMessage, [
      'kubernetes', 'k8s', 'pod', 'container', 'cluster', 'deployment'
    ])) {
      return { type: 'kubernetes', confidence: 0.8 };
    }
    
    // Network queries
    if (this.matchesPatterns(lowerMessage, [
      'network', 'bandwidth', 'latency', 'connection', 'traffic'
    ])) {
      return { type: 'network', confidence: 0.8 };
    }
    
    // Problems/alerts queries
    if (this.matchesPatterns(lowerMessage, [
      'problem', 'alert', 'issue', 'error', 'down', 'failing'
    ])) {
      return { type: 'problems', confidence: 0.9 };
    }
    
    // Recommendations queries
    if (this.matchesPatterns(lowerMessage, [
      'recommend', 'suggest', 'what should', 'advice', 'optimize'
    ])) {
      return { type: 'recommendations', confidence: 0.7 };
    }
    
    return { type: 'general', confidence: 0.5 };
  }

  async handleHealthStatusQuery(intent, context) {
    const healthReport = await this.healthAnalyzer.generateHealthReport();
    
    let message = `🔍 **System Health Overview**\n\n`;
    message += `**Overall Status:** ${this.getStatusEmoji(healthReport.overallHealth)} ${healthReport.overallHealth.toUpperCase()}\n\n`;
    message += `${healthReport.summary}\n\n`;
    
    message += `**Component Status:**\n`;
    message += `• Services: ${this.getStatusEmoji(healthReport.details.services.status)} ${healthReport.details.services.summary}\n`;
    message += `• Infrastructure: ${this.getStatusEmoji(healthReport.details.infrastructure.status)} ${healthReport.details.infrastructure.summary}\n`;
    message += `• Databases: ${this.getStatusEmoji(healthReport.details.databases.status)} ${healthReport.details.databases.summary}\n`;
    message += `• Kubernetes: ${this.getStatusEmoji(healthReport.details.kubernetes.status)} ${healthReport.details.kubernetes.summary}\n`;
    
    if (healthReport.details.problems.total > 0) {
      message += `\n⚠️ **Active Issues:** ${healthReport.details.problems.total} problems detected\n`;
      message += `• Critical: ${healthReport.details.problems.critical}\n`;
      message += `• Warnings: ${healthReport.details.problems.warnings}\n`;
    }
    
    return {
      message,
      data: healthReport,
      suggestions: [
        "Show me service details",
        "What problems are active?",
        "Check infrastructure status",
        "Show recommendations"
      ]
    };
  }

  async handleCriticalServicesQuery(intent, context) {
    const healthReport = await this.healthAnalyzer.generateHealthReport();
    const services = healthReport.details.services.services;
    
    // Find critical, down, or problematic services
    const criticalServices = services.filter(s => s.status === 'critical');
    const warningServices = services.filter(s => s.status === 'warning');
    const downServices = services.filter(s => s.status === 'down' || s.status === 'offline');
    
    let message = `🚨 **Critical & Down Applications Status**\n\n`;
    
    // Check for down/offline services first
    if (downServices.length > 0) {
      message += `❌ **Applications Currently DOWN (${downServices.length}):**\n`;
      downServices.forEach(service => {
        message += `• **${service.name}** - Status: ${service.status.toUpperCase()}\n`;
        if (service.issues.length > 0) {
          message += `  Issues: ${service.issues.join(', ')}\n`;
        }
      });
      message += `\n`;
    }
    
    // Check for critical services
    if (criticalServices.length > 0) {
      message += `🔴 **Critical Applications (${criticalServices.length}):**\n`;
      criticalServices.forEach(service => {
        message += `• **${service.name}** - ${service.issues.join(', ')}\n`;
        if (service.metrics.responseTime) {
          message += `  Response Time: ${service.metrics.responseTime}ms\n`;
        }
        if (service.metrics.errorRate) {
          message += `  Error Rate: ${service.metrics.errorRate}%\n`;
        }
      });
      message += `\n`;
    }
    
    // Check for warning services
    if (warningServices.length > 0) {
      message += `⚠️ **Applications with Issues (${warningServices.length}):**\n`;
      warningServices.forEach(service => {
        message += `• **${service.name}** - ${service.issues.join(', ')}\n`;
        if (service.metrics.responseTime > 500) {
          message += `  Response Time: ${service.metrics.responseTime}ms (elevated)\n`;
        }
        if (service.metrics.errorRate > 1) {
          message += `  Error Rate: ${service.metrics.errorRate}% (above normal)\n`;
        }
      });
      message += `\n`;
    }
    
    // If no critical issues found
    if (criticalServices.length === 0 && warningServices.length === 0 && downServices.length === 0) {
      message += `✅ **Good News!** No applications are currently down or in critical state.\n\n`;
      message += `All ${services.length} monitored applications are running normally:\n`;
      services.forEach(service => {
        message += `• ${service.name} - ${this.getStatusEmoji(service.status)} ${service.status}\n`;
      });
    } else {
      // Provide immediate action recommendations
      message += `🔧 **Immediate Actions Recommended:**\n`;
      if (downServices.length > 0) {
        message += `1. **URGENT**: Investigate and restore down applications immediately\n`;
      }
      if (criticalServices.length > 0) {
        message += `2. **HIGH PRIORITY**: Address critical service issues\n`;
      }
      if (warningServices.length > 0) {
        message += `3. **MONITOR**: Keep close watch on warning services\n`;
      }
    }
    
    return {
      message,
      data: { 
        critical: criticalServices, 
        warning: warningServices, 
        down: downServices,
        total_issues: criticalServices.length + warningServices.length + downServices.length
      },
      suggestions: [
        "Show detailed service metrics",
        "What caused these issues?",
        "How can I fix the problems?",
        "Show infrastructure status"
      ]
    };
  }

  async handleServiceQuery(intent, context) {
    const healthReport = await this.healthAnalyzer.generateHealthReport();
    const services = healthReport.details.services.services;
    
    let message = `🔧 **Service Analysis**\n\n`;
    
    if (intent.serviceName) {
      const service = services.find(s => 
        s.name.toLowerCase().includes(intent.serviceName.toLowerCase())
      );
      
      if (service) {
        message += `**${service.name}**\n`;
        message += `Status: ${this.getStatusEmoji(service.status)} ${service.status.toUpperCase()}\n`;
        
        if (service.metrics.responseTime) {
          message += `Response Time: ${service.metrics.responseTime}ms\n`;
        }
        if (service.metrics.errorRate) {
          message += `Error Rate: ${service.metrics.errorRate}%\n`;
        }
        
        if (service.issues.length > 0) {
          message += `\n**Issues:**\n`;
          service.issues.forEach(issue => {
            message += `• ${issue}\n`;
          });
        }
      } else {
        message += `Service "${intent.serviceName}" not found.\n\n`;
        message += `**Available Services:**\n`;
        services.slice(0, 5).forEach(service => {
          message += `• ${service.name} - ${this.getStatusEmoji(service.status)} ${service.status}\n`;
        });
      }
    } else {
      message += `**Service Overview (${services.length} services)**\n\n`;
      
      const criticalServices = services.filter(s => s.status === 'critical');
      const warningServices = services.filter(s => s.status === 'warning');
      
      if (criticalServices.length > 0) {
        message += `🚨 **Critical Services (${criticalServices.length}):**\n`;
        criticalServices.forEach(service => {
          message += `• ${service.name}: ${service.issues.join(', ')}\n`;
        });
        message += `\n`;
      }
      
      if (warningServices.length > 0) {
        message += `⚠️ **Warning Services (${warningServices.length}):**\n`;
        warningServices.forEach(service => {
          message += `• ${service.name}: ${service.issues.join(', ')}\n`;
        });
        message += `\n`;
      }
      
      const healthyServices = services.filter(s => s.status === 'healthy');
      message += `✅ **Healthy Services:** ${healthyServices.length}\n`;
    }
    
    return {
      message,
      data: { services },
      suggestions: [
        "Show infrastructure status",
        "What are the current problems?",
        "Show service recommendations"
      ]
    };
  }

  async handleInfrastructureQuery(intent, context) {
    const healthReport = await this.healthAnalyzer.generateHealthReport();
    const infrastructure = healthReport.details.infrastructure;
    
    let message = `🖥️ **Infrastructure Status**\n\n`;
    message += `Overall Status: ${this.getStatusEmoji(infrastructure.status)} ${infrastructure.status.toUpperCase()}\n`;
    message += `${infrastructure.summary}\n\n`;
    
    if (infrastructure.hosts && infrastructure.hosts.length > 0) {
      const criticalHosts = infrastructure.hosts.filter(h => h.status === 'critical');
      const warningHosts = infrastructure.hosts.filter(h => h.status === 'warning');
      
      if (criticalHosts.length > 0) {
        message += `🚨 **Critical Hosts:**\n`;
        criticalHosts.forEach(host => {
          message += `• ${host.name}: ${host.issues.join(', ')}\n`;
        });
        message += `\n`;
      }
      
      if (warningHosts.length > 0) {
        message += `⚠️ **Warning Hosts:**\n`;
        warningHosts.forEach(host => {
          message += `• ${host.name}: ${host.issues.join(', ')}\n`;
        });
        message += `\n`;
      }
      
      const healthyHosts = infrastructure.hosts.filter(h => h.status === 'healthy');
      message += `✅ **Healthy Hosts:** ${healthyHosts.length}\n`;
    }
    
    return {
      message,
      data: infrastructure,
      suggestions: [
        "Show CPU usage details",
        "Check memory utilization",
        "Show network performance"
      ]
    };
  }

  async handleDatabaseQuery(intent, context) {
    const healthReport = await this.healthAnalyzer.generateHealthReport();
    const databases = healthReport.details.databases;
    
    let message = `🗄️ **Database Status**\n\n`;
    message += `Status: ${this.getStatusEmoji(databases.status)} ${databases.status.toUpperCase()}\n`;
    message += `${databases.summary}\n\n`;
    
    if (databases.databases && databases.databases.length > 0) {
      message += `**Database Services:**\n`;
      databases.databases.forEach(db => {
        message += `• ${db.name} (${db.vendor}) - ${this.getStatusEmoji(db.status)} ${db.status}\n`;
      });
    }
    
    return {
      message,
      data: databases,
      suggestions: [
        "Show database performance metrics",
        "Check connection pools",
        "Show query performance"
      ]
    };
  }

  async handleKubernetesQuery(intent, context) {
    const healthReport = await this.healthAnalyzer.generateHealthReport();
    const kubernetes = healthReport.details.kubernetes;
    
    let message = `☸️ **Kubernetes Status**\n\n`;
    message += `Status: ${this.getStatusEmoji(kubernetes.status)} ${kubernetes.status.toUpperCase()}\n`;
    message += `${kubernetes.summary}\n\n`;
    
    if (kubernetes.clusters && kubernetes.clusters.length > 0) {
      message += `**Clusters:**\n`;
      kubernetes.clusters.forEach(cluster => {
        message += `• ${cluster.name} - ${this.getStatusEmoji(cluster.status)} ${cluster.status}\n`;
      });
    }
    
    return {
      message,
      data: kubernetes,
      suggestions: [
        "Show pod status",
        "Check resource utilization",
        "Show deployment health"
      ]
    };
  }

  async handleNetworkQuery(intent, context) {
    const healthReport = await this.healthAnalyzer.generateHealthReport();
    const network = healthReport.details.network;
    
    let message = `🌐 **Network Status**\n\n`;
    message += `Status: ${this.getStatusEmoji(network.status)} ${network.status.toUpperCase()}\n`;
    message += `${network.summary}\n\n`;
    
    return {
      message,
      data: network,
      suggestions: [
        "Show bandwidth utilization",
        "Check latency metrics",
        "Show connection status"
      ]
    };
  }

  async handleProblemsQuery(intent, context) {
    const healthReport = await this.healthAnalyzer.generateHealthReport();
    const problems = healthReport.details.problems;
    
    let message = `🚨 **Active Problems**\n\n`;
    
    if (problems.total === 0) {
      message += `✅ No active problems detected!\n`;
    } else {
      message += `**Summary:**\n`;
      message += `• Total Problems: ${problems.total}\n`;
      message += `• Critical: ${problems.critical}\n`;
      message += `• Warnings: ${problems.warnings}\n\n`;
      
      if (problems.problems && problems.problems.length > 0) {
        message += `**Recent Problems:**\n`;
        problems.problems.slice(0, 5).forEach(problem => {
          const severity = problem.severity === 'ERROR' ? '🚨' : '⚠️';
          message += `${severity} **${problem.title}**\n`;
          message += `   Status: ${problem.status} | Affected: ${problem.affectedEntities} entities\n`;
          message += `   Started: ${new Date(problem.startTime).toLocaleString()}\n\n`;
        });
      }
    }
    
    return {
      message,
      data: problems,
      suggestions: [
        "Show problem details",
        "Get resolution recommendations",
        "Check affected services"
      ]
    };
  }

  async handleRecommendationsQuery(intent, context) {
    const healthReport = await this.healthAnalyzer.generateHealthReport();
    
    let message = `💡 **Recommendations**\n\n`;
    
    if (healthReport.recommendations && healthReport.recommendations.length > 0) {
      healthReport.recommendations.forEach((rec, index) => {
        message += `${index + 1}. ${rec}\n`;
      });
    } else {
      message += `No specific recommendations at this time. System appears to be running well!\n`;
    }
    
    return {
      message,
      data: { recommendations: healthReport.recommendations },
      suggestions: [
        "Show performance optimization tips",
        "Get capacity planning advice",
        "Show best practices"
      ]
    };
  }

  async handleGeneralQuery(message, context) {
    const lowerMessage = message.toLowerCase();
    
    // Handle common greetings and questions
    if (this.matchesPatterns(lowerMessage, ['hello', 'hi', 'hey', 'good morning', 'good afternoon'])) {
      return {
        message: `👋 Hello! I'm SRE GPT, your intelligent monitoring assistant!\n\n` +
                 `I'm here to help you understand your application's health and performance. I can:\n\n` +
                 `🔍 **Monitor & Analyze**: Real-time system health, performance metrics, and trends\n` +
                 `🚨 **Alert & Diagnose**: Active problems, root cause analysis, and impact assessment\n` +
                 `💡 **Recommend & Guide**: Optimization suggestions and best practices\n` +
                 `📊 **Report & Explain**: Detailed insights in plain English\n\n` +
                 `**Try asking me:**\n` +
                 `• "How is my system performing?"\n` +
                 `• "What problems need attention?"\n` +
                 `• "Show me the slowest services"\n` +
                 `• "Explain the current alerts"\n\n` +
                 `What would you like to know?`,
        suggestions: [
          "Show system health overview",
          "What problems are active?",
          "Check service performance",
          "Explain current alerts"
        ]
      };
    }

    // Handle help requests
    if (this.matchesPatterns(lowerMessage, ['help', 'what can you do', 'commands', 'capabilities'])) {
      return {
        message: `🤖 **SRE GPT Capabilities**\n\n` +
                 `**System Monitoring:**\n` +
                 `• "Show system health" - Overall application status\n` +
                 `• "Check service performance" - Individual service metrics\n` +
                 `• "Monitor infrastructure" - Server and resource status\n\n` +
                 `**Problem Management:**\n` +
                 `• "What problems are active?" - Current issues and alerts\n` +
                 `• "Explain this alert" - Detailed problem analysis\n` +
                 `• "Show critical issues" - High-priority problems only\n\n` +
                 `**Performance Analysis:**\n` +
                 `• "Which services are slow?" - Performance bottlenecks\n` +
                 `• "Show error rates" - Service reliability metrics\n` +
                 `• "Check database performance" - Database health status\n\n` +
                 `**Recommendations:**\n` +
                 `• "What should I investigate?" - Priority recommendations\n` +
                 `• "How can I optimize performance?" - Improvement suggestions\n` +
                 `• "Show best practices" - SRE guidance\n\n` +
                 `Just ask me in natural language - I understand context!`,
        suggestions: [
          "Show system health",
          "What problems are active?",
          "Which services are slow?",
          "What should I investigate?"
        ]
      };
    }

    // Handle demo/test queries
    if (this.matchesPatterns(lowerMessage, ['demo', 'test', 'example', 'sample'])) {
      return {
        message: `🎯 **Demo Mode Active**\n\n` +
                 `You're currently viewing simulated monitoring data. This demonstrates how SRE GPT works with real Dynatrace integration.\n\n` +
                 `**Current Demo Data:**\n` +
                 `• 12 services (1 with performance issues)\n` +
                 `• 8 infrastructure hosts (1 with high memory usage)\n` +
                 `• 3 healthy database instances\n` +
                 `• 2 Kubernetes clusters running smoothly\n` +
                 `• 2 active warnings (non-critical)\n\n` +
                 `**To connect real data:**\n` +
                 `1. Add your Dynatrace URL and API token to the .env file\n` +
                 `2. Restart the application\n` +
                 `3. Set up webhooks in Dynatrace for real-time alerts\n\n` +
                 `Try exploring the demo data with questions like "What's causing the performance issues?"`,
        suggestions: [
          "What's causing the performance issues?",
          "Show me the warning alerts",
          "Which server needs attention?",
          "How do I connect real data?"
        ]
      };
    }

    // Default response with enhanced guidance
    return {
      message: `I'm SRE GPT, your intelligent application monitoring assistant! 🤖\n\n` +
               `I specialize in helping you understand and manage your application's health. Here's what I can do:\n\n` +
               `**🔍 Real-time Monitoring**\n` +
               `Ask me about system health, service performance, or infrastructure status\n\n` +
               `**🚨 Problem Analysis**\n` +
               `I can explain alerts, identify root causes, and suggest solutions\n\n` +
               `**💡 Smart Recommendations**\n` +
               `Get actionable insights for optimization and best practices\n\n` +
               `**📊 Performance Insights**\n` +
               `Understand trends, bottlenecks, and improvement opportunities\n\n` +
               `**Example questions:**\n` +
               `• "How is my application performing today?"\n` +
               `• "What's the root cause of the slow response times?"\n` +
               `• "Which services need immediate attention?"\n` +
               `• "How can I improve system reliability?"\n\n` +
               `What would you like to explore?`,
      suggestions: [
        "Show overall system health",
        "What problems need attention?",
        "Analyze service performance",
        "Give me recommendations"
      ]
    };
  }

  // Helper methods
  matchesPatterns(text, patterns) {
    return patterns.some(pattern => text.includes(pattern));
  }

  extractServiceName(message) {
    // Simple extraction - could be enhanced with NLP
    const words = message.split(' ');
    const serviceIndex = words.findIndex(word => 
      ['service', 'api', 'microservice'].includes(word.toLowerCase())
    );
    
    if (serviceIndex !== -1 && serviceIndex < words.length - 1) {
      return words[serviceIndex + 1];
    }
    
    return null;
  }

  getStatusEmoji(status) {
    const emojis = {
      healthy: '✅',
      warning: '⚠️',
      critical: '🚨',
      degraded: '🔶',
      unknown: '❓',
      not_found: '❌'
    };
    return emojis[status] || '❓';
  }

  getConversationContext(sessionId) {
    return this.conversationContext.get(sessionId) || { history: [] };
  }

  updateConversationContext(sessionId, message, response) {
    const context = this.getConversationContext(sessionId);
    context.history.push({
      message,
      response: response.message,
      timestamp: new Date().toISOString()
    });
    
    // Keep only last 10 interactions
    if (context.history.length > 10) {
      context.history = context.history.slice(-10);
    }
    
    this.conversationContext.set(sessionId, context);
  }
}

module.exports = ChatHandler;