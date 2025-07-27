# 🌐 Campo Vida - Make Friends Access Your Store

## Quick Setup for Public Access

### Step 1: Start Backend ngrok
Open a NEW PowerShell terminal and run:
```powershell
ngrok http 5000
```
You'll get a URL like: `https://abc123-ngrok-free.app`

### Step 2: Update Frontend Configuration
1. Open `frontend/.env`
2. Replace the content with your backend ngrok URL:
```
REACT_APP_API_URL=https://your-backend-ngrok-url-here.ngrok.io
REACT_APP_ENVIRONMENT=production
```

### Step 3: Start Frontend ngrok  
In ANOTHER PowerShell terminal, run:
```powershell
ngrok http 3000
```
You'll get a URL like: `https://xyz789-ngrok-free.app`

### Step 4: Share Frontend URL
Give your friends the FRONTEND ngrok URL from Step 3.

## Example Setup:
1. Backend ngrok: `https://abc123-ngrok-free.app` (for API)
2. Frontend ngrok: `https://xyz789-ngrok-free.app` (for friends to visit)
3. Update frontend/.env: `REACT_APP_API_URL=https://abc123-ngrok-free.app`

## Test Access:
- You: Visit `https://xyz789-ngrok-free.app`
- Friends: Visit `https://xyz789-ngrok-free.app`
- Login: admin@campo-vida.com / password123

🎉 Your Campo Vida store will be accessible worldwide!
