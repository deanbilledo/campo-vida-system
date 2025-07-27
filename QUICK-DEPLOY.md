# Quick Deploy Guide for Campo Vida

## 🚀 Deploy in 15 Minutes (Free Hosting)

### Step 1: Prepare Your Code for Deployment

1. **Push to GitHub** (if not already done):
   ```bash
   git init
   git add .
   git commit -m "Initial Campo Vida deployment"
   git branch -M main
   git remote add origin https://github.com/yourusername/campo-vida-system.git
   git push -u origin main
   ```

### Step 2: Deploy Backend (Railway - FREE)

1. **Go to [Railway.app](https://railway.app)**
2. **Sign up with GitHub**
3. **Click "Deploy from GitHub repo"**
4. **Select your `campo-vida-system` repository**
5. **Choose the `backend` folder as root directory**
6. **Add Environment Variables:**
   - Copy all variables from `backend/.env.production`
   - Set `FRONTEND_URL` to your future frontend URL (we'll update this later)

### Step 3: Deploy Frontend (Vercel - FREE)

1. **Go to [Vercel.com](https://vercel.com)**
2. **Sign up with GitHub**
3. **Click "Import Project"**
4. **Select your `campo-vida-system` repository**
5. **Configure build settings:**
   - Framework Preset: Create React App
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `build`
6. **Add Environment Variables:**
   - `REACT_APP_API_URL`: Your Railway backend URL (from step 2)

### Step 4: Update Backend Configuration

1. **Go back to Railway dashboard**
2. **Update environment variables:**
   - `FRONTEND_URL`: Your Vercel frontend URL
   - `CLIENT_URL`: Your Vercel frontend URL
3. **Redeploy the backend**

### Step 5: Test Your Deployment

1. **Visit your Vercel frontend URL**
2. **Test user registration/login**
3. **Try admin login:** admin@campo-vida.com / password123
4. **Test product browsing and cart functionality**

## 🔧 Alternative Deployment Options

### Option B: Netlify + Render

#### Frontend (Netlify):
1. Connect GitHub to Netlify
2. Build settings: `npm run build` in `frontend/` folder
3. Environment: `REACT_APP_API_URL`

#### Backend (Render):
1. Connect GitHub to Render
2. Choose Web Service
3. Build: `npm install`, Start: `npm start`
4. Add all environment variables from `.env.production`

### Option C: Heroku (All-in-One)

```bash
# Install Heroku CLI
npm install -g heroku

# Create app
heroku create campo-vida-app

# Add MongoDB addon or use your Atlas connection
heroku config:set MONGODB_URI="your-atlas-connection-string"

# Deploy
git push heroku main
```

## 📋 Pre-Deployment Checklist

- [ ] MongoDB Atlas database is accessible
- [ ] All environment variables are set correctly
- [ ] CORS origins are configured for production domains
- [ ] Email service credentials are valid
- [ ] Rate limiting is configured for production traffic

## 🔍 Troubleshooting

### Common Issues:

1. **CORS Errors**: Update `FRONTEND_URL` in backend environment
2. **Database Connection**: Check MongoDB Atlas IP whitelist (allow 0.0.0.0/0 for cloud deployment)
3. **Build Failures**: Check Node.js version compatibility
4. **Environment Variables**: Ensure all required variables are set

### Testing Deployment:

```bash
# Test backend health
curl https://your-backend-url.railway.app/api/health

# Test frontend
curl https://your-frontend-url.vercel.app
```

## 📞 Support

If you encounter issues:
1. Check the platform-specific documentation
2. Review deployment logs in your hosting dashboard
3. Verify environment variables are correctly set
4. Test locally first to ensure code works

## 🎉 You're Live!

Once deployed, your Campo Vida e-commerce system will be accessible worldwide at your Vercel URL. Share the link with your customers and start selling!

**Demo Credentials:**
- Admin: admin@campo-vida.com / password123
- Customer: customer@campo-vida.com / password123
