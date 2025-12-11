# Setup Nginx after uploading files via WinSCP
# Run this AFTER you've uploaded dist files and nginx.conf

param(
    [string]$EC2Host = "47.129.108.163"
)

Write-Host "=" -ForegroundColor Cyan
Write-Host "🔧 Setup Nginx on EC2" -ForegroundColor Cyan
Write-Host "=" -ForegroundColor Cyan

# NOTE: Run these commands manually via WinSCP terminal or SSH:
$commands = @"

# Install nginx
sudo apt-get update && sudo apt-get install -y nginx

# Copy nginx config
sudo cp /home/ubuntu/game-store-frontend/nginx.conf /etc/nginx/sites-available/game-store

# Update paths
sudo sed -i 's|/usr/share/nginx/html|/home/ubuntu/game-store-frontend|g' /etc/nginx/sites-available/game-store

# Enable site
sudo ln -sf /etc/nginx/sites-available/game-store /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Fix permissions
sudo chown -R www-data:www-data /home/ubuntu/game-store-frontend
sudo chmod -R 755 /home/ubuntu/game-store-frontend

# Test and restart
sudo nginx -t && sudo systemctl restart nginx && sudo systemctl enable nginx

echo "✅ Nginx setup complete!"

"@

Write-Host "`n📋 Copy these commands and run on EC2:" -ForegroundColor Yellow
Write-Host $commands -ForegroundColor White

Write-Host "`n🔍 Or connect via SSH and run:" -ForegroundColor Yellow
Write-Host "ssh -i D:\AWS\keys\game-store-backend-key.pem ubuntu@$EC2Host" -ForegroundColor Cyan

Write-Host "`n📝 Instructions:" -ForegroundColor Green
Write-Host "1. Upload files via WinSCP first" -ForegroundColor White
Write-Host "2. Open terminal in WinSCP (Ctrl+T)" -ForegroundColor White
Write-Host "3. Paste and run the commands above" -ForegroundColor White
Write-Host "4. Visit: http://$EC2Host" -ForegroundColor White
