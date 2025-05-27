#!/bin/bash

# Update Squid proxy authentication
USER=${1:-admin}
PASS=${2:-password}

echo "Updating proxy credentials..."
docker exec squid-proxy htpasswd -bc /etc/squid/passwd "$USER" "$PASS"
docker exec squid-proxy squid -k reconfigure

echo "Credentials updated: $USER"
echo "Reloading Squid configuration..."