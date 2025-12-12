# 🎮 Devteria Game Store - AWS E-Commerce Platform

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.5.5-brightgreen)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18.3.1-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6.2-blue)](https://www.typescriptlang.org/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0.42-orange)](https://www.mysql.com/)
[![AWS](https://img.shields.io/badge/AWS-EC2%20%7C%20RDS%20%7C%20S3-orange)](https://aws.amazon.com/)

## 📋 Tổng Quan

**Devteria Game Store** là nền tảng thương mại điện tử chuyên bán game keys, được xây dựng với **Monolithic Architecture**, triển khai đầy đủ trên AWS Cloud Infrastructure.

### 🏗️ Architecture: **MONOLITHIC APPLICATION**

```
┌─────────────────────────────────────────────────────────────────┐
│                         AWS CLOUD                               │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │          EC2 Instance (t2.medium - Ubuntu 24.04)          │  │
│  │                                                           │  │
│  │  ┌──────────────────┐      ┌──────────────────────────┐  │  │
│  │  │   NGINX Web      │      │  Spring Boot Backend    │  │  │
│  │  │   Server         │──────▶  (Port 8080)             │  │  │
│  │  │   Port 80/443    │      │  • REST API             │  │  │
│  │  │  • React Static  │      │  • Business Logic       │  │  │
│  │  │  • SSL/TLS       │      │  • Security Layer       │  │  │
│  │  │  • Reverse Proxy │      │  • Payment Integration  │  │  │
│  │  └──────────────────┘      └──────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────────┘  │
│                               ↕                                 │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │         MySQL RDS (db.t3.micro - 8.0.42)                 │  │
│  │  • Users & Authentication                                │  │
│  │  • Games, Categories, Ratings                            │  │
│  │  • Orders, Transactions, Inventory                       │  │
│  │  • Cart, Wishlist, Permissions                           │  │
│  └───────────────────────────────────────────────────────────┘  │
│                               ↕                                 │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │              AWS S3 Storage (2 Buckets)                  │  │
│  │  • game-store-avatars-2025   (User avatars)              │  │
│  │  • game-store-images-2025    (Game images/covers)        │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │              External Integrations                        │  │
│  │  • MoMo Payment Gateway (QR Code & Callback)             │  │
│  │  • Google OAuth 2.0 (Social Login)                       │  │
│  │  • Let's Encrypt SSL (Auto-renewal)                      │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

**Tại sao chọn Monolithic?**
- ✅ **Đơn giản**: Dễ triển khai, dễ quản lý, dễ debug
- ✅ **Chi phí thấp**: 1 EC2 instance cho toàn bộ hệ thống
- ✅ **Performance**: Single-process communication (no network overhead)
- ✅ **Phù hợp quy mô**: Vừa và nhỏ, không cần phức tạp hóa
- ✅ **Development speed**: Nhanh hơn microservices cho MVP

---

## 🛠️ Technology Stack

### Backend Technologies
| Technology | Version | Purpose |
|-----------|---------|---------|
| **Spring Boot** | 3.5.5 | Application Framework |
| **Java** | 21 (LTS) | Programming Language |
| **Spring Security** | 6.x | Authentication & Authorization |
| **Spring Data JPA** | 3.x | Database ORM |
| **MySQL Connector** | 8.0.x | Database Driver |
| **JWT (jjwt)** | 0.12.x | Token-based Auth |
| **MapStruct** | 1.6.x | DTO Mapping |
| **Lombok** | 1.18.x | Boilerplate Reduction |
| **AWS SDK S3** | 2.x | File Storage |
| **Jackson** | 2.17.x | JSON Processing |
| **Maven** | 3.9.6 | Build Tool |

### Frontend Technologies
| Technology | Version | Purpose |
|-----------|---------|---------|
| **React** | 18.3.1 | UI Framework |
| **TypeScript** | 5.6.2 | Type Safety |
| **Vite** | 5.4.20 | Build Tool & Dev Server |
| **Axios** | 1.7.7 | HTTP Client |
| **React Router DOM** | 7.1.1 | Client-side Routing |
| **Context API** | Built-in | State Management |

### Infrastructure & DevOps
| Component | Specification | Purpose |
|-----------|--------------|---------|
| **AWS EC2** | t2.medium, Ubuntu 24.04 | Application Server |
| **AWS RDS** | MySQL 8.0.42, db.t3.micro | Database |
| **AWS S3** | 2 buckets, ap-southeast-1 | Object Storage |
| **NGINX** | 1.24.x | Web Server & Reverse Proxy |
| **Let's Encrypt** | Auto-renewal | SSL/TLS Certificates |
| **systemd** | Built-in | Process Management |
| **Git** | 2.x | Version Control |

---

## 📁 Project Structure

```
Workshop-AWS/
│
├── README.md                          # ⭐ Documentation tổng (file này)
├── DEPLOYMENT_GUIDE.md                # Hướng dẫn deploy chi tiết
├── LOGIN_API_FIX_SUMMARY.md           # Fix log history
├── PRODUCTION_SETUP.md                # Production configuration
│
├── Back-End/                          # 🔧 Spring Boot Monolithic App
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/se182393/baidautien/
│   │   │   │   │
│   │   │   │   ├── controller/        # 🎯 REST API Controllers
│   │   │   │   │   ├── AuthenticationController.java
│   │   │   │   │   ├── GameController.java
│   │   │   │   │   ├── OrderController.java
│   │   │   │   │   ├── PaymentController.java
│   │   │   │   │   ├── CategoryController.java
│   │   │   │   │   └── UserController.java
│   │   │   │   │
│   │   │   │   ├── service/           # 💼 Business Logic Layer
│   │   │   │   │   ├── AuthenticationService.java
│   │   │   │   │   ├── GameService.java
│   │   │   │   │   ├── OrderService.java      # ⭐ Order processing
│   │   │   │   │   ├── PaymentService.java    # 💳 MoMo integration
│   │   │   │   │   ├── UserService.java
│   │   │   │   │   └── S3Service.java         # ☁️ AWS S3 uploads
│   │   │   │   │
│   │   │   │   ├── repository/        # 🗄️ Data Access Layer (JPA)
│   │   │   │   │   ├── UserRepository.java
│   │   │   │   │   ├── GameRepository.java
│   │   │   │   │   ├── OrderRepository.java
│   │   │   │   │   ├── OrderItemRepository.java
│   │   │   │   │   ├── CategoryRepository.java
│   │   │   │   │   └── TopupTransactionRepository.java
│   │   │   │   │
│   │   │   │   ├── entity/            # 📊 Database Models (JPA Entities)
│   │   │   │   │   ├── User.java
│   │   │   │   │   ├── Game.java
│   │   │   │   │   ├── Order.java
│   │   │   │   │   ├── OrderItem.java
│   │   │   │   │   ├── Category.java
│   │   │   │   │   ├── Role.java
│   │   │   │   │   ├── Permission.java
│   │   │   │   │   └── TopupTransaction.java
│   │   │   │   │
│   │   │   │   ├── dto/               # 📦 Data Transfer Objects
│   │   │   │   │   ├── request/       # API Request DTOs
│   │   │   │   │   └── response/      # API Response DTOs
│   │   │   │   │
│   │   │   │   ├── mapper/            # 🔄 MapStruct Mappers
│   │   │   │   │   ├── UserMapper.java
│   │   │   │   │   ├── GameMapper.java
│   │   │   │   │   └── OrderMapper.java
│   │   │   │   │
│   │   │   │   ├── configuration/     # ⚙️ Spring Configuration
│   │   │   │   │   ├── SecurityConfig.java    # Security setup
│   │   │   │   │   ├── JwtAuthFilter.java     # JWT filter
│   │   │   │   │   ├── ApplicationInitConfig.java
│   │   │   │   │   └── CorsConfig.java
│   │   │   │   │
│   │   │   │   ├── exception/         # ⚠️ Exception Handling
│   │   │   │   │   ├── GlobalExceptionHandler.java
│   │   │   │   │   ├── AppException.java
│   │   │   │   │   └── ErrorCode.java
│   │   │   │   │
│   │   │   │   └── enums/             # 📋 Enumerations
│   │   │   │       ├── OrderStatus.java
│   │   │   │       └── PaymentMethod.java
│   │   │   │
│   │   │   └── resources/
│   │   │       ├── application.yaml           # Main config
│   │   │       ├── application-ec2.yaml       # Production config
│   │   │       ├── application-docker.yaml    # Docker config
│   │   │       └── data.sql                   # Seed data
│   │   │
│   │   └── test/                      # 🧪 Unit & Integration Tests
│   │
│   ├── pom.xml                        # Maven dependencies
│   ├── Dockerfile                     # Docker build
│   ├── docker-compose.yml             # Local dev setup
│   ├── game-store-backend.service     # Systemd service
│   └── deploy-backend-ec2.sh          # Deployment script
│
├── Front-End/                         # ⚛️ React SPA Application
│   ├── src/
│   │   │
│   │   ├── api/                       # 🌐 API Client Layer
│   │   │   └── client.ts              # Axios instance + API functions
│   │   │
│   │   ├── components/                # 🧩 Reusable Components
│   │   │   ├── common/                # Shared UI components
│   │   │   │   ├── GameCard.tsx
│   │   │   │   ├── GameRating.tsx
│   │   │   │   └── LoadingSpinner.tsx
│   │   │   ├── admin/                 # Admin-specific components
│   │   │   │   ├── GamesSection.tsx
│   │   │   │   └── UsersSection.tsx
│   │   │   ├── layout/                # Layout components
│   │   │   │   ├── Header.tsx
│   │   │   │   ├── Footer.tsx
│   │   │   │   └── Sidebar.tsx
│   │   │   └── ui/                    # Basic UI elements
│   │   │       ├── Button.tsx
│   │   │       ├── Modal.tsx
│   │   │       └── Toast.tsx
│   │   │
│   │   ├── pages/                     # 📄 Page Components (Routes)
│   │   │   ├── admin/                 # Admin panel pages
│   │   │   │   ├── AdminPage.tsx
│   │   │   │   ├── AdminOrdersPage.tsx    # ⭐ Order management
│   │   │   │   └── AdminUsersPage.tsx
│   │   │   │
│   │   │   ├── HomePage.tsx           # Landing page
│   │   │   ├── StorePage.tsx          # Game catalog
│   │   │   ├── GameDetailPage.tsx     # Game details
│   │   │   ├── CheckoutPage.tsx       # 💳 Checkout flow
│   │   │   ├── MyOrdersPage.tsx       # 📦 User orders + keys
│   │   │   ├── ProfilePage.tsx        # User profile
│   │   │   ├── LoginPage.tsx          # Authentication
│   │   │   ├── RegisterPage.tsx       # Registration
│   │   │   ├── WishlistPage.tsx       # Wishlist
│   │   │   └── CategoriesPage.tsx     # Categories
│   │   │
│   │   ├── context/                   # 🔄 React Context (State)
│   │   │   ├── CartContext.tsx        # Shopping cart
│   │   │   ├── CurrencyContext.tsx    # Multi-currency
│   │   │   ├── ToastContext.tsx       # Notifications
│   │   │   └── WishlistContext.tsx    # Wishlist
│   │   │
│   │   ├── services/                  # 📡 Business Logic Services
│   │   │   ├── authService.ts
│   │   │   └── paymentService.ts
│   │   │
│   │   ├── utils/                     # 🛠️ Utility Functions
│   │   │   ├── formatters.ts
│   │   │   ├── validators.ts
│   │   │   └── keyGenerator.ts
│   │   │
│   │   ├── styles/                    # 🎨 Global Styles
│   │   │   └── globals.css
│   │   │
│   │   ├── App.tsx                    # Main app component
│   │   ├── main.tsx                   # Entry point
│   │   └── vite-env.d.ts              # Vite types
│   │
│   ├── public/                        # Static assets
│   ├── package.json                   # NPM dependencies
│   ├── vite.config.ts                 # Vite configuration
│   ├── tsconfig.json                  # TypeScript config
│   └── deploy-frontend-ec2.sh         # Deployment script
│
└── [Scripts & Configs]
    ├── deploy.sh                      # Main deployment script
    ├── deploy.bat                     # Windows deployment
    ├── deploy-production.bat          # Production deploy
    ├── start.bat                      # Local development
    └── .gitignore                     # Git ignore rules
```

---

## 🚀 Core Features

### 👤 **User Features**

#### Authentication & Profile
- ✅ Email/Password registration & login
- ✅ Google OAuth 2.0 integration
- ✅ JWT token-based authentication
- ✅ Profile management (avatar upload to S3)
- ✅ Password reset via email

#### Shopping Experience
- ✅ Browse game catalog with filters
- ✅ Search games by name/category
- ✅ Game detail page with ratings & reviews
- ✅ Add to cart & wishlist
- ✅ Real-time stock availability check
- ✅ Multi-currency support (VND/USD/EUR)

#### Payment & Orders
- ✅ **MoMo QR Code payment** (scan to pay)
- ✅ **Balance payment** (wallet topup)
- ✅ Order tracking & history
- ✅ **Automatic license key delivery**
- ✅ Download license keys as text file

#### Membership & Rewards
- ✅ Tiered membership system:
  - 🥉 **Thường**: < 1.000.000đ lifetime spend
  - 🥇 **Vàng**: ≥ 1.000.000đ (3% discount)
  - 💎 **Kim Cương**: ≥ 10.000.000đ (5% discount)
- ✅ Points accumulation tracking
- ✅ Transaction history

---

### 🔧 **Admin Features**

#### Dashboard & Analytics
- ✅ Sales overview dashboard
- ✅ Monthly revenue reports
- ✅ Order statistics (processing/completed)
- ✅ User growth metrics

#### Game Management
- ✅ CRUD operations (Create, Read, Update, Delete)
- ✅ **Image upload to AWS S3**
- ✅ Cover image & video URL support
- ✅ Category assignment (many-to-many)
- ✅ Sale percentage configuration
- ✅ **Stock/inventory management**
- ✅ Auto-scroll to form when editing

#### Order Management
- ✅ **View all orders** with details
- ✅ **Sort orders** by date/amount/status
- ✅ **Filter by status** (All/Processing/Completed/Cancelled)
- ✅ **Fulfill orders** (assign license keys)
- ✅ Auto-generate Steam-format keys
- ✅ Bulk key assignment for multiple items

#### User & Access Control
- ✅ User management (CRUD)
- ✅ Role-based access control (RBAC)
- ✅ Permission management
- ✅ View user spending & membership tier

---

### 🎯 **Business Logic**

#### Inventory Management
```java
// Automatic stock deduction on order creation
if (game.getQuantity() < orderedQuantity) {
    throw new RuntimeException("Hết hàng!");
}
game.setQuantity(currentQuantity - orderedQuantity);
```

#### Payment Processing
```java
// Balance payment flow
1. Validate user balance
2. Deduct amount from wallet
3. Create order with COMPLETED status
4. Admin fulfills with license key
5. User receives key instantly
```

#### Order Workflow
```
PROCESSING → Admin assigns keys → COMPLETED
```

#### Membership Discounts
```typescript
// Auto-apply discount based on tier
const discount = 
  tier === 'Kim Cương' ? 5% :
  tier === 'Vàng' ? 3% : 0%;
```

---

## 🗄️ Database Schema

### **Core Tables**

#### Users & Authentication
```sql
users (
    id UUID PRIMARY KEY,
    username VARCHAR(255) UNIQUE,
    password VARCHAR(255),  -- BCrypt hashed
    email VARCHAR(255) UNIQUE,
    balance DECIMAL(15,2) DEFAULT 0,
    avatarUrl TEXT,
    roles SET<Role>
)

roles (
    name VARCHAR(50) PRIMARY KEY,
    description TEXT,
    permissions SET<Permission>
)

permissions (
    name VARCHAR(100) PRIMARY KEY,
    description TEXT
)
```

#### Game Catalog
```sql
games (
    id UUID PRIMARY KEY,
    name VARCHAR(255),
    price DECIMAL(10,2),
    quantity INT DEFAULT 0,  -- Stock count
    salePercent DOUBLE DEFAULT 0,
    image TEXT,  -- S3 URL
    cover TEXT,  -- S3 URL
    video TEXT,  -- YouTube URL
    releaseDate DATE,
    categories SET<Category>
)

categories (
    id UUID PRIMARY KEY,
    name VARCHAR(100) UNIQUE,
    description TEXT
)

game_ratings (
    id UUID PRIMARY KEY,
    game_id UUID,
    user_id UUID,
    rating INT CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    FOREIGN KEY (game_id) REFERENCES games(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
)
```

#### Orders & Payment
```sql
orders (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    orderId VARCHAR(50) UNIQUE,  -- ORDER_timestamp
    user_id UUID,
    totalAmount DECIMAL(15,2),
    status ENUM('PROCESSING', 'COMPLETED', 'CANCELLED'),
    paymentMethod VARCHAR(50),  -- MOMO, BALANCE
    createdAt TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
)

order_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT,
    game_id UUID,
    quantity INT,
    unitPrice DECIMAL(10,2),
    totalPrice DECIMAL(15,2),
    licenseKey TEXT,  -- Assigned by admin
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (game_id) REFERENCES games(id)
)

topup_transactions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id UUID,
    amount DECIMAL(15,2),
    momoTransId VARCHAR(255),
    status VARCHAR(50),
    createdAt TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
)
```

#### Shopping
```sql
cart_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id UUID,
    game_id UUID,
    quantity INT,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (game_id) REFERENCES games(id)
)

wishlist_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id UUID,
    game_id UUID,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (game_id) REFERENCES games(id)
)
```

---

## 🔐 Security Implementation

### JWT Authentication Flow
```
1. User login → POST /identity/auth/token
   Request: { username, password }
   
