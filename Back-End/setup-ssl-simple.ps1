# Setup SSL for keygamezspace.space
$ErrorActionPreference = "Stop"

$EC2_USER = "ec2-user"
$EC2_HOST = "13.212.125.86"
$SSH_KEY = "D:\AWS\keys\game-store-backend-key.pem"
$DOMAIN = "keygamezspace.space"
$EMAIL = "huynhvuminhkhoi157@gmail.com"

Write-Host "🔐 Setting up SSL for $DOMAIN..." -ForegroundColor Cyan
Write-Host ""

# Upload SSL setup script
Write-Host "[1/4] Uploading SSL setup script..." -ForegroundColor Yellow
& scp -i "$SSH_KEY" "setup-ssl.sh" "${EC2_USER}@${EC2_HOST}:/tmp/"

Write-Host "[2/4] Installing certbot..." -ForegroundColor Yellow
& ssh -i "$SSH_KEY" "${EC2_USER}@${EC2_HOST}" "sudo yum install -y certbot python3-certbot-nginx"

Write-Host "[3/4] Getting SSL certificate..." -ForegroundColor Yellow
& ssh -i "$SSH_KEY" "${EC2_USER}@${EC2_HOST}" "sudo systemctl stop nginx; sudo certbot certonly --standalone -d $DOMAIN -d www.$DOMAIN --email $EMAIL --agree-tos --no-eff-email --non-interactive"

Write-Host "[4/4] Configuring nginx with HTTPS..." -ForegroundColor Yellow
$nginxConfig = @'
# HTTP to HTTPS redirect
server {
    listen 80;
    server_name keygamezspace.space www.keygamezspace.space;
    return 301 https://keygamezspace.space$request_uri;
}

# HTTPS Server
server {
    listen 443 ssl http2;
    server_name keygamezspace.space www.keygamezspace.space;

    ssl_certificate /etc/letsencrypt/live/keygamezspace.space/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/keygamezspace.space/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    root /home/ec2-user/frontend;
    index index.html;

    location /identity/ {
        proxy_pass http://localhost:8080/identity/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_connect_timeout 75s;
        proxy_read_timeout 300s;
    }

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

    location ^~ /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    location ~* \.html$ {
        add_header Cache-Control "no-store, no-cache, must-revalidate";
        expires off;
    }

    location / {
        try_files $uri $uri/ /index.html;
    }
}
'@

$tempFile = [System.IO.Path]::GetTempFileName()
$nginxConfig | Out-File -FilePath $tempFile -Encoding ASCII -NoNewline

& scp -i "$SSH_KEY" $tempFile "${EC2_USER}@${EC2_HOST}:/tmp/nginx-https.conf"
& ssh -i "$SSH_KEY" "${EC2_USER}@${EC2_HOST}" "sudo mv /tmp/nginx-https.conf /etc/nginx/conf.d/game-store.conf; sudo nginx -t; sudo systemctl start nginx"

Remove-Item $tempFile

Write-Host ""
Write-Host "✅ SSL Setup Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Website: https://keygamezspace.space" -ForegroundColor Cyan
Write-Host ""
