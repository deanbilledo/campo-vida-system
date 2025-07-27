# Campo Vida - Start ngrok tunnels for public access
Write-Host "🌿 Starting Campo Vida ngrok tunnels..." -ForegroundColor Green

# Start backend tunnel (port 5000)
Write-Host "Starting backend tunnel on port 5000..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "ngrok http 5000 --log=stdout"

# Wait a bit for backend tunnel to start
Start-Sleep -Seconds 3

# Start frontend tunnel (port 3000)
Write-Host "Starting frontend tunnel on port 3000..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "ngrok http 3000 --log=stdout"

Write-Host "✅ Both ngrok tunnels starting!" -ForegroundColor Green
Write-Host "Check the ngrok windows for your public URLs" -ForegroundColor Cyan
Write-Host "You'll need to update the frontend .env file with the backend URL" -ForegroundColor Yellow
