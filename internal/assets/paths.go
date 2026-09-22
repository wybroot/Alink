package assets

import (
	"encoding/base64"
	"os"
	"path/filepath"
	"strings"
)

const (
	defaultWebDir   = "web/dist"
	defaultAgentDir = "bin/agents"
	defaultLogoPath = "web/public/logo.svg"
)

func WebDir() string {
	if dir := os.Getenv("PIKAW_WEB_DIR"); dir != "" {
		return dir
	}
	return defaultWebDir
}

func AgentDir() string {
	if dir := os.Getenv("PIKAW_AGENT_DIR"); dir != "" {
		return dir
	}
	return defaultAgentDir
}

func AgentPath(filename string) string {
	return filepath.Join(AgentDir(), filename)
}

func DefaultLogoBase64() string {
	for _, path := range []string{
		os.Getenv("PIKAW_DEFAULT_LOGO_PATH"),
		defaultLogoPath,
		filepath.Join(WebDir(), "logo.svg"),
	} {
		if path == "" {
			continue
		}
		logo, err := os.ReadFile(path)
		if err == nil && len(logo) > 0 {
			contentType := "image/png"
			switch strings.ToLower(filepath.Ext(path)) {
			case ".svg":
				contentType = "image/svg+xml"
			case ".jpg", ".jpeg":
				contentType = "image/jpeg"
			case ".webp":
				contentType = "image/webp"
			}
			return "data:" + contentType + ";base64," + base64.StdEncoding.EncodeToString(logo)
		}
	}
	return ""
}
