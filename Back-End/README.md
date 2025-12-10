# 🎮 Game Store Management Backend

Spring Boot REST API for game store management system with AWS cloud services integration.

## 📋 Overview

Full-featured e-commerce backend for game store with:
- User authentication & authorization (JWT + OAuth2 Google)
- Role-based access control (ADMIN, USER)
- Game & Category management with image storage
- Shopping cart & order management
- Email OTP verification
- Payment integration (MoMo)

## 🛠 Tech Stack

- **Framework:** Spring Boot 3.5.5
- **Java:** 21
- **Database:** MySQL 9.4
- **AWS Services:** RDS, S3, SES
- **Authentication:** JWT + Google OAuth2
- **Payment:** MoMo Gateway

## 🚀 Quick Start

### Prerequisites
- Java 21+
- Maven 3.9+
- MySQL 9.4+ or AWS RDS
- AWS Account (for S3, SES, RDS)

### Local Development

1. **Clone the repository**
```bash
git clone <your-repo>
cd Back-End
```

2. **Configure environment**
```bash
# Copy and edit the environment file
cp .env.example .env.aws
# Edit .env.aws with your actual credentials
```

3. **Run with Maven**
```bash
# Development mode (local MySQL)
./mvnw spring-boot:run

# With AWS services
./mvnw spring-boot:run -Dspring-boot.run.profiles=aws
```

4. **Run with Docker**
```bash
docker-compose up -d
```

The API will be available at: `http://localhost:8080/identity`

### Docker Deployment

```bash
# Build and run with docker-compose
docker-compose up -d

# View logs
docker-compose logs -f app

# Stop containers
docker-compose down
```

## 🌐 EC2 Deployment

### Instance Information
- **Public IP:** 47.129.108.163
- **Region:** ap-southeast-1 (Singapore)
- **Instance Type:** t3.medium
- **API Endpoint:** http://47.129.108.163:8080/identity

### Quick Start

⚠️ **First Time Setup:** Read [SETUP-BEFORE-DEPLOY.md](./SETUP-BEFORE-DEPLOY.md) first!

### Deploy to EC2

**Prerequisites:**
1. Place your `D:\AWS\keys\game-store-backend-key.pem` key file in the project root
2. Configure `.env.aws` with your AWS credentials
3. Ensure EC2 security group allows:
   - SSH (port 22) from your IP
   - HTTP (port 8080) from anywhere
4. Ensure RDS security group allows EC2 connection

**Check Connection:**
```powershell
.\check-ec2-connection.ps1
```

**Deploy:**
```powershell
# Windows PowerShell
.\deploy-ec2.ps1

# Linux/Mac/Git Bash
chmod +x deploy-ec2.sh
./deploy-ec2.sh
```

For detailed deployment instructions, see [EC2-DEPLOYMENT.md](./EC2-DEPLOYMENT.md)

## 📚 API Documentation

### Base URL
- **Local:** `http://localhost:8080/identity`
- **Production:** `http://47.129.108.163:8080/identity`

### Health Check
```bash
GET /actuator/health
```

### Authentication
```bash
# Login
POST /auth/login
Content-Type: application/json
{
  "username": "admin@example.com",
  "password": "Admin@123"
}

# Request OTP
POST /users/email/request-otp
Content-Type: application/json
{
  "email": "user@example.com"
}

# Register with OTP
POST /users/registration-with-otp
Content-Type: application/json
{
  "email": "user@example.com",
  "otpCode": "123456",
  "firstName": "John",
  "lastName": "Doe",
  "password": "User@123",
  "dob": "1990-01-01"
}
```

### Import Postman Collection
Import the `ShopGameManagement-COMPLETE-API.postman_collection.json` file for complete API documentation.

## 🗄 Database Schema

The application uses MySQL with the following main tables:
- `user` - User accounts
- `role` & `permission` - Authorization
- `game` & `category` - Product catalog
- `cart` & `cart_item` - Shopping cart
- `phone_otp` & `password_reset_token` - Security

