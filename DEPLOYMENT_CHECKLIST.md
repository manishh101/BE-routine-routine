# 🚀 Deployment Checklist

## ✅ Pre-Deployment Requirements

### Prerequisites Completed
- [ ] Vercel account created
- [ ] Render account created
- [ ] MongoDB Atlas cluster running
- [ ] GitHub repository updated with latest code
- [ ] All environment variables identified

## 🔧 Backend Deployment (Render)

### Files Created
- [x] `backend/Dockerfile`
- [x] `backend/healthcheck.js`
- [x] `backend/.env.production.template`
- [x] `render.yaml`
- [x] Updated CORS configuration in `backend/app.js`

### Deployment Steps
- [ ] 1. Go to [Render Dashboard](https://dashboard.render.com)
- [ ] 2. Create new Web Service
- [ ] 3. Connect GitHub repository
- [ ] 4. Configure service settings:
  - Root Directory: `backend`
  - Build Command: `npm install`
  - Start Command: `npm start`
- [ ] 5. Set environment variables:
  ```
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 10000
      - key: MONGODB_URI
        value: mongodb+srv://079bct044manish:routine@routine.mrjj7ho.mongodb.net/bctroutine?retryWrites=true&w=majority&appName=routine
      - key: JWT_SECRET
        value: ASDSHI@!@!BDSHUIfwefwefwe@*!@&^^
      - key: FRONTEND_URL
        value: https://your-frontend-url.vercel.app
      - key: USE_RABBITMQ
        value: false
      - key: CORS_ORIGIN
        value: https://your-frontend-url.vercel.app
  ```
- [ ] 6. Deploy and note the backend URL
- [ ] 7. Test health endpoint: `https://your-app.onrender.com/api/health`

## 🎨 Frontend Deployment (Vercel)

### Files Created
- [x] `frontend/vercel.json`
- [x] `frontend/.env.production`
- [x] `frontend/src/config/environment.js`
- [x] Updated API configuration in `frontend/src/services/api.js`
- [x] Updated Vite config for production builds

### Deployment Steps
- [ ] 1. Update `frontend/vercel.json` with actual backend URL
- [ ] 2. Update `frontend/.env.production` with actual backend URL
- [ ] 3. Go to [Vercel Dashboard](https://vercel.com/dashboard)
- [ ] 4. Import project from GitHub
- [ ] 5. Configure project settings:
  - Framework: Vite
  - Root Directory: `frontend`
  - Build Command: `npm run build`
  - Output Directory: `dist`
- [ ] 6. Set environment variables:
  ```
  VITE_API_BASE_URL=<your-render-backend-url>
  VITE_APP_NAME=BE Routine Management System
  VITE_NODE_ENV=production
  ```
- [ ] 7. Deploy and note the frontend URL

## 🔄 Post-Deployment Updates

### Backend Updates
- [ ] Update `FRONTEND_URL` environment variable in Render with Vercel URL
- [ ] Update `CORS_ORIGIN` environment variable in Render with Vercel URL
- [ ] Redeploy backend if needed

### Frontend Updates
- [ ] Verify `VITE_API_BASE_URL` points to correct Render URL
- [ ] Test API connectivity

## 🧪 Testing & Verification

### Backend Testing
- [ ] Health check endpoint: `GET /api/health`
- [ ] Authentication endpoint: `POST /api/auth/login`
- [ ] CORS headers in browser network tab
- [ ] Check Render service logs for errors

### Frontend Testing
- [ ] Application loads without errors
- [ ] Login functionality works
- [ ] API calls succeed in browser network tab
- [ ] No CORS errors in browser console

### Integration Testing
- [ ] Complete user journey: login → dashboard → routine operations
- [ ] Data persistence between page refreshes
- [ ] Responsive design on mobile/tablet

## 🔐 Security Verification

- [ ] HTTPS enabled on both platforms (automatic)
- [ ] Environment variables not exposed in frontend
- [ ] Strong JWT secret in production
- [ ] CORS properly configured
- [ ] No sensitive data in client-side code

## 📊 Performance Optimization

- [ ] Frontend build size is reasonable
- [ ] Backend cold starts within acceptable limits
- [ ] Database queries optimized
- [ ] Static assets cached properly

## 📞 Monitoring & Maintenance

### Set Up Monitoring
- [ ] Render service monitoring
- [ ] Vercel function monitoring
- [ ] MongoDB Atlas monitoring
- [ ] Set up error alerts

### Documentation Updates
- [ ] Update README.md with deployment URLs
- [ ] Document any production-specific configurations
- [ ] Update API documentation with production endpoints

## 🆘 Troubleshooting Guide

### Common Issues
1. **CORS Errors**: Check origin configuration in backend
2. **API Not Found**: Verify environment variables and URLs
3. **Build Failures**: Check Node.js version compatibility
4. **Database Connection**: Verify MongoDB URI and network access
5. **Authentication Issues**: Check JWT secret consistency

### Support Resources
- [Render Documentation](https://render.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)

## 🎉 Go Live Checklist

- [ ] Backend deployed and healthy
- [ ] Frontend deployed and accessible
- [ ] All environment variables configured
- [ ] Cross-platform communication working
- [ ] Test user accounts created
- [ ] Documentation updated
- [ ] Team notified of new URLs

---

**🚀 Ready for Production!**

Once all items are checked, your BE Routine Management System should be live and accessible to users.

Backend URL: `https://your-app.onrender.com`
Frontend URL: `https://your-app.vercel.app`
