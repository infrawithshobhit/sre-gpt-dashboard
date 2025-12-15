#!/usr/bin/env node

console.log('🌐 SRE GPT - Render Deployment Guide');
console.log('===================================\n');

console.log('🎯 Render is perfect for your SRE GPT application!');
console.log('   ✅ Free tier available');
console.log('   ✅ Automatic HTTPS');
console.log('   ✅ GitHub integration');
console.log('   ✅ Auto-deploys on push\n');

console.log('📋 Step-by-Step Deployment:');
console.log('');

console.log('1️⃣  Go to https://render.com');
console.log('   - Sign up with GitHub account');
console.log('');

console.log('2️⃣  Click "New +" → "Web Service"');
console.log('   - Connect your GitHub repository');
console.log('   - Select your SRE GPT repository');
console.log('');

console.log('3️⃣  Configure the service:');
console.log('   Name: sre-gpt-dashboard');
console.log('   Environment: Node');
console.log('   Build Command: npm install');
console.log('   Start Command: npm start');
console.log('   Instance Type: Free (or Starter $7/month)');
console.log('');

console.log('4️⃣  Environment Variables (Optional):');
console.log('   NODE_ENV = production');
console.log('   DYNATRACE_URL = your-dynatrace-url');
console.log('   DYNATRACE_API_TOKEN = your-api-token');
console.log('');

console.log('5️⃣  Click "Create Web Service"');
console.log('   - Render will automatically build and deploy');
console.log('   - You\'ll get a public URL like: https://sre-gpt-dashboard.onrender.com');
console.log('');

console.log('🎉 That\'s it! Your app will be live in 2-3 minutes.');
console.log('');

console.log('💡 Pro Tips:');
console.log('   • Free tier sleeps after 15 minutes of inactivity');
console.log('   • Upgrade to Starter ($7/month) for always-on service');
console.log('   • Auto-deploys happen on every git push to main branch');
console.log('   • Add custom domain in Render dashboard');
console.log('');

console.log('🔗 Useful Links:');
console.log('   Render Dashboard: https://dashboard.render.com');
console.log('   Render Docs: https://render.com/docs');
console.log('');

console.log('🚀 Your SRE GPT will be accessible from anywhere once deployed!');

// Check if git repository exists
const fs = require('fs');
if (fs.existsSync('.git')) {
    console.log('\n✅ Git repository detected - ready for Render deployment!');
} else {
    console.log('\n⚠️  Initialize git repository first:');
    console.log('   git init');
    console.log('   git add .');
    console.log('   git commit -m "Initial commit"');
    console.log('   git remote add origin <your-github-repo-url>');
    console.log('   git push -u origin main');
}