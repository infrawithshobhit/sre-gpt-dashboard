# SRE GPT Deployment Guide

This guide provides step-by-step instructions for deploying SRE GPT in various environments.

## 🚀 Quick Start (Any Platform)

### Option 1: Automated Setup

**Windows:**
```cmd
# Double-click start.bat or run in Command Prompt
start.bat
```

**Linux/Mac:**
```bash
# Make executable and run
chmod +x start.sh
./start.sh
```

**Cross-platform (Node.js):**
```bash
node deploy.js
npm run dev
```

### Option 2: Manual Setup

1. **Install Node.js 18+** from https://nodejs.org/
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Configure environment:**
   ```bash
   cp .env.example .env
   # Edit .env with your Dynatrace credentials
   ```
4. **Start application:**
   ```bash
   npm run dev  # Development
   npm start    # Production
   ```

## 🔧 Configuration

### Required Environment Variables

Edit `.env` file with your settings:

```env
# Dynatrace Configuration (REQUIRED)
DYNATRACE_URL=https://your-environment.live.dynatrace.com
DYNATRACE_API_TOKEN=your-api-token-here

# Server Configuration
PORT=3000
NODE_ENV=development

# Webhook Security
WEBHOOK_SECRET=your-secure-webhook-secret

# Optional: Enhanced Chat
OPENAI_API_KEY=your-openai-key-here
```

### Dynatrace API Token Setup

1. **Login to Dynatrace**
2. **Go to:** Settings > Integration > Dynatrace API
3. **Generate token** with permissions:
   - Read entities
   - Read metrics
   - Read problems
   - Read synthetic monitors
   - Read network zones
   - Read configuration
4. **Copy token** to `.env` file

## 🐳 Docker Deployment

### Using Docker Compose (Recommended)

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f sre-gpt

# Stop services
docker-compose down
```

### Manual Docker

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

## ☁️ Cloud Deployment

### AWS (ECS/Fargate)

1. **Build and push image:**
   ```bash
   # Build for AWS
   docker build -t sre-gpt .
   
   # Tag for ECR
   docker tag sre-gpt:latest 123456789012.dkr.ecr.us-east-1.amazonaws.com/sre-gpt:latest
   
   # Push to ECR
   docker push 123456789012.dkr.ecr.us-east-1.amazonaws.com/sre-gpt:latest
   ```

2. **Create ECS task definition:**
   ```json
   {
     "family": "sre-gpt",
     "networkMode": "awsvpc",
     "requiresCompatibilities": ["FARGATE"],
     "cpu": "256",
     "memory": "512",
     "containerDefinitions": [
       {
         "name": "sre-gpt",
         "image": "123456789012.dkr.ecr.us-east-1.amazonaws.com/sre-gpt:latest",
         "portMappings": [
           {
             "containerPort": 3000,
             "protocol": "tcp"
           }
         ],
         "environment": [
           {
             "name": "NODE_ENV",
             "value": "production"
           },
           {
             "name": "PORT",
             "value": "3000"
           }
         ],
         "secrets": [
           {
             "name": "DYNATRACE_URL",
             "valueFrom": "arn:aws:secretsmanager:us-east-1:123456789012:secret:sre-gpt/dynatrace-url"
           },
           {
             "name": "DYNATRACE_API_TOKEN",
             "valueFrom": "arn:aws:secretsmanager:us-east-1:123456789012:secret:sre-gpt/api-token"
           }
         ]
       }
     ]
   }
   ```

### Google Cloud Run

```bash
# Deploy to Cloud Run
gcloud run deploy sre-gpt \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars NODE_ENV=production \
  --set-env-vars PORT=8080
```

### Azure Container Instances

```bash
# Create resource group
az group create --name sre-gpt-rg --location eastus

# Deploy container
az container create \
  --resource-group sre-gpt-rg \
  --name sre-gpt \
  --image sre-gpt:latest \
  --ports 3000 \
  --environment-variables NODE_ENV=production PORT=3000 \
  --secure-environment-variables \
    DYNATRACE_URL=https://your-env.live.dynatrace.com \
    DYNATRACE_API_TOKEN=your-token
```

### Heroku

```bash
# Login to Heroku
heroku login

# Create app
heroku create your-sre-gpt-app

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set DYNATRACE_URL=https://your-env.live.dynatrace.com
heroku config:set DYNATRACE_API_TOKEN=your-token
heroku config:set WEBHOOK_SECRET=your-secret

# Deploy
git push heroku main
```

## 🔒 Production Security

### Environment Variables

Store sensitive data in secure environment variable services:

- **AWS:** Systems Manager Parameter Store / Secrets Manager
- **Google Cloud:** Secret Manager
- **Azure:** Key Vault
- **Heroku:** Config Vars

### Reverse Proxy (Nginx)

```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;
    
    # SSL configuration
    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;
    
    # Security headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 🔗 Webhook Setup

### 1. Get Webhook Configuration

```bash
curl http://your-domain.com/api/setup/webhook-config
```

### 2. Configure in Dynatrace

1. **Go to:** Settings > Integration > Problem notifications
2. **Click:** "Set up notifications"
3. **Choose:** "Custom integration"
4. **Configure:**
   - **URL:** `https://your-domain.com/api/webhooks/dynatrace`
   - **Method:** POST
   - **Headers:** 
     - `Content-Type: application/json`
     - `X-SRE-GPT-Token: your-webhook-secret`

### 3. Test Webhook

```bash
curl -X POST https://your-domain.com/api/webhooks/dynatrace \
  -H "Content-Type: application/json" \
  -H "X-SRE-GPT-Token: your-webhook-secret" \
  -d '{"test": "webhook"}'
```

## 📊 Monitoring & Maintenance

### Health Checks

- **Application:** `GET /health`
- **Setup Status:** `GET /api/setup/status`
- **Dynatrace Connection:** `POST /api/setup/test-connection`

### Logs

**Development:**
```bash
npm run dev  # Console output
```

**Production:**
```bash
# PM2
pm2 logs sre-gpt

# Docker
docker logs sre-gpt

# Files
tail -f logs/combined.log
tail -f logs/error.log
```

### Process Management (PM2)

```bash
# Install PM2
npm install -g pm2

# Start application
pm2 start src/app.js --name sre-gpt

# Setup startup script
pm2 startup
pm2 save

# Monitor
pm2 status
pm2 logs sre-gpt
pm2 restart sre-gpt
```

## 🔧 Troubleshooting

### Common Issues

**Port already in use:**
```bash
# Find process using port 3000
netstat -tulpn | grep 3000  # Linux
netstat -ano | findstr 3000  # Windows

# Kill process
kill -9 <PID>  # Linux
taskkill /PID <PID> /F  # Windows
```

**Dynatrace connection failed:**
- Verify `DYNATRACE_URL` format
- Check API token permissions
- Test network connectivity

**Webhook not receiving events:**
- Verify webhook URL is publicly accessible
- Check `WEBHOOK_SECRET` matches
- Review Dynatrace notification settings

### Support

- Check application logs
- Verify configuration with `/api/setup/validate`
- Test individual components with API endpoints
- Review README.md for detailed documentation

## 📈 Scaling

### Horizontal Scaling

- Use load balancer (ALB, Cloud Load Balancer)
- Deploy multiple instances
- Share session data via Redis

### Vertical Scaling

- Increase CPU/memory allocation
- Optimize Node.js heap size: `--max-old-space-size=4096`

### Performance Optimization

- Enable gzip compression
- Use CDN for static assets
- Implement caching strategies
- Monitor with APM tools