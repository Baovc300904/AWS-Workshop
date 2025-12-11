#!/bin/bash

# Deploy Frontend to EC2
# Usage: ./deploy-ec2.sh

set -e

echo "🚀 Deploying Frontend to EC2..."

# Configuration
EC2_USER="ubuntu"
EC2_HOST="47.129.108.163"  # Your EC2 public IP
EC2_KEY="D:/AWS/keys/game-store-backend-key.pem"
APP_NAME="game-store-frontend"
REMOTE_DIR="/home/ubuntu/game-store-frontend"

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}📦 Building Frontend...${NC}"
npm run build

if [ ! -d "dist" ]; then
    echo "❌ Build failed - dist directory not found"
    exit 1
fi

echo -e "${GREEN}✅ Build successful${NC}"

echo -e "${BLUE}📤 Uploading to EC2...${NC}"

# Create remote directory if not exists
ssh -i $EC2_KEY $EC2_USER@$EC2_HOST "mkdir -p $REMOTE_DIR"

# Upload dist folder
scp -i $EC2_KEY -r dist/* $EC2_USER@$EC2_HOST:$REMOTE_DIR/

# Upload nginx config
scp -i $EC2_KEY docker/nginx.conf $EC2_USER@$EC2_HOST:$REMOTE_DIR/

echo -e "${BLUE}🔧 Configuring Nginx on EC2...${NC}"

# SSH to EC2 and configure
ssh -i $EC2_KEY $EC2_USER@$EC2_HOST << 'ENDSSH'
    # Install nginx if not installed
    if ! command -v nginx &> /dev/null; then
        echo "Installing Nginx..."
        sudo apt-get update
        sudo apt-get install -y nginx
    fi

    # Copy nginx config
    sudo cp /home/ubuntu/game-store-frontend/nginx.conf /etc/nginx/sites-available/game-store

    # Update nginx config with correct paths
    sudo sed -i 's|/usr/share/nginx/html|/home/ubuntu/game-store-frontend|g' /etc/nginx/sites-available/game-store
    
    # Enable site
    sudo ln -sf /etc/nginx/sites-available/game-store /etc/nginx/sites-enabled/
    sudo rm -f /etc/nginx/sites-enabled/default
    
    # Test nginx config
    sudo nginx -t
    
    # Restart nginx
    sudo systemctl restart nginx
    sudo systemctl enable nginx
    
    echo "✅ Nginx configured and restarted"
ENDSSH

echo -e "${GREEN}✅ Deployment complete!${NC}"
echo -e "${YELLOW}🌐 Frontend is now running at: http://$EC2_HOST${NC}"
echo -e "${YELLOW}📝 Make sure your EC2 Security Group allows inbound traffic on port 80${NC}"
