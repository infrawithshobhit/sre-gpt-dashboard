# SRE GPT - AI-Powered Application Monitoring

SRE GPT is an intelligent Site Reliability Engineering assistant that provides AI-powered application monitoring and analysis through Dynatrace integration. Get real-time insights, chat-based problem analysis, and proactive monitoring for your applications.


# SRE GPT Dashboard

An AI-powered incident intelligence system built on Dynatrace.

This project helps SRE teams:
• Understand incidents in plain English  
• Correlate failures across services  
• Decide what to fix first  
• Reduce MTTR  

---

## Why this exists

Monitoring tools tell you *what* broke.  
This system explains *why* it broke and *what to do next*.

---

## Architecture

Dynatrace → API → Node.js → GPT → SRE Dashboard

Telemetry is pulled live from Dynatrace, enriched with context, and passed to GPT to generate human-readable incident analysis.

---

## Who this is for

• SRE Teams  
• Platform Engineers  
• Incident Commanders  
• Reliability Leads  
• DevOps teams running production workloads



## 🚀 Features

- **Real-time Monitoring**: Continuous health analysis of services, infrastructure, databases, and Kubernetes clusters
- **AI Chat Interface**: Natural language queries for system status, problems, and recommendations  
- **Interactive Dashboard**: Web-based visualization with live updates via WebSocket connections
- **Webhook Integration**: Real-time Dynatrace event processing and notifications
- **Automated Analysis**: Scheduled health reports and detailed system analysis
- **Multi-Component Support**: Services, infrastructure, databases, Kubernetes, network, and synthetic monitoring

## 📋 Prerequisites

- Node.js 18+ 
- Dynatrace environment with API access
- Docker (optional, for containerized deployment)

## 🛠️ Quick Start

### 1. Clone and Install

```bash
git clone <repository-url>
cd sre-gpt
npm install
```

### 2. Environment Setup

```bash
# Copy environment template
cp .env.example .env
# Just Test

# Edit with your Dynatrace credentials
nano .env
```

Required environment variables:
```env
DYNATRACE_URL=https://your-environment.live.dynatrace.com
DYNATRACE_API_TOKEN=your-api-token-here
PORT=3000
NODE_ENV=development
WEBHOOK_SECRET=your-webhook-secret-here
```

Optional variables:
```env
OPENAI_API_KEY=your-openai-key-here  # For enhanced chat capabilities
LOG_LEVEL=info
```

### 3. Dynatrace API Token Setup

Create an API token in Dynatrace with these permissions:
- Read entities
- Read metrics  
- Read problems
- Read synthetic monitors
- Read network zones
- Read configuration

**Steps:**
1. Go to Settings > Integration > Dynatrace API
2. Click "Generate token"
3. Add the required permissions
4. Copy token to your `.env` file

### 4. Start the Application

**Development mode:**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

**Docker deployment:**
```bash
docker-compose up -d
```

### 5. Access Dashboard

Open your browser and navigate to:
- Local: http://localhost:3000
- Production: https://your-domain.com

## 🔗 Webhook Integration

### Setup Dynatrace Webhooks

1. **Get webhook configuration:**
   ```bash
   curl http://localhost:3000/api/setup/webhook-config
   ```

2. **Configure in Dynatrace:**
   - Go to Settings > Integration > Problem notifications
   - Click "Set up notifications"  
   - Choose "Custom integration"
   - Use the webhook URL: `https://your-domain.com/api/webhooks/dynatrace`
   - Add header: `X-SRE-GPT-Token: your-webhook-secret`

3. **Test webhook:**
   ```bash
   curl -X POST http://localhost:3000/api/webhooks/dynatrace \
     -H "Content-Type: application/json" \
     -H "X-SRE-GPT-Token: your-webhook-secret" \
     -d '{"test": "webhook"}'
   ```

## 🐳 Docker Deployment

### Using Docker Compose (Recommended)

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f sre-gpt

# Stop services
docker-compose down
```

### Manual Docker Build

```bash
# Build image
docker build -t sre-gpt .

# Run container
docker run -d \
  --name sre-gpt \
  -p 3000:3000 \
  --env-file .env \
  sre-gpt
```

## 🌐 Production Deployment

### Environment Setup

1. **Set production environment variables:**
   ```env
   NODE_ENV=production
   PORT=3000
   LOG_LEVEL=warn
   ```

2. **Use process manager (PM2):**
   ```bash
   npm install -g pm2
   pm2 start src/app.js --name sre-gpt
   pm2 startup
   pm2 save
   ```

3. **Nginx reverse proxy:**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

### Cloud Deployment Options

**AWS ECS/Fargate:**
- Use the provided Dockerfile
- Set environment variables in task definition
- Configure ALB for load balancing

**Google Cloud Run:**
```bash
gcloud run deploy sre-gpt \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

**Azure Container Instances:**
```bash
az container create \
  --resource-group myResourceGroup \
  --name sre-gpt \
  --image sre-gpt:latest \
  --ports 3000 \
  --environment-variables NODE_ENV=production
```

## 🔧 Configuration Validation

Check your setup status:
```bash
curl http://localhost:3000/api/setup/status
```

Validate configuration:
```bash
curl http://localhost:3000/api/setup/validate
```

Test Dynatrace connection:
```bash
curl -X POST http://localhost:3000/api/setup/test-connection
```

## 📊 API Endpoints

### Health & Status
- `GET /health` - Application health check
- `GET /api/setup/status` - Setup status and configuration guide
- `GET /api/setup/validate` - Validate current configuration

### Dashboard Data
- `GET /api/dashboard/overview` - System health overview
- `GET /api/dashboard/analysis` - Detailed analysis
- `GET /api/dashboard/metrics/realtime` - Real-time metrics

### Chat Interface
- `POST /api/chat/message` - Process chat message
- `GET /api/chat/history/:sessionId` - Get conversation history

### Webhooks
- `POST /api/webhooks/dynatrace` - Dynatrace webhook endpoint
- `GET /api/webhooks/events` - Recent webhook events
- `GET /api/webhooks/config` - Webhook configuration

### Dynatrace Integration
- `GET /api/dynatrace/health` - Dynatrace connection status
- `GET /api/dynatrace/entities` - Get entities
- `GET /api/dynatrace/problems` - Get active problems

## 🔍 Troubleshooting

### Common Issues

**Connection Issues:**
- Verify `DYNATRACE_URL` is correct and accessible
- Check API token permissions
- Ensure network connectivity to Dynatrace

**Webhook Not Working:**
- Verify webhook URL is accessible from Dynatrace
- Check `WEBHOOK_SECRET` matches in both places
- Review webhook logs in application

**Chat Not Responding:**
- Check if `OPENAI_API_KEY` is set (optional)
- Verify WebSocket connection in browser console
- Review application logs for errors

### Logs

View application logs:
```bash
# Development
npm run dev

# Production with PM2
pm2 logs sre-gpt

# Docker
docker-compose logs -f sre-gpt
```

Log files location:
- `logs/error.log` - Error logs
- `logs/combined.log` - All logs

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

- Create an issue for bug reports
- Check existing issues for solutions
- Review the troubleshooting section above

---

**Built with ❤️ for SRE teams everywhere**
 
