#!/usr/bin/env node

// Campo Vida System Health Check
const http = require('http');
const https = require('https');

console.log('🌿 Campo Vida System Health Check\n');

// Check Frontend
const checkFrontend = () => {
  return new Promise((resolve) => {
    const req = http.get('http://localhost:3000', (res) => {
      if (res.statusCode === 200) {
        console.log('✅ Frontend: Running on http://localhost:3000');
        resolve(true);
      } else {
        console.log('❌ Frontend: Not responding');
        resolve(false);
      }
    });
    
    req.on('error', () => {
      console.log('❌ Frontend: Not running');
      resolve(false);
    });
    
    req.setTimeout(5000, () => {
      console.log('❌ Frontend: Timeout');
      resolve(false);
    });
  });
};

// Check Backend
const checkBackend = () => {
  return new Promise((resolve) => {
    const req = http.get('http://localhost:5000/api/health', (res) => {
      if (res.statusCode === 200) {
        console.log('✅ Backend: Running on http://localhost:5000');
        resolve(true);
      } else {
        console.log('❌ Backend: Not responding');
        resolve(false);
      }
    });
    
    req.on('error', () => {
      console.log('❌ Backend: Not running');
      resolve(false);
    });
    
    req.setTimeout(5000, () => {
      console.log('❌ Backend: Timeout');
      resolve(false);
    });
  });
};

// Main health check
async function healthCheck() {
  console.log('🔍 Checking system components...\n');
  
  const [frontendOk, backendOk] = await Promise.all([
    checkFrontend(),
    checkBackend()
  ]);
  
  console.log('\n📊 System Status:');
  console.log(`Frontend: ${frontendOk ? '🟢 Healthy' : '🔴 Down'}`);
  console.log(`Backend: ${backendOk ? '🟢 Healthy' : '🔴 Down'}`);
  
  if (frontendOk && backendOk) {
    console.log('\n🎉 Campo Vida System: FULLY OPERATIONAL');
    console.log('🚀 Ready for presentation!');
  } else {
    console.log('\n⚠️  Some services are down. Please check the logs.');
  }
  
  console.log('\n📝 Demo Accounts:');
  console.log('👨‍💼 Admin: admin@campo-vida.com / password123');
  console.log('🛒 Customer: customer@campo-vida.com / password123');
  console.log('🚚 Driver: driver@campo-vida.com / password123');
}

healthCheck();
