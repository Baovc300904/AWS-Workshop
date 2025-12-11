# Game Store Backend - Setup Instructions

## Sensitive Files Configuration

This repository uses `.gitignore` to protect sensitive credentials. You need to create these files locally:

### 1. Application Configuration

Copy the example file and fill in your actual credentials:

```bash
cd Back-End/src/main/resources
cp application-ec2.yaml.example application-ec2.yaml
```

Then edit `application-ec2.yaml` with your:
- RDS database endpoint, username, password
- JWT secret key
- MoMo payment credentials (partner code, access key, secret key)
- Google OAuth credentials (client ID, client secret)
- AWS S3 bucket name

### 2. Environment Variables (Optional)

```bash
cp .env.example .env
```

### 3. SSH Keys

Place your EC2 SSH key (`.pem` file) in a secure location outside this repository.

Example:
```
D:\AWS\keys\your-key.pem
```

### 4. Nginx Configuration

Create `Back-End/nginx-game-store.conf` for your domain:

```nginx
server {
    listen 443 ssl;
    server_name YOUR_DOMAIN;

    ssl_certificate /etc/letsencrypt/live/YOUR_DOMAIN/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/YOUR_DOMAIN/privkey.pem;

    location /api/ {
        proxy_pass http://localhost:8080/identity/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
    }
}
```

## Files Protected by .gitignore

The following files contain sensitive data and are NOT committed:

- `*.pem` - SSH keys
- `application-ec2.yaml` - Database & API credentials
- `application-docker.yaml` - Docker configs
- `application-test.yaml` - Test configs
- `.env*` - Environment variables
- `nginx*.conf` - Domain & SSL configs
- `*.service` - Systemd service files
- `*-data.sql` - Database dumps with data

## Deployment

See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for full deployment instructions.
