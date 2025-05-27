# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Node.js Express Server (HTTP only)
- `npm install` - Install dependencies
- `npm start` - Run the proxy server
- `npm run dev` - Run with nodemon for development
- `npm run lint` - Run ESLint
- `npm test` - Run tests with Jest

### Squid Proxy Server (Production HTTPS)
- `docker-compose -f docker-compose.squid.yml up -d` - Start production Squid proxy
- `docker-compose -f docker-compose.squid.yml logs -f` - View Squid logs
- `docker-compose -f docker-compose.squid.yml down` - Stop Squid proxy
- `./scripts/test-proxy.sh` - Test proxy functionality
- `./scripts/update-auth.sh [user] [password]` - Update proxy credentials

## Architecture

This repository contains two proxy implementations:

### 1. Node.js HTTP Proxy (Development/Basic Use)
- **File**: `src/server.js`
- **Purpose**: Basic HTTP proxy for development and simple use cases
- **Limitations**: HTTP only, no HTTPS CONNECT support
- **Port**: 3128

### 2. Squid HTTPS Proxy (Production)
- **File**: `squid/squid.conf` 
- **Purpose**: Production-grade HTTP/HTTPS proxy with full SSL support
- **Features**: CONNECT tunneling, authentication, caching, logging
- **Ports**: 3128 (proxy), 8080 (PAC server)

### Production Architecture
```
Internet → [Reverse Proxy + SSL] → [Squid Container:3128] → Target Servers
                                → [PAC Server:8080]
```

### Key Components

#### Squid Configuration (`squid/squid.conf`)
- HTTP and HTTPS (CONNECT) proxy support
- Basic authentication via `/etc/squid/passwd`
- Access control lists for security
- Caching and logging configuration
- DNS and performance optimization

#### Docker Setup
- **Dockerfile.squid**: Ubuntu-based Squid container
- **docker-compose.squid.yml**: Multi-service setup with Squid + PAC server
- **scripts/**: Utility scripts for testing and authentication management

### Mobile Device Integration

Both implementations provide PAC (Proxy Auto-Configuration) files:
- Node.js version: `http://localhost:3128/proxy.pac`
- Squid version: `http://localhost:8080/proxy.pac`

### Security Features

- Basic Authentication required for all proxy requests
- Access control lists restrict unsafe ports and methods
- Configurable via environment variables
- Support for reverse proxy SSL termination

### Deployment Strategy

The Squid implementation is designed for production deployment where:
1. Container exposes port 3128 to host
2. Reverse proxy (nginx/traefik) handles SSL termination
3. Domain points to VPS with proper certificates
4. Mobile devices use PAC file for automatic configuration