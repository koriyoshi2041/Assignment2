# Blog System MVP

[![Go Version](https://img.shields.io/badge/Go-1.24+-blue.svg)](https://golang.org/)
[![Node Version](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![React Version](https://img.shields.io/badge/React-19+-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![GORM](https://img.shields.io/badge/GORM-1.30+-red.svg)](https://gorm.io/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A modern, full-stack blog system built with Go and React, featuring JWT authentication, GORM database persistence, TypeScript safety, auto-generated API clients, and comprehensive APIFox integration.

## 🚀 Features

- **Full Blog System**: Complete blogging platform with post creation and listing
- **Database Persistence**: GORM integration with SQLite/MySQL/PostgreSQL support
- **Secure Authentication**: JWT token-based authentication with bcrypt password hashing
- **Blog Post Management**: Create, view, and manage blog posts with user attribution
- **TypeScript Integration**: Full TypeScript support with auto-generated API clients
- **Code Generation**: OpenAPI Generator for automated frontend and backend models
- **Modern UI**: Responsive React interface with Ant Design components
- **Real-time State Management**: MobX for reactive state management
- **Protected Routes**: Client-side route protection with automatic redirects
- **API Documentation**: OpenAPI 3.0+ specification with APIFox integration
- **CORS Support**: Cross-origin resource sharing enabled
- **Type Safety**: Complete type safety from database to UI components

## 🛠️ Tech Stack

### Backend
- **Go 1.24+** - High-performance backend service
- **Gin Framework v1.10+** - Fast HTTP web framework
- **GORM v1.30+** - Go ORM with database abstraction
- **SQLite/MySQL/PostgreSQL** - Database support with auto-migration
- **JWT** - JSON Web Token for authentication
- **bcrypt** - Password hashing and verification

### Frontend
- **React 19+** - Modern JavaScript UI library
- **TypeScript 5.0+** - Static type checking and enhanced developer experience
- **Ant Design 5+** - Enterprise-class UI components
- **MobX 6+ & MobX-React-Lite** - Simple, scalable state management
- **React Router v7+** - Declarative routing
- **Generated API Client** - Auto-generated TypeScript client from OpenAPI spec
- **pnpm** - Fast, disk space efficient package manager
- **Vite** - Fast build tool and development server

### API & Code Generation
- **OpenAPI 3.0+** - API specification and documentation
- **OpenAPI Generator** - Automated TypeScript client and Go model generation
- **APIFox** - API design, testing, and code generation platform

### DevOps & Tools
- **Make** - Build automation
- **Git** - Version control
- **TypeScript Compiler** - Type checking and compilation

## 📋 Prerequisites

- Go 1.24 or higher
- Node.js 18.0 or higher
- pnpm package manager
- OpenAPI Generator CLI (automatically installed)
- SQLite (default), MySQL 8+, or PostgreSQL 16+ (optional)

## 🚀 Quick Start

### 1. Clone the repository
```bash
git clone https://github.com/koriyoshi2041/Assignment2.git
cd Assignment2
```

### 2. Start the backend server
```bash
cd backend
go mod tidy
go run .
```
The backend server will start on `http://localhost:8080` with SQLite database

### 3. Start the frontend development server
```bash
cd frontend
pnpm install
pnpm dev
```
The frontend application will be available at `http://localhost:5173`

### 4. Test the application
- Open your browser to `http://localhost:5173`
- Use the test credentials:
  - **Admin**: `admin` / `password123`
  - **User**: `user1` / `mypassword`
- Create blog posts, view the blog feed, and test authentication

## 📁 Project Structure

```
Assignment2/
├── backend/              # Go backend service
│   ├── main.go          # Main application entry point
│   ├── models/          # GORM database models
│   │   ├── user.go      # User model with associations
│   │   └── post.go      # Post model with relationships
│   ├── api_models/      # Auto-generated API models from OpenAPI
│   ├── utils.go         # Utility functions
│   ├── gen_api.sh       # API model generation script
│   ├── go.mod           # Go module dependencies
│   └── go.sum           # Go module checksums
├── frontend/            # React TypeScript frontend application
│   ├── src/
│   │   ├── api/         # Auto-generated TypeScript API client
│   │   │   ├── apis/    # API endpoint implementations
│   │   │   ├── models/  # TypeScript type definitions
│   │   │   └── runtime.ts
│   │   ├── components/  # React TypeScript components
│   │   │   ├── LoginPage.tsx
│   │   │   ├── BlogPage.tsx
│   │   │   ├── CreatePostForm.tsx
│   │   │   ├── PostList.tsx
│   │   │   ├── Header.tsx
│   │   │   └── ProtectedRoute.tsx
│   │   ├── stores/      # MobX stores with TypeScript
│   │   │   ├── authStore.ts
│   │   │   ├── blogStore.ts
│   │   │   └── index.ts
│   │   ├── App.tsx      # Main application component
│   │   └── main.tsx     # Application entry point
│   ├── gen_api.sh       # API client generation script
│   ├── openapitools.json # OpenAPI Generator configuration
│   ├── package.json     # Frontend dependencies
│   ├── tsconfig.json    # TypeScript configuration
│   └── vite.config.js   # Vite configuration
├── openapi.yml          # OpenAPI specification
├── Makefile            # Build automation
└── README.md           # Project documentation
```

## 🔐 API Endpoints

### Authentication
- **POST** `/user/login` - User authentication
  - Request: `{"username": "string", "password": "string"}`
  - Response: `{"token": "jwt_token"}`
- **POST** `/user/logout` - User logout
  - Headers: `Authorization: Bearer <token>`
  - Response: `{"message": "Logged out successfully"}`

### User Information
- **GET** `/user/info` - Get current user information
  - Headers: `Authorization: Bearer <token>`
  - Response: `{"nick_name": "string"}`

### Blog Posts
- **POST** `/posts` - Create a new blog post
  - Headers: `Authorization: Bearer <token>`
  - Request: `{"content": "string"}`
  - Response: `{"id": 1, "content": "string", "author_nickname": "string", "created_at": "2025-01-01T00:00:00Z"}`
- **GET** `/posts` - Get all blog posts
  - Response: `[{"id": 1, "content": "string", "author_nickname": "string", "created_at": "2025-01-01T00:00:00Z"}]`

## 🔧 Development

### Using Makefile
```bash
make run-backend      # Start backend server
make run-frontend     # Start frontend development server
make build-backend    # Build backend binary
make build-frontend   # Build frontend for production
make clean           # Clean build artifacts
```

### API Client Generation
The project uses OpenAPI Generator to automatically generate both frontend and backend code:

**Frontend TypeScript API Client:**
```bash
cd frontend
./gen_api.sh          # Generate TypeScript API client from OpenAPI spec
```

**Backend Go API Models:**
```bash
cd backend
./gen_api.sh          # Generate Go API models from OpenAPI spec
```

This generates:
- **Frontend**: `AuthenticationApi`, `PostsApi`, `UserInformationApi` with TypeScript types
- **Backend**: Go structs for requests/responses with proper JSON tags
- **Type Definitions**: Complete type safety across the entire stack
- **Runtime**: HTTP client with proper error handling

### TypeScript Development
```bash
cd frontend
pnpm run build        # Build with TypeScript compilation
npx tsc --noEmit      # Type checking only
```

### Database Configuration
The application supports multiple database backends via environment variables:

**SQLite (Default):**
```bash
# No configuration needed - uses ./blog_system.db
go run .
```

**MySQL:**
```bash
export DB_TYPE=mysql
export DB_HOST=localhost
export DB_PORT=3306
export DB_USER=root
export DB_PASSWORD=password
export DB_NAME=blog_system
go run .
```

**PostgreSQL:**
```bash
export DB_TYPE=postgres
export DB_HOST=localhost
export DB_PORT=5432
export DB_USER=postgres
export DB_PASSWORD=password
export DB_NAME=blog_system
go run .
```

## 🧪 Testing

### Manual Testing
1. Start both backend and frontend servers
2. Navigate to `http://localhost:5173`
3. Test login functionality with provided credentials
4. Create and view blog posts
5. Test logout functionality
6. Verify protected route access and JWT token handling
7. Verify database persistence by restarting servers

### API Testing with APIFox
1. Import the `openapi.yml` file into APIFox
2. Configure environment variables
3. Run the provided test cases
4. Verify all endpoints return expected responses

## 📊 APIFox Integration

This project demonstrates proper APIFox workflow:

### 1. API Design & Documentation
- Import `openapi.yml` into APIFox
- Complete API specification with examples
- Auto-generated interactive documentation

### 2. Code Generation
- Export OpenAPI JSON from APIFox
- Use OpenAPI Generator CLI to generate TypeScript client
- Automated type-safe API integration

### 3. Mock Services & Testing
- APIFox mock services for parallel development
- Automated API testing and validation
- Team collaboration through shared specifications

### Workflow
```bash
APIFox Design → OpenAPI Export → OpenAPI Generator → TypeScript Client
```

This replaces manual API coding with automated, type-safe client generation.

## 🚢 Deployment

### Backend Deployment
```bash
cd backend
go build -o server .
./server
```

### Frontend Deployment
```bash
cd frontend
pnpm run build
# Deploy the dist/ folder to your static hosting service
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Gin Framework](https://github.com/gin-gonic/gin) for the excellent Go web framework
- [Ant Design](https://ant.design/) for the beautiful React UI components
- [APIFox](https://www.apifox.cn/) for comprehensive API development tools

## 📞 Contact

For questions or support, please open an issue in the GitHub repository.

---

**Note**: This is an educational project demonstrating modern full-stack web development practices with Go, React, TypeScript, GORM, and proper APIFox workflow with automated code generation for both frontend and backend.