package main

import (
	"fmt"
	"golang.org/x/crypto/bcrypt"
)

// GeneratePasswordHash is a utility function to generate bcrypt hashes
// This is used to create the hashes stored in our mock database
func GeneratePasswordHash(password string) {
	hash, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		fmt.Printf("Error generating hash: %v\n", err)
		return
	}
	fmt.Printf("Password: %s\nHash: %s\n\n", password, string(hash))
}

// Uncomment and run this function to generate password hashes for testing
// func main() {
//     GeneratePasswordHash("password123")
//     GeneratePasswordHash("mypassword")
// }