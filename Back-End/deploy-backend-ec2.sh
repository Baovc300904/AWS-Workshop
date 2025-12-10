#!/bin/bash
# 🚀 Deploy Backend with MoMo Fix to EC2
# This script uploads and restarts backend with correct MoMo URLs

echo "================================================"
echo " 🚀 Deploying Backend to EC2 with MoMo Fix"
echo "================================================"

EC2_USER="ec2-user"
EC2_HOST="13.212.125.86"
BACKEND_DIR="/home/ec2-user/backend"
LOCAL_JAR="target/ShopGameManagement-0.0.1-SNAPSHOT.jar"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo ""
echo "[1/6] Checking local JAR file..."
if [ ! -f "$LOCAL_JAR" ]; then
    echo -e "${RED}❌ JAR file not found: $LOCAL_JAR${NC}"
    echo "   Please run: mvn clean package -DskipTests"
    exit 1
fi
echo -e "${GREEN}✅ JAR file found${NC}"

echo ""
echo "[2/6] Stopping backend service on EC2..."
ssh ${EC2_USER}@${EC2_HOST} << 'EOF'
    # Try systemd service first
    if sudo systemctl status game-store-backend > /dev/null 2>&1; then
        sudo systemctl stop game-store-backend
        echo "   ✅ Systemd service stopped"
    else
        # Kill java process manually
        pkill -f "ShopGameManagement" && echo "   ✅ Java process killed" || echo "   ℹ️  No running process found"
    fi
EOF

echo ""
echo "[3/6] Uploading JAR to EC2..."
scp "$LOCAL_JAR" ${EC2_USER}@${EC2_HOST}:${BACKEND_DIR}/
echo -e "${GREEN}✅ JAR uploaded${NC}"

echo ""
echo "[4/6] Setting up environment variables..."
ssh ${EC2_USER}@${EC2_HOST} << 'EOF'
    # Create .env file for backend
    cat > /home/ec2-user/backend/.env << 'ENVEOF'
# Spring Profile
SPRING_PROFILES_ACTIVE=ec2

# MoMo Payment Configuration
MOMO_PARTNER_CODE=MOMOLRJZ20181206
MOMO_ACCESS_KEY=mTCKt9W3eU1m39TW
MOMO_SECRET_KEY=SetA5RDnLHvt51AULf51DyauxUo3kDU6
MOMO_ENDPOINT=https://test-payment.momo.vn/v2/gateway/api/create
MOMO_REDIRECT_URL=https://www.awstestgamexyz.space/payment/callback
MOMO_IPN_URL=https://www.awstestgamexyz.space/payment/momo/ipn
ENVEOF

    # Add to ~/.bashrc
    grep -q "MOMO_REDIRECT_URL" ~/.bashrc || cat >> ~/.bashrc << 'BASHEOF'

# MoMo Payment URLs
export MOMO_REDIRECT_URL="https://www.awstestgamexyz.space/payment/callback"
export MOMO_IPN_URL="https://www.awstestgamexyz.space/payment/momo/ipn"
BASHEOF

    source ~/.bashrc
    echo "   ✅ Environment variables configured"
EOF

echo ""
echo "[5/6] Creating/Updating systemd service..."
ssh ${EC2_USER}@${EC2_HOST} << 'EOF'
    sudo bash -c 'cat > /etc/systemd/system/game-store-backend.service << "SERVICEEOF"
[Unit]
Description=Game Store Backend Service
After=network.target

[Service]
Type=simple
User=ec2-user
WorkingDirectory=/home/ec2-user/backend
Environment="SPRING_PROFILES_ACTIVE=ec2"
Environment="MOMO_PARTNER_CODE=MOMOLRJZ20181206"
Environment="MOMO_ACCESS_KEY=mTCKt9W3eU1m39TW"
Environment="MOMO_SECRET_KEY=SetA5RDnLHvt51AULf51DyauxUo3kDU6"
Environment="MOMO_ENDPOINT=https://test-payment.momo.vn/v2/gateway/api/create"
Environment="MOMO_REDIRECT_URL=https://www.awstestgamexyz.space/payment/callback"
Environment="MOMO_IPN_URL=https://www.awstestgamexyz.space/payment/momo/ipn"
ExecStart=/usr/bin/java -jar /home/ec2-user/backend/ShopGameManagement-0.0.1-SNAPSHOT.jar
Restart=always
RestartSec=10
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
SERVICEEOF'

    sudo systemctl daemon-reload
    sudo systemctl enable game-store-backend
    echo "   ✅ Systemd service configured"
EOF

echo ""
echo "[6/6] Starting backend service..."
ssh ${EC2_USER}@${EC2_HOST} << 'EOF'
    sudo systemctl start game-store-backend
    sleep 3
    
    if sudo systemctl is-active --quiet game-store-backend; then
        echo "   ✅ Backend service started successfully"
        echo ""
        echo "   Service status:"
        sudo systemctl status game-store-backend --no-pager -l | head -15
    else
        echo "   ❌ Failed to start backend service"
        echo ""
        echo "   Checking logs:"
        sudo journalctl -u game-store-backend -n 50 --no-pager
        exit 1
    fi
EOF

echo ""
echo "================================================"
echo " ✅ Backend Deployment Complete!"
echo "================================================"
echo ""
echo "Backend is now running with:"
echo "  📍 URL: https://www.awstestgamexyz.space"
echo "  🔄 MoMo Redirect: https://www.awstestgamexyz.space/payment/callback"
echo "  📥 MoMo IPN: https://www.awstestgamexyz.space/payment/momo/ipn"
echo ""
echo "Useful commands:"
echo "  View logs:    ssh ${EC2_USER}@${EC2_HOST} 'sudo journalctl -u game-store-backend -f'"
echo "  Restart:      ssh ${EC2_USER}@${EC2_HOST} 'sudo systemctl restart game-store-backend'"
echo "  Stop:         ssh ${EC2_USER}@${EC2_HOST} 'sudo systemctl stop game-store-backend'"
echo "  Status:       ssh ${EC2_USER}@${EC2_HOST} 'sudo systemctl status game-store-backend'"
echo ""
