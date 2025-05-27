#!/bin/bash

# Generate Basic Auth hash for Traefik
USER=${1:-admin}
PASS=${2:-password}

if ! command -v htpasswd &> /dev/null; then
    echo "htpasswd not found. Install apache2-utils:"
    echo "  Ubuntu/Debian: sudo apt install apache2-utils"
    echo "  macOS: brew install httpd"
    exit 1
fi

echo "Generating Basic Auth for Traefik..."
AUTH_HASH=$(htpasswd -nb "$USER" "$PASS" | sed -e s/\\$/\\$\\$/g)
echo ""
echo "Add this to your .env file:"
echo "PROXY_BASIC_AUTH=$AUTH_HASH"
echo ""
echo "Full environment variable:"
echo "PROXY_BASIC_AUTH='$AUTH_HASH'"