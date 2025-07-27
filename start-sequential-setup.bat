@echo off
echo =====================================
echo   Campo Vida - Sequential Setup
echo =====================================
echo.
echo STEP 1: Starting Backend Tunnel (Port 5000)
echo Make sure your backend is running on port 5000
echo.
echo After you get the backend URL:
echo 1. Copy the HTTPS URL (like https://abc123.ngrok-free.app)
echo 2. Press Ctrl+C to stop this tunnel
echo 3. Update frontend .env file with the backend URL
echo 4. Run start-frontend-ngrok.bat for frontend tunnel
echo.
pause
cd /d "C:\Users\deanr\AppData\Roaming\npm\node_modules\ngrok\bin"
echo Starting backend ngrok tunnel...
ngrok.exe http 5000
