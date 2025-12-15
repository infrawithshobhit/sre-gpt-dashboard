const http = require('http');
const fs = require('fs');
const path = require('path');

console.log('🔍 SRE GPT Application Diagnostics\n');

// Test 1: Check if server is running
async function testServerHealth() {
    console.log('1. Testing server health...');
    try {
        const response = await fetch('http://localhost:3000/health');
        const data = await response.json();
        console.log('   ✅ Server is running:', data.status);
        return true;
    } catch (error) {
        console.log('   ❌ Server not responding:', error.message);
        return false;
    }
}

// Test 2: Check dashboard API
async function testDashboardAPI() {
    console.log('2. Testing dashboard API...');
    try {
        const response = await fetch('http://localhost:3000/api/dashboard/overview');
        const data = await response.json();
        console.log('   ✅ Dashboard API working');
        console.log('   📊 Services found:', data.details.services.services.length);
        console.log('   🏥 Overall health:', data.overallHealth);
        return true;
    } catch (error) {
        console.log('   ❌ Dashboard API failed:', error.message);
        return false;
    }
}

// Test 3: Check chat API
async function testChatAPI() {
    console.log('3. Testing chat API...');
    try {
        const response = await fetch('http://localhost:3000/api/chat/message', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: 'hello' })
        });
        const data = await response.json();
        console.log('   ✅ Chat API working');
        console.log('   💬 Response length:', data.message.length, 'characters');
        return true;
    } catch (error) {
        console.log('   ❌ Chat API failed:', error.message);
        return false;
    }
}

// Test 4: Check critical services query
async function testCriticalServicesQuery() {
    console.log('4. Testing critical services query...');
    try {
        const response = await fetch('http://localhost:3000/api/chat/message', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: 'which application is down' })
        });
        const data = await response.json();
        console.log('   ✅ Critical services query working');
        
        // Check if response mentions down services
        if (data.message.includes('DOWN') || data.message.includes('down')) {
            console.log('   🎯 Response correctly identifies down services');
        } else {
            console.log('   ⚠️  Response may not be identifying down services correctly');
        }
        
        return true;
    } catch (error) {
        console.log('   ❌ Critical services query failed:', error.message);
        return false;
    }
}

// Test 5: Check file structure
function testFileStructure() {
    console.log('5. Checking file structure...');
    
    const requiredFiles = [
        'src/app.js',
        'src/dashboard/index.html',
        'src/dashboard/dashboard.js',
        'src/chat/chatHandler.js',
        'src/routes/chatRoutes.js',
        'src/routes/dashboardRoutes.js',
        'package.json'
    ];
    
    let allFilesExist = true;
    
    requiredFiles.forEach(file => {
        if (fs.existsSync(file)) {
            console.log(`   ✅ ${file}`);
        } else {
            console.log(`   ❌ ${file} - MISSING`);
            allFilesExist = false;
        }
    });
    
    return allFilesExist;
}

// Test 6: Check dashboard accessibility
async function testDashboardAccess() {
    console.log('6. Testing dashboard accessibility...');
    try {
        const response = await fetch('http://localhost:3000/');
        const html = await response.text();
        
        if (html.includes('SRE GPT')) {
            console.log('   ✅ Dashboard HTML loads correctly');
            
            // Check for key elements
            if (html.includes('socket.io')) {
                console.log('   ✅ Socket.IO script included');
            } else {
                console.log('   ⚠️  Socket.IO script may be missing');
            }
            
            if (html.includes('dashboard.js')) {
                console.log('   ✅ Dashboard JavaScript included');
            } else {
                console.log('   ⚠️  Dashboard JavaScript may be missing');
            }
            
            return true;
        } else {
            console.log('   ❌ Dashboard HTML does not contain expected content');
            return false;
        }
    } catch (error) {
        console.log('   ❌ Dashboard not accessible:', error.message);
        return false;
    }
}

// Test 7: Check environment configuration
function testEnvironmentConfig() {
    console.log('7. Checking environment configuration...');
    
    const envFile = '.env';
    const envExampleFile = '.env.example';
    
    if (fs.existsSync(envFile)) {
        console.log('   ✅ .env file exists');
        
        const envContent = fs.readFileSync(envFile, 'utf8');
        
        if (envContent.includes('DYNATRACE_URL')) {
            console.log('   ✅ DYNATRACE_URL configured');
        } else {
            console.log('   ⚠️  DYNATRACE_URL not found in .env');
        }
        
        if (envContent.includes('your-environment')) {
            console.log('   ℹ️  Using demo/placeholder Dynatrace configuration');
        }
        
    } else if (fs.existsSync(envExampleFile)) {
        console.log('   ⚠️  .env file missing, but .env.example exists');
        console.log('   💡 Run: copy .env.example .env');
    } else {
        console.log('   ❌ No environment configuration files found');
    }
    
    return fs.existsSync(envFile);
}

// Main diagnostic function
async function runDiagnostics() {
    console.log('Starting comprehensive diagnostics...\n');
    
    const results = {
        serverHealth: await testServerHealth(),
        dashboardAPI: await testDashboardAPI(),
        chatAPI: await testChatAPI(),
        criticalQuery: await testCriticalServicesQuery(),
        fileStructure: testFileStructure(),
        dashboardAccess: await testDashboardAccess(),
        envConfig: testEnvironmentConfig()
    };
    
    console.log('\n📋 DIAGNOSTIC SUMMARY:');
    console.log('========================');
    
    Object.entries(results).forEach(([test, passed]) => {
        const status = passed ? '✅ PASS' : '❌ FAIL';
        const testName = test.replace(/([A-Z])/g, ' $1').toLowerCase();
        console.log(`${status} - ${testName}`);
    });
    
    const passedTests = Object.values(results).filter(Boolean).length;
    const totalTests = Object.keys(results).length;
    
    console.log(`\n🎯 Overall Score: ${passedTests}/${totalTests} tests passed`);
    
    if (passedTests === totalTests) {
        console.log('\n🎉 All tests passed! Your SRE GPT application should be working correctly.');
        console.log('   Try opening http://localhost:3000 in your browser.');
    } else {
        console.log('\n🔧 Some issues detected. Recommendations:');
        
        if (!results.serverHealth) {
            console.log('   • Start the server: npm start or node src/app.js');
        }
        
        if (!results.envConfig) {
            console.log('   • Create .env file: copy .env.example .env');
        }
        
        if (!results.fileStructure) {
            console.log('   • Check for missing files in the project structure');
        }
        
        if (results.serverHealth && results.dashboardAPI && results.chatAPI) {
            console.log('   • Backend APIs are working - issue may be in frontend JavaScript');
            console.log('   • Check browser console for JavaScript errors at http://localhost:3000');
        }
    }
    
    console.log('\n🌐 Quick Test URLs:');
    console.log('   • Dashboard: http://localhost:3000');
    console.log('   • Health Check: http://localhost:3000/health');
    console.log('   • Chat Test: http://localhost:3000/test-chat.html');
    console.log('   • API Test: http://localhost:3000/api/dashboard/overview');
}

// Run diagnostics
runDiagnostics().catch(console.error);