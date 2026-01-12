@echo off
echo ========================================
echo   Todo App - Vercel Deployment Script
echo ========================================
echo.

echo Step 1: Checking Vercel CLI installation...
where vercel >nul 2>&1
if %errorlevel% neq 0 (
    echo Vercel CLI not found. Installing...
    npm install -g vercel
) else (
    echo Vercel CLI is installed.
)
echo.

echo Step 2: Navigating to frontend directory...
cd frontend
echo.

echo Step 3: Installing dependencies...
call npm install
echo.

echo Step 4: Building the application...
call npm run build
echo.

echo Step 5: Deploying to Vercel...
echo.
echo IMPORTANT: You will be prompted to:
echo   1. Login to Vercel (if not already logged in)
echo   2. Confirm project settings
echo   3. Set up environment variables
echo.
echo When prompted for environment variables, add:
echo   NEXT_PUBLIC_API_URL = http://localhost:8001/api/v1
echo.
pause

vercel --prod

echo.
echo ========================================
echo   Deployment Complete!
echo ========================================
echo.
echo Your app should now be live on Vercel.
echo Check the URL provided above.
echo.
pause
