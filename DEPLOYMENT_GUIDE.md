# AWS Workshop - Deployment Guide

## 🚀 Quick Fix Summary

**Issue Fixed**: Frontend was unable to connect to backend API due to context path mismatch.

**Changes Made**:
1. ✅ Updated backend context path from `/` to `/identity` in `application.yaml`
2. ✅ Updated frontend to use environment variables for API base URL
3. ✅ Fixed MoMo payment callback URL to include correct context path
4. ✅ Created deployment scripts for easy setup
5. ✅ **Removed hardcoded secrets from `application.yaml` for improved security.**

## 📋 Prerequisites

- **Java 21+** (for backend)
- **Node.js 18+** (for frontend)
- **Maven 3.8+** (for backend build)
- **Git** (for cloning)

## 🔒 Environment Setup (Important!)

Before running the application, you must configure your environment variables. The backend relies on these variables for sensitive data like database passwords and API keys.

1.  Navigate to the `Back-End` directory.
2.  Copy the `.env.example` file to a new file named `.env`.
    ```bash
    cd Back-End
    cp .env.example .env
    ```
3.  Open the `.env` file and fill in the required values for each variable.

**Note**: The application will not start without a properly configured `.env` file.

## 🛠️ Local Development Setup

### Option 1: Automated Deployment (Recommended)

**Windows:**
```cmd
# Clone and navigate to project
git clone <repository-url>
cd Workshop-AWS

# Set up your .env file as described above

# Run deployment script
deploy.bat
```

**Linux/Mac:**
```bash
# Clone and navigate to project
git clone <repository-url>
cd Workshop-AWS

# Set up your .env file as described above

# Make script executable and run
chmod +x deploy.sh
./deploy.sh
```

### Option 2: Manual Setup

**Backend Setup:**
```cmd
cd Back-End

# Set up your .env file as described above

mvn clean package -DskipTests
java -jar target/ShopGameManagement-0.0.1-SNAPSHOT.jar
```

**Frontend Setup:**
```cmd
cd Front-End
npm install
npm run dev
```

## 🌐 Access URLs

After deployment, access the application at:

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8080/identity
- **Login Endpoint**: http://localhost:8080/identity/auth/log-in

## 🔧 Configuration Details

### Backend Configuration (`application.yaml`)
```yaml
server:
  port: 8080
  servlet:
    context-path: /identity  # ✅ Fixed: Now matches frontend expectation
```

### Frontend Configuration (`.env`)
```env
# Local development
VITE_API_BASE=http://localhost:8080/identity  # ✅ Fixed: Now uses localhost

# Production (commented out for local dev)
# VITE_API_BASE=https://keygamezspace.space/identity
```

### API Client (`client.ts`)
```typescript
// ✅ Fixed: Now uses environment variable
const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8080/identity';
```

## 🧪 Testing the Login API

### Using curl:
```bash
curl -X POST http://localhost:8080/identity/auth/log-in \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

### Expected Response:
```json
{
  "code": 1000,
  "message": "Success",
  "result": {
    "token": "eyJhbGciOiJIUzUxMiJ9...",
    "authenticated": true
  }
}
```

## 🐛 Troubleshooting

### Common Issues:

**1. Port Already in Use**
```bash
# Kill processes on ports
netstat -ano | findstr :8080  # Windows
lsof -ti:8080 | xargs kill    # Linux/Mac
```

**2. CORS Errors**
- Ensure backend is running on port 8080
- Check that frontend .env points to correct backend URL

**3. Database Connection Issues**
- Verify AWS RDS credentials in `application.yaml`
- Check network connectivity to RDS instance

**4. Build Failures**
```bash
# Clean and rebuild
cd Back-End
mvn clean install -DskipTests

cd ../Front-End
rm -rf node_modules package-lock.json
npm install
```

## 📁 Project Structure

```
Workshop-AWS/
├── Back-End/                 # Spring Boot API
│   ├── src/main/resources/
│   │   └── application.yaml  # ✅ Updated context path
│   └── target/
├── Front-End/                # React Application
│   ├── .env                  # ✅ Updated API base URL
│   └── src/api/client.ts     # ✅ Updated to use env vars
├── deploy.bat               # ✅ Windows deployment script
├── deploy.sh                # ✅ Linux/Mac deployment script
└── start.bat                # ✅ Quick start script
```

## 🚀 Production Deployment

For production deployment:

1. Update `.env` to use production URLs:
```env
VITE_API_BASE=https://keygamezspace.space/identity
```

2. Build for production:
```bash
cd Front-End
npm run build
```

3. Deploy built files to your web server

## 📞 Support

If you encounter any issues:

1. Check the console logs in both backend and frontend
2. Verify all services are running on correct ports
3. Ensure environment variables are set correctly
4. Check network connectivity between services

---

**✅ Login API is now fixed and ready for use!**