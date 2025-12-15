#!/usr/bin/env node

const { execSync } = require('child_process');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log('🚀 SRE GPT - Cloud Deployment Assistant');
console.log('======================================\n');

console.log('🌐 Choose your deployment platform:\n');
console.log('1️⃣  Railway    - Easiest, free tier, instant deployment');
console.log('2️⃣  Render     - Great free tier, GitHub integration');
console.log('3️⃣  Vercel     - Serverless, fast CDN, free tier');
console.log('4️⃣  Manual     - Show manual deployment instructions');
console.log('5️⃣  Docker     - Container deployment guide');
console.log('6️⃣  Exit       - Exit deployment assistant\n');

function deployRailway() {
    console.log('\n🚀 Railway Deployment Selected');
    console.log('==============================\n');
    
    try {
        require('./deploy-railway.js');
    } catch (error) {
        console.log('Running Railway deployment...\n');
        execSync('node deploy-railway.js', { stdio: 'inherit' });
    }
}

function deployRender() {
    console.log('\n🌐 Render Deployment Selected');
    console.log('=============================\n');
    
    try {
        require('./deploy-render.js');
    } catch (error) {
        console.log('Running Render deployment guide...\n');
        execSync('node deploy-render.js', { stdio: 'inherit' });
    }
}

function deployVercel() {
    console.log('\n⚡ Vercel Deployment Selected');
    console.log('============================\n');
    
    try {
        require('./deploy-vercel.js');
    } catch (error) {
        console.log('Running Vercel deployment...\n');
        execSync('node deploy-vercel.js', { stdio: 'inherit' });
    }
}

function showManualInstructions() {
    console.log('\n📋 Manual Deployment Instructions');
    console.log('=================================\n');
    
    console.log('🔧 Your SRE GPT app is ready for deployment on any platform!\n');
    
    console.log('📦 Required Files:');
    console.log('   ✅ package.json (with start script)');
    console.log('   ✅ src/app.js (main application)');
    console.log('   ✅ .env.example (environment template)');
    console.log('   ✅ Dockerfile (for container deployment)');
    console.log('   ✅ vercel.json (for Vercel deployment)\n');
    
    console.log('⚙️  Environment Variables to Set:');
    console.log('   NODE_ENV=production');
    console.log('   PORT=3000 (or platform default)');
    console.log('   DYNATRACE_URL=your-dynatrace-url (optional)');
    console.log('   DYNATRACE_API_TOKEN=your-token (optional)\n');
    
    console.log('🚀 Platform-Specific Instructions:\n');
    
    console.log('🔹 Heroku:');
    console.log('   heroku create your-app-name');
    console.log('   git push heroku main\n');
    
    console.log('🔹 DigitalOcean App Platform:');
    console.log('   1. Connect GitHub repository');
    console.log('   2. Build: npm install');
    console.log('   3. Run: npm start\n');
    
    console.log('🔹 AWS/Google Cloud/Azure:');
    console.log('   Use Docker deployment with provided Dockerfile\n');
    
    console.log('✅ Your app will be accessible at the provided URL!');
}

function showDockerInstructions() {
    console.log('\n🐳 Docker Deployment Guide');
    console.log('==========================\n');
    
    console.log('📦 Your app includes Docker support!\n');
    
    console.log('🔨 Build and Run Locally:');
    console.log('   docker build -t sre-gpt .');
    console.log('   docker run -p 3000:3000 sre-gpt\n');
    
    console.log('☁️  Deploy to Cloud Platforms:\n');
    
    console.log('🔹 Google Cloud Run:');
    console.log('   gcloud builds submit --tag gcr.io/PROJECT-ID/sre-gpt');
    console.log('   gcloud run deploy --image gcr.io/PROJECT-ID/sre-gpt\n');
    
    console.log('🔹 AWS ECS/Fargate:');
    console.log('   1. Push to ECR registry');
    console.log('   2. Create ECS service');
    console.log('   3. Configure load balancer\n');
    
    console.log('🔹 Azure Container Instances:');
    console.log('   az container create --resource-group myResourceGroup \\');
    console.log('     --name sre-gpt --image your-registry/sre-gpt\n');
    
    console.log('🔹 DigitalOcean Droplet:');
    console.log('   1. Create droplet');
    console.log('   2. Install Docker');
    console.log('   3. Run: docker run -d -p 80:3000 sre-gpt\n');
    
    console.log('✅ Docker provides consistent deployment across all platforms!');
}

function askChoice() {
    rl.question('Enter your choice (1-6): ', (answer) => {
        switch (answer.trim()) {
            case '1':
                deployRailway();
                break;
            case '2':
                deployRender();
                break;
            case '3':
                deployVercel();
                break;
            case '4':
                showManualInstructions();
                break;
            case '5':
                showDockerInstructions();
                break;
            case '6':
                console.log('\n👋 Thanks for using SRE GPT deployment assistant!');
                console.log('🌐 Your app is ready for deployment on any platform.');
                rl.close();
                return;
            default:
                console.log('\n❌ Invalid choice. Please enter 1-6.\n');
                askChoice();
                return;
        }
        
        console.log('\n🔄 Would you like to try another deployment option?');
        rl.question('Press Enter to continue or Ctrl+C to exit...', () => {
            console.log('\n' + '='.repeat(50) + '\n');
            askChoice();
        });
    });
}

// Start the interactive deployment assistant
askChoice();