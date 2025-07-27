@echo off
echo =================================
echo   Campo Vida - Start Backend Only
echo =================================
echo.
echo This will start ONLY the backend ngrok tunnel
echo Make sure your backend is running on port 5000
echo.
pause
cd /d "C:\Users\deanr\AppData\Roaming\npm\node_modules\ngrok\bin"
ngrok.exe http 5000
pause
