#!/bin/bash

# Fix MoMo redirect URLs for EC2 deployment
# This script updates the environment variables for MoMo configuration

echo "================================================"
echo " Fixing MoMo Configuration for EC2 Deployment"
echo "================================================"

# Define the correct URLs
DOMAIN="www.awstestgamexyz.space"
MOMO_REDIRECT_URL="https://${DOMAIN}/checkout/momo-callback"
MOMO_IPN_URL="https://${DOMAIN}/payment/momo/ipn"

echo ""
echo "Setting MoMo URLs:"
echo "  REDIRECT: ${MOMO_REDIRECT_URL}"
echo "  IPN:      ${MOMO_IPN_URL}"
echo ""

# Update /etc/environment
echo "[1/4] Updating /etc/environment..."
sudo bash -c "cat >> /etc/environment << EOF

# MoMo Payment Configuration
export MOMO_REDIRECT_URL=\"${MOMO_REDIRECT_URL}\"
export MOMO_IPN_URL=\"${MOMO_IPN_URL}\"
EOF"

# Update ~/.bashrc for ec2-user
echo "[2/4] Updating ~/.bashrc..."
cat >> ~/.bashrc << EOF

# MoMo Payment Configuration  
export MOMO_REDIRECT_URL="${MOMO_REDIRECT_URL}"
export MOMO_IPN_URL="${MOMO_IPN_URL}"
EOF

# Update systemd service file if exists
SERVICE_FILE="/etc/systemd/system/game-store-backend.service"
if [ -f "$SERVICE_FILE" ]; then
    echo "[3/4] Updating systemd service..."
    
    # Backup original service file
    sudo cp "$SERVICE_FILE" "${SERVICE_FILE}.backup"
    
    # Add environment variables to service file
    sudo bash -c "cat > ${SERVICE_FILE} << 'EOF'
[Unit]
Description=Game Store Backend Service
After=network.target

[Service]
Type=simple
User=ec2-user
WorkingDirectory=/home/ec2-user/backend
Environment=\"SPRING_PROFILES_ACTIVE=ec2\"
Environment=\"MOMO_REDIRECT_URL=${MOMO_REDIRECT_URL}\"
Environment=\"MOMO_IPN_URL=${MOMO_IPN_URL}\"
ExecStart=/usr/bin/java -jar /home/ec2-user/backend/ShopGameManagement-0.0.1-SNAPSHOT.jar
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF"
    
    sudo systemctl daemon-reload
    echo "   - Service file updated and daemon reloaded"
else
    echo "[3/4] Systemd service not found, skipping..."
fi

# Restart backend service
echo "[4/4] Restarting backend service..."
if sudo systemctl restart game-store-backend 2>/dev/null; then
    echo "   - Backend service restarted successfully"
    sleep 3
    sudo systemctl status game-store-backend --no-pager
else
    echo "   - Service restart failed or service doesn't exist"
    echo "   - You may need to restart manually"
fi

echo ""
echo "================================================"
echo " Configuration Complete!"
echo "================================================"
echo ""
echo "MoMo URLs have been set to:"
echo "  REDIRECT: ${MOMO_REDIRECT_URL}"
echo "  IPN:      ${MOMO_IPN_URL}"
echo ""
echo "Next steps:"
echo "  1. Verify backend is running: sudo systemctl status game-store-backend"
echo "  2. Test MoMo payment flow"
echo "  3. Check logs: sudo journalctl -u game-store-backend -f"
echo ""
