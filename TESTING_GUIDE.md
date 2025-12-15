# SRE GPT Testing Guide

## 🧪 How to Test Your SRE GPT Application

This guide provides multiple ways to test your SRE GPT application, from basic functionality to full integration testing.

## 🚀 Quick Test Options

### Option 1: Basic Installation Test (No Node.js Required)

**Windows:**
```cmd
check-installation.bat
```

This will verify:
- ✅ Node.js installation
- ✅ Required files present
- ✅ Basic configuration

### Option 2: Full Application Test

**Prerequisites:**
- Node.js 18+ installed
- Basic Dynatrace credentials (optional for initial testing)

**Steps:**
```bash
# 1. Install dependencies
npm install

# 2. Create basic .env (for testing without Dynatrace)
cp .env.example .env

# 3. Start in test mode
npm run dev
```

## 🔧 Testing Scenarios

### 1. Application Startup Test

**Test:** Verify the application starts correctly

```bash
# Start the application
npm run dev

# Expected output:
# - Server starts on port 3000
# - No critical errors in console
# - Winston logger initializes
```

**Success Indicators:**
- ✅ Console shows: "SRE GPT server running on port 3000"
- ✅ No error messages during startup
- ✅ Logs directory created automatically

### 2. Dashboard Access Test

**Test:** Verify the web interface loads

1. **Start application:** `npm run dev`
2. **Open browser:** http://localhost:3000
3. **Expected results:**
   - ✅ Dashboard loads with SRE GPT interface
   - ✅ Connection status shows "Connected"
   - ✅ Chat interface is functional
   - ✅ Component status cards are visible

### 3. API Endpoints Test

**Test:** Verify core API functionality

```bash
# Health check
curl http://localhost:3000/health

# Expected: {"status":"healthy","timestamp":"..."}

# Setup status
curl http://localhost:3000/api/setup/status

# Expected: Configuration validation results

# Dashboard overview (will show errors without Dynatrace)
curl http://localhost:3000/api/dashboard/overview

# Expected: Health report or error message
```

### 4. Chat Interface Test

**Test:** Verify AI chat functionality

1. **Open dashboard:** http://localhost:3000
2. **Send test messages:**
   - "Hello"
   - "Show system health"
   - "What problems are active?"
3. **Expected results:**
   - ✅ Messages appear in chat
   - ✅ Bot responds with helpful information
   - ✅ Quick action buttons work

### 5. Webhook Endpoint Test

**Test:** Verify webhook integration works

```bash
# Test webhook endpoint
curl -X POST http://localhost:3000/api/webhooks/dynatrace \
  -H "Content-Type: application/json" \
  -H "X-SRE-GPT-Token: sre-gpt-webhook-secret-change-me" \
  -d '{"test": "webhook", "ProblemNotification": {"PID": "TEST-123", "ProblemTitle": "Test Problem", "State": "OPEN"}}'

# Expected: {"success":true,"eventId":"...","message":"Webhook processed successfully"}
```

## 🔗 Dynatrace Integration Testing

### Prerequisites for Full Testing

1. **Dynatrace Environment Access**
2. **API Token with Permissions:**
   - Read entities
   - Read metrics
   - Read problems
   - Read synthetic monitors

### Setup for Dynatrace Testing

1. **Configure .env file:**
   ```env
   DYNATRACE_URL=https://your-environment.live.dynatrace.com
   DYNATRACE_API_TOKEN=your-actual-api-token
   ```

2. **Test Dynatrace connection:**
   ```bash
   curl -X POST http://localhost:3000/api/setup/test-connection
   ```

3. **Expected success response:**
   ```json
   {
     "status": "connected",
     "version": "1.x.x",
     "timestamp": "..."
   }
   ```

### Full Integration Test

**With valid Dynatrace credentials:**

1. **Start application:** `npm run dev`
2. **Test endpoints:**
   ```bash
   # Get entities
   curl http://localhost:3000/api/dynatrace/entities
   
   # Get problems
   curl http://localhost:3000/api/dynatrace/problems
   
   # Get dashboard overview
   curl http://localhost:3000/api/dashboard/overview
   ```

3. **Expected results:**
   - ✅ Real data from your Dynatrace environment
   - ✅ Dashboard shows actual system health
   - ✅ Chat provides real insights

## 🐳 Docker Testing

### Test with Docker Compose

```bash
# 1. Configure .env file first
cp .env.example .env
# Edit .env with your settings

# 2. Build and start
docker-compose up --build

# 3. Test access
curl http://localhost:3000/health

# 4. View logs
docker-compose logs -f sre-gpt
```

### Test Individual Docker Build

