# 🚀 SRE GPT Deployment Checklist

## Phase 1: Local Testing ✅

### Prerequisites
- [ ] Node.js 18+ installed
- [ ] Git installed (optional)
- [ ] Text editor available

### Testing Steps
```bash
# 1. Verify application structure
node quick-test.js

# 2. Install dependencies  
npm install

# 3. Create configuration
cp .env.example .env
# Edit .env with your settings

# 4. Start application
npm run dev

# 5. Test in browser
# Open: http://localhost:3000
```

### Verification Points
- [ ] ✅ Application starts without errors
- [ ] ✅ Dashboard loads in browser
- [ ] ✅ Chat interface responds
- [ ] ✅ API endpoints work: `curl http://localhost:3000/health`
- [ ] ✅ No critical errors in logs

---

## Phase 2: Package Creation ✅

### Create Deployment Package
```bash
# Create clean deployment folder
mkdir ../sre-gpt-deploy
cp -r . ../sre-gpt-deploy/
cd ../sre-gpt-deploy

# Remove development files
rm -rf node_modules
rm -rf .git
rm -rf logs/*

# Create archive
tar -czf sre-gpt-deployment.tar.gz .
# OR for Windows: zip -r sre-gpt-deployment.zip .
```

### Package Contents Verification
- [ ] ✅ src/ folder with all source code
- [ ] ✅ package.json and package-lock.json
- [ ] ✅ .env.example file
- [ ] ✅ docker-compose.yml and Dockerfile
- [ ] ✅ start.sh and start.bat scripts
- [ ] ✅ README.md and documentation files

---

## Phase 3: Target Machine Setup ✅

### Machine Requirements
- [ ] Operating System: Linux/Windows/macOS
- [ ] RAM: Minimum 512MB, Recommended 1GB+
- [ ] Disk Space: Minimum 500MB
- [ ] Network: Internet access for npm packages

### Install Prerequisites

**Ubuntu/Debian:**
```bash
# Update system
sudo apt update

# Install Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version  # Should show v18.x.x or higher
npm --version
```

**CentOS/RHEL:**
```bash
# Install Node.js
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs
```

**Windows:**
- Download and install Node.js from https://nodejs.org/
- Choose "LTS" version (18.x or higher)
- Verify in Command Prompt: `node --version`

### Prerequisites Checklist
- [ ] ✅ Node.js 18+ installed
- [ ] ✅ npm available
- [ ] ✅ Port 3000 available (or alternative configured)
- [ ] ✅ Firewall allows inbound connections (if needed)

---

## Phase 4: Application Deployment ✅

### Transfer Files to Target Machine

**Method 1: Direct Copy (Local Network)**
```bash
scp sre-gpt-deployment.tar.gz user@target-machine:/home/user/
```

**Method 2: Cloud Storage**
- Upload to Google Drive/Dropbox/OneDrive
- Download on target machine

**Method 3: Git Repository**
```bash
git clone https://github.com/your-repo/sre-gpt.git
```

### Extract and Setup
```bash
# Extract files
tar -xzf sre-gpt-deployment.tar.gz
cd sre-gpt-deployment

# Make scripts executable (Linux/Mac)
chmod +x start.sh

# Install dependencies
npm install

# Configure environment
cp .env.example .env
nano .env  # Edit with your Dynatrace credentials
```

### Configuration Required in .env
```env
# REQUIRED: Basic settings
PORT=3000
NODE_ENV=production
WEBHOOK_SECRET=your-secure-secret-here

# REQUIRED: Dynatrace integration
DYNATRACE_URL=https://your-environment.live.dynatrace.com
DYNATRACE_API_TOKEN=your-api-token-here

# OPTIONAL: Enhanced features
OPENAI_API_KEY=your-openai-key-here
```

### Deployment Checklist
- [ ] ✅ Files extracted successfully
- [ ] ✅ Dependencies installed (`npm install` completed)
- [ ] ✅ .env file configured with real credentials
- [ ] ✅ Logs directory exists and is writable

---

## Phase 5: Application Startup ✅

### Development Mode (Testing)
```bash
# Start in development mode
npm run dev

# Expected output:
# [timestamp] info: SRE GPT server running on port 3000
```

### Production Mode
```bash
# Start in production mode
npm start

# Or with PM2 (recommended for production)
npm install -g pm2
pm2 start src/app.js --name sre-gpt
pm2 startup  # Setup auto-start
pm2 save     # Save configuration
```

### Docker Mode (Alternative)
```bash
# Start with Docker Compose
docker-compose up -d

# Check status
docker-compose ps
docker-compose logs sre-gpt
```

### Startup Verification
- [ ] ✅ Application starts without errors
- [ ] ✅ Port 3000 is listening: `netstat -tulpn | grep 3000`
- [ ] ✅ Process is running: `ps aux | grep node`
- [ ] ✅ Logs are being written: `ls -la logs/`

---

## Phase 6: Functionality Testing ✅

### Basic API Tests
```bash
# Health check
curl http://localhost:3000/health
# Expected: {"status":"healthy","timestamp":"..."}

# Setup status
curl http://localhost:3000/api/setup/status
# Expected: Configuration validation results

# Dashboard overview
curl http://localhost:3000/api/dashboard/overview
# Expected: Health report data or error message
```

### Web Interface Test
1. **Open browser:** http://server-ip:3000
2. **Verify elements:**
   - [ ] ✅ SRE GPT dashboard loads
   - [ ] ✅ Connection status shows "Connected"
   - [ ] ✅ System health cards display
   - [ ] ✅ Chat interface is functional

### Chat Interface Test
1. **Type message:** "Hello"
2. **Send message:** Click Send or press Enter
3. **Verify response:** Bot should respond with greeting and help options

