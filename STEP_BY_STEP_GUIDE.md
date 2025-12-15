# SRE GPT - Complete Step-by-Step Testing & Deployment Guide

## 📋 Overview

This guide will walk you through:
1. **Testing locally** on your current machine
2. **Packaging** the application for deployment
3. **Deploying** to different machines/environments
4. **Verifying** everything works correctly

---

## 🧪 PART 1: Local Testing (Current Machine)

### Step 1: Quick Verification Test

First, let's verify your application is complete:

```bash
# Run the quick test (works without Node.js dependencies)
node quick-test.js
```

**Expected Output:**
```
🧪 SRE GPT Quick Test
✅ Node.js v18.x.x (compatible)
✅ package.json
✅ src/app.js
✅ All tests passed!
```

### Step 2: Install Dependencies

```bash
# Install all required packages
npm install
```

**Expected Output:**
- Downloads and installs ~50+ packages
- Creates `node_modules` folder
- No error messages

### Step 3: Configure Environment

```bash
# Create environment file
cp .env.example .env

# Edit the .env file with a text editor
notepad .env    # Windows
nano .env       # Linux/Mac
```

**Minimum configuration for testing:**
```env
# Basic configuration (works without Dynatrace)
PORT=3000
NODE_ENV=development
WEBHOOK_SECRET=test-secret-123

# Optional: Add real Dynatrace credentials for full testing
# DYNATRACE_URL=https://your-environment.live.dynatrace.com
# DYNATRACE_API_TOKEN=your-api-token-here
```

### Step 4: Start the Application

```bash
# Start in development mode
npm run dev
```

**Expected Output:**
```
[timestamp] info: SRE GPT server running on port 3000
```

### Step 5: Test the Web Interface

1. **Open browser:** http://localhost:3000
2. **Verify you see:**
   - ✅ SRE GPT dashboard loads
   - ✅ "Connected" status in top right
   - ✅ Chat interface on the right side
   - ✅ System health overview cards

### Step 6: Test Core Functionality

**Test the API endpoints:**
```bash
# Health check
curl http://localhost:3000/health

# Expected: {"status":"healthy","timestamp":"2024-..."}

# Setup status
curl http://localhost:3000/api/setup/status

# Expected: Configuration validation results

# Test webhook
curl -X POST http://localhost:3000/api/webhooks/dynatrace \
  -H "Content-Type: application/json" \
  -H "X-SRE-GPT-Token: test-secret-123" \
  -d '{"test": "webhook"}'

# Expected: {"success":true,"eventId":"..."}
```

**Test the chat interface:**
1. In the web dashboard, type: "Hello"
2. Click Send or press Enter
3. You should see a bot response

### Step 7: Stop the Application

```bash
# Press Ctrl+C in the terminal where the app is running
```

---

## 📦 PART 2: Packaging for Deployment

### Step 1: Create Deployment Package

Create a deployment-ready package:

```bash
# Create deployment directory
mkdir sre-gpt-deployment
cd sre-gpt-deployment

# Copy all necessary files
cp -r ../src .
cp ../package.json .
cp ../package-lock.json .
cp ../.env.example .
cp ../docker-compose.yml .
cp ../Dockerfile .
cp ../README.md .
cp ../DEPLOYMENT.md .
cp ../start.bat .
cp ../start.sh .
cp ../deploy.js .
cp ../quick-test.js .

# Create logs and config directories
mkdir logs config

# Create deployment info
echo "SRE GPT Deployment Package" > DEPLOYMENT_INFO.txt
echo "Created: $(date)" >> DEPLOYMENT_INFO.txt
echo "Version: $(grep version package.json)" >> DEPLOYMENT_INFO.txt
```

### Step 2: Create Deployment Archive

**Option A: ZIP Archive (Windows)**
```cmd
# Create ZIP file
powershell Compress-Archive -Path sre-gpt-deployment -DestinationPath sre-gpt-v1.0.zip
```

**Option B: TAR Archive (Linux/Mac)**
```bash
# Create TAR archive
tar -czf sre-gpt-v1.0.tar.gz sre-gpt-deployment/
```

### Step 3: Verify Package Contents

Your deployment package should contain:
```
sre-gpt-deployment/
├── src/                    # Complete source code
├── package.json           # Dependencies
├── package-lock.json      # Exact versions
├── .env.example          # Configuration template
├── docker-compose.yml    # Docker setup
├── Dockerfile           # Container build
├── README.md           # Documentation
├── start.bat          # Windows launcher
├── start.sh          # Linux/Mac launcher
├── deploy.js         # Automated setup
├── quick-test.js     # Testing script
├── logs/            # Log directory
└── config/         # Config directory
```

---

## 🚀 PART 3: Deployment to Different Machines

### Scenario A: Deploy to Another Windows Machine

**Step 1: Transfer Files**
```cmd
# Copy the ZIP file to target machine
# Extract: Right-click → Extract All
```

**Step 2: Install Prerequisites**
```cmd
# Install Node.js 18+ from https://nodejs.org/
# Verify installation
node --version
npm --version
```

**Step 3: Quick Setup**
```cmd
# Navigate to extracted folder
cd sre-gpt-deployment

# Run automated setup
start.bat
```

**Step 4: Manual Setup (Alternative)**
```cmd
# Install dependencies
npm install

# Configure environment
copy .env.example .env
notepad .env

# Start application
npm run dev
```

### Scenario B: Deploy to Linux Server

**Step 1: Transfer Files**
```bash
# Upload tar.gz file to server
scp sre-gpt-v1.0.tar.gz user@server:/home/user/

# SSH to server and extract
ssh user@server
cd /home/user
tar -xzf sre-gpt-v1.0.tar.gz
cd sre-gpt-deployment
```

