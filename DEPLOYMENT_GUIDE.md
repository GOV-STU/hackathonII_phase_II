# Deployment Guide - Todo App with Authentication

## Overview

This guide covers deploying your full-stack Todo application with authentication to production.

**Architecture:**
- **Frontend**: Next.js → Deploy to Vercel
- **Backend**: FastAPI → Deploy to Railway/Render/Heroku
- **Database**: PostgreSQL → Neon (already configured)

---

## Part 1: Deploy Frontend to Vercel

### Step 1: Push Code to GitHub (✅ COMPLETED)

Your code is now on GitHub at:
```
https://github.com/GOV-STU/hackathonII_phase_II
Branch: 001-todo-app
```

### Step 2: Import Project to Vercel

1. **Go to Vercel Dashboard**
   - Visit: https://vercel.com/dashboard
   - Click **"Add New..."** → **"Project"**

2. **Import Git Repository**
   - Click **"Import Git Repository"**
   - Select **"GOV-STU/hackathonII_phase_II"**
   - Click **"Import"**

3. **Configure Project Settings**

   **Framework Preset**: Next.js

   **Root Directory**: `frontend` (IMPORTANT!)
   - Click **"Edit"** next to Root Directory
   - Select `frontend` folder
   - This tells Vercel to deploy only the frontend from your monorepo

   **Build Settings** (Auto-detected):
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

4. **Environment Variables**

   Click **"Environment Variables"** and add:

   | Name | Value |
   |------|-------|
   | `NEXT_PUBLIC_API_URL` | `https://your-backend-url.com/api/v1` |

   **Note**: You'll update this after deploying the backend (Part 2)

5. **Deploy**
   - Click **"Deploy"**
   - Wait 2-3 minutes for deployment to complete
   - You'll get a URL like: `https://your-project.vercel.app`

---

## Part 2: Deploy Backend (Choose One Option)

### Option A: Railway (Recommended - Free Tier)

1. **Sign up at Railway**
   - Visit: https://railway.app
   - Sign up with GitHub

2. **Create New Project**
   - Click **"New Project"**
   - Select **"Deploy from GitHub repo"**
   - Choose **"GOV-STU/hackathonII_phase_II"**

3. **Configure Service**
   - **Root Directory**: `backend`
   - **Start Command**: `uvicorn src.main:app --host 0.0.0.0 --port $PORT`
   - **Build Command**: `pip install -r requirements.txt`

4. **Add Environment Variables**
   ```
   DATABASE_URL=your_neon_postgres_url
   ENVIRONMENT=production
   CORS_ORIGINS=https://your-vercel-app.vercel.app
   ```

5. **Deploy**
   - Railway will auto-deploy
   - Copy your Railway URL (e.g., `https://your-app.railway.app`)

6. **Update Vercel Environment Variable**
   - Go back to Vercel Dashboard
   - Project Settings → Environment Variables
   - Update `NEXT_PUBLIC_API_URL` to: `https://your-app.railway.app/api/v1`
   - Redeploy frontend

### Option B: Render (Free Tier)

1. **Sign up at Render**
   - Visit: https://render.com
   - Sign up with GitHub

2. **Create Web Service**
   - Click **"New +"** → **"Web Service"**
   - Connect **"GOV-STU/hackathonII_phase_II"**

3. **Configure Service**
   - **Name**: `todo-app-backend`
   - **Root Directory**: `backend`
   - **Runtime**: Python 3
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn src.main:app --host 0.0.0.0 --port $PORT`

4. **Add Environment Variables**
   ```
   DATABASE_URL=your_neon_postgres_url
   ENVIRONMENT=production
   CORS_ORIGINS=https://your-vercel-app.vercel.app
   ```

5. **Deploy**
   - Click **"Create Web Service"**
   - Copy your Render URL

6. **Update Vercel**
   - Update `NEXT_PUBLIC_API_URL` in Vercel
   - Redeploy

### Option C: Heroku (Paid)

1. **Install Heroku CLI**
   ```bash
   # Download from: https://devcenter.heroku.com/articles/heroku-cli
   ```

2. **Login and Create App**
   ```bash
   heroku login
   heroku create todo-app-backend
   ```

3. **Deploy Backend**
   ```bash
   cd backend
   git init
   git add .
   git commit -m "Deploy backend"
   heroku git:remote -a todo-app-backend
   git push heroku main
   ```

4. **Set Environment Variables**
   ```bash
   heroku config:set DATABASE_URL=your_neon_postgres_url
   heroku config:set ENVIRONMENT=production
   heroku config:set CORS_ORIGINS=https://your-vercel-app.vercel.app
   ```

---

## Part 3: Update CORS Configuration

After deploying both frontend and backend, update the backend CORS settings:

**File**: `backend/src/config.py`

```python
cors_origins: str = Field(
    default="https://your-vercel-app.vercel.app",
    env="CORS_ORIGINS"
)
```

Or set via environment variable on your backend hosting platform.

---

## Part 4: Test Deployment

1. **Visit Your Vercel URL**
   ```
   https://your-project.vercel.app
   ```

2. **Test Authentication**
   - Sign up with a new account
   - Log in
   - Create todos
   - Test all features

3. **Check Browser Console**
   - Press F12 → Console
   - Verify no CORS errors
   - Verify API calls succeed

---

## Troubleshooting

### Issue: "Failed to fetch" on Vercel

**Solution**: Check environment variables
- Verify `NEXT_PUBLIC_API_URL` is set correctly
- Must include `/api/v1` at the end
- Must be HTTPS (not HTTP)

### Issue: CORS Error

**Solution**: Update backend CORS_ORIGINS
- Add your Vercel URL to CORS_ORIGINS
- Redeploy backend
- Format: `https://your-app.vercel.app` (no trailing slash)

### Issue: 404 on API Calls

**Solution**: Check API URL
- Verify backend is deployed and running
- Test backend directly: `https://your-backend.com/health`
- Ensure `/api/v1` is included in NEXT_PUBLIC_API_URL

### Issue: Database Connection Error

**Solution**: Check DATABASE_URL
- Verify Neon connection string is correct
- Ensure backend has DATABASE_URL environment variable
- Test connection from backend logs

---

## Environment Variables Summary

### Frontend (Vercel)
```
NEXT_PUBLIC_API_URL=https://your-backend-url.com/api/v1
```

### Backend (Railway/Render/Heroku)
```
DATABASE_URL=postgresql://user:pass@host/db
ENVIRONMENT=production
CORS_ORIGINS=https://your-vercel-app.vercel.app
LOG_LEVEL=INFO
```

---

## Deployment Checklist

- [x] Code pushed to GitHub
- [ ] Frontend deployed to Vercel
- [ ] Backend deployed to Railway/Render/Heroku
- [ ] Environment variables configured
- [ ] CORS settings updated
- [ ] Database connected
- [ ] Authentication tested
- [ ] All features working

---

## Quick Deploy Commands

### Update and Redeploy
```bash
# Make changes
git add .
git commit -m "Your changes"
git push origin 001-todo-app

# Vercel auto-deploys from GitHub
# Railway/Render auto-deploy from GitHub
```

### Manual Vercel Deploy
```bash
npm install -g vercel
cd frontend
vercel --prod
```

---

## Production URLs

After deployment, update this section:

- **Frontend**: https://your-project.vercel.app
- **Backend**: https://your-backend.railway.app
- **Database**: Neon PostgreSQL (already configured)

---

## Support

If you encounter issues:
1. Check Vercel deployment logs
2. Check backend hosting logs
3. Verify environment variables
4. Test API endpoints directly
5. Check browser console for errors

---

**Your application is ready for deployment!** Follow the steps above to get your authenticated todo app live on the internet.
