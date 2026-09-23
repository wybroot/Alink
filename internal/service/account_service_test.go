package service

import (
	"testing"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"go.uber.org/zap"
)

func TestAccountServiceJWTIssuerMigration(t *testing.T) {
	service := &AccountService{
		logger:           zap.NewNop(),
		jwtSecret:        "test-secret-at-least-32-characters-long",
		tokenExpireHours: 1,
	}

	tokenString, _, err := service.generateToken("admin", "Admin")
	if err != nil {
		t.Fatal(err)
	}
	claims, err := service.ValidateToken(tokenString)
	if err != nil {
		t.Fatal(err)
	}
	if claims.Issuer != "alink" {
		t.Fatalf("issuer = %q, want %q", claims.Issuer, "alink")
	}

	legacyClaims := &JWTClaims{
		UserID:   "admin",
		Username: "admin",
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(time.Hour)),
			Issuer:    "pikaw",
			Subject:   "admin",
		},
	}
	legacyToken := jwt.NewWithClaims(jwt.SigningMethodHS256, legacyClaims)
	legacyTokenString, err := legacyToken.SignedString([]byte(service.jwtSecret))
	if err != nil {
		t.Fatal(err)
	}
	if _, err := service.ValidateToken(legacyTokenString); err != nil {
		t.Fatalf("legacy token should remain valid during issuer migration: %v", err)
	}
}
