# User Login Service MVP

[![Go Version](https://img.shields.io/badge/Go-1.21+-blue.svg)](https://golang.org/)
[![Node Version](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![React Version](https://img.shields.io/badge/React-18+-blue.svg)](https://reactjs.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A modern, secure user authentication system built with Go and React, featuring JWT token-based authentication, responsive UI, and comprehensive API documentation.

## 🚀 Features

- **Secure Authentication**: JWT token-based authentication with bcrypt password hashing
- **Modern UI**: Responsive React interface with Ant Design components
- **Real-time State Management**: MobX for reactive state management
- **Protected Routes**: Client-side route protection with automatic redirects
- **API Documentation**: OpenAPI 3.0+ specification with APIFox integration
- **CORS Support**: Cross-origin resource sharing enabled
- **Mock Support**: Development with mock APIs for parallel development

## 🛠️ Tech Stack

### Backend
- **Go 1.21+** - High-performance backend service
- **Gin Framework** - Fast HTTP web framework
- **JWT** - JSON Web Token for authentication
- **bcrypt** - Password hashing and verification

### Frontend
- **React 18+** - Modern JavaScript UI library
- **Ant Design 5** - Enterprise-class UI components
- **MobX** - Simple, scalable state management
- **React Router v7** - Declarative routing
- **Axios** - Promise-based HTTP client
- **Vite** - Fast build tool and development server

### DevOps & Tools
- **OpenAPI 3.0+** - API specification and documentation
- **APIFox** - API development and testing platform
- **Make** - Build automation
- **Git** - Version control

## 📋 Prerequisites

- Go 1.21 or higher
- Node.js 18.0 or higher
- npm or pnpm package manager

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
go run main.go
```
The backend server will start on `http://localhost:8080`

### 3. Start the frontend development server
```bash
cd frontend
npm install
npm run dev
```
The frontend application will be available at `http://localhost:5173`

### 4. Test the application
- Open your browser to `http://localhost:5173`
- Use the test credentials:
  - **Admin**: `admin` / `password123`
  - **User**: `user1` / `mypassword`

## 📁 Project Structure

```
Assignment2/
├── backend/              # Go backend service
│   ├── main.go          # Main application entry point
│   ├── utils.go         # Utility functions
│   ├── go.mod           # Go module dependencies
│   └── go.sum           # Go module checksums
├── frontend/            # React frontend application
│   ├── src/
│   │   ├── components/  # React components
│   │   │   ├── LoginPage.jsx
│   │   │   ├── WelcomePage.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── stores/      # MobX stores
│   │   │   └── authStore.js
│   │   ├── config/      # Configuration files
│   │   │   └── api.js
│   │   ├── App.jsx      # Main application component
│   │   └── main.jsx     # Application entry point
│   ├── package.json     # Frontend dependencies
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

### User Information
- **GET** `/user/info` - Get current user information
  - Headers: `Authorization: Bearer <token>`
  - Response: `{"nick_name": "string"}`

## 🔧 Development

### Using Makefile
```bash
make run-backend      # Start backend server
make run-frontend     # Start frontend development server
make build-backend    # Build backend binary
make build-frontend   # Build frontend for production
make clean           # Clean build artifacts
```

### Environment Configuration
The application supports multiple environments through `frontend/src/config/api.js`:

```javascript
const CURRENT_ENV = ENV.REAL_API;      // Production API
// const CURRENT_ENV = ENV.LOCAL_MOCK;  // Local mock server
// const CURRENT_ENV = ENV.CLOUD_MOCK;  // Cloud mock server
```

## 🧪 Testing

### Manual Testing
1. Start both backend and frontend servers
2. Navigate to `http://localhost:5173`
3. Test login functionality with provided credentials
4. Verify protected route access and JWT token handling

### API Testing with APIFox
1. Import the `openapi.yml` file into APIFox
2. Configure environment variables
3. Run the provided test cases
4. Verify all endpoints return expected responses

## 📊 APIFox Integration

This project includes comprehensive APIFox integration for:
- **API Documentation**: Auto-generated from OpenAPI specification
- **Mock Services**: Parallel development with mock APIs
- **Testing**: Automated API testing and validation
- **Team Collaboration**: Shared API specifications and test cases

Mock Service URLs:
- Local: `http://127.0.0.1:4523/m1/6796621-0-default`
- Cloud: `https://mock.apifox.cn/m1/6796621-0-default`

## 🚢 Deployment

### Backend Deployment
```bash
cd backend
go build -o server main.go
./server
```

### Frontend Deployment
```bash
cd frontend
npm run build
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

**Note**: This is a educational project demonstrating modern web development practices with Go and React.