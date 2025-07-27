@echo off
echo =====================================
echo   Campo Vida - Frontend Tunnel
echo =====================================
echo.
echo STEP 2: Starting Frontend Tunnel (Port 3000)
echo Make sure your frontend is running on port 3000
echo.
echo After you get the frontend URL:
echo 1. Copy the HTTPS URL (like https://def456.ngrok-free.app)
echo 2. Share this URL with your friends!
echo.
pause
cd /d "C:\Users\deanr\AppData\Roaming\npm\node_modules\ngrok\bin"
echo Starting frontend ngrok tunnel...
ngrok.exe http 3000
pause
