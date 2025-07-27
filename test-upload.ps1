# PowerShell script to test file upload
# First, create a simple test image file
$testImageContent = @"
iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==
"@

# Create a simple 1x1 pixel PNG as base64
$bytes = [Convert]::FromBase64String($testImageContent)
[System.IO.File]::WriteAllBytes("$PWD\test-image.png", $bytes)

# Test the upload endpoint with Invoke-WebRequest (PowerShell's curl equivalent)
try {
    Write-Host "Testing file upload..."
    
    # You'll need a valid JWT token for this to work
    # For testing, you can get one by logging into the admin panel and checking the browser's local storage
    $token = "YOUR_JWT_TOKEN_HERE"
    
    $headers = @{
        "Authorization" = "Bearer $token"
    }
    
    $filePath = "$PWD\test-image.png"
    
    if (Test-Path $filePath) {
        $response = Invoke-WebRequest -Uri "http://localhost:5000/api/upload/product" `
                                    -Method POST `
                                    -Headers $headers `
                                    -InFile $filePath `
                                    -ContentType "multipart/form-data"
        
        Write-Host "Upload successful!"
        Write-Host $response.Content
    } else {
        Write-Host "Test image file not found: $filePath"
    }
} catch {
    Write-Host "Upload failed: $($_.Exception.Message)"
    Write-Host "Response: $($_.Exception.Response)"
}

# Clean up test file
if (Test-Path "$PWD\test-image.png") {
    Remove-Item "$PWD\test-image.png"
}