### Webhook Test
```bash
curl -X POST http://localhost:3000/api/webhooks/dynatrace \
  -H "Content-Type: application/json" \
  -H "X-SRE-GPT-Token: your-webhook-secret" \
  -d '{"test": "webhook", "ProblemNotification": {"PID": "TEST-123", "ProblemTitle": "Test Problem", "State": "OPEN"}}'

# Expected: {"success":true,"eventId":"...","message":"Webhook processed successfully"}
```

### Testing Checklist
- [ ] ✅ Health endpoint responds correctly
- [ ] ✅ Web dashboard accessible
- [ ] ✅ Chat interface works
- [ ] ✅ Webhook endpoint accepts requests
- [ ] ✅ No errors in application logs

---

## Phase 7: Production Configuration ✅

### Security Setup
```bash
# Setup firewall (Ubuntu)
sudo ufw enable
sudo ufw allow ssh
sudo ufw allow 3000  # Or your configured port

# Setup firewall (CentOS)
sudo firewall-cmd --permanent --add-service=ssh
sudo firewall-cmd --permanent --add-port=3000/tcp
sudo firewall-cmd --reload
```

### Reverse Proxy (Optional but Recommended)
```bash
# Install Nginx
sudo apt-get install nginx  # Ubuntu
sudo yum install nginx      # CentOS

# Create configuration
sudo nano /etc/nginx/sites-available/sre-gpt

# Add this configuration:
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

# Enable site
sudo ln -s /etc/nginx/sites-available/sre-gpt /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### SSL Certificate (Production)
```bash
# Install Certbot
sudo apt-get install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d your-domain.com

# Verify auto-renewal
sudo certbot renew --dry-run
```

### Production Checklist
- [ ] ✅ Firewall configured
- [ ] ✅ Process manager setup (PM2)
- [ ] ✅ Reverse proxy configured (optional)
- [ ] ✅ SSL certificate installed (optional)
- [ ] ✅ Auto-start on boot configured

---

## Phase 8: Dynatrace Integration ✅

### Dynatrace API Token Setup
1. **Login to Dynatrace**
2. **Navigate:** Settings > Integration > Dynatrace API
3. **Generate Token** with permissions:
   - [ ] Read entities
   - [ ] Read metrics
   - [ ] Read problems
   - [ ] Read synthetic monitors
   - [ ] Read network zones
   - [ ] Read configuration

### Test Dynatrace Connection
```bash
# Test connection
curl -X POST http://localhost:3000/api/setup/test-connection

# Expected success response:
# {"status":"connected","version":"1.x.x","timestamp":"..."}
```

### Webhook Configuration in Dynatrace
1. **Navigate:** Settings > Integration > Problem notifications
2. **Click:** "Set up notifications"
3. **Choose:** "Custom integration"
4. **Configure:**
   - **URL:** `https://your-domain.com/api/webhooks/dynatrace`
   - **Method:** POST
   - **Headers:**
     - `Content-Type: application/json`
     - `X-SRE-GPT-Token: your-webhook-secret`

### Get Webhook Configuration
```bash
# Get webhook configuration template
curl http://localhost:3000/api/setup/webhook-config
```

### Dynatrace Integration Checklist
- [ ] ✅ API token created with correct permissions
- [ ] ✅ Connection test successful
- [ ] ✅ Webhook configured in Dynatrace
- [ ] ✅ Real data appears in dashboard

---

## Phase 9: Final Verification ✅

### Complete System Test
```bash
# 1. Application health
curl http://localhost:3000/health

# 2. Setup validation
curl http://localhost:3000/api/setup/validate

# 3. Dashboard data
curl http://localhost:3000/api/dashboard/overview

# 4. Recent events
curl http://localhost:3000/api/webhooks/events
```

### Performance Check
```bash
# Check memory usage
ps aux | grep node

# Check disk usage
df -h

# Check network connections
netstat -tulpn | grep 3000

# Check logs for errors
tail -f logs/error.log
```

### User Acceptance Test
1. **Open dashboard:** http://your-domain.com
2. **Test chat:** Ask "Show system health"
3. **Verify data:** Check if real Dynatrace data appears
4. **Test alerts:** Trigger a test problem in Dynatrace
5. **Verify webhook:** Check if alert appears in dashboard

### Final Checklist
- [ ] ✅ Application accessible from external network
- [ ] ✅ All API endpoints working
- [ ] ✅ Real Dynatrace data flowing
- [ ] ✅ Webhooks receiving events
- [ ] ✅ Performance acceptable
- [ ] ✅ Logs clean (no critical errors)
- [ ] ✅ Security configured
- [ ] ✅ Monitoring setup

---

## 🎉 Deployment Complete!

### Success Indicators
- ✅ Application running stable
- ✅ Dashboard accessible and functional
- ✅ Dynatrace integration working
- ✅ Webhooks receiving real-time events
- ✅ Chat providing intelligent responses
- ✅ Production security configured

### Next Steps
1. **Monitor logs:** `tail -f logs/combined.log`
2. **Setup monitoring:** Consider adding uptime monitoring
3. **Backup strategy:** Regular backups of configuration
4. **Team training:** Train users on the dashboard
5. **Documentation:** Update any custom configurations

### Support Resources
- **Application logs:** `logs/error.log` and `logs/combined.log`
- **Configuration validation:** `curl http://localhost:3000/api/setup/validate`
- **Health monitoring:** `curl http://localhost:3000/health`
- **Documentation:** README.md and DEPLOYMENT.md

**Your SRE GPT application is now successfully deployed and ready for production use!** 🚀