const logger = require('../utils/logger');

class SetupGuide {
  constructor(dynatraceService) {
    this.dynatraceService = dynatraceService;
  }

  async validateConfiguration() {
    const results = {
      dynatrace: await this.validateDynatraceConnection(),
      environment: this.validateEnvironmentVariables(),
      webhook: this.validateWebhookConfiguration()
    };

    return {
      isValid: Object.values(results).every(r => r.status === 'success'),
      results
    };
  }

  async validateDynatraceConnection() {
    try {
      const health = await this.dynatraceService.healthCheck();
      
      if (health.status === 'connected') {
        return {
          status: 'success',
          message: `Connected to Dynatrace (${health.version})`,
          details: health
        };
      } else {
        return {
          status: 'error',
          message: 'Failed to connect to Dynatrace',
          details: health,
          solution: 'Check DYNATRACE_URL and DYNATRACE_API_TOKEN in your .env file'
        };
      }
    } catch (error) {
      return {
        status: 'error',
        message: 'Dynatrace connection error',
        details: error.message,
        solution: 'Verify your Dynatrace credentials and network connectivity'
      };
    }
  }

  validateEnvironmentVariables() {
    const required = ['DYNATRACE_URL', 'DYNATRACE_API_TOKEN'];
    const optional = ['OPENAI_API_KEY', 'WEBHOOK_SECRET', 'PORT', 'NODE_ENV'];
    
    const missing = required.filter(key => !process.env[key]);
    const present = required.filter(key => process.env[key]);
    const optionalPresent = optional.filter(key => process.env[key]);

    if (missing.length > 0) {
      return {
        status: 'error',
        message: `Missing required environment variables: ${missing.join(', ')}`,
        solution: 'Copy .env.example to .env and fill in the required values'
      };
    }

    return {
      status: 'success',
      message: 'All required environment variables are set',
      details: {
        required: present,
        optional: optionalPresent
      }
    };
  }

  validateWebhookConfiguration() {
    const webhookSecret = process.env.WEBHOOK_SECRET;
    
    if (!webhookSecret) {
      return {
        status: 'warning',
        message: 'WEBHOOK_SECRET not set, using default value',
        solution: 'Set WEBHOOK_SECRET in .env for better security'
      };
    }

    return {
      status: 'success',
      message: 'Webhook configuration is valid'
    };
  }

  generateSetupInstructions(baseUrl) {
    return {
      title: 'SRE GPT Setup Instructions',
      steps: [
        {
          step: 1,
          title: 'Environment Configuration',
          description: 'Set up your environment variables',
          commands: [
            'cp .env.example .env',
            'nano .env  # Edit the file with your Dynatrace credentials'
          ],
          variables: {
            DYNATRACE_URL: 'Your Dynatrace environment URL (e.g., https://abc12345.live.dynatrace.com)',
            DYNATRACE_API_TOKEN: 'API token with required permissions',
            WEBHOOK_SECRET: 'Secret for webhook authentication (optional)',
            OPENAI_API_KEY: 'OpenAI API key for enhanced chat (optional)'
          }
        },
        {
          step: 2,
          title: 'Dynatrace API Token Setup',
          description: 'Create an API token in Dynatrace with the following permissions:',
          permissions: [
            'Read entities',
            'Read metrics',
            'Read problems',
            'Read synthetic monitors',
            'Read network zones',
            'Read configuration'
          ],
          instructions: [
            '1. Go to Settings > Integration > Dynatrace API',
            '2. Click "Generate token"',
            '3. Add the required permissions listed above',
            '4. Copy the token to your .env file'
          ]
        },
        {
          step: 3,
          title: 'Webhook Configuration',
          description: 'Set up Dynatrace webhook integration',
          webhookUrl: `${baseUrl}/api/webhooks/dynatrace`,
          instructions: [
            '1. Go to Settings > Integration > Problem notifications',
            '2. Click "Set up notifications"',
            '3. Choose "Custom integration"',
            '4. Use the webhook URL and configuration provided below'
          ],
          webhookConfig: {
            url: `${baseUrl}/api/webhooks/dynatrace`,
            headers: {
              'Content-Type': 'application/json',
              'X-SRE-GPT-Token': process.env.WEBHOOK_SECRET || 'sre-gpt-webhook'
            }
          }
        },
        {
          step: 4,
          title: 'Start the Application',
          description: 'Run SRE GPT using one of these methods:',
          methods: {
            development: {
              command: 'npm run dev',
              description: 'Start in development mode with auto-reload'
            },
            production: {
              command: 'npm start',
              description: 'Start in production mode'
            },
            docker: {
              command: 'docker-compose up -d',
              description: 'Start using Docker Compose'
            }
          }
        },
        {
          step: 5,
          title: 'Access the Dashboard',
          description: 'Open your browser and navigate to the dashboard',
          url: baseUrl,
          features: [
            'Real-time system health monitoring',
            'AI-powered chat interface',
            'Live webhook event notifications',
            'Interactive problem analysis'
          ]
        }
      ],
      troubleshooting: {
        'Connection Issues': [
          'Verify DYNATRACE_URL is correct and accessible',
          'Check API token permissions',
          'Ensure network connectivity to Dynatrace'
        ],
        'Webhook Not Working': [
          'Verify webhook URL is accessible from Dynatrace',
          'Check WEBHOOK_SECRET matches in both places',
          'Review webhook logs in the application'
        ],
        'Chat Not Responding': [
          'Check if OPENAI_API_KEY is set (optional)',
          'Verify WebSocket connection in browser console',
          'Review application logs for errors'
        ]
      }
    };
  }

  async generateHealthReport() {
    const validation = await this.validateConfiguration();
    const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
    
    return {
      timestamp: new Date().toISOString(),
      configuration: validation,
      setupInstructions: this.generateSetupInstructions(baseUrl),
      nextSteps: this.getNextSteps(validation)
    };
  }

  getNextSteps(validation) {
    const steps = [];
    
    if (!validation.results.dynatrace || validation.results.dynatrace.status !== 'success') {
      steps.push('Configure Dynatrace connection');
    }
    
    if (!validation.results.environment || validation.results.environment.status !== 'success') {
      steps.push('Set up environment variables');
    }
    
    if (validation.results.webhook && validation.results.webhook.status === 'warning') {
      steps.push('Set up webhook security');
    }
    
    if (steps.length === 0) {
      steps.push('Configuration complete! Set up Dynatrace webhooks to receive real-time events.');
    }
    
    return steps;
  }
}

module.exports = SetupGuide;