Database is automatically initialized on first run.

## ⚙️ Configuration

### Environment Variables (.env.aws)
```env
# Database
RDS_ENDPOINT=your-rds-endpoint
RDS_USERNAME=root
RDS_PASSWORD=your-password

# AWS Services
AWS_REGION=ap-southeast-1
AWS_ACCESS_KEY=your-access-key
AWS_SECRET_KEY=your-secret-key
AWS_S3_BUCKET_NAME=your-bucket
AWS_SES_FROM_EMAIL=your-email

# JWT
JWT_SIGNER_KEY=your-jwt-secret

# Email
MAIL_USERNAME=your-gmail
MAIL_PASSWORD=your-app-password

# Google OAuth
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
```

### Application Profiles
- `default` - Local development with local MySQL
- `docker` - Running in Docker containers
- `aws` - Using AWS RDS with other AWS services
- `ec2` - Production deployment on EC2

## 🔐 Default Credentials

### Admin Account
- **Email:** admin@example.com
- **Password:** Admin@123
- **Role:** ADMIN

### Test User
- Register via API with email OTP verification

## 📁 Project Structure

```
src/main/java/com/se182393/baidautien/
├── configuration/     # Security, JWT, AWS configs
├── controller/        # REST API endpoints
├── dto/              # Data transfer objects
├── entity/           # JPA entities
├── repository/       # Database access
├── service/          # Business logic
├── exception/        # Error handling
└── mapper/           # DTO-Entity mapping

src/main/resources/
├── application.yaml           # Default config
├── application-docker.yaml    # Docker config
├── application-aws.yaml       # AWS config
├── application-ec2.yaml       # EC2 config
└── data.sql                   # Initial data
```

## 🧪 Testing

```bash
# Run all tests
./mvnw test

# Run specific test class
./mvnw test -Dtest=AuthenticationControllerTest

# Skip tests during build
./mvnw clean package -DskipTests
```

Test the API with the included `test-game-api.http` file.

## 🔍 Monitoring

### Application Logs
```bash
# Local
tail -f logs/application.log

# EC2
ssh -i D:\AWS\keys\game-store-backend-key.pem ec2-user@47.129.108.163 'tail -f /home/ec2-user/backend/app.log'
```

### Actuator Endpoints
- `/actuator/health` - Health status
- `/actuator/info` - Application info
- `/actuator/metrics` - Application metrics

## 🐛 Troubleshooting

### Cannot connect to database
1. Check database is running
2. Verify credentials in `.env.aws`
3. Ensure RDS security group allows access

### AWS S3 errors
1. Verify AWS credentials
2. Check S3 bucket exists and region is correct
3. Ensure IAM user has S3 permissions

### Email not sending
1. Verify SES credentials
2. Check email is verified in SES
3. Ensure SES is out of sandbox mode

### EC2 deployment fails
1. Check security group allows SSH (port 22)
2. Verify key file permissions
3. Ensure EC2 instance is running
4. Check Java is installed on EC2

See [EC2-DEPLOYMENT.md](./EC2-DEPLOYMENT.md) for detailed troubleshooting.

## 📞 Support

For issues or questions:
1. Check the [EC2-DEPLOYMENT.md](./EC2-DEPLOYMENT.md) guide
2. Review application logs
3. Test with Postman collection

## 📄 License

This project is for educational purposes.

## 🚀 Next Steps

After deployment:
1. **Setup Domain:** Configure Route 53 for custom domain
2. **Add SSL:** Use AWS Certificate Manager + Load Balancer
3. **CI/CD:** Setup GitHub Actions for automated deployment
4. **Monitoring:** Configure CloudWatch logs and alarms
5. **Scaling:** Create Auto Scaling Group
6. **Backup:** Setup automated RDS snapshots

