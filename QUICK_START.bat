@echo off
REM QUICK_START.bat - One-command setup for College Portal (Windows)

echo 🎓 College Portal - Quick Setup
echo ================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js is not installed. Please install Node.js 16+ from https://nodejs.org
    exit /b 1
)

for /f "tokens=*" %%i in ('node -v') do set NODE_VERSION=%%i
echo ✓ Node.js version: %NODE_VERSION%
echo.

REM Create .env file if it doesn't exist
if not exist .env (
    echo 📝 Creating .env file...
    copy .env.example .env
    echo.
    echo ⚠️  Please update .env with your MongoDB Atlas connection string
    echo    Open .env and replace MONGODB_URI with your actual connection string
    echo.
    echo    Steps:
    echo    1. Go to https://www.mongodb.com/cloud/atlas
    echo    2. Create a free cluster
    echo    3. Get your connection string
    echo    4. Add it to .env as MONGODB_URI
    echo.
    pause
)

REM Install dependencies
echo 📦 Installing dependencies...
call npm install

echo.
echo ✅ Setup complete!
echo.
echo 🚀 Next steps:
echo    1. Update MongoDB connection in .env file
echo    2. Run: npm run seed (to add sample data^)
echo    3. Run: npm run dev (to start server^)
echo.
echo 📊 Server will run on: http://localhost:5000
echo.
pause
