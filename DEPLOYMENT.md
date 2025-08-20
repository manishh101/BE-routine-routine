# Deployment Guide

## 🚀 Deployment Overview

This guide covers deploying the BE Routine Management System with:
- **Frontend**: Vercel (Static hosting for React app)
- **Backend**: Render (Node.js hosting with MongoDB Atlas)

## 📋 Prerequisites

1. **Accounts Required**:
   - [Vercel Account](https://vercel.com)
   - [Render Account](https://render.com)
   - [MongoDB Atlas Account](https://cloud.mongodb.com) (already configured)

2. **Repository Setup**:
   - Code pushed to GitHub/GitLab
   - Environment variables configured

## 🔧 Backend Deployment (Render)

### Step 1: Prepare Backend
1. Ensure all deployment files are in place:
   - `backend/Dockerfile`
   - `backend/healthcheck.js`
   - `backend/.env.production.template`
   - `render.yaml`

### Step 2: Deploy to Render
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: `be-routine-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free (or paid for better performance)

### Step 3: Set Environment Variables
In Render dashboard, add these environment variables:

```bash
NODE_ENV=production
PORT=7102
MONGODB_URI=mongodb+srv://079bct044manish:routine@routine.mrjj7ho.mongodb.net/bctroutine?retryWrites=true&w=majority&appName=routine
JWT_SECRET=ASDSHI@!@!BDSHUIfwefwefwe@*!@&^^
JWT_EXPIRE=30d
FRONTEND_URL=https://your-frontend-url.vercel.app
USE_RABBITMQ=false
CORS_ORIGIN=https://your-frontend-url.vercel.app
```

**⚠️ Important**: Update `FRONTEND_URL` and `CORS_ORIGIN` with your actual Vercel URL after frontend deployment.

### Step 4: Deploy
1. Click "Create Web Service"
2. Wait for deployment to complete
3. Note your backend URL: `https://your-backend-url.onrender.com`

## 🎨 Frontend Deployment (Vercel)

### Step 1: Update Configuration
1. Update `frontend/vercel.json` with your backend URL
2. Update `frontend/.env.production` with your backend URL

### Step 2: Deploy to Vercel
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your repository
4. Configure the project:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

### Step 3: Set Environment Variables
In Vercel dashboard, add these environment variables:

```bash
VITE_API_BASE_URL=https://your-backend-url.onrender.com
VITE_APP_NAME=BE Routine Management System
VITE_NODE_ENV=production
```

### Step 4: Deploy
1. Click "Deploy"
2. Wait for deployment to complete
3. Note your frontend URL: `https://your-frontend-url.vercel.app`

## 🔄 Update Cross-References

After both deployments are complete:

1. **Update Backend Environment Variables**:
   - Set `FRONTEND_URL` to your Vercel URL
   - Set `CORS_ORIGIN` to your Vercel URL

2. **Update Frontend Environment Variables**:
   - Set `VITE_API_BASE_URL` to your Render URL

3. **Update API Configuration**:
   - Update any hardcoded URLs in your frontend code

## 🧪 Testing Deployment

### Backend Health Check
```bash
curl https://your-backend-url.onrender.com/api/health
```

### Frontend Connectivity
1. Open your Vercel URL
2. Try logging in
3. Check browser network tab for API calls

## 🔧 Common Issues & Solutions

### Backend Issues
1. **Build Failures**: Check Node.js version compatibility
2. **Environment Variables**: Ensure all required variables are set
3. **Database Connection**: Verify MongoDB Atlas connection string

### Frontend Issues
1. **API Calls Failing**: Check CORS configuration
2. **Build Errors**: Verify all dependencies are listed in package.json
3. **Environment Variables**: Ensure VITE_ prefix for Vite variables

### General Issues
1. **Slow Performance**: Consider upgrading to paid plans
2. **HTTPS Issues**: Both Vercel and Render provide HTTPS by default
3. **Domain Setup**: Configure custom domains in respective dashboards

## 📊 Monitoring

### Render Monitoring
- Check service logs in Render dashboard
- Monitor service metrics and uptime
- Set up log alerts for errors

### Vercel Monitoring
- Monitor function invocations and errors
- Check build logs for deployment issues
- Set up monitoring for performance

## 🔐 Security Considerations

1. **Environment Variables**: Never commit production secrets
2. **CORS**: Configure strict CORS origins
3. **JWT Secrets**: Use strong, unique secrets in production
4. **Database**: Ensure MongoDB Atlas has proper access controls
5. **HTTPS**: Both platforms provide HTTPS by default

## 📈 Scaling Considerations

1. **Backend Scaling**: Render will auto-scale within plan limits
2. **Database**: MongoDB Atlas can be scaled independently
3. **CDN**: Vercel provides global CDN automatically
4. **Monitoring**: Set up monitoring and alerting for high traffic

## 💰 Cost Optimization

1. **Render Free Tier**: Spins down after 15 minutes of inactivity
2. **Vercel Free Tier**: 100GB bandwidth per month
3. **MongoDB Atlas**: M0 cluster is free with 512MB storage
4. **Upgrade Path**: Consider paid plans for production use

## 🚀 CI/CD Setup

### Auto-deployment from Git
Both platforms support automatic deployment when you push to your repository:

1. **Render**: Auto-deploys from specified branch
2. **Vercel**: Auto-deploys from main/master branch

### Manual Deployment
You can also trigger manual deployments from the respective dashboards.

---

## 📞 Support

If you encounter issues during deployment:
1. Check the platform-specific documentation
2. Review error logs in the respective dashboards
3. Ensure all environment variables are correctly configured
4. Verify that your MongoDB Atlas cluster is accessible