```bash
# Build image
docker build -t sre-gpt-test .

# Run container
docker run -d \
  --name sre-gpt-test \
  -p 3000:3000 \
  --env-file .env \
  sre-gpt-test

# Test
curl http://localhost:3000/health

# View logs
docker logs sre-gpt-test

# Cleanup
docker stop sre-gpt-test
docker rm sre-gpt-test
```

## 🔍 Troubleshooting Tests

### Common Test Scenarios

#### Test 1: Port Already in Use
```bash
# Find what's using port 3000
netstat -tulpn | grep 3000  # Linux
netstat -ano | findstr 3000  # Windows

# Change port in .env
echo "PORT=3001" >> .env
```

#### Test 2: Missing Dependencies
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

#### Test 3: Environment Issues
```bash
# Verify environment
node -e "require('dotenv').config(); console.log(process.env.DYNATRACE_URL)"
```

#### Test 4: Memory Issues
```bash
# Start with more memory
node --max-old-space-size=4096 src/app.js
```

## 📊 Performance Testing

### Load Testing (Optional)

```bash
# Install artillery (load testing tool)
npm install -g artillery

# Create test config
cat > load-test.yml << EOF
config:
  target: 'http://localhost:3000'
  phases:
    - duration: 60
      arrivalRate: 10
scenarios:
  - name: "Health check"
    requests:
      - get:
          url: "/health"
EOF

# Run load test
artillery run load-test.yml
```

### Memory Usage Test

```bash
# Monitor memory usage
node --inspect src/app.js

# Open Chrome DevTools
# Go to chrome://inspect
# Click "inspect" under your Node.js process
```

## 🧪 Automated Testing

### Create Test Script

```bash
# Create test runner
cat > run-tests.js << 'EOF'
const axios = require('axios');

async function runTests() {
  const baseUrl = 'http://localhost:3000';
  
  console.log('🧪 Running SRE GPT Tests...\n');
  
  try {
    // Test 1: Health check
    console.log('1. Testing health endpoint...');
    const health = await axios.get(`${baseUrl}/health`);
    console.log('✅ Health check passed:', health.data.status);
    
    // Test 2: Setup status
    console.log('2. Testing setup status...');
    const setup = await axios.get(`${baseUrl}/api/setup/status`);
    console.log('✅ Setup status retrieved');
    
    // Test 3: Dashboard overview
    console.log('3. Testing dashboard overview...');
    try {
      const dashboard = await axios.get(`${baseUrl}/api/dashboard/overview`);
      console.log('✅ Dashboard data retrieved');
    } catch (error) {
      console.log('⚠️  Dashboard test failed (expected without Dynatrace)');
    }
    
    // Test 4: Webhook endpoint
    console.log('4. Testing webhook endpoint...');
    const webhook = await axios.post(`${baseUrl}/api/webhooks/dynatrace`, 
      { test: 'data' },
      { headers: { 'X-SRE-GPT-Token': 'sre-gpt-webhook-secret-change-me' } }
    );
    console.log('✅ Webhook test passed');
    
    console.log('\n🎉 All tests completed successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  }
}

runTests();
EOF

# Run tests (after starting the app)
node run-tests.js
```

## 📋 Test Checklist

### Basic Functionality ✅
- [ ] Application starts without errors
- [ ] Health endpoint responds
- [ ] Dashboard loads in browser
- [ ] Chat interface is functional
- [ ] API endpoints respond correctly

### Integration Testing ✅
- [ ] Dynatrace connection works (with credentials)
- [ ] Webhook endpoint accepts requests
- [ ] Real-time updates work
- [ ] Error handling works properly

### Production Readiness ✅
- [ ] Docker build succeeds
- [ ] Environment variables work
- [ ] Logging functions correctly
- [ ] Security headers present
- [ ] Performance acceptable

## 🎯 Quick Test Commands

```bash
# Complete test sequence
npm install                                    # Install dependencies
cp .env.example .env                          # Create config
npm run dev &                                 # Start app in background
sleep 5                                       # Wait for startup
curl http://localhost:3000/health             # Test health
curl http://localhost:3000/api/setup/status   # Test setup
pkill -f "node src/app.js"                   # Stop app

# Docker test sequence
docker-compose up -d                          # Start with Docker
curl http://localhost:3000/health             # Test
docker-compose logs sre-gpt                   # Check logs
docker-compose down                           # Stop
```

## 🆘 Getting Help

If tests fail:

1. **Check logs:** Look in `logs/error.log` and console output
2. **Verify setup:** Run `node verify-deployment.js`
3. **Test step by step:** Follow individual test scenarios above
4. **Check documentation:** Review README.md and DEPLOYMENT.md

**Your SRE GPT application is ready for testing!** 🚀