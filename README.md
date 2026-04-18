# Urban Farming API

A robust RESTful API designed to power an urban farming marketplace and community platform. This backend service facilitates the connection between urban farmers (vendors) and consumers, offering features for produce sales, farming space rentals, and community discussions. 

Built with scalability and security in mind, this project includes comprehensive validation, detailed API documentation, request logging, and a performance benchmarking suite.



## Key Features

* **Role-Based Access Control (RBAC):** Secure session-based authentication utilizing JWT, with enforced roles for Administrators, Vendors, and Standard Users.
* **Geospatial Marketplace:** Advanced search capabilities allowing users to find fresh produce and community rental spaces within a specific geographic radius.
* **Community Forum:** A structured discussion platform supporting threaded posts and nested replies to foster community engagement.
* **Order Management & Inventory:** Transactional logic that securely decrements vendor inventory when user orders are placed.
* **Strict Data Validation:** All incoming requests are strictly validated using Zod, ensuring data integrity and providing clear, actionable error messages.
* **Application Security & Logging:** Integrated Helmet for secure HTTP headers, CORS protection, and Winston paired with Morgan for centralized file-based auditing and error logging.
* **Secure File Uploads:** Certificate and vendor credential image uploads managed and processed securely using Multer.
* **Rate Limiting:** Protects the platform against brute-force attacks and regulates excessive load across API endpoints using a configurable rate limiter mechanism.

## Technology Stack

* **Runtime & Framework:** Node.js, Express.js
* **Database & ORM:** PostgreSQL, Prisma ORM
* **Validation & Security:** Zod, Helmet, CORS, JSON Web Tokens (JWT), Argon2
* **Documentation:** Swagger UI (OpenAPI specification)
* **Testing & Tools:** Autocannon (Load testing / Benchmarking)
* **File Processing:** Multer

## Architecture Overview

The application follows a clean, modular Model-View-Controller (MVC) inspired layered architecture. The codebase is organized by technical domain to cleanly separate concerns, improve maintainability, and ensure scalability.

Here is the structural breakdown of the source code:

* **Configuration:** Centralizes database connections and ORM initialization.
* **Controllers:** The entry point for business logic. They extract request parameters, manage response formatting, and route data cleanly to the services.
* **Documentation:** Contains Swagger and OpenAPI structural mappings.
* **Middlewares:** Request interceptors handling cross-cutting concerns like JWT authentication, central error handling, rate limiting, role-based authorization, file upload interception, and Zod payload validation.
* **Routes:** Defines all HTTP API endpoints and attaches the corresponding middlewares and controllers.
* **Services:** Encapsulates the core business algorithms, transactional logic, and direct database queries using the Prisma ORM.
* **Utilities:** Reusable helper components like JWT signing, password hashing, custom error classes, and localized loggers.
* **Validations:** Strictly enforces data payloads utilizing independent Zod schemas before requests can even reach the controller layer.

## Getting Started

### Prerequisites
* Node.js (v18 or higher recommended)
* Configuration for a PostgreSQL database

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/lauhemahfus/urban-farming.git
   cd urban-farming
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root directory based on the provided `.env.example` file.
   ```env
   PORT=3000
   NODE_ENV=development
   DATABASE_URL="postgresql://user:password@host/database?connection_limit=50&pool_timeout=30"
   JWT_ACCESS_SECRET=your_secure_access_secret
   JWT_ACCESS_EXPIRES_IN=1d
   ```

4. **Database Initialization & Seeding:**
   Synchronize the Prisma schema with your database and run the seeder script to populate initial testing data (Admin, Users, Vendors, Produce, and Posts).
   ```bash
   npx prisma db push
   npx prisma generate
   npm run seed
   ```

   **Default Seed Credentials:**
   - **Admin:**
     - Email: `admin@example.com`
     - Password: `admin@123`
   - **Users:**
     - Emails: `user001@example.com` to `user005@example.com`
     - Password: `user@123`
   - **Vendors:**
     - Emails: `vendoer001@example.com` to `vendoer010@example.com`
     - Password: `vendoer@123`

5. **Start the Application:**
   ```bash
   # Development mode with automatic restarts
   npm run dev

   # Production mode
   npm start
   ```

## API Documentation

The project includes an interactive Swagger UI to explore and test the available REST endpoints.

Once the server is running, navigate to the documentation at:
**`http://localhost:3000/api/v1/docs`**

### Primary Endpoint Categories

* **Auth (`/api/v1/auth`):** Registration, login, and secure token generation.
* **Produce (`/api/v1/produce`):** Paginated marketplace listings, geospatial searches by latitude/longitude, and vendor inventory management.
* **Rentals (`/api/v1/rentals`):** Browsing and reserving farming spaces.
* **Orders (`/api/v1/orders`):** Secure order placement and historical order fetching.
* **Community (`/api/v1/community`):** Forum posts, comment replies, and community interaction endpoints.
* **Vendor (`/api/v1/vendor`):** Profile registration and certification management.
* **Admin (`/api/v1/admin`):** Dashboard metrics, system oversight, and explicit access controls.

## System Benchmarking

To ensure the backend performs reliably under heavy concurrency, an automated benchmark script (`benchmark.mjs`) is included. It utilizes Autocannon to stress-test critical read and write pathways.

**Running the Benchmark:**
```bash
node benchmark.mjs
```
Detailed benchmark results, including Min/Max latencies and total throughput arrays, are compiled and saved locally into `benchmark-report.json` and documented in `BENCHMARK.md`.
