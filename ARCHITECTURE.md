# Architecture Overview

## Microservices

### 1. API Gateway
Handles all browser requests and forwards API traffic to internal services.

### 2. Auth Service
Responsible for:
- user registration
- password hashing
- login
- JWT issuance
- token verification

### 3. Product Service
Responsible for:
- storing products/services
- listing products
- retrieving single product details
- seeding demo products

### 4. Review Service
Responsible for:
- storing reviews
- linking reviews to product IDs and user IDs
- enforcing ownership for update/delete

### 5. User Service
Responsible for:
- profile retrieval
- aggregation of user details and the user’s reviews

## MVC Inside Each Service
- **Model**: database schema and persistence logic
- **Controller**: business logic
- **Routes**: API endpoints
- **Middleware**: reusable logic such as authentication

## Data Separation
- `authdb`
- `productdb`
- `reviewdb`

This keeps domains isolated while still using one MongoDB container for development.
