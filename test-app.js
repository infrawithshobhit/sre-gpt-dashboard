// Simple test to verify application structure
const fs = require('fs');
const path = require('path');

console.log('🔍 SRE GPT Application Structure Test\n');

// Check required files
const requiredFiles = [
  'package.json',
  'src/app.js',
  'src/dashboard/index.html',
  'src/dashboard/dashboard.js',
  'src/dynatrace/dynatraceService.js',
  'src/chat/chatHandler.js',
  'src/analyzers/healthAnalyzer.js',
  'src/webhooks/dynatraceWebhook.js',
  'src/routes/dashboardRoutes.js',
  'src/routes/dynatraceRoutes.js',
  'src/routes/chatRoutes.js',
  'src/routes/webhookRoutes.js',
  'src/routes/setupRoutes.js',
  'src/utils/logger.js',
  'src/setup/setupGuide.js',
  '.env.example',
  'docker-compose.yml',
  'Dockerfile',
  'README.md'
];

let allFilesExist = true;

console.log('📁 Checking required files:');
requiredFiles.forEach(file => {
  const exists = fs.existsSync(file);
  console.log(`${exists ? '✅' : '❌'} ${file}`);
  if (!exists) allFilesExist = false;
});

console.log('\n📦 Package.json check:');
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  console.log(`✅ Name: ${packageJson.name}`);
  console.log(`✅ Version: ${packageJson.version}`);
  console.log(`✅ Main: ${packageJson.main}`);
  console.log(`✅ Scripts: ${Object.keys(packageJson.scripts).join(', ')}`);
} catch (error) {
  console.log(`❌ Error reading package.json: ${error.message}`);
  allFilesExist = false;
}

console.log('\n🐳 Docker files check:');
const dockerFiles = ['Dockerfile', 'docker-compose.yml'];
dockerFiles.forEach(file => {
  const exists = fs.existsSync(file);
  console.log(`${exists ? '✅' : '❌'} ${file}`);
});

console.log('\n📋 Environment template check:');
try {
  const envExample = fs.readFileSync('.env.example', 'utf8');
  const requiredVars = ['DYNATRACE_URL', 'DYNATRACE_API_TOKEN', 'WEBHOOK_SECRET'];
  requiredVars.forEach(varName => {
    const hasVar = envExample.includes(varName);
    console.log(`${hasVar ? '✅' : '❌'} ${varName}`);
  });
} catch (error) {
  console.log(`❌ Error reading .env.example: ${error.message}`);
}

console.log('\n🎯 Summary:');
if (allFilesExist) {
  console.log('✅ All required files are present!');
  console.log('\n🚀 Next steps:');
  console.log('1. Install Node.js 18+ if not already installed');
  console.log('2. Run: npm install');
  console.log('3. Copy .env.example to .env and configure');
  console.log('4. Run: npm run dev (development) or npm start (production)');
  console.log('5. Open http://localhost:3000 in your browser');
  console.log('\n📖 See README.md for detailed setup instructions');
} else {
  console.log('❌ Some required files are missing. Please check the file structure.');
}

console.log('\n🔗 Application URLs (when running):');
console.log('- Dashboard: http://localhost:3000');
console.log('- Health Check: http://localhost:3000/health');
console.log('- Setup Status: http://localhost:3000/api/setup/status');
console.log('- Webhook Config: http://localhost:3000/api/setup/webhook-config');