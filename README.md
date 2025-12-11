<div id="top">

<!-- HEADER STYLE: CLASSIC -->
<div align="center">

# Shop Game Management System

<em>Empowering E-Commerce Through Seamless Gaming Platform Innovation</em>

<em>Built with the tools and technologies:</em>

<img src="https://img.shields.io/badge/Spring%20Boot-6DB33F.svg?style=flat&logo=Spring-Boot&logoColor=white" alt="Spring Boot">
<img src="https://img.shields.io/badge/React-61DAFB.svg?style=flat&logo=React&logoColor=black" alt="React">
<img src="https://img.shields.io/badge/TypeScript-3178C6.svg?style=flat&logo=TypeScript&logoColor=white" alt="TypeScript">
<img src="https://img.shields.io/badge/MySQL-4479A1.svg?style=flat&logo=MySQL&logoColor=white" alt="MySQL">
<img src="https://img.shields.io/badge/Docker-2496ED.svg?style=flat&logo=Docker&logoColor=white" alt="Docker">
<img src="https://img.shields.io/badge/Amazon%20AWS-232F3E.svg?style=flat&logo=Amazon-AWS&logoColor=white" alt="AWS">
<br>
<img src="https://img.shields.io/badge/Vite-646CFF.svg?style=flat&logo=Vite&logoColor=white" alt="Vite">
<img src="https://img.shields.io/badge/JSON-000000.svg?style=flat&logo=JSON&logoColor=white" alt="JSON">
<img src="https://img.shields.io/badge/Maven-C71A36.svg?style=flat&logo=Apache-Maven&logoColor=white" alt="Maven">
<img src="https://img.shields.io/badge/Axios-5A29E4.svg?style=flat&logo=Axios&logoColor=white" alt="Axios">
<img src="https://img.shields.io/badge/JWT-000000.svg?style=flat&logo=JSON-Web-Tokens&logoColor=white" alt="JWT">

</div>
<br>

---

## Table of Contents

- [Overview](#overview)
- [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
    - [Usage](#usage)
    - [Testing](#testing)
- [Features](#features)
- [Project Structure](#project-structure)
    - [Project Index](#project-index)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

Shop Game Management System is a comprehensive full-stack e-commerce platform designed specifically for digital game distribution and management. It provides a robust backend API built with Spring Boot and a modern React-based frontend for managing game inventory, user transactions, and payment processing. The platform streamlines game sales operations with secure, role-based access, comprehensive data models, and intuitive interfaces.

**Why Shop Game Management System?**

This project aims to facilitate efficient digital game commerce through scalable APIs and user-friendly dashboards. The core features include:

- 🎮 **Game Catalog Management:** Complete CRUD operations for games, categories, and system requirements with advanced filtering capabilities.
- 🔐 **Secure Authentication:** JWT-based security with OAuth2 Google integration and role-based access control.
- 💳 **Payment Integration:** Support for multiple payment gateways including MoMo and VNPay for seamless transactions.
- ☁️ **Cloud Infrastructure:** AWS integration for scalable storage (S3), database (RDS), and email services (SES).
- 🛒 **E-Commerce Features:** Complete shopping cart, wishlist, and order management system.
- 📊 **Admin Dashboard:** Comprehensive admin interface for inventory, orders, and user management.
- ⚙️ **Developer Focused:** Modular architecture with Docker deployment for easy scaling and maintenance.

---

## Features

|      | Component       | Details                                                                                     |
| :--- | :-------------- | :------------------------------------------------------------------------------------------ |
| ⚙️  | **Architecture**  | <ul><li>Spring Boot 3.5.5 backend with RESTful API design</li><li>React 18 + TypeScript frontend with Vite</li><li>Microservices-ready architecture with clear separation of concerns</li><li>Uses MVC pattern with service layer for backend</li></ul> |
| 🔩 | **Code Quality**  | <ul><li>TypeScript for type safety in frontend</li><li>MapStruct for DTO mapping in backend</li><li>Lombok for boilerplate reduction</li><li>Consistent code organization and naming conventions</li></ul> |
| 📄 | **Documentation** | <ul><li>Comprehensive README with setup instructions</li><li>Postman API collections included</li><li>Detailed setup guides for Google OAuth, Payment gateways, and AWS services</li></ul> |
| 🔌 | **Integrations**  | <ul><li>AWS RDS for MySQL database</li><li>AWS S3 for file storage</li><li>AWS SES for email services</li><li>Google OAuth2 for social login</li><li>MoMo and VNPay payment gateways</li></ul> |
| 🧩 | **Modularity**    | <ul><li>Frontend components are highly modular and reusable</li><li>Backend organized into distinct layers: controller, service, repository, entity</li><li>Environment-specific configurations</li></ul> |
| 🧪 | **Testing**       | <ul><li>Spring Boot Test framework for backend testing</li><li>HTTP test files included for API testing</li><li>Postman collections for integration testing</li></ul> |
| ⚡️  | **Performance**   | <ul><li>Vite for lightning-fast frontend builds</li><li>Spring Boot with optimized JPA queries</li><li>Docker containerization for consistent deployment</li><li>AWS RDS for scalable database performance</li></ul> |
| 🛡️ | **Security**      | <ul><li>JWT tokens for stateless authentication</li><li>OAuth2 integration for secure social login</li><li>Role-based access control (ADMIN, USER, MOD)</li><li>AWS security best practices</li></ul> |
| 📦 | **Dependencies**  | <ul><li>Backend: Spring Boot 3.5.5, Spring Security, Spring Data JPA, AWS SDK, MapStruct, Lombok</li><li>Frontend: React 18, TypeScript, Vite, Axios, React Router, GSAP</li><li>Package management via Maven and npm</li></ul> |

---

## Project Structure

```sh
└── Workshop-AWS/
    ├── .github
    │   └── workflows
    │       └── deploy.yml
    ├── Back-End
    │   ├── .env.example
    │   ├── docker-compose.yml
    │   ├── Dockerfile
    │   ├── mvnw
    │   ├── mvnw.cmd
    │   ├── pom.xml
    │   ├── setup.bat
    │   ├── setup.sh
    │   ├── README.md
    │   ├── GOOGLE_LOGIN_SETUP.md
    │   ├── PAYMENT_INTEGRATION.md
    │   ├── VNPAY_SETUP.md
    │   ├── scripts
    │   │   └── reseed_categories.sql
    │   ├── src
    │   │   ├── main
    │   │   │   ├── java
    │   │   │   │   └── com/se182393/baidautien
    │   │   │   │       ├── configuration
    │   │   │   │       ├── controller
    │   │   │   │       ├── dto
    │   │   │   │       ├── entity
    │   │   │   │       ├── exception
    │   │   │   │       ├── mapper
    │   │   │   │       ├── repository
    │   │   │   │       └── service
    │   │   │   └── resources
    │   │   │       ├── application.yaml
    │   │   │       ├── application-aws.yaml
    │   │   │       ├── application-docker.yaml
    │   │   │       └── templates
    │   │   └── test
    │   └── target
    └── Front-End
        ├── .env
        ├── .gitignore
        ├── index.html
        ├── package.json
        ├── tsconfig.json
        ├── vite.config.ts
        ├── README.md
        ├── GOOGLE-OAUTH-SETUP.md
        ├── S3_INTEGRATION_GUIDE.md
        ├── docker
        │   ├── docker-compose.yml
        │   ├── Dockerfile
        │   ├── Dockerfile.dev
        │   ├── nginx.conf
        │   └── README.md
        ├── public
        ├── src
        │   ├── api
        │   │   └── client.ts
        │   ├── components
        │   │   ├── admin
        │   │   ├── common
        │   │   ├── layout
        │   │   └── ui
        │   ├── context
        │   │   ├── CartContext.tsx
        │   │   ├── CurrencyContext.tsx
        │   │   └── WishlistContext.tsx
        │   ├── pages
        │   ├── services
        │   └── styles
        └── README.md
```

---

### Project Index

<details open>
	<summary><b><code>WORKSHOP-AWS/</code></b></summary>
	<!-- Back-End Submodule -->
	<details>
		<summary><b>Back-End</b></summary>
		<blockquote>
			<div class='directory-path' style='padding: 8px 0; color: #666;'>
				<code><b>⦿ Back-End</b></code>
			<table style='width: 100%; border-collapse: collapse;'>
			<thead>
				<tr style='background-color: #f8f9fa;'>
					<th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
					<th style='text-align: left; padding: 8px;'>Summary</th>
				</tr>
			</thead>
				<tr style='border-bottom: 1px solid #eee;'>
					<td style='padding: 8px;'><b><a href='https://github.com/minikoi408/ShopGameManagement/blob/master/Back-End/pom.xml'>pom.xml</a></b></td>
					<td style='padding: 8px;'>- Defines the project dependencies and build configuration for the Spring Boot-based game shop backend<br>- Manages core frameworks including Spring Security for authentication, JPA for data persistence, AWS SDK for cloud services, and payment integration libraries<br>- Ensures proper dependency versions and build processes for a production-ready e-commerce platform.</td>
				</tr>
				<tr style='border-bottom: 1px solid #eee;'>
					<td style='padding: 8px;'><b><a href='https://github.com/minikoi408/ShopGameManagement/blob/master/Back-End/README.md'>README.md</a></b></td>
					<td style='padding: 8px;'>- Provides comprehensive documentation for the backend API, including authentication endpoints, game management operations, cart and order handling, and payment processing<br>- Details RESTful API design, security mechanisms, and integration patterns for the game shop management system.</td>
				</tr>
			</table>
			<!-- Configuration Submodule -->
			<details>
				<summary><b>configuration</b></summary>
				<blockquote>
					<table style='width: 100%; border-collapse: collapse;'>
					<thead>
						<tr style='background-color: #f8f9fa;'>
							<th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
							<th style='text-align: left; padding: 8px;'>Summary</th>
						</tr>
					</thead>
						<tr style='border-bottom: 1px solid #eee;'>
							<td style='padding: 8px;'><b>SecurityConfig.java</b></td>
							<td style='padding: 8px;'>- Configures Spring Security with JWT authentication filter, CORS policies, and endpoint authorization rules<br>- Implements stateless session management and integrates custom authentication providers for secure API access control across the application.</td>
						</tr>
						<tr style='border-bottom: 1px solid #eee;'>
							<td style='padding: 8px;'><b>AWSConfig.java</b></td>
							<td style='padding: 8px;'>- Establishes AWS service clients for S3, SES, and RDS connectivity<br>- Manages credentials and regional configuration for cloud resource access, enabling file storage, email delivery, and database operations within the applications infrastructure.</td>
						</tr>
						<tr style='border-bottom: 1px solid #eee;'>
							<td style='padding: 8px;'><b>CorsConfig.java</b></td>
							<td style='padding: 8px;'>- Defines Cross-Origin Resource Sharing policies to allow frontend applications to communicate with the backend API<br>- Configures allowed origins, methods, and headers for secure cross-domain requests.</td>
						</tr>
					</table>
				</blockquote>
			</details>
			<!-- Controller Submodule -->
			<details>
				<summary><b>controller</b></summary>
				<blockquote>
					<table style='width: 100%; border-collapse: collapse;'>
					<thead>
						<tr style='background-color: #f8f9fa;'>
							<th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
							<th style='text-align: left; padding: 8px;'>Summary</th>
						</tr>
					</thead>
						<tr style='border-bottom: 1px solid #eee;'>
							<td style='padding: 8px;'><b>AuthController.java</b></td>
							<td style='padding: 8px;'>- Handles user authentication endpoints including login, registration, OAuth2 integration, password reset, and profile management<br>- Serves as the primary interface for user identity operations within the RESTful API architecture.</td>
						</tr>
						<tr style='border-bottom: 1px solid #eee;'>
							<td style='padding: 8px;'><b>GameController.java</b></td>
							<td style='padding: 8px;'>- Provides REST endpoints for game catalog management including CRUD operations, search, filtering by category and price range, and media upload handling<br>- Implements pagination and sorting capabilities for efficient data retrieval.</td>
						</tr>
						<tr style='border-bottom: 1px solid #eee;'>
							<td style='padding: 8px;'><b>CartController.java</b></td>
							<td style='padding: 8px;'>- Manages shopping cart operations through RESTful endpoints, enabling users to view cart contents, add items, update quantities, and remove items<br>- Integrates with user authentication to maintain cart state across sessions.</td>
						</tr>
						<tr style='border-bottom: 1px solid #eee;'>
							<td style='padding: 8px;'><b>OrderController.java</b></td>
							<td style='padding: 8px;'>- Facilitates order management including order creation, retrieval of order history, status tracking, and order cancellation<br>- Provides both user-specific and admin-level order access patterns for comprehensive e-commerce workflow support.</td>
						</tr>
						<tr style='border-bottom: 1px solid #eee;'>
							<td style='padding: 8px;'><b>PaymentController.java</b></td>
							<td style='padding: 8px;'>- Integrates payment gateway APIs for MoMo and VNPay, handling payment initiation, callback processing, and transaction verification<br>- Manages payment lifecycle events and status updates for secure transaction processing.</td>
						</tr>
					</table>
				</blockquote>
			</details>
			<!-- Service Submodule -->
			<details>
				<summary><b>service</b></summary>
				<blockquote>
					<table style='width: 100%; border-collapse: collapse;'>
					<thead>
						<tr style='background-color: #f8f9fa;'>
							<th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
							<th style='text-align: left; padding: 8px;'>Summary</th>
						</tr>
					</thead>
						<tr style='border-bottom: 1px solid #eee;'>
							<td style='padding: 8px;'><b>AuthService.java</b></td>
							<td style='padding: 8px;'>- Implements core authentication logic including JWT token generation/validation, password encryption, OAuth2 integration, and user session management<br>- Handles email verification workflows via AWS SES.</td>
						</tr>
						<tr style='border-bottom: 1px solid #eee;'>
							<td style='padding: 8px;'><b>GameService.java</b></td>
							<td style='padding: 8px;'>- Manages game inventory operations including CRUD functionality, category assignment, media upload to AWS S3, search indexing, and system requirements tracking<br>- Implements business logic for game catalog management.</td>
						</tr>
						<tr style='border-bottom: 1px solid #eee;'>
							<td style='padding: 8px;'><b>CartService.java</b></td>
							<td style='padding: 8px;'>- Handles shopping cart business logic including item addition with duplicate checking, quantity updates, cart total calculation, and cart persistence<br>- Manages cart-to-order conversion during checkout process.</td>
						</tr>
						<tr style='border-bottom: 1px solid #eee;'>
							<td style='padding: 8px;'><b>OrderService.java</b></td>
							<td style='padding: 8px;'>- Processes order lifecycle including order creation from cart, status tracking, payment verification, order fulfillment, and cancellation logic<br>- Manages order history and sends confirmation emails via AWS SES.</td>
						</tr>
						<tr style='border-bottom: 1px solid #eee;'>
							<td style='padding: 8px;'><b>PaymentService.java</b></td>
							<td style='padding: 8px;'>- Integrates with MoMo and VNPay APIs for payment processing, handles callback verification, manages transaction records, and updates order status based on payment outcomes<br>- Implements secure payment workflows.</td>
						</tr>
					</table>
				</blockquote>
			</details>
			<!-- Entity Submodule -->
			<details>
				<summary><b>entity</b></summary>
				<blockquote>
					<table style='width: 100%; border-collapse: collapse;'>
					<thead>
						<tr style='background-color: #f8f9fa;'>
							<th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
							<th style='text-align: left; padding: 8px;'>Summary</th>
						</tr>
					</thead>
						<tr style='border-bottom: 1px solid #eee;'>
							<td style='padding: 8px;'><b>User.java</b></td>
							<td style='padding: 8px;'>- Defines the User entity with fields for authentication, profile information, roles, and account status<br>- Maps to the users database table and establishes relationships with orders and cart entities.</td>
						</tr>
						<tr style='border-bottom: 1px solid #eee;'>
							<td style='padding: 8px;'><b>Game.java</b></td>
							<td style='padding: 8px;'>- Represents the Game entity containing product details including title, description, pricing, category, media URLs, system requirements, and inventory status<br>- Includes metadata timestamps and category relationships.</td>
						</tr>
						<tr style='border-bottom: 1px solid #eee;'>
							<td style='padding: 8px;'><b>Cart.java</b></td>
							<td style='padding: 8px;'>- Models shopping cart data structure with user association, cart items collection, and total price calculation<br>- Supports cart persistence across user sessions with timestamp tracking.</td>
						</tr>
						<tr style='border-bottom: 1px solid #eee;'>
							<td style='padding: 8px;'><b>Order.java</b></td>
							<td style='padding: 8px;'>- Defines order entity including user reference, order items, total amount, order status, payment method, and timestamp tracking<br>- Establishes order-to-items relationships for complete order representation.</td>
						</tr>
						<tr style='border-bottom: 1px solid #eee;'>
							<td style='padding: 8px;'><b>Payment.java</b></td>
							<td style='padding: 8px;'>- Represents payment transaction records with order association, payment gateway details, transaction ID, amount, status, and timestamp tracking<br>- Supports payment reconciliation and audit trails.</td>
						</tr>
					</table>
				</blockquote>
			</details>
		</blockquote>
	</details>
	<!-- Front-End Submodule -->
	<details>
		<summary><b>Front-End</b></summary>
		<blockquote>
			<div class='directory-path' style='padding: 8px 0; color: #666;'>
				<code><b>⦿ Front-End</b></code>
			<table style='width: 100%; border-collapse: collapse;'>
			<thead>
				<tr style='background-color: #f8f9fa;'>
					<th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
					<th style='text-align: left; padding: 8px;'>Summary</th>
				</tr>
			</thead>
				<tr style='border-bottom: 1px solid #eee;'>
					<td style='padding: 8px;'><b><a href='https://github.com/minikoi408/ShopGameManagement/blob/master/Front-End/package.json'>package.json</a></b></td>
					<td style='padding: 8px;'>- Defines frontend application dependencies, scripts, and configuration for a React-based game shop interface<br>- Manages build tools (Vite), UI libraries, routing, state management, and development utilities for creating a modern, responsive e-commerce experience.</td>
				</tr>
				<tr style='border-bottom: 1px solid #eee;'>
					<td style='padding: 8px;'><b><a href='https://github.com/minikoi408/ShopGameManagement/blob/master/Front-End/vite.config.ts'>vite.config.ts</a></b></td>
					<td style='padding: 8px;'>- Configures Vite build tool with React plugin, development server settings, and optimization parameters<br>- Enables fast refresh, hot module replacement, and production build optimization for enhanced development experience.</td>
				</tr>
				<tr style='border-bottom: 1px solid #eee;'>
					<td style='padding: 8px;'><b><a href='https://github.com/minikoi408/ShopGameManagement/blob/master/Front-End/README.md'>README.md</a></b></td>
					<td style='padding: 8px;'>- Provides comprehensive documentation for frontend setup, component architecture, styling guidelines, and deployment instructions<br>- Details React component hierarchy, routing configuration, and integration with backend API services.</td>
				</tr>
			</table>
			<!-- Components Submodule -->
			<details>
				<summary><b>components</b></summary>
				<blockquote>
					<table style='width: 100%; border-collapse: collapse;'>
					<thead>
						<tr style='background-color: #f8f9fa;'>
							<th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
							<th style='text-align: left; padding: 8px;'>Summary</th>
						</tr>
					</thead>
						<tr style='border-bottom: 1px solid #eee;'>
							<td style='padding: 8px;'><b>ErrorBoundary.tsx</b></td>
							<td style='padding: 8px;'>- Implements React error boundary for graceful error handling, displaying user-friendly error messages and providing recovery options<br>- Captures component tree errors to prevent full application crashes.</td>
						</tr>
						<tr style='border-bottom: 1px solid #eee;'>
							<td style='padding: 8px;'><b>Header.tsx</b></td>
							<td style='padding: 8px;'>- Renders the main navigation header with logo, search functionality, cart icon with item count, user authentication status, and responsive menu<br>- Integrates with cart context and authentication state.</td>
						</tr>
						<tr style='border-bottom: 1px solid #eee;'>
							<td style='padding: 8px;'><b>GameCard.tsx</b></td>
							<td style='padding: 8px;'>- Displays individual game information in card format including thumbnail, title, price, rating, and quick action buttons<br>- Supports add-to-cart, wishlist toggle, and game detail navigation functionality.</td>
						</tr>
						<tr style='border-bottom: 1px solid #eee;'>
							<td style='padding: 8px;'><b>CartDrawer.tsx</b></td>
							<td style='padding: 8px;'>- Provides sliding cart panel showing current cart items, quantities, subtotal, and checkout button<br>- Enables quantity updates and item removal with real-time total calculation.</td>
						</tr>
						<tr style='border-bottom: 1px solid #eee;'>
							<td style='padding: 8px;'><b>CheckoutForm.tsx</b></td>
							<td style='padding: 8px;'>- Implements multi-step checkout process including shipping information collection, payment method selection (MoMo/VNPay), order review, and payment submission<br>- Handles form validation and payment gateway integration.</td>
						</tr>
					</table>
				</blockquote>
			</details>
			<!-- Pages Submodule -->
			<details>
				<summary><b>pages</b></summary>
				<blockquote>
					<table style='width: 100%; border-collapse: collapse;'>
					<thead>
						<tr style='background-color: #f8f9fa;'>
							<th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
							<th style='text-align: left; padding: 8px;'>Summary</th>
						</tr>
					</thead>
						<tr style='border-bottom: 1px solid #eee;'>
							<td style='padding: 8px;'><b>HomePage.tsx</b></td>
							<td style='padding: 8px;'>- Displays featured games, promotional banners, category navigation, and trending games section<br>- Serves as the main landing page with curated content and calls-to-action for user engagement.</td>
						</tr>
						<tr style='border-bottom: 1px solid #eee;'>
							<td style='padding: 8px;'><b>GameDetailPage.tsx</b></td>
							<td style='padding: 8px;'>- Shows comprehensive game information including screenshots, videos, description, system requirements, user reviews, and purchase options<br>- Enables game purchase and wishlist addition.</td>
						</tr>
						<tr style='border-bottom: 1px solid #eee;'>
							<td style='padding: 8px;'><b>CategoriesPage.tsx</b></td>
							<td style='padding: 8px;'>- Displays games filtered by category with sorting and filtering controls<br>- Implements grid layout with pagination for browsing large game catalogs organized by genre or tag.</td>
						</tr>
						<tr style='border-bottom: 1px solid #eee;'>
							<td style='padding: 8px;'><b>CheckoutPage.tsx</b></td>
							<td style='padding: 8px;'>- Manages checkout workflow including cart review, shipping details, payment method selection, and order confirmation<br>- Integrates with payment services for transaction processing.</td>
						</tr>
						<tr style='border-bottom: 1px solid #eee;'>
							<td style='padding: 8px;'><b>ProfilePage.tsx</b></td>
							<td style='padding: 8px;'>- Displays user profile information, purchase history, wishlist, and account settings<br>- Enables profile editing, password changes, and order tracking.</td>
						</tr>
					</table>
				</blockquote>
			</details>
			<!-- Services Submodule -->
			<details>
				<summary><b>services</b></summary>
				<blockquote>
					<table style='width: 100%; border-collapse: collapse;'>
					<thead>
						<tr style='background-color: #f8f9fa;'>
							<th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
							<th style='text-align: left; padding: 8px;'>Summary</th>
						</tr>
					</thead>
						<tr style='border-bottom: 1px solid #eee;'>
							<td style='padding: 8px;'><b>authService.ts</b></td>
							<td style='padding: 8px;'>- Handles authentication API calls including login, registration, logout, token refresh, and OAuth2 integration<br>- Manages JWT token storage and automatic authentication header injection.</td>
						</tr>
						<tr style='border-bottom: 1px solid #eee;'>
							<td style='padding: 8px;'><b>gameService.ts</b></td>
							<td style='padding: 8px;'>- Provides API client methods for game catalog operations including fetching games, categories, search, filtering, and game details retrieval<br>- Handles pagination and sorting parameters.</td>
						</tr>
						<tr style='border-bottom: 1px solid #eee;'>
							<td style='padding: 8px;'><b>cartService.ts</b></td>
							<td style='padding: 8px;'>- Manages cart-related API interactions including fetching cart, adding items, updating quantities, and removing items<br>- Syncs local cart state with backend cart data.</td>
						</tr>
						<tr style='border-bottom: 1px solid #eee;'>
							<td style='padding: 8px;'><b>orderService.ts</b></td>
							<td style='padding: 8px;'>- Handles order management API calls including order creation, fetching order history, order details, and order cancellation<br>- Processes order status updates and tracking information.</td>
						</tr>
						<tr style='border-bottom: 1px solid #eee;'>
							<td style='padding: 8px;'><b>paymentService.ts</b></td>
							<td style='padding: 8px;'>- Integrates with payment gateway APIs for initiating payments, handling callbacks, and verifying transaction status<br>- Supports MoMo and VNPay payment flows.</td>
						</tr>
					</table>
				</blockquote>
			</details>
		</blockquote>
	</details>
</details>

---

## Getting Started

### Prerequisites

This project requires the following dependencies:

- **Java:** Version 21 or higher
- **Node.js:** Version 18 or higher
- **npm:** Version 9 or higher
- **Maven:** Version 3.8 or higher
- **Docker:** Version 20.10 or higher (optional but recommended)
- **MySQL:** Version 9.4 or higher (or use Docker container)

### Installation

Build Shop Game Management System from source and install dependencies:

#### **Backend Setup (Windows):**

```powershell
# 1. Clone the repository
git clone https://github.com/minikoi408/ShopGameManagement.git
cd Workshop-AWS\Back-End

# 2. Configure environment variables
copy .env.example .env.aws
# Edit .env.aws with your AWS credentials and database settings

# 3. Run setup script
.\setup.bat

# 4. Start with Docker (recommended)
docker-compose up -d

# Or build and run manually
mvn clean install
mvn spring-boot:run
```

#### **Backend Setup (Linux/Mac):**

```bash
# 1. Clone the repository
git clone https://github.com/minikoi408/ShopGameManagement.git
cd Workshop-AWS/Back-End

# 2. Configure environment variables
cp .env.example .env.aws
# Edit .env.aws with your AWS credentials and database settings

# 3. Make scripts executable and run setup
chmod +x *.sh
./setup.sh

# 4. Start with Docker (recommended)
docker-compose up -d

# Or build and run manually
mvn clean install
mvn spring-boot:run
```

#### **Frontend Setup:**

**Using [npm](https://www.npmjs.com/):**

```powershell
cd ..\Front-End

# Install dependencies
npm install

# Configure environment
# Edit .env file with API endpoint

# Start development server
npm run dev
```

**Using [yarn](https://yarnpkg.com/):**

```powershell
cd ..\Front-End

# Install dependencies
yarn install

# Configure environment
# Edit .env file with API endpoint

# Start development server
yarn dev
```

### Usage

Run the project with:

#### **Backend:**

**Using [Docker](https://www.docker.com/) (Recommended):**

```sh
cd Back-End
docker-compose up -d
```

**Using [Maven](https://maven.apache.org/):**

```sh
cd Back-End
mvn spring-boot:run
```

#### **Frontend:**

**Using [npm](https://www.npmjs.com/):**

```sh
cd Front-End
npm run dev
```

**Using [yarn](https://yarnpkg.com/):**

```sh
cd Front-End
yarn dev
```

#### **Access URLs:**

| Service | URL | Description |
|---------|-----|-------------|
| Frontend | http://localhost:5173 | React application |
| Backend API | http://localhost:8080 | Spring Boot REST API |
| MySQL | localhost:3307 | Database (Docker) |
| API Docs | http://localhost:8080/swagger-ui.html | Swagger documentation |

### Testing

Shop Game Management System uses JUnit and Spring Boot Test framework. Run the test suite with:

#### **Backend Testing:**

**Using [Maven](https://maven.apache.org/):**

```sh
cd Back-End

# Run all tests
mvn test

# Run specific test class
mvn test -Dtest=GameServiceTest

# Run tests with coverage
mvn clean test jacoco:report
```

#### **Frontend Testing:**

**Using [npm](https://www.npmjs.com/):**

```sh
cd Front-End

# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

**Using [yarn](https://yarnpkg.com/):**

```sh
cd Front-End

# Run tests
yarn test

# Run tests with coverage
yarn test:coverage
```

#### **API Testing:**

Import the provided Postman collections:
- `ShopGameManagement-COMPLETE-API.postman_collection.json`
- `VNPay-API.postman_collection.json`

---

## Roadmap

### ✅ Completed (v1.0)

- [X] **JWT + OAuth2 Authentication:** Secure user authentication with Google social login
- [X] **Game Catalog CRUD:** Complete game management with categories and system requirements
- [X] **Shopping Cart:** Add to cart, update quantities, cart persistence
- [X] **Payment Integration:** MoMo and VNPay payment gateway support
- [X] **AWS Integration:** S3 storage, SES email, RDS database
- [X] **Responsive UI:** Mobile-first design with smooth animations
- [X] **Docker Deployment:** Containerized application for easy deployment
- [X] **Order Management:** Complete order processing and tracking

### 🚧 In Progress (v1.5)

- [ ] **Advanced Search:** Elasticsearch integration for better search performance
- [ ] **User Reviews:** Game rating and review system
- [ ] **Wishlist Sharing:** Share wishlists with friends
- [ ] **Admin Analytics:** Enhanced dashboard with charts and metrics
- [ ] **Email Templates:** Improved email notifications with branded templates

### 📋 Planned (v2.0)

- [ ] **Multi-language Support:** i18n implementation for multiple languages
- [ ] **Real-time Notifications:** WebSocket-based live notifications
- [ ] **Mobile App:** React Native application for iOS and Android
- [ ] **AI Recommendations:** Machine learning-based game recommendations
- [ ] **Kubernetes Deployment:** K8s configurations for scalable cloud deployment
- [ ] **Social Features:** User profiles, friends system, activity feeds
- [ ] **Gift Cards:** Digital gift card purchase and redemption
- [ ] **Subscription Service:** Game subscription plans with recurring billing

---

## Contributing

Contributions are welcome! Please follow these guidelines:

### Contributing Guidelines

1. **Fork the Repository**: Start by forking the project repository to your GitHub account.
2. **Clone Locally**: Clone the forked repository to your local machine.
   ```sh
   git clone https://github.com/minikoi408/ShopGameManagement
   cd ShopGameManagement
   ```
3. **Create a New Branch**: Always work on a new branch with a descriptive name.
   ```sh
   git checkout -b feature/amazing-feature
   ```
4. **Make Your Changes**: Develop and test your changes locally.
5. **Follow Code Style**: Ensure your code follows the project's coding standards.
6. **Write Tests**: Add tests for new features or bug fixes.
7. **Commit Your Changes**: Commit with a clear, descriptive message.
   ```sh
   git commit -m 'feat: add amazing feature'
   ```
8. **Push to GitHub**: Push the changes to your forked repository.
   ```sh
   git push origin feature/amazing-feature
   ```
9. **Submit a Pull Request**: Create a PR against the original project repository.
10. **Code Review**: Wait for code review and address any feedback.

### Development Guidelines

- Follow Java code conventions for backend development
- Use TypeScript and follow React best practices for frontend
- Write meaningful commit messages following conventional commits
- Add JSDoc/JavaDoc comments for public APIs
- Update documentation when adding new features
- Ensure all tests pass before submitting PR

### Community

- **💬 [Join the Discussions](https://github.com/minikoi408/ShopGameManagement/discussions)**: Share insights, provide feedback, or ask questions.
- **🐛 [Report Issues](https://github.com/minikoi408/ShopGameManagement/issues)**: Submit bugs found or log feature requests.
- **💡 [Submit Pull Requests](https://github.com/minikoi408/ShopGameManagement/pulls)**: Review open PRs and submit your own.

---

## License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## Documentation

### Additional Resources

#### Backend Documentation

| File | Description |
|------|-------------|
| [Backend README](./Back-End/README.md) | Detailed Spring Boot backend documentation |
| [Google OAuth Setup](./Back-End/GOOGLE_LOGIN_SETUP.md) | Google OAuth2 integration guide |
| [Payment Integration](./Back-End/PAYMENT_INTEGRATION.md) | MoMo & VNPay integration guide |
| [VNPay Setup](./Back-End/VNPAY_SETUP.md) | VNPay configuration instructions |
| [VNPay Quickstart](./Back-End/VNPAY_QUICKSTART.md) | Quick start guide for VNPay |
| [System Requirements](./Back-End/SYSTEM-REQUIREMENTS-README.md) | System requirements documentation |

#### Frontend Documentation

| File | Description |
|------|-------------|
| [Frontend README](./Front-End/README.md) | Detailed React frontend documentation |
| [Google OAuth Frontend](./Front-End/GOOGLE-OAUTH-SETUP.md) | Frontend OAuth setup guide |
| [S3 Integration](./Front-End/S3_INTEGRATION_GUIDE.md) | AWS S3 integration guide |
| [Docker Guide](./Front-End/docker/README.md) | Docker deployment instructions |

### API Documentation

The complete API documentation is available in Postman format:

- **[Complete API Collection](./Back-End/ShopGameManagement-COMPLETE-API.postman_collection.json)**
- **[VNPay API Collection](./Back-End/VNPay-API.postman_collection.json)**

Import these collections into Postman to test all available endpoints!

### Environment Configuration

#### Backend (.env.aws)

```bash
# AWS Configuration
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=ap-southeast-1
AWS_S3_BUCKET_NAME=your-bucket-name
AWS_SES_FROM_EMAIL=noreply@yourdomain.com

# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=shop_game_management
DB_USERNAME=root
DB_PASSWORD=your_password

# JWT Configuration
JWT_SIGNER_KEY=your-secure-key-min-512-bits
JWT_VALID_DURATION=3600
JWT_REFRESHABLE_DURATION=86400

# Google OAuth2
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-secret

# Payment Gateways
MOMO_PARTNER_CODE=your_code
MOMO_ACCESS_KEY=your_key
MOMO_SECRET_KEY=your_secret

VNPAY_TMN_CODE=your_code
VNPAY_HASH_SECRET=your_secret
```

#### Frontend (.env)

```bash
VITE_API_BASE=http://localhost:8080
VITE_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
```

---

## Troubleshooting

### Common Issues

#### Backend Issues

**Issue: Backend won't start**

```powershell
# Check Java version (should be 21+)
java -version

# Rebuild the project
cd Back-End
mvn clean install -DskipTests

# Check if port 8080 is available
netstat -ano | findstr :8080  # Windows
lsof -i :8080  # Linux/Mac
```

**Issue: Database connection error**

```powershell
# Verify MySQL is running
docker ps | findstr mysql

# Reset database
cd Back-End
docker-compose down -v
docker-compose up -d

# Check database logs
docker-compose logs mysql
```

**Issue: AWS S3 upload failed**

```powershell
# Verify AWS credentials
echo $env:AWS_ACCESS_KEY_ID  # Windows PowerShell
echo $AWS_ACCESS_KEY_ID  # Linux/Mac

# Test S3 access using AWS CLI
aws s3 ls s3://your-bucket-name

# Check IAM permissions for S3 and SES
```

#### Frontend Issues

**Issue: Frontend won't start**

```powershell
# Clear node modules and reinstall
cd Front-End
rm -rf node_modules package-lock.json
npm install

# Or with yarn
rm -rf node_modules yarn.lock
yarn install

# Check Node version (should be 18+)
node --version
```

**Issue: API calls failing**

```powershell
# Verify backend is running
curl http://localhost:8080/api/health

# Check CORS configuration in backend
# Verify .env file has correct API_BASE URL

# Check browser console for detailed errors
```

#### Payment Gateway Issues

**Issue: Payment callback not received**

```powershell
# For local testing, use ngrok
ngrok http 8080

# Update .env.aws with ngrok URL
# Update payment gateway callback URLs in provider dashboard
```

**Issue: Payment verification failed**

```bash
# Verify payment gateway credentials
# Check hash/signature generation algorithm
# Review payment gateway API logs
# Ensure timezone synchronization for timestamp validation
```

---

## Docker Commands

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f backend
docker-compose logs -f mysql

# Stop services
docker-compose down

# Stop and remove volumes (reset database)
docker-compose down -v

# Rebuild containers
docker-compose up -d --build

# Execute commands in running container
docker-compose exec backend bash
docker-compose exec mysql mysql -u root -p
```

---

## Default Credentials

### Admin Account

| Email | Password | Role |
|-------|----------|------|
| admin@shopgame.com | Admin@123 | ADMIN |

### Test Users

| Email | Password | Role |
|-------|----------|------|
| user1@test.com | User@123 | USER |
| mod1@test.com | Mod@123 | MOD |

**⚠️ Important:** Change these credentials in production!

---

## Contact & Support

- **GitHub Repository:** [minikoi408/ShopGameManagement](https://github.com/minikoi408/ShopGameManagement)
- **Current Branch:** `feature/vnpay-integration`
- **Issues:** [GitHub Issues](https://github.com/minikoi408/ShopGameManagement/issues)
- **Discussions:** [GitHub Discussions](https://github.com/minikoi408/ShopGameManagement/discussions)

---

<div align="center">

**Made with ❤️ by ShopGameManagement Team**

⭐ Star this repo if you find it helpful!

[⬆ Back to Top](#top)

</div>
