# Deploy Campo Vida to Production

This guide will help you deploy the Campo Vida e-commerce system to make it publicly accessible.

## Deployment Options

### Option 1: Vercel (Frontend) + Railway (Backend) [RECOMMENDED - FREE TIER]

#### Frontend Deployment (Vercel)
1. Push your code to GitHub repository
2. Connect Vercel to your GitHub account
3. Import your repository and deploy the `/frontend` folder

#### Backend Deployment (Railway)
1. Connect Railway to your GitHub account
2. Deploy the `/backend` folder
3. Add environment variables from `.env.production`

### Option 2: Netlify (Frontend) + Render (Backend) [FREE TIER]

#### Frontend Deployment (Netlify)
1. Connect Netlify to your GitHub repository
2. Set build command: `npm run build`
3. Set publish directory: `build`

#### Backend Deployment (Render)
1. Connect Render to your GitHub repository
2. Create a Web Service for the backend
3. Add environment variables

### Option 3: Heroku (Full Stack) [PAID]

Deploy both frontend and backend to Heroku with proper configuration.

## Pre-Deployment Checklist

- [ ] MongoDB Atlas database is set up and accessible
- [ ] Environment variables are configured for production
- [ ] CORS settings allow your production domain
- [ ] Rate limiting is properly configured for production
- [ ] Email service is configured (Gmail App Password recommended)
- [ ] All secrets are generated securely for production

## Quick Deploy Commands

### For Railway Backend:
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway link
railway up
```

### For Vercel Frontend:
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd frontend
vercel --prod
```

## Environment Variables to Set

Copy all variables from `.env.production` to your hosting platform's environment variables section.

## Post-Deployment

1. Update FRONTEND_URL and CLIENT_URL in backend environment variables
2. Test all functionality including:
   - User registration/login
   - Product browsing
   - Cart functionality
   - Order placement
   - Admin panel access

## Monitoring

- Check application logs regularly
- Monitor database performance
- Set up uptime monitoring
- Configure error tracking (optional: Sentry)

## Maintenance

- Regularly update dependencies
- Monitor security vulnerabilities
- Backup database regularly
- Keep SSL certificates updated

## Support

For deployment issues, check the documentation of your chosen hosting platform:
- [Vercel Documentation](https://vercel.com/docs)
- [Railway Documentation](https://docs.railway.app)
- [Netlify Documentation](https://docs.netlify.com)
- [Render Documentation](https://render.com/docs)
