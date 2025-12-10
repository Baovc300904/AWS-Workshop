# GitHub Actions Setup Guide

## Required Secrets

Để sử dụng GitHub Actions tự động deploy lên EC2, bạn cần thêm các secrets sau vào repository:

### 1. Vào GitHub Repository Settings
`Repository > Settings > Secrets and variables > Actions > New repository secret`

### 2. Thêm các secrets sau:

#### EC2_HOST
- **Description**: Public IP hoặc DNS của EC2 instance
- **Value**: `13.250.xxx.xxx` hoặc `ec2-xxx.ap-southeast-1.compute.amazonaws.com`

#### EC2_SSH_KEY
- **Description**: Nội dung của file .pem key
- **Value**: Copy toàn bộ nội dung file .pem (bao gồm BEGIN và END)
```
-----BEGIN RSA PRIVATE KEY-----
MIIEpAIBAAKCAQEA...
...
-----END RSA PRIVATE KEY-----
```

#### AWS_ACCESS_KEY_ID
- **Description**: AWS Access Key ID
- **Value**: `AKIA26EAZOGCRCQED7CK`

#### AWS_SECRET_ACCESS_KEY
- **Description**: AWS Secret Access Key
- **Value**: `your-secret-key`

## Các secrets khác (optional, nếu chưa có trong .env trên EC2)

#### DB_PASSWORD
- **Value**: RDS database password

#### JWT_SIGNER_KEY
- **Value**: JWT signing key

#### GOOGLE_CLIENT_ID & GOOGLE_CLIENT_SECRET
- **Value**: Google OAuth credentials

## Trigger Deployment

### Automatic (khi push code)
```bash
git add .
git commit -m "Deploy to EC2"
git push origin main
```

### Manual (từ GitHub Actions tab)
1. Vào repository > Actions
2. Chọn workflow "Deploy to EC2"
3. Click "Run workflow"
4. Select branch và click "Run workflow"

## View Logs

1. Vào repository > Actions
2. Click vào workflow run
3. Click vào job "build-and-deploy"
4. Xem từng step

## Rollback (nếu deploy bị lỗi)

```bash
# SSH vào EC2
ssh -i your-key.pem ec2-user@your-ec2-ip

# Restore backup JAR
cd /home/ec2-user/game-store-backend
mv ShopGameManagement-0.0.1-SNAPSHOT.jar.backup ShopGameManagement-0.0.1-SNAPSHOT.jar

# Restart service
sudo systemctl restart game-store-backend
```

