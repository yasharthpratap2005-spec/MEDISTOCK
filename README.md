# MEDISTOCK
### Pharmacy Inventory and Medicine Stock Management System

> An academic mini project demonstrating full-stack Java web development using Spring Boot and MySQL, developed during industrial training in the healthcare quick-commerce domain.

---

## Features

- ✅ JWT-based authentication with BCrypt password hashing
- ✅ Role-based access control (ADMIN / STAFF)
- ✅ Complete medicine CRUD management
- ✅ Category management
- ✅ Real-time inventory monitoring with stock status
- ✅ Stock-in / Stock-out with full transaction history
- ✅ Low stock detection and alerts
- ✅ Medicine expiry monitoring (expired + expiring soon)
- ✅ Order management with status workflow
- ✅ Expired medicine order prevention
- ✅ Dashboard with KPI statistics
- ✅ Search and filtering across medicines
- ✅ User management (admin only)
- ✅ Responsive sidebar UI (Bootstrap 5 + Bootstrap Icons)
- ✅ Swagger/OpenAPI documentation

---

## Technology Stack

| Layer | Technology |
|-------|-----------|
| Backend | Java 17, Spring Boot 3.2.3 |
| Persistence | Spring Data JPA, Hibernate |
| Security | Spring Security, JWT |
| Database | MySQL 8.x |
| Frontend | HTML5, CSS3, Vanilla JavaScript |
| UI Framework | Bootstrap 5, Bootstrap Icons |
| Documentation | SpringDoc OpenAPI (Swagger UI) |
| Build | Maven (with Maven Wrapper) |
| Testing | JUnit 5, Mockito |

---

## Architecture

```
Frontend (HTML/CSS/JS)
       ↓  REST API (JSON)
Controller Layer
       ↓
Service Layer (Business Logic)
       ↓
Repository Layer (Spring Data JPA)
       ↓
Entity Layer (Hibernate)
       ↓
MySQL Database
```

---

## Project Structure

```
MEDISTOCK/
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/medistock/
│   │   │   │   ├── MedistockApplication.java
│   │   │   │   ├── config/
│   │   │   │   │   ├── SecurityConfig.java
│   │   │   │   │   └── DataInitializer.java
│   │   │   │   ├── controller/        (REST controllers)
│   │   │   │   ├── dto/               (Request/Response DTOs)
│   │   │   │   ├── entity/            (JPA entities)
│   │   │   │   ├── repository/        (Spring Data repositories)
│   │   │   │   ├── service/           (Business logic)
│   │   │   │   ├── security/          (JWT, UserDetails)
│   │   │   │   └── exception/         (Global exception handler)
│   │   │   └── resources/
│   │   │       ├── application.properties
│   │   │       └── static/            (Frontend files)
│   │   └── test/                      (Unit tests)
│   └── pom.xml
├── database/
│   └── schema.sql
├── postman/
│   └── MEDISTOCK-API-Collection.json
├── documentation/
└── README.md
```

---

## Database Setup

### Prerequisites
- MySQL 8.x running on localhost:3306
- Default root credentials (configurable in `application.properties`)

### Setup
1. Create the database (auto-created on first run via Hibernate):
   ```sql
   CREATE DATABASE IF NOT EXISTS medistock_db;
   ```
2. Or run the schema script:
   ```bash
   mysql -u root -p < database/schema.sql
   ```

---

## Backend Setup

### Prerequisites
- Java 17 or later
- MySQL 8.x

### Configuration
Edit `backend/src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/medistock_db?createDatabaseIfNotExist=true
spring.datasource.username=root
spring.datasource.password=your_password
```

### Running the Application

**Windows:**
```cmd
cd backend
mvnw.cmd spring-boot:run
```

**Linux/Mac:**
```bash
cd backend
./mvnw spring-boot:run
```

The application starts on **http://localhost:8080**

### Build JAR
```cmd
mvnw.cmd clean package -DskipTests
java -jar target/medistock-backend-1.0.0.jar
```

---

## Frontend Setup

The frontend is served as static files from Spring Boot.

- Login: http://localhost:8080/pages/login.html
- Dashboard: http://localhost:8080/pages/dashboard.html
- Medicines: http://localhost:8080/pages/medicines.html
- Inventory: http://localhost:8080/pages/inventory.html
- Orders: http://localhost:8080/pages/orders.html
- Categories: http://localhost:8080/pages/categories.html
- Low Stock: http://localhost:8080/pages/low-stock.html
- Expiry Alerts: http://localhost:8080/pages/expiry.html
- Users: http://localhost:8080/pages/users.html

---

## Default Credentials

> ⚠️ These are **development/demo credentials only**. Change before production use.

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@medistock.com | Admin@123 |
| Staff | staff@medistock.com | Staff@123 |

---

## API Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/login | Authenticate and get JWT |
| GET | /api/dashboard/summary | Dashboard statistics |
| GET | /api/medicines | List/search medicines |
| POST | /api/medicines | Create medicine (ADMIN) |
| PUT | /api/medicines/{id} | Update medicine (ADMIN) |
| GET | /api/medicines/low-stock | Low stock medicines |
| GET | /api/medicines/expiring | Expiring soon |
| GET | /api/medicines/expired | Expired medicines |
| GET | /api/inventory | All inventory |
| POST | /api/inventory/{id}/stock-in | Add stock |
| POST | /api/inventory/{id}/stock-out | Remove stock |
| GET | /api/inventory/{id}/history | Transaction history |
| GET | /api/orders | All orders |
| POST | /api/orders | Create order |
| PATCH | /api/orders/{id}/status | Update status |
| GET | /api/categories | All categories |
| POST | /api/categories | Create category (ADMIN) |
| GET | /api/users | All users (ADMIN) |
| POST | /api/users | Create user (ADMIN) |

**Swagger UI:** http://localhost:8080/swagger-ui.html

---

## Testing

### Run Unit Tests
```cmd
mvnw.cmd test
```

### Test Coverage
- MedicineServiceTest - Medicine CRUD, stock/expiry status
- InventoryServiceTest - Stock-in, Stock-out, negative stock prevention
- OrderServiceTest - Order creation, expiry check, insufficient stock, status transitions

---

## Seed Data

On first startup, the `DataInitializer` automatically creates:
- **2 users** (1 Admin, 1 Staff)
- **10 categories** (Pain Relief, Antibiotics, Vitamins, etc.)
- **20 medicines** including:
  - Normal stock medicines
  - Low stock medicines
  - Out-of-stock medicines
  - Expiring soon (within 30 days)
  - Expired medicines

---

## Screenshots

> *(Add screenshots here after the first run)*

- Login Page
- Dashboard
- Medicine Management
- Inventory
- Low Stock Alerts
- Expiry Monitoring
- Order Management

---

## Future Scope

- PDF invoice generation for orders
- Email/SMS notifications for low stock and expiry
- Barcode scanning integration
- Supplier management module
- Advanced reporting and analytics
- Mobile-responsive PWA
- Multi-branch support
- Integration with national drug database

---

## Academic Context

This project was developed as an academic mini project based on exposure to pharmacy operations and inventory management during industrial training in the healthcare quick-commerce domain. It demonstrates practical implementation of:
- Full-stack Java web development
- RESTful API design
- Relational database design
- Security best practices
- Clean architecture patterns

---

*MEDISTOCK v1.0.0 — B.Tech Information Technology Academic Project*
