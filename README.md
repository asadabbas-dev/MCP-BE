# My Class Portal (MCP) - Backend API

Backend API for My Class Portal built with NestJS, TypeORM, and PostgreSQL.

## 🛠️ Tech Stack

- **Framework**: NestJS
- **Database**: PostgreSQL
- **ORM**: TypeORM
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: class-validator, class-transformer
- **API Documentation**: Swagger/OpenAPI
- **Language**: TypeScript

## 📋 Prerequisites

- **Node.js** 18+ installed
- **PostgreSQL** installed and running (or use pgAdmin)
- **npm** or **yarn** package manager

## 🚀 Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the `backend` directory:

```env
# Database Configuration (PostgreSQL)
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your-password
DB_DATABASE=mcp_db
DB_SSL=false

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d

# Application
PORT=3001
NODE_ENV=development

# CORS
CORS_ORIGIN=http://localhost:3000
```

### 3. Create Database

**Using pgAdmin (GUI):**
1. Open pgAdmin
2. Right-click on "Databases" → "Create" → "Database"
3. Name: `mcp_db`
4. Click "Save"

**Using Command Line:**
```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE mcp_db;

# Exit
\q
```

### 4. Run the Application

**Development mode:**
```bash
npm run start:dev
```

**Production mode:**
```bash
npm run build
npm run start:prod
```

The API will be available at `http://localhost:3001/api`

## 📁 Project Structure

```
backend/
├── src/
│   ├── auth/                 # Authentication module
│   │   ├── dto/            # Data Transfer Objects
│   │   ├── strategies/     # JWT strategy
│   │   ├── auth.service.ts
│   │   ├── auth.controller.ts
│   │   └── auth.module.ts
│   ├── users/               # User management
│   ├── students/            # Student module
│   ├── teachers/            # Teacher module
│   ├── courses/             # Course management
│   ├── enrollments/         # Enrollment management
│   ├── results/             # Results and grades
│   ├── assignments/         # Assignment module
│   ├── notifications/       # Notifications
│   ├── timetable/           # Timetable management
│   ├── library/             # Library module
│   ├── forum/               # Community forum
│   ├── lost-found/          # Lost & Found
│   ├── requests/             # Student requests
│   ├── feedback/             # Feedback system
│   ├── fees/                 # Fee management
│   ├── chatbot/              # AI Chatbot
│   ├── common/               # Shared utilities
│   │   ├── decorators/      # Custom decorators
│   │   ├── guards/          # Auth guards
│   │   └── interceptors/    # Interceptors
│   ├── config/               # Configuration files
│   ├── app.module.ts        # Root module
│   └── main.ts              # Application entry point
├── .env                      # Environment variables
├── tsconfig.json            # TypeScript configuration
├── nest-cli.json            # NestJS CLI configuration
└── package.json             # Dependencies
```

## 🔌 API Endpoints

### Authentication

- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/forgot-password` - Request password reset

### Users

- `GET /api/users/profile` - Get current user profile (Protected)

### More endpoints will be added as modules are implemented...

## 📚 API Documentation (Swagger)

Swagger API documentation is available at:

**http://localhost:3001/api/docs**

The Swagger UI provides:
- Interactive API testing
- Request/response schemas
- Authentication support (JWT Bearer token)
- Example requests and responses
- All available endpoints organized by tags

### Using Swagger UI

1. Start the backend server
2. Navigate to `http://localhost:3001/api/docs`
3. Click "Authorize" button (top right) to add JWT token
4. Enter your JWT token (obtained from login endpoint)
5. Test endpoints directly from the Swagger UI

## 🔒 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

**To get a token:**
1. Register a new user: `POST /api/auth/register`
2. Or login: `POST /api/auth/login`
3. Copy the `accessToken` from the response
4. Use it in the Authorization header for protected routes

## 📝 Available Scripts

- `npm run build` - Build the application
- `npm run start` - Start the application
- `npm run start:dev` - Start in development mode with hot reload
- `npm run start:debug` - Start in debug mode
- `npm run start:prod` - Start in production mode
- `npm run lint` - Run ESLint

## 🗄️ Database Schema

The application uses the following main entities:

- **Users** - Base user accounts
- **Students** - Student-specific information
- **Teachers** - Teacher-specific information
- **Courses** - Course catalog
- **Enrollments** - Student course enrollments
- **Assignments** - Course assignments
- **Assignment Submissions** - Student submissions
- **Grades** - Student grades
- **Notifications** - System notifications
- **Timetable** - Class schedules
- **Library Books** - Book catalog
- **Borrowings** - Book borrowing records
- **Forum Posts** - Forum posts
- **Forum Replies** - Forum replies
- **Lost Found Items** - Lost and found items
- **Requests** - Student requests
- **Feedback** - Student feedback
- **Fees** - Fee records

## 🔧 Configuration

### TypeORM Configuration

The database connection is configured in `src/config/typeorm.config.ts`. In development mode, `synchronize: true` will automatically create/update database tables. **Set this to false in production** and use migrations instead.

### CORS

CORS is enabled for the frontend origin. Update `CORS_ORIGIN` in `.env` to match your frontend URL.

## 📚 Next Steps

1. Implement remaining feature modules (Courses, Assignments, Results, etc.)
2. Add file upload handling for assignments and forum posts
3. Implement email service for password reset
4. Add Swagger decorators to remaining controllers and DTOs
5. Add unit and integration tests
6. Set up database migrations

## 📄 License

This project is part of a final year project for a university student in Pakistan.

