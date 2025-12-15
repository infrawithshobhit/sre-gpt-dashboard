const logger = require('../utils/logger');

class DynatraceWebhookHandler {
  constructor(io) {
    this.io = io;
    this.webhookData = new Map(); // Store recent webhook data
    this.maxStoredEvents = 100; // Keep last 100 events
  }

  // Handle incoming Dynatrace webhook
  handleWebhook(webhookPayload) {
    try {
      logger.info('Received Dynatrace webhook:', JSON.stringify(webhookPayload, null, 2));
      
      const processedEvent = this.processWebhookEvent(webhookPayload);
      
      // Store the event
      this.storeEvent(processedEvent);
      
      // Broadcast to connected clients
      this.io.emit('dynatrace_event', processedEvent);
      
      // Check if this is a critical event that needs immediate attention
      if (processedEvent.severity === 'CRITICAL' || processedEvent.severity === 'ERROR') {
        this.io.emit('critical_alert', processedEvent);
      }
      
      return processedEvent;
    } catch (error) {
      logger.error('Error processing Dynatrace webhook:', error);
      throw error;
    }
  }

  processWebhookEvent(payload) {
    // Handle different types of Dynatrace webhooks
    if (payload.ProblemNotification) {
      return this.processProblemNotification(payload.ProblemNotification);
    } else if (payload.MetricEvent) {
      return this.processMetricEvent(payload.MetricEvent);
    } else if (payload.DeploymentEvent) {
      return this.processDeploymentEvent(payload.DeploymentEvent);
    } else {
      return this.processGenericEvent(payload);
    }
  }

  processProblemNotification(problem) {
    return {
      type: 'problem',
      id: problem.PID || problem.problemId,
      title: problem.ProblemTitle || problem.title,
      severity: problem.State === 'OPEN' ? 'CRITICAL' : 'RESOLVED',
      status: problem.State || 'UNKNOWN',
      startTime: problem.ProblemDetailsText?.includes('Started:') ? 
        this.extractStartTime(problem.ProblemDetailsText) : new Date().toISOString(),
      endTime: problem.State === 'RESOLVED' ? new Date().toISOString() : null,
      affectedEntities: problem.ImpactedEntities || [],
      description: problem.ProblemDetailsText || problem.description,
      url: problem.ProblemURL || null,
      tags: problem.Tags || [],
      timestamp: new Date().toISOString(),
      source: 'dynatrace_webhook'
    };
  }

  processMetricEvent(metric) {
    return {
      type: 'metric',
      id: `metric_${Date.now()}`,
      title: `Metric Alert: ${metric.metricName || 'Unknown Metric'}`,
      severity: metric.violationState === 'VIOLATED' ? 'WARNING' : 'INFO',
      status: metric.violationState || 'UNKNOWN',
      metricName: metric.metricName,
      value: metric.value,
      threshold: metric.threshold,
      entity: metric.entity,
      timestamp: new Date().toISOString(),
      source: 'dynatrace_webhook'
    };
  }

  processDeploymentEvent(deployment) {
    return {
      type: 'deployment',
      id: `deployment_${Date.now()}`,
      title: `Deployment: ${deployment.deploymentName || 'Unknown Deployment'}`,
      severity: 'INFO',
      status: deployment.deploymentStatus || 'UNKNOWN',
      deploymentName: deployment.deploymentName,
      version: deployment.deploymentVersion,
      entity: deployment.entity,
      timestamp: new Date().toISOString(),
      source: 'dynatrace_webhook'
    };
  }

  processGenericEvent(payload) {
    return {
      type: 'generic',
      id: `event_${Date.now()}`,
      title: 'Dynatrace Event',
      severity: 'INFO',
      status: 'RECEIVED',
      data: payload,
      timestamp: new Date().toISOString(),
      source: 'dynatrace_webhook'
    };
  }

  storeEvent(event) {
    const eventId = event.id;
    this.webhookData.set(eventId, event);
    
    // Clean up old events if we exceed the limit
    if (this.webhookData.size > this.maxStoredEvents) {
      const oldestKey = this.webhookData.keys().next().value;
      this.webhookData.delete(oldestKey);
    }
  }

  getRecentEvents(limit = 20) {
    const events = Array.from(this.webhookData.values())
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, limit);
    
    return events;
  }

  getEventById(eventId) {
    return this.webhookData.get(eventId);
  }

  getEventsByType(type, limit = 10) {
    const events = Array.from(this.webhookData.values())
      .filter(event => event.type === type)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, limit);
    
    return events;
  }

  extractStartTime(problemText) {
    const startTimeMatch = problemText.match(/Started:\s*([^,\n]+)/);
    if (startTimeMatch) {
      return new Date(startTimeMatch[1]).toISOString();
    }
    return new Date().toISOString();
  }

  // Generate webhook configuration for Dynatrace
  generateWebhookConfig(baseUrl) {
    return {
      name: "SRE GPT Integration",
      url: `${baseUrl}/api/webhooks/dynatrace`,
      headers: {
        "Content-Type": "application/json",
        "X-SRE-GPT-Token": process.env.WEBHOOK_SECRET || "sre-gpt-webhook"
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
  }
}

module.exports = DynatraceWebhookHandler;