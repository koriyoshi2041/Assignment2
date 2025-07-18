.PHONY: run-backend run-frontend test-api setup-backend setup-frontend clean

# Setup commands
setup-backend:
	cd backend && go mod init assignment2-backend && go mod tidy

setup-frontend:
	cd frontend && pnpm create vite . --template react && pnpm install

# Run commands
run-backend:
	cd backend && go run main.go

run-frontend:
	cd frontend && pnpm dev

# Test commands
test-api:
	cd backend && go test ./...

# Clean commands
clean:
	cd backend && go clean
	cd frontend && rm -rf node_modules dist

# Development commands
dev: run-backend run-frontend

# Build commands
build-backend:
	cd backend && go build -o bin/server main.go

build-frontend:
	cd frontend && pnpm build

build: build-backend build-frontend