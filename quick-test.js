#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🧪 SRE GPT Quick Test\n');

// Test 1: Check Node.js version
console.log('1. Checking Node.js version...');
try {
  const nodeVersion = process.version;
  const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);
  
  if (majorVersion >= 18) {
    console.log(`✅ Node.js ${nodeVersion} (compatible)`);
  } else {
    console.log(`⚠️  Node.js ${nodeVersion} (recommend 18+)`);
  }
} catch (error) {
  console.log(`❌ Error checking Node.js: ${error.message}`);
}

// Test 2: Check required files
console.log('\n2. Checking required files...');
const criticalFiles = [
  'package.json',
  'src/app.js',
  'src/dashboard/index.html',
  'src/dashboard/dashboard.js',
  '.env.example'
];

let missingFiles = 0;
criticalFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} (missing)`);
    missingFiles++;
  }
});

// Test 3: Check package.json
console.log('\n3. Checking package.json...');
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  
  if (packageJson.name === 'sre-gpt') {
    console.log('✅ Package name correct');
  }
  
  if (packageJson.scripts && packageJson.scripts.start && packageJson.scripts.dev) {
    console.log('✅ Required scripts present');
  } else {
    console.log('❌ Missing required scripts');
    missingFiles++;
  }
  
  const requiredDeps = ['express', 'socket.io', 'axios', 'winston'];
  const hasDeps = requiredDeps.every(dep => packageJson.dependencies && packageJson.dependencies[dep]);
  
  if (hasDeps) {
    console.log('✅ Core dependencies listed');
  } else {
    console.log('❌ Missing core dependencies');
    missingFiles++;
  }
  
} catch (error) {
  console.log(`❌ Error reading package.json: ${error.message}`);
  missingFiles++;
}

// Test 4: Check if dependencies are installed
console.log('\n4. Checking node_modules...');
if (fs.existsSync('node_modules')) {
  console.log('✅ node_modules directory exists');
  
  // Check for key dependencies
  const keyDeps = ['express', 'socket.io', 'axios'];
  keyDeps.forEach(dep => {
    if (fs.existsSync(path.join('node_modules', dep))) {
      console.log(`✅ ${dep} installed`);
    } else {
      console.log(`⚠️  ${dep} not found (run npm install)`);
    }
  });
} else {
  console.log('⚠️  node_modules not found (run npm install)');
}

// Test 5: Check environment setup
console.log('\n5. Checking environment setup...');
if (fs.existsSync('.env')) {
  console.log('✅ .env file exists');
  
  try {
    const envContent = fs.readFileSync('.env', 'utf8');
    const hasUrl = envContent.includes('DYNATRACE_URL=') && !envContent.includes('your-environment');
    const hasToken = envContent.includes('DYNATRACE_API_TOKEN=') && !envContent.includes('your-api-token');
    
    if (hasUrl && hasToken) {
      console.log('✅ Dynatrace configuration appears complete');
    } else {
      console.log('⚠️  Dynatrace configuration needs setup');
    }
  } catch (error) {
    console.log('⚠️  Could not read .env file');
  }
} else {
  console.log('⚠️  .env file not found (will be created on first run)');
}

// Test 6: Try to load main application file
console.log('\n6. Testing application structure...');
try {
  // Don't actually require it (to avoid starting the server)
  const appContent = fs.readFileSync('src/app.js', 'utf8');
  
  if (appContent.includes('class SREGPTApp')) {
    console.log('✅ Main application class found');
  }
  
  if (appContent.includes('express')) {
    console.log('✅ Express framework imported');
  }
  
  if (appContent.includes('socket.io')) {
    console.log('✅ Socket.IO imported');
  }
  
} catch (error) {
  console.log(`❌ Error reading application file: ${error.message}`);
  missingFiles++;
}

// Summary
console.log('\n📊 Test Summary:');
console.log('═'.repeat(40));

if (missingFiles === 0) {
  console.log('🎉 ALL TESTS PASSED!');
  console.log('\n✅ Your SRE GPT application is ready to run!');
  console.log('\n🚀 Next steps:');
  console.log('1. Install dependencies: npm install');
  console.log('2. Configure environment: cp .env.example .env && edit .env');
  console.log('3. Start application: npm run dev');
  console.log('4. Open browser: http://localhost:3000');
  console.log('\n📖 For detailed instructions, see TESTING_GUIDE.md');
} else {
  console.log(`❌ ${missingFiles} issues found`);
  console.log('\n🔧 Required actions:');
  console.log('1. Fix missing files/configuration issues above');
  console.log('2. Run this test again: node quick-test.js');
  console.log('3. Proceed when all tests pass');
}

// Show available commands
console.log('\n🛠️  Available commands:');
console.log('• node quick-test.js          - Run this test again');
console.log('• npm install                 - Install dependencies');
console.log('• npm run dev                 - Start development server');
console.log('• npm start                   - Start production server');

if (fs.existsSync('start.bat')) {
  console.log('• start.bat                   - Windows quick start');
}

if (fs.existsSync('start.sh')) {
  console.log('• ./start.sh                  - Linux/Mac quick start');
}

console.log('• docker-compose up -d        - Start with Docker');

process.exit(missingFiles > 0 ? 1 : 0);