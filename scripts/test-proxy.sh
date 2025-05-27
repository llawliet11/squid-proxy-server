#!/bin/bash

# Test script for proxy functionality
PROXY_HOST=${1:-localhost}
PROXY_PORT=${2:-3128}
USER=${3:-admin}
PASS=${4:-password}

echo "Testing proxy at $PROXY_HOST:$PROXY_PORT"
echo "Using credentials: $USER:$PASS"

# Test HTTP
echo -e "\n🔗 Testing HTTP proxy..."
curl -x $USER:$PASS@$PROXY_HOST:$PROXY_PORT http://httpbin.org/ip --max-time 10

# Test HTTPS
echo -e "\n🔒 Testing HTTPS proxy..."
curl -x $USER:$PASS@$PROXY_HOST:$PROXY_PORT https://httpbin.org/ip --max-time 10

# Test PAC file
echo -e "\n📄 Testing PAC file..."
curl http://$PROXY_HOST:8080/proxy.pac

# Test health
echo -e "\n❤️ Testing health endpoints..."
curl http://$PROXY_HOST:8080/health

echo -e "\n✅ Proxy tests completed"