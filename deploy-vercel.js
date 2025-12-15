#!/usr/bin/env node

const { execSync } = require('child_process');

console.log('⚡ SRE GPT - Vercel Deployment Script');
console.log('====================================\n');

// Check if Vercel CLI is installed
function checkVercelCLI() {
    try {
        execSync('vercel --version', { stdio: 'ignore' });
        console.log('✅ Vercel CLI is installed');
        return true;
    } catch (error) {
        console.log('❌ Vercel CLI not found. Installing...');
        try {
            execSync('npm install -g vercel', { stdio: 'inherit' });
            console.log('✅ Vercel CLI installed successfully');
            return true;
        } catch (installError) {
            console.error('❌ Failed to install Vercel CLI');
            console.log('\n💡 Manual installation:');
            console.log('   npm install -g vercel');
            return false;
        }
    }
}

// Deploy to Vercel
function deploy() {
    try {
        console.log('\n🚀 Deploying to Vercel...');
        console.log('📝 Follow the prompts to configure your deployment\n');
        
        execSync('vercel', { stdio: 'inherit' });
        
        console.log('\n✅ Deployment successful!');
        console.log('\n🌐 Your SRE GPT application is now live!');
        console.log('🔗 Dashboard: https://vercel.com/dashboard');
        
    } catch (error) {
        console.error('❌ Deployment failed:', error.message);
        console.log('\n🔧 Troubleshooting:');
        console.log('   1. Make sure you have a Vercel account');
        console.log('   2. Try: vercel login');
        console.log('   3. Try: vercel --help');
    }
}

// Main execution
function main() {
    console.log('🔍 Checking prerequisites...\n');
    
    if (!checkVercelCLI()) {
        process.exit(1);
    }
    
    console.log('\n✅ Prerequisites met!');
    
    // Show deployment info
    console.log('\n📋 Deployment Information:');
    console.log('   Platform: Vercel');
    console.log('   Runtime: Node.js');
    console.log('   Configuration: vercel.json');
    console.log('   Features: Serverless, Auto-scaling, CDN');
    
    console.log('\n💡 Vercel Features:');
    console.log('   ✅ Free tier with generous limits');
    console.log('   ✅ Automatic HTTPS and CDN');
    console.log('   ✅ GitHub integration');
    console.log('   ✅ Custom domains');
    console.log('   ✅ Serverless functions');
    
    deploy();
}

// Run the script
main().catch(console.error);