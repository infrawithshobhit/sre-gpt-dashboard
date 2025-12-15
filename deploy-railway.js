#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');

console.log('🚀 SRE GPT - Railway Deployment Script');
console.log('=====================================\n');

// Check if Railway CLI is installed
function checkRailwayCLI() {
    try {
        execSync('railway --version', { stdio: 'ignore' });
        console.log('✅ Railway CLI is installed');
        return true;
    } catch (error) {
        console.log('❌ Railway CLI not found. Installing...');
        try {
            execSync('npm install -g @railway/cli', { stdio: 'inherit' });
            console.log('✅ Railway CLI installed successfully');
            return true;
        } catch (installError) {
            console.error('❌ Failed to install Railway CLI');
            console.log('\n💡 Manual installation:');
            console.log('   npm install -g @railway/cli');
            return false;
        }
    }
}

// Check if user is logged in
function checkLogin() {
    try {
        execSync('railway whoami', { stdio: 'ignore' });
        console.log('✅ Already logged in to Railway');
        return true;
    } catch (error) {
        console.log('❌ Not logged in to Railway');
        console.log('\n🔑 Please login to Railway:');
        console.log('   railway login');
        console.log('\nThen run this script again.');
        return false;
    }
}

// Deploy to Railway
function deploy() {
    try {
        console.log('\n🚀 Deploying to Railway...');
        
        // Initialize if needed
        if (!fs.existsSync('railway.json')) {
            console.log('📝 Initializing Railway project...');
            execSync('railway init', { stdio: 'inherit' });
        }
        
        // Deploy
        console.log('🚀 Starting deployment...');
        execSync('railway up', { stdio: 'inherit' });
        
        console.log('\n✅ Deployment successful!');
        console.log('\n🌐 Your SRE GPT application is now live!');
        console.log('📊 Check your Railway dashboard for the public URL');
        console.log('🔗 Dashboard: https://railway.app/dashboard');
        
        // Try to get the URL
        try {
            const url = execSync('railway status --json', { encoding: 'utf8' });
            const status = JSON.parse(url);
            if (status.deployments && status.deployments[0] && status.deployments[0].url) {
                console.log(`\n🎉 Your app is live at: ${status.deployments[0].url}`);
            }
        } catch (urlError) {
            console.log('\n💡 Get your URL from: railway status');
        }
        
    } catch (error) {
        console.error('❌ Deployment failed:', error.message);
        console.log('\n🔧 Troubleshooting:');
        console.log('   1. Make sure you have a Railway account');
        console.log('   2. Check your internet connection');
        console.log('   3. Try: railway login');
        console.log('   4. Try: railway init');
        console.log('   5. Try: railway up');
    }
}

// Main execution
async function main() {
    console.log('🔍 Checking prerequisites...\n');
    
    if (!checkRailwayCLI()) {
        process.exit(1);
    }
    
    if (!checkLogin()) {
        process.exit(1);
    }
    
    console.log('\n✅ All prerequisites met!');
    
    // Show deployment info
    console.log('\n📋 Deployment Information:');
    console.log('   Platform: Railway');
    console.log('   Runtime: Node.js');
    console.log('   Port: 3000');
    console.log('   Build: npm install');
    console.log('   Start: npm start');
    
    deploy();
}

// Run the script
main().catch(console.error);