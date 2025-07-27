# 🌐 Campo Vida - VS Code Port Forwarding Setup

## Quick Setup for Public Access Using VS Code

Since you're using VS Code's built-in port forwarding feature, here's how your friends can access your Campo Vida store:

### Step 1: Start Your Services
Make sure both services are running:
- **Backend**: `npm run dev` (port 5000)
- **Frontend**: `npm start` (port 3000)

### Step 2: VS Code Port Forwarding
1. In VS Code, open the **Ports** tab (usually at bottom panel)
2. Click **"Forward a Port"** 
3. Add port **3000** (Frontend) - Set visibility to **Public**
4. Add port **5000** (Backend) - Set visibility to **Public**

### Step 3: Share Frontend URL
- Copy the **public** URL for port 3000 (frontend)
- Share this URL with your friends
- Example: `https://curly-space-robot-abc123-3000.app.github.dev`

### Step 4: Update Backend Configuration
The frontend will automatically connect to the backend through port 5000's forwarded URL.

### Demo Accounts
Your friends can test with:
- **Admin**: admin@campo-vida.com / password123
- **Customer**: customer@campo-vida.com / password123

## Features Available
✅ Browse organic products
✅ User registration/login
✅ Shopping cart & checkout
✅ Admin dashboard
✅ Order management
✅ Product management

## 🎉 Your Campo Vida organic store is now accessible worldwide!
