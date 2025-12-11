#!/bin/bash
set -e

BUCKET="game-store-deploy-temp-20251211163207"
REGION="ap-southeast-1"

echo "=== Deploying from S3 ==="

# Stop services
echo "Stopping services..."
sudo systemctl stop game-store-backend 2>/dev/null || true
sudo systemctl stop nginx 2>/dev/null || true

# Download backend
echo "Downloading backend..."
cd ~
aws s3 cp s3://$BUCKET/backend.jar ./ShopGameManagement-0.0.1-SNAPSHOT.jar --region $REGION

# Download frontend
echo "Downloading frontend..."
aws s3 cp s3://$BUCKET/frontend-dist.zip ./frontend-dist.zip --region $REGION
sudo rm -rf /var/www/game-store/*
sudo unzip -o frontend-dist.zip -d /var/www/game-store/
sudo chown -R www-data:www-data /var/www/game-store/

# Start services
echo "Starting services..."
sudo systemctl start nginx
sudo systemctl restart game-store-backend

echo "=== Deploy complete! ==="
echo "Backend: http://18.143.195.172:8080"
echo "Frontend: http://18.143.195.172"
