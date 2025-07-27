package main

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"strings"
	"time"

	"assignment2-backend/api_models"
	"assignment2-backend/models"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/driver/mysql"
	"gorm.io/driver/postgres"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)



// JWT Claims
type Claims struct {
	Username string `json:"username"`
	UserID   uint   `json:"user_id"`
	jwt.RegisteredClaims
}

var (
	// JWT secret key - in production, this should be from environment variable
	jwtSecret = []byte("your-secret-key-change-in-production")
	
	// Global database instance
	db *gorm.DB
)

// initDatabase initializes and returns a database connection
func initDatabase() (*gorm.DB, error) {
	// Try to get database configuration from environment variables
	dbType := os.Getenv("DB_TYPE") // sqlite, mysql, or postgres
	if dbType == "" {
		dbType = "sqlite" // default to SQLite for easy local development
	}
	
	var dsn string
	var gormDB *gorm.DB
	var err error
	
	switch dbType {
	case "postgres":
		host := getEnvOrDefault("DB_HOST", "localhost")
		port := getEnvOrDefault("DB_PORT", "5432")
		user := getEnvOrDefault("DB_USER", "postgres")
		password := getEnvOrDefault("DB_PASSWORD", "password")
		dbname := getEnvOrDefault("DB_NAME", "blog_system")
		sslmode := getEnvOrDefault("DB_SSLMODE", "disable")
		
		dsn = fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=%s TimeZone=Asia/Shanghai",
			host, user, password, dbname, port, sslmode)
		gormDB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	case "mysql":
		host := getEnvOrDefault("DB_HOST", "localhost")
		port := getEnvOrDefault("DB_PORT", "3306")
		user := getEnvOrDefault("DB_USER", "root")
		password := getEnvOrDefault("DB_PASSWORD", "password")
		dbname := getEnvOrDefault("DB_NAME", "blog_system")
		
		dsn = fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?charset=utf8mb4&parseTime=True&loc=Local",
			user, password, host, port, dbname)
		gormDB, err = gorm.Open(mysql.Open(dsn), &gorm.Config{})
	default: // sqlite
		dbPath := getEnvOrDefault("DB_PATH", "./blog_system.db")
		gormDB, err = gorm.Open(sqlite.Open(dbPath), &gorm.Config{})
	}
	
	if err != nil {
		return nil, fmt.Errorf("failed to connect to %s database: %w", dbType, err)
	}
	
	log.Printf("Successfully connected to %s database", dbType)
	return gormDB, nil
}

// getEnvOrDefault returns environment variable value or default if not set
func getEnvOrDefault(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}

// seedDatabase creates initial test users if they don't exist
func seedDatabase() {
	var userCount int64
	db.Model(&models.User{}).Count(&userCount)
	
	if userCount > 0 {
		log.Println("Database already seeded, skipping...")
		return
	}
	
	log.Println("Seeding database with initial users...")
	
	// Create test users
	adminHash, _ := hashPassword("password123")
	userHash, _ := hashPassword("mypassword")
	
	users := []models.User{
		{
			Username: "admin",
			Password: adminHash,
			NickName: "管理员小张",
		},
		{
			Username: "user1",
			Password: userHash,
			NickName: "用户小李",
		},
	}
	
	for _, user := range users {
		if err := db.Create(&user).Error; err != nil {
			log.Printf("Failed to create user %s: %v", user.Username, err)
		} else {
			log.Printf("Created user: %s", user.Username)
		}
	}
}

func main() {
	// Initialize database
	var err error
	db, err = initDatabase()
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}
	
	// Auto-migrate database schema
	err = db.AutoMigrate(&models.User{}, &models.Post{})
	if err != nil {
		log.Fatal("Failed to migrate database:", err)
	}
	
	// Seed initial users for testing (only if no users exist)
	seedDatabase()

	// Create Gin router
	r := gin.Default()
	
	// CORS middleware
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173"}, // Vite default port
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	// Routes
	r.POST("/user/login", handleLogin)
	r.GET("/user/info", authMiddleware(), handleUserInfo)
	r.POST("/user/logout", authMiddleware(), handleLogout)
	r.POST("/posts", authMiddleware(), handleCreatePost)
	r.GET("/posts", handleListPosts)

	// Start server
	log.Println("Server starting on :8080")
	r.Run(":8080")
}

// hashPassword creates a bcrypt hash of the password
func hashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	return string(bytes), err
}

// checkPasswordHash compares a password with a hash
func checkPasswordHash(password, hash string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	return err == nil
}

// generateJWT creates a new JWT token for the user
func generateJWT(username string, userID uint) (string, error) {
	expirationTime := time.Now().Add(24 * time.Hour)
	claims := &Claims{
		Username: username,
		UserID:   userID,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(expirationTime),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(jwtSecret)
}

// validateJWT validates and parses the JWT token
func validateJWT(tokenString string) (*Claims, error) {
	claims := &Claims{}
	token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
		return jwtSecret, nil
	})

	if err != nil {
		return nil, err
	}

	if !token.Valid {
		return nil, jwt.ErrTokenInvalidClaims
	}

	return claims, nil
}

// handleLogin handles the POST /user/login endpoint
func handleLogin(c *gin.Context) {
	var req api_models.LoginUserRequest
	
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, api_models.ErrorResponse{Error: "Invalid request format"})
		return
	}

	// Find user in database
	var user models.User
	if err := db.Where("username = ?", req.Username).First(&user).Error; err != nil {
		c.JSON(http.StatusUnauthorized, api_models.ErrorResponse{Error: "Invalid username or password"})
		return
	}

	// Check password
	if !checkPasswordHash(req.Password, user.Password) {
		c.JSON(http.StatusUnauthorized, api_models.ErrorResponse{Error: "Invalid username or password"})
		return
	}

	// Generate JWT token
	token, err := generateJWT(user.Username, user.ID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, api_models.ErrorResponse{Error: "Failed to generate token"})
		return
	}

	c.JSON(http.StatusOK, api_models.LoginUser200Response{Token: token})
}

// authMiddleware validates JWT token from Authorization header
func authMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.JSON(http.StatusUnauthorized, api_models.ErrorResponse{Error: "Authorization header required"})
			c.Abort()
			return
		}

		// Extract token from "Bearer <token>"
		tokenString := strings.TrimPrefix(authHeader, "Bearer ")
		if tokenString == authHeader {
			c.JSON(http.StatusUnauthorized, api_models.ErrorResponse{Error: "Bearer token required"})
			c.Abort()
			return
		}

		// Validate token
		claims, err := validateJWT(tokenString)
		if err != nil {
			c.JSON(http.StatusUnauthorized, api_models.ErrorResponse{Error: "Invalid token"})
			c.Abort()
			return
		}

		// Store user info in context
		c.Set("username", claims.Username)
		c.Set("userID", claims.UserID)
		c.Next()
	}
}

// handleUserInfo handles the GET /user/info endpoint
func handleUserInfo(c *gin.Context) {
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusInternalServerError, api_models.ErrorResponse{Error: "User not found in context"})
		return
	}

	var user models.User
	if err := db.First(&user, userID).Error; err != nil {
		c.JSON(http.StatusNotFound, api_models.ErrorResponse{Error: "User not found"})
		return
	}

	c.JSON(http.StatusOK, api_models.GetUserInfo200Response{NickName: user.NickName})
}


// handleLogout handles the POST /user/logout endpoint
func handleLogout(c *gin.Context) {
	// For stateless JWT, logout is mainly handled on the client side
	// Here we just return success - client should remove the token
	c.JSON(http.StatusOK, gin.H{"message": "Logged out successfully"})
}

// handleCreatePost handles the POST /posts endpoint
func handleCreatePost(c *gin.Context) {
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusInternalServerError, api_models.ErrorResponse{Error: "User not found in context"})
		return
	}

	var req api_models.CreatePostRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, api_models.ErrorResponse{Error: "Invalid request format"})
		return
	}

	// Create new post
	post := models.Post{
		Content: req.Content,
		UserID:  userID.(uint),
	}

	if err := db.Create(&post).Error; err != nil {
		c.JSON(http.StatusInternalServerError, api_models.ErrorResponse{Error: "Failed to create post"})
		return
	}

	// Return the created post with user info
	var createdPost models.Post
	if err := db.Preload("User").First(&createdPost, post.ID).Error; err != nil {
		c.JSON(http.StatusInternalServerError, api_models.ErrorResponse{Error: "Failed to fetch created post"})
		return
	}

	response := api_models.PostResponse{
		Id:             int32(createdPost.ID),
		Content:        createdPost.Content,
		AuthorNickname: createdPost.User.NickName,
		CreatedAt:      createdPost.CreatedAt,
	}

	c.JSON(http.StatusCreated, response)
}

// handleListPosts handles the GET /posts endpoint
func handleListPosts(c *gin.Context) {
	var posts []models.Post
	
	// Fetch all posts with user information, ordered by creation time (newest first)
	if err := db.Preload("User").Order("created_at DESC").Find(&posts).Error; err != nil {
		c.JSON(http.StatusInternalServerError, api_models.ErrorResponse{Error: "Failed to fetch posts"})
		return
	}

	// Convert to response format
	var responses []api_models.PostResponse
	for _, post := range posts {
		responses = append(responses, api_models.PostResponse{
			Id:             int32(post.ID),
			Content:        post.Content,
			AuthorNickname: post.User.NickName,
			CreatedAt:      post.CreatedAt,
		})
	}

	c.JSON(http.StatusOK, responses)
}