2. Backend validates credentials (BCrypt)
   
3. Generate JWT with user info + roles
   Token payload: {
     userId: "...",
     scope: "ROLE_USER GAME_READ ORDER_CREATE",
     iat: timestamp,
     exp: timestamp + 1h
   }
   
4. Frontend stores JWT in localStorage
   
5. Every API call includes header:
   Authorization: Bearer <JWT>
   
6. JwtAuthFilter validates token on each request
   
7. Token expires after 1 hour
   Frontend calls /auth/refresh to get new token
```

### Security Features
- ✅ **Password Hashing**: BCrypt with salt
- ✅ **JWT Tokens**: Stateless authentication
- ✅ **RBAC**: Role-based access control
- ✅ **CORS**: Configured for frontend domain
- ✅ **Input Validation**: @Valid annotations on DTOs
- ✅ **SQL Injection Prevention**: JPA Parameterized queries
- ✅ **XSS Protection**: React escaping by default
- ✅ **HTTPS**: Let's Encrypt SSL certificates
- ✅ **Secure Headers**: NGINX security headers

---

## 💳 Payment Integration

### MoMo Payment Gateway

#### QR Code Payment Flow
```
┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐
│  User    │   │ Frontend │   │ Backend  │   │  MoMo    │
└────┬─────┘   └────┬─────┘   └────┬─────┘   └────┬─────┘
     │              │              │              │
     │─── Checkout ─▶              │              │
     │              │─ POST /momo-checkout ──▶    │
     │              │              │─ Create payment request ─▶
     │              │              │◀─ Return QR URL ────────│
     │              │◀─ QR URL ────│              │
     │◀─ Display QR │              │              │
     │              │              │              │
     │───── Scan QR ─────────────────────────────▶│
     │              │              │◀─ Callback ──│
     │              │              │  (validate signature)
     │              │              │─ Update order status
     │              │              │─ Update inventory
     │◀─ Redirect to success page ─┘              │
```

#### Implementation
```java
@PostMapping("/momo-checkout")
public MoMoResponse createPayment(@RequestBody PaymentRequest request) {
    // 1. Generate order ID
    String orderId = "ORDER_" + System.currentTimeMillis();
    
    // 2. Create signature
    String rawSignature = String.format(
        "accessKey=%s&amount=%s&orderId=%s&...",
        momoAccessKey, amount, orderId
    );
    String signature = hmacSHA256(rawSignature, momoSecretKey);
    
    // 3. Call MoMo API
    String payUrl = momoGateway.createPayment(orderId, amount, signature);
    
    // 4. Return QR URL to frontend
    return new MoMoResponse(payUrl, orderId);
}

@PostMapping("/momo-callback")
public void handleCallback(@RequestBody MoMoCallback callback) {
    // 1. Validate signature from MoMo
    if (!validateSignature(callback)) {
        throw new SecurityException("Invalid signature");
    }
    
    // 2. Update order status
    if (callback.getResultCode() == 0) {  // Success
        Order order = orderRepository.findByOrderId(callback.getOrderId());
        order.setStatus("COMPLETED");
        orderRepository.save(order);
    }
}
```

### Balance Payment

#### Wallet Topup Flow
```
1. User navigates to Profile → Nạp tiền
2. Enter amount (100,000đ - 50,000,000đ)
3. System creates topup transaction
4. Redirect to MoMo QR for topup payment
5. After payment, MoMo callback updates balance
6. User can use balance for purchases
```

#### Balance Payment Flow
```java
@PostMapping("/checkout-with-balance")
public OrderResponse checkoutWithBalance(@RequestBody OrderRequest request) {
    User user = getCurrentUser();
    double total = calculateTotal(request.getItems());
    
    // 1. Validate balance
    if (user.getBalance() < total) {
        throw new RuntimeException("Insufficient balance");
    }
    
    // 2. Deduct balance
    user.setBalance(user.getBalance() - total);
    userRepository.save(user);
    
    // 3. Create order with COMPLETED status
    Order order = createOrder(request, user);
    order.setStatus("COMPLETED");
    order.setPaymentMethod("BALANCE");
    
    return orderMapper.toResponse(order);
}
```

---

## 📊 API Endpoints

### Authentication (`/identity/auth`)
```http
POST   /token                  # Login
POST   /introspect            # Validate JWT
POST   /logout                # Invalidate token
POST   /refresh               # Refresh JWT
GET    /outbound/google       # Google OAuth callback
```

### Games (`/identity/games`)
```http
GET    /                      # List all games (with filters)
GET    /{id}                  # Get game by ID
GET    /search?q={query}     # Search games
POST   /                      # Create game (ADMIN)
PUT    /{id}                  # Update game (ADMIN)
DELETE /{id}                  # Delete game (ADMIN)
GET    /by-price             # Filter by price range
```

### Orders (`/identity/orders`)
```http
GET    /                      # Get current user's orders
GET    /all                   # Get all orders (ADMIN)
GET    /{id}                  # Get order by ID
POST   /checkout-with-balance # Create order with balance
PUT    /{id}/fulfill          # Fulfill order with keys (ADMIN)
```

### Categories (`/identity/categories`)
```http
GET    /                      # List all categories
POST   /                      # Create category (ADMIN)
PUT    /{id}                  # Update category (ADMIN)
DELETE /{id}                  # Delete category (ADMIN)
```

### Payment (`/identity/payment`)
```http
POST   /momo-checkout         # Create MoMo payment
POST   /momo-callback         # MoMo callback handler (internal)
```

### Users (`/identity/users`)
```http
GET    /myInfo                # Get current user profile
PUT    /myInfo                # Update profile
POST   /avatar                # Upload avatar to S3
GET    /                      # List users (ADMIN)
POST   /                      # Create user (ADMIN)
PUT    /{id}                  # Update user (ADMIN)
DELETE /{id}                  # Delete user (ADMIN)
```

### Topup (`/identity/topup`)
```http
GET    /balance               # Get current balance
POST   /momo                  # Create topup transaction
GET    /history               # Get topup history
```

---

## 🌐 Production Deployment

### Server Specifications
```yaml
Domain: keygamezspace.space
SSL: HTTPS (Let's Encrypt)

EC2 Instance:
  Type: t2.medium
  vCPU: 2
  Memory: 4 GB
  Storage: 30 GB SSD
  OS: Ubuntu 24.04 LTS
  Region: ap-southeast-1 (Singapore)
  IP: 13.214.135.223

RDS Database:
  Engine: MySQL 8.0.42
  Instance: db.t3.micro
  Storage: 20 GB SSD
  Multi-AZ: No
  Backup: 7 days retention

S3 Buckets:
  - game-store-avatars-2025 (Private)
  - game-store-images-2025 (Public Read)
  Region: ap-southeast-1
```

### NGINX Configuration
```nginx
# /etc/nginx/sites-available/game-store
server {
    listen 80;
    listen [::]:80;
    server_name keygamezspace.space;
    
    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name keygamezspace.space;
    
    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/keygamezspace.space/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/keygamezspace.space/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    
    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    
    # Frontend (React SPA)
    location / {
        root /var/www/game-store;
        try_files $uri $uri/ /index.html;
        expires 1d;
        add_header Cache-Control "public, immutable";
    }
    
    # Backend API (Spring Boot)
    location /identity/ {
        proxy_pass http://localhost:8080/identity/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # WebSocket support
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
    
    # File upload size
    client_max_body_size 10M;
}
```

### Systemd Service
```ini
# /etc/systemd/system/game-store-backend.service
[Unit]
Description=Devteria Game Store Backend
Documentation=https://github.com/your-repo
After=network.target mysql.service
Wants=mysql.service

[Service]
Type=simple
User=ubuntu
Group=ubuntu
WorkingDirectory=/home/ubuntu

# Java application
ExecStart=/usr/bin/java -jar /home/ubuntu/app.jar --spring.profiles.active=ec2

# Restart policy
Restart=always
RestartSec=10

# Logging
StandardOutput=journal
StandardError=journal
SyslogIdentifier=game-store

# Resource limits
LimitNOFILE=65536

[Install]
WantedBy=multi-user.target
```

---

## 🔨 Build & Deployment Guide

### Prerequisites
```bash
# Backend
Java 21 JDK
Maven 3.9+
MySQL 8.0+

# Frontend
Node.js 18+
npm 9+

# Deployment
SSH access to EC2
AWS CLI (for S3)
Git
```

### Local Development

#### Backend Setup
```bash
cd Back-End

# Configure database
# Edit src/main/resources/application.yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/devteria
    username: root
    password: your_password

# Run application
mvn spring-boot:run

# Or with specific profile
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

#### Frontend Setup
```bash
cd Front-End

# Install dependencies
npm install

# Configure API endpoint
# Create .env file
echo "VITE_API_BASE_URL=http://localhost:8080/identity" > .env

# Start dev server
npm run dev

# Access at http://localhost:5173
```

### Production Build

#### Backend Build
```bash
cd Back-End

# Clean and package
mvn clean package -DskipTests

# Output: target/ShopGameManagement-0.0.1-SNAPSHOT.jar (66MB)
```

#### Frontend Build
```bash
cd Front-End

# Build for production
npm run build

# Output: dist/ folder (~230KB compressed)
```

### Deploy to AWS EC2

#### Step 1: Upload Backend
```bash
# From local machine
cd Back-End/target

# Upload JAR file
scp -i /path/to/key.pem \
    ShopGameManagement-0.0.1-SNAPSHOT.jar \
    ubuntu@13.214.135.223:/home/ubuntu/app.jar

# SSH to EC2
ssh -i /path/to/key.pem ubuntu@13.214.135.223

# Restart backend service
sudo systemctl restart game-store-backend

# Check status
sudo systemctl status game-store-backend

# View logs
sudo journalctl -u game-store-backend -f
```

#### Step 2: Deploy Frontend
```bash
# From local machine
cd Front-End

# Create deployment package
npm run build
cd dist
zip -r ../dist-$(date +%Y%m%d%H%M%S).zip *
cd ..

# Upload to EC2
scp -i /path/to/key.pem \
    dist-*.zip \
    ubuntu@13.214.135.223:/tmp/frontend.zip

# SSH to EC2
ssh -i /path/to/key.pem ubuntu@13.214.135.223

# Deploy frontend
cd /tmp
unzip -o frontend.zip -d frontend-temp
sudo rm -rf /var/www/game-store/*
sudo mv frontend-temp/* /var/www/game-store/
sudo chown -R www-data:www-data /var/www/game-store
rm -rf frontend-temp frontend.zip

# Verify
ls -la /var/www/game-store
```

#### Step 3: Verify Deployment
```bash
# Test backend health
curl http://localhost:8080/identity/health

# Check NGINX
sudo nginx -t
sudo systemctl status nginx

# Test SSL
curl https://keygamezspace.space

# Monitor logs
tail -f /var/log/nginx/access.log
sudo journalctl -u game-store-backend -f
```

---

## 🐛 Troubleshooting Guide

### Common Issues

#### ❌ Issue 1: Order COMPLETED nhưng không có license key
**Triệu chứng**: User thấy order status "Hoàn thành" nhưng không thấy mã kích hoạt

**Nguyên nhân**: 
- Order đã thanh toán (COMPLETED)
- Admin chưa fulfill order (chưa gán license key)

**Giải pháp**:
```
1. Admin login vào /admin
2. Vào tab "Orders"
3. Tìm order cần fulfill
4. Click "Complete Order"
5. Nhập license key (hoặc auto-generate)
6. Click Submit
7. User sẽ thấy key ngay lập tức
```

#### ❌ Issue 2: Balance payment trả về 400 Bad Request
**Triệu chứng**: Console log hiển thị 400 error khi thanh toán bằng số dư

**Nguyên nhân**: 
- Frontend gửi request thiếu field `paymentMethod`
- Backend validation yêu cầu field này

**Giải pháp**:
```bash
# Đã fix trong version mới nhất
# Cần hard refresh browser:
Windows/Linux: Ctrl + Shift + R
Mac: Cmd + Shift + R
```

#### ❌ Issue 3: Backend không khởi động
**Triệu chứng**: `sudo systemctl status game-store-backend` hiển thị failed

**Debug**:
```bash
# Check logs
sudo journalctl -u game-store-backend -n 100

# Common issues:
# 1. Database connection failed
#    → Check RDS security group
#    → Verify credentials in application-ec2.yaml

# 2. Port 8080 already in use
#    → sudo lsof -i :8080
#    → Kill process: sudo kill -9 <PID>

# 3. JAR file not found
#    → ls -la /home/ubuntu/app.jar

# 4. Java not installed
#    → java -version
#    → sudo apt install openjdk-21-jdk
```

#### ❌ Issue 4: Frontend hiển thị blank page
**Triệu chứng**: Website chỉ hiển thị màn hình trắng

**Debug**:
```bash
# 1. Check browser console (F12)
#    → Look for 404 errors on JS/CSS files

# 2. Verify NGINX is serving files
curl http://localhost/

# 3. Check file permissions
ls -la /var/www/game-store/
# Should be: www-data:www-data

# 4. Fix permissions
sudo chown -R www-data:www-data /var/www/game-store

# 5. Check NGINX error log
sudo tail -f /var/log/nginx/error.log
```

#### ❌ Issue 5: SSL Certificate expired
**Triệu chứng**: Browser hiển thị "Your connection is not private"

**Giải pháp**:
```bash
# Check certificate status
sudo certbot certificates

# Renew certificate
sudo certbot renew

# Reload NGINX
sudo systemctl reload nginx

# Test auto-renewal
sudo certbot renew --dry-run
```

#### ❌ Issue 6: Cannot upload images to S3
**Triệu chứng**: Admin panel hiển thị "Failed to upload image"

**Debug**:
```bash
# 1. Check AWS credentials in backend logs
sudo journalctl -u game-store-backend | grep S3

# 2. Verify S3 bucket exists
aws s3 ls

# 3. Check IAM permissions
aws sts get-caller-identity

# 4. Test S3 upload manually
aws s3 cp test.jpg s3://game-store-images-2025/
```

---

## 📈 Performance & Optimization

### Current Performance Metrics
```
Backend Response Time: ~100-300ms
Frontend Load Time: ~1.5s (First Load)
Database Query Time: ~50-150ms
Image Load Time: ~200-500ms (from S3)
```

### Optimization Techniques Applied
- ✅ **Database Indexing**: Indexed on foreign keys
- ✅ **Connection Pooling**: HikariCP (default Spring Boot)
- ✅ **Lazy Loading**: JPA lazy fetch for relationships
- ✅ **CDN**: S3 with CloudFront (optional)
- ✅ **Gzip Compression**: NGINX gzip enabled
- ✅ **Browser Caching**: Cache-Control headers
- ✅ **Code Splitting**: Vite dynamic imports
- ✅ **Image Optimization**: WebP format support

### Future Improvements
- [ ] **Redis Caching**: Cache game catalog, user sessions
- [ ] **Elasticsearch**: Full-text search for games
- [ ] **CloudFront CDN**: Faster static asset delivery
- [ ] **Database Read Replicas**: Scale read operations
- [ ] **Load Balancer**: AWS ALB for multiple EC2 instances
- [ ] **Auto-scaling**: EC2 Auto Scaling Group
- [ ] **Monitoring**: CloudWatch, New Relic, or Datadog
- [ ] **CI/CD Pipeline**: GitHub Actions or AWS CodePipeline

---

## 🔮 Roadmap

### Phase 1: Current State ✅
- [x] Monolithic application deployed
- [x] Core e-commerce features
- [x] Payment integration (MoMo)
- [x] Admin panel
- [x] AWS infrastructure

### Phase 2: Enhancements (Q1 2026)
- [ ] **Microservices Migration**
  - Auth Service
  - Game Catalog Service
  - Order Service
  - Payment Service
  - Notification Service
- [ ] **Advanced Features**
  - Wishlist sharing
  - Gift cards
  - Referral program
  - Reviews & ratings v2
- [ ] **Performance**
  - Redis caching layer
  - CDN integration
  - Database optimization

### Phase 3: Scale (Q2-Q3 2026)
- [ ] **Infrastructure**
  - Kubernetes deployment
  - Service mesh (Istio)
  - Message queue (RabbitMQ/Kafka)
- [ ] **Features**
  - Live chat support
  - Email notifications
  - Mobile app (React Native)
  - Advanced analytics

---

## 👥 Team & Contributors

**Project Team**: SE182393
- **Architecture**: Monolithic Spring Boot + React
- **Cloud Provider**: AWS (EC2, RDS, S3)
- **Development Period**: November 2025 - December 2025

---

## 📄 License

This project is developed for educational purposes as part of the SE182393 course.

**© 2025 Devteria Game Store. All Rights Reserved.**

---

## 📞 Support & Contact

### Technical Support
- **Issues**: Check logs first
  ```bash
  # Backend logs
  sudo journalctl -u game-store-backend -n 100
  
  # NGINX logs
  sudo tail -f /var/log/nginx/error.log
  
  # Browser console
  Press F12 → Console tab
  ```

### Useful Commands
```bash
# Backend service management
sudo systemctl start game-store-backend
sudo systemctl stop game-store-backend
sudo systemctl restart game-store-backend
sudo systemctl status game-store-backend

# NGINX management
sudo nginx -t                    # Test config
sudo systemctl reload nginx      # Reload config
sudo systemctl restart nginx     # Restart server

# Database access
mysql -h <RDS_ENDPOINT> -u admin -p devteria

# View real-time logs
sudo journalctl -u game-store-backend -f

# Disk space check
df -h

# Memory usage
free -m
```

---

## 🌟 Key Highlights

### Why This Architecture?
1. **Simplicity First**: Monolithic cho phép MVP nhanh
2. **Cost Effective**: 1 EC2 thay vì nhiều containers
3. **Easy Maintenance**: Single codebase, single deployment
4. **Performance**: No inter-service network calls
5. **Development Speed**: Faster iteration, less complexity

### Production-Ready Features
- ✅ SSL/TLS with Let's Encrypt
- ✅ Systemd process management
- ✅ NGINX reverse proxy
- ✅ AWS RDS for database
- ✅ S3 for file storage
- ✅ JWT authentication
- ✅ Payment gateway integration
- ✅ Admin panel
- ✅ Order fulfillment system
- ✅ Inventory management
- ✅ Multi-currency support

---

**Last Updated**: December 12, 2025
**Project Version**: 1.0.0
**Architecture**: Monolithic (Spring Boot + React)
**Deployment**: AWS Cloud (Production)
**Status**: ✅ **Live & Production Ready**

---

**🎮 Happy Gaming!**
