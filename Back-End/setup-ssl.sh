#!/bin/bash
# Setup SSL for keygamezspace.space

DOMAIN="keygamezspace.space"
WWW_DOMAIN="www.keygamezspace.space"
EMAIL="your-email@example.com"  # Thay bằng email thật

echo "🔐 Setting up SSL for $DOMAIN..."

# Install certbot if not exists
if ! command -v certbot &> /dev/null; then
    echo "Installing certbot..."
    sudo yum install -y certbot python3-certbot-nginx
fi

# Stop nginx temporarily
sudo systemctl stop nginx

# Get SSL certificate
sudo certbot certonly --standalone \
    -d $DOMAIN \
    -d $WWW_DOMAIN \
    --email $EMAIL \
    --agree-tos \
    --no-eff-email \
    --non-interactive

# Create HTTPS nginx config
sudo cat > /etc/nginx/conf.d/game-store.conf << 'EOF'
# HTTP to HTTPS redirect
server {
    listen 80;
    listen [::]:80;
    server_name keygamezspace.space www.keygamezspace.space;
    return 301 https://keygamezspace.space$request_uri;
}

# HTTPS Server
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name keygamezspace.space www.keygamezspace.space;

    ssl_certificate /etc/letsencrypt/live/keygamezspace.space/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/keygamezspace.space/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    root /home/ec2-user/frontend;
    index index.html;

    # Backend API - /identity
    location /identity/ {
        proxy_pass http://localhost:8080/identity/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-Host $host;
        proxy_connect_timeout 75s;
        proxy_read_timeout 300s;
        proxy_send_timeout 300s;
    }

    # Backend API - /api (alias for /identity)
    location /api/ {
        proxy_pass http://localhost:8080/identity/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_connect_timeout 75s;
        proxy_read_timeout 300s;
    }

    # Static assets with caching
    location ^~ /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # HTML files - no cache
    location ~* \.html$ {
        add_header Cache-Control "no-store, no-cache, must-revalidate";
        expires off;
    }

    # SPA fallback - MUST BE LAST
    location / {
        try_files $uri $uri/ /index.html;
    }
}
EOF

# Test and reload nginx
sudo nginx -t && sudo systemctl start nginx

# Setup auto-renewal
echo "Setting up SSL auto-renewal..."
sudo systemctl enable certbot-renew.timer
sudo systemctl start certbot-renew.timer

echo "✅ SSL setup complete!"
echo "Domain: https://keygamezspace.space"