**Step 2: Install Prerequisites**
```bash
# Install Node.js (Ubuntu/Debian)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install Node.js (CentOS/RHEL)
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs

# Verify installation
node --version
npm --version
```

**Step 3: Setup and Start**
```bash
# Make scripts executable
chmod +x start.sh deploy.js

# Run automated setup
./start.sh

# Or manual setup
npm install
cp .env.example .env
nano .env  # Edit configuration
npm run dev
```

### Scenario C: Deploy with Docker

**Step 1: Install Docker**
```bash
# Install Docker (Ubuntu)
sudo apt-get update
sudo apt-get install docker.io docker-compose

# Install Docker (CentOS)
sudo yum install docker docker-compose

# Start Docker service
sudo systemctl start docker
sudo systemctl enable docker
```

**Step 2: Deploy with Docker Compose**
```bash
# Navigate to deployment directory
cd sre-gpt-deployment

# Configure environment
cp .env.example .env
nano .env  # Add your Dynatrace credentials

# Start with Docker
sudo docker-compose up -d

# Check status
sudo docker-compose ps
sudo docker-compose logs sre-gpt
```

### Scenario D: Deploy to Cloud (AWS/GCP/Azure)

**AWS EC2 Example:**
```bash
# 1. Launch EC2 instance (Ubuntu 20.04+)
# 2. SSH to instance
ssh -i your-key.pem ubuntu@ec2-instance-ip

# 3. Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 4. Upload and extract deployment package
scp -i your-key.pem sre-gpt-v1.0.tar.gz ubuntu@ec2-instance-ip:~/
tar -xzf sre-gpt-v1.0.tar.gz
cd sre-gpt-deployment

# 5. Setup and start
npm install
cp .env.example .env
nano .env  # Configure
npm start  # Production mode

# 6. Setup reverse proxy (optional)
sudo apt-get install nginx
# Configure nginx to proxy to localhost:3000
```

---

## ✅ PART 4: Verification & Testing

### Step 1: Basic Functionality Test

On the target machine, run these tests:

```bash
# 1. Quick verification
node quick-test.js

# 2. Health check
curl http://localhost:3000/health

# 3. Web interface test
# Open browser to: http://server-ip:3000
```

### Step 2: Full Integration Test

```bash
# Test all API endpoints
curl http://localhost:3000/api/setup/status
curl http://localhost:3000/api/dashboard/overview
curl -X POST http://localhost:3000/api/webhooks/dynatrace \
  -H "Content-Type: application/json" \
  -H "X-SRE-GPT-Token: your-webhook-secret" \
  -d '{"test": "integration"}'
```

### Step 3: Performance Test

```bash
# Check memory usage
ps aux | grep node

# Check port binding
netstat -tulpn | grep 3000

# Check logs
tail -f logs/combined.log
```

### Step 4: Production Readiness

**For production deployment:**

1. **Use PM2 for process management:**
```bash
npm install -g pm2
pm2 start src/app.js --name sre-gpt
pm2 startup
pm2 save
```

2. **Setup reverse proxy (Nginx):**
```bash
sudo apt-get install nginx

# Create nginx config
sudo nano /etc/nginx/sites-available/sre-gpt

# Add configuration:
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

3. **Setup SSL (Let's Encrypt):**
```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

---

## 🔧 Troubleshooting Common Issues

### Issue 1: Port Already in Use
```bash
# Find process using port 3000
sudo netstat -tulpn | grep 3000
sudo kill -9 <PID>

# Or change port in .env
echo "PORT=3001" >> .env
```

### Issue 2: Permission Denied
```bash
# Fix file permissions
chmod +x start.sh deploy.js
sudo chown -R $USER:$USER sre-gpt-deployment/
```

### Issue 3: Node.js Version Issues
```bash
# Check version
node --version

# Install specific version with nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 18
nvm use 18
```

### Issue 4: Firewall Blocking Access
```bash
# Ubuntu/Debian
sudo ufw allow 3000

# CentOS/RHEL
sudo firewall-cmd --permanent --add-port=3000/tcp
sudo firewall-cmd --reload
```

---

## 📊 Success Checklist

### ✅ Local Testing Complete
- [ ] Application starts without errors
- [ ] Web dashboard loads at http://localhost:3000
- [ ] API endpoints respond correctly
- [ ] Chat interface works
- [ ] Webhook endpoint accepts requests

### ✅ Deployment Package Ready
- [ ] All files included in package
- [ ] Package extracts correctly
- [ ] Documentation included
- [ ] Scripts are executable

### ✅ Remote Deployment Working
- [ ] Application runs on target machine
- [ ] Accessible via network (http://server-ip:3000)
- [ ] Logs are being written
- [ ] Performance is acceptable
- [ ] Security configured (firewall, SSL)

### ✅ Production Ready
- [ ] Process manager configured (PM2)
- [ ] Reverse proxy setup (Nginx)
- [ ] SSL certificate installed
- [ ] Monitoring configured
- [ ] Backup strategy in place

---

## 🎯 Quick Commands Summary

```bash
# Local testing
node quick-test.js && npm install && npm run dev

# Create deployment package
tar -czf sre-gpt-v1.0.tar.gz sre-gpt-deployment/

# Deploy on new machine
tar -xzf sre-gpt-v1.0.tar.gz && cd sre-gpt-deployment && ./start.sh

# Docker deployment
docker-compose up -d

# Production with PM2
pm2 start src/app.js --name sre-gpt

# Test deployment
curl http://localhost:3000/health
```

**Your SRE GPT application is now ready for deployment anywhere!** 🚀