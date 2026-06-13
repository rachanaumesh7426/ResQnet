@echo off
echo ==================================
echo  ResQNet - Disaster Mgmt System
echo ==================================
echo.
echo Installing backend dependencies...
cd backend
call npm install
echo.
echo Installing frontend dependencies...
cd ../frontend
call npm install
cd ..
echo.
echo ✅ Installation complete!
echo.
echo To start the app:
echo   Terminal 1: cd backend  then  npm run dev
echo   Terminal 2: cd frontend then  npm run dev
echo.
echo Open: http://localhost:5173
pause
