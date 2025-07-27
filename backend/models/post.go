package models

import (
	"time"
	"gorm.io/gorm"
)

type Post struct {
	ID        uint           `json:"id" gorm:"primaryKey"`
	Content   string         `json:"content" gorm:"not null;type:text"`
	UserID    uint           `json:"user_id" gorm:"not null;index"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `json:"-" gorm:"index"` // soft delete
	
	// Relationships
	User User `json:"user,omitempty" gorm:"foreignKey:UserID"`
}

// PostResponse represents the response format for posts with author info
type PostResponse struct {
	ID             uint      `json:"id"`
	Content        string    `json:"content"`
	AuthorNickname string    `json:"author_nickname"`
	CreatedAt      time.Time `json:"created_at"`
}