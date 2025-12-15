#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 SRE GPT Deployment Verification\n');

// File structure verification
const requiredFiles = [
  // Core application files
  { path: 'package.json', type: 'config', critical: true },
  { path: 'src/app.js', type: 'main', critical: true },
  
  // Frontend files
  { path: 'src/dashboard/index.html', type: 'frontend', critical: true },
  { path: 'src/dashboard/dashboard.js', type: 'frontend', critical: true },
  
  // Backend services
  { path: 'src/dynatrace/dynatraceService.js', type: 'service', critical: true },
  { path: 'src/chat/chatHandler.js', type: 'service', critical: true },
  { path: 'src/analyzers/healthAnalyzer.js', type: 'service', critical: true },
  { path: 'src/webhooks/dynatraceWebhook.js', type: 'service', critical: true },
  { path: 'src/setup/setupGuide.js', type: 'service', critical: true },
  
  // Routes
  { path: 'src/routes/dashboardRoutes.js', type: 'route', critical: true },
  { path: 'src/routes/dynatraceRoutes.js', type: 'route', critical: true },
  { path: 'src/routes/chatRoutes.js', type: 'route', critical: true },
  { path: 'src/routes/webhookRoutes.js', type: 'route', critical: true },
  { path: 'src/routes/setupRoutes.js', type: 'route', critical: true },
  
  // Utilities
  { path: 'src/utils/logger.js', type: 'utility', critical: true },
  
  // Configuration
  { path: '.env.example', type: 'config', critical: true },
  { path: 'docker-compose.yml', type: 'docker', critical: false },
  { path: 'Dockerfile', type: 'docker', critical: false },
  
  // Documentation
  { path: 'README.md', type: 'docs', critical: false },
  { path: 'DEPLOYMENT.md', type: 'docs', critical: false },
  
  // Deployment scripts
  { path: 'start.bat', type: 'script', critical: false },
  { path: 'start.sh', type: 'script', critical: false },
  { path: 'deploy.js', type: 'script', critical: false }
];

let criticalMissing = 0;
let totalMissing = 0;

console.log('📁 File Structure Check:');
console.log('═'.repeat(50));

const filesByType = {};
requiredFiles.forEach(file => {
  if (!filesByType[file.type]) filesByType[file.type] = [];
  filesByType[file.type].push(file);
});

Object.keys(filesByType).forEach(type => {
  console.log(`\n${type.toUpperCase()} FILES:`);
  filesByType[type].forEach(file => {
    const exists = fs.existsSync(file.path);
    const status = exists ? '✅' : (file.critical ? '❌' : '⚠️');
    const label = file.critical ? '(critical)' : '(optional)';
    
    console.log(`${status} ${file.path} ${label}`);
    
    if (!exists) {
      totalMissing++;
      if (file.critical) criticalMissing++;
    }
  });
});

// Package.json validation
console.log('\n📦 Package Configuration:');
console.log('═'.repeat(50));

try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  
  console.log(`✅ Name: ${packageJson.name}`);
  console.log(`✅ Version: ${packageJson.version}`);
  console.log(`✅ Main entry: ${packageJson.main}`);
  
  // Check required scripts
  const requiredScripts = ['start', 'dev'];
  const hasAllScripts = requiredScripts.every(script => packageJson.scripts && packageJson.scripts[script]);
  
  if (hasAllScripts) {
    console.log('✅ Required scripts present');
  } else {
    console.log('❌ Missing required scripts');
    criticalMissing++;
  }
  
  // Check dependencies
  const requiredDeps = ['express', 'socket.io', 'axios', 'winston', 'dotenv'];
  const missingDeps = requiredDeps.filter(dep => !packageJson.dependencies || !packageJson.dependencies[dep]);
  
  if (missingDeps.length === 0) {
    console.log('✅ All required dependencies present');
  } else {
    console.log(`❌ Missing dependencies: ${missingDeps.join(', ')}`);
    criticalMissing++;
  }
  
} catch (error) {
  console.log(`❌ Error reading package.json: ${error.message}`);
  criticalMissing++;
}

// Environment template validation
console.log('\n🔧 Environment Configuration:');
console.log('═'.repeat(50));

try {
  const envExample = fs.readFileSync('.env.example', 'utf8');
  const requiredVars = [
    'DYNATRACE_URL',
    'DYNATRACE_API_TOKEN',
    'PORT',
    'NODE_ENV',
    'WEBHOOK_SECRET'
  ];
  
  const missingVars = requiredVars.filter(varName => !envExample.includes(`${varName}=`));
  
  if (missingVars.length === 0) {
    console.log('✅ All required environment variables in template');
  } else {
    console.log(`❌ Missing environment variables: ${missingVars.join(', ')}`);
    criticalMissing++;
  }
  
  // Check if .env exists
  if (fs.existsSync('.env')) {
    console.log('✅ .env file exists');
    
    const envContent = fs.readFileSync('.env', 'utf8');
    const configured = requiredVars.filter(varName => {
      const line = envContent.split('\n').find(l => l.startsWith(`${varName}=`));
      return line && !line.includes('your-') && !line.includes('change-me');
    });
    
    console.log(`📊 Configured variables: ${configured.length}/${requiredVars.length}`);
    
    if (configured.length < 2) {
      console.log('⚠️  Please configure DYNATRACE_URL and DYNATRACE_API_TOKEN');
    }
  } else {
    console.log('⚠️  .env file not found (will be created on first run)');
  }
  
} catch (error) {
  console.log(`❌ Error reading environment files: ${error.message}`);
  criticalMissing++;
}

// Docker configuration check
console.log('\n🐳 Docker Configuration:');
console.log('═'.repeat(50));

const dockerFiles = ['Dockerfile', 'docker-compose.yml'];
const dockerPresent = dockerFiles.filter(file => fs.existsSync(file));

if (dockerPresent.length === dockerFiles.length) {
  console.log('✅ Docker configuration complete');
} else {
  console.log(`⚠️  Docker files present: ${dockerPresent.length}/${dockerFiles.length}`);
}

// Deployment readiness summary
console.log('\n🎯 Deployment Readiness Summary:');
console.log('═'.repeat(50));

if (criticalMissing === 0) {
  console.log('✅ READY FOR DEPLOYMENT!');
  console.log('\n🚀 Next Steps:');
  console.log('1. Configure .env file with Dynatrace credentials');
  console.log('2. Run deployment script:');
  console.log('   • Windows: start.bat');
  console.log('   • Linux/Mac: ./start.sh');
  console.log('   • Manual: node deploy.js && npm run dev');
  console.log('3. Open http://localhost:3000 in your browser');
  console.log('4. Set up Dynatrace webhooks using setup guide');
} else {
  console.log(`❌ NOT READY - ${criticalMissing} critical issues found`);
  console.log('\n🔧 Required Actions:');
  console.log('1. Fix critical file/configuration issues above');
  console.log('2. Re-run this verification script');
  console.log('3. Proceed with deployment once all issues resolved');
}

console.log(`\n📊 Statistics:`);
console.log(`• Total files checked: ${requiredFiles.length}`);
console.log(`• Missing files: ${totalMissing}`);
console.log(`• Critical issues: ${criticalMissing}`);

// Application URLs
console.log('\n🔗 Application URLs (when running):');
console.log('═'.repeat(50));
console.log('• Dashboard: http://localhost:3000');
console.log('• Health Check: http://localhost:3000/health');
console.log('• Setup Status: http://localhost:3000/api/setup/status');
console.log('• Webhook Config: http://localhost:3000/api/setup/webhook-config');
console.log('• API Documentation: See README.md');

process.exit(criticalMissing > 0 ? 1 : 0);