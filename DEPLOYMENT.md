# Deployment Guide - Phase II Todo App

## Overview
This is a monorepo containing both frontend (Next.js) and backend (FastAPI) applications.

## Vercel Deployment (Frontend Only)

### Prerequisites
- Vercel account connected to your GitHub repository
- Environment variables configured in Vercel dashboard

### Configuration Files
- `vercel.json` - Tells Vercel to deploy the frontend subdirectory
- `frontend/next.config.js` - Next.js configuration with environment variables

### Environment Variables for Vercel
Add these in your Vercel project settings:

```
NEXT_PUBLIC_API_URL=https://your-backend-api-url.com/api/v1
```

**Important:** Replace `your-backend-api-url.com` with your actual backend deployment URL.

### Deployment Steps

#### Option 1: Automatic Deployment (Recommended)
1. Push your code to GitHub
2. Go to [Vercel Dashboard](https://vercel.com/dashboard)
3. Click "Add New Project"
4. Import your GitHub repository
5. Vercel will auto-detect the `vercel.json` configuration
6. Add environment variables in the project settings
7. Click "Deploy"

#### Option 2: Manual Deployment via CLI
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy from project root
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? Select your account
# - Link to existing project? No (first time) or Yes (subsequent)
# - What's your project's name? todo-app-phase-ii
# - In which directory is your code located? ./
```

### Troubleshooting Vercel 404 Errors

**Issue:** 404 Page Not Found on Vercel

**Common Causes:**
1. **Wrong Root Directory**: Vercel is looking in the wrong folder
   - **Fix**: Ensure `vercel.json` has `"rootDirectory": "frontend"`

2. **Build Failure**: The build process failed
   - **Fix**: Check Vercel build logs for errors
   - Run `cd frontend && npm run build` locally to test

3. **Missing Environment Variables**: API URL not configured
   - **Fix**: Add `NEXT_PUBLIC_API_URL` in Vercel project settings

4. **Incorrect Framework Detection**: Vercel didn't detect Next.js
   - **Fix**: Ensure `"framework": "nextjs"` is in `vercel.json`

### Vercel Build Logs
If deployment fails, check the build logs:
1. Go to your Vercel project dashboard
2. Click on the failed deployment
3. View the "Building" tab for error messages

## GitHub Pages Deployment (Static Export)

**Note:** GitHub Pages only supports static sites. For full Next.js features (SSR, API routes), use Vercel instead.

### For Static Export to GitHub Pages:

1. Update `frontend/next.config.js`:
```javascript
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: '/hackathonII_phase_II',
  assetPrefix: '/hackathonII_phase_II/',
}
```

2. Build static export:
```bash
cd frontend
npm run build
```

3. Deploy to GitHub Pages:
```bash
# Create gh-pages branch
git checkout -b gh-pages

# Copy build output
cp -r frontend/out/* .

# Commit and push
git add .
git commit -m "Deploy to GitHub Pages"
git push origin gh-pages
```

4. Enable GitHub Pages:
   - Go to repository Settings > Pages
   - Source: Deploy from branch
   - Branch: gh-pages
   - Folder: / (root)

### Troubleshooting GitHub 404 Errors

**Issue:** 404 on GitHub Pages

**Common Causes:**
1. **GitHub Pages Not Enabled**
   - **Fix**: Enable in repository Settings > Pages

2. **Wrong Branch Selected**
   - **Fix**: Ensure gh-pages branch is selected as source

3. **Missing index.html**
   - **Fix**: Ensure `frontend/out/index.html` exists after build

4. **Incorrect basePath**
   - **Fix**: Set `basePath` to match your repository name

## Backend Deployment

The backend (FastAPI) needs separate deployment. Options:

### Railway
1. Go to [Railway](https://railway.app)
2. Create new project from GitHub repo
3. Select the `backend` directory
4. Add environment variables:
   ```
   DATABASE_URL=your-postgresql-url
   ENVIRONMENT=production
   CORS_ORIGINS=https://your-frontend-url.vercel.app
   ```

### Render
1. Go to [Render](https://render.com)
2. Create new Web Service
3. Connect GitHub repository
4. Root Directory: `backend`
5. Build Command: `pip install -r requirements.txt`
6. Start Command: `uvicorn src.main:app --host 0.0.0.0 --port $PORT`

### Heroku
```bash
# From backend directory
heroku create your-app-name
heroku addons:create heroku-postgresql:hobby-dev
git subtree push --prefix backend heroku main
```

## Full Stack Deployment Checklist

- [ ] Backend deployed and accessible
- [ ] Database (PostgreSQL) provisioned
- [ ] Backend environment variables configured
- [ ] Backend CORS configured with frontend URL
- [ ] Frontend deployed to Vercel
- [ ] Frontend environment variable points to backend URL
- [ ] Test API connectivity from frontend
- [ ] Test CRUD operations
- [ ] Verify search, filter, and sort functionality

## Testing Deployment

### Test Backend
```bash
curl https://your-backend-url.com/api/v1/health
# Should return: {"status":"healthy","timestamp":"..."}
```

### Test Frontend
1. Open https://your-frontend-url.vercel.app
2. Check browser console for errors
3. Try creating a todo
4. Verify todos load correctly

## Common Issues and Solutions

### CORS Errors
**Symptom:** "Access to fetch blocked by CORS policy"
**Solution:** Add frontend URL to backend CORS_ORIGINS environment variable

### API Connection Failed
**Symptom:** "Failed to fetch todos: Not Found"
**Solution:** Verify NEXT_PUBLIC_API_URL is correct in Vercel settings

### Build Failures
**Symptom:** Vercel build fails
**Solution:**
1. Check build logs for specific errors
2. Test build locally: `cd frontend && npm run build`
3. Ensure all dependencies are in package.json

### Environment Variables Not Working
**Symptom:** API calls go to localhost instead of production
**Solution:**
1. Ensure variable starts with `NEXT_PUBLIC_`
2. Redeploy after adding environment variables
3. Clear Vercel cache and redeploy

## Support

If you continue to experience 404 errors:
1. Check Vercel deployment logs
2. Verify `vercel.json` configuration
3. Ensure GitHub repository is public (for GitHub Pages)
4. Test build locally before deploying

## Quick Fix Commands

```bash
# Rebuild and redeploy to Vercel
cd frontend
npm run build
vercel --prod

# Check if build works locally
cd frontend
npm run build
npm start
# Open http://localhost:3000

# Force Vercel to rebuild
vercel --force
```
