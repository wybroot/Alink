package service

import (
	"testing"

	"go.uber.org/zap"
)

func TestAccountServiceJWTIssuer(t *testing.T) {
	accountService := &AccountService{
		logger:           zap.NewNop(),
		jwtSecret:        "test-secret-at-least-32-characters-long",
		tokenExpireHours: 1,
	}

	tokenString, _, err := accountService.generateToken("admin", "Admin")
	if err != nil {
		t.Fatal(err)
	}
	claims, err := accountService.ValidateToken(tokenString)
	if err != nil {
		t.Fatal(err)
	}
	if claims.Issuer != "alink" {
		t.Fatalf("issuer = %q, want %q", claims.Issuer, "alink")
	}
}
