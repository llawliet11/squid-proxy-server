# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm install` - Install dependencies
- `npm start` - Run the proxy server
- `npm run dev` - Run with nodemon for development
- `npm run lint` - Run ESLint
- `npm test` - Run tests with Jest

## Docker Commands

- `docker-compose up -d` - Start the proxy server in detached mode
- `docker-compose logs -f` - View logs
- `docker-compose down` - Stop the server
- `docker build -t proxy-server .` - Build Docker image manually

## Architecture

This is a Node.js HTTP proxy server built with Express.js that provides:

### Core Components

- **src/server.js** - Main application entry point containing:
  - Express server setup with CORS and JSON middleware
  - Basic Authentication middleware for proxy access
  - PAC file generation endpoint at `/proxy.pac`
  - Health check endpoint at `/health`
  - Proxy middleware using `http-proxy-middleware`

### Key Features

- **Authentication**: Uses Basic Auth with configurable username/password via environment variables
- **PAC File Support**: Generates proxy auto-configuration files for easy mobile device setup
- **Docker Ready**: Includes Dockerfile and docker-compose.yml for containerized deployment
- **Environment Configuration**: All settings configurable via environment variables

### Proxy Behavior

- Main proxy endpoint: `/proxy/*` (requires authentication)
- Supports HTTP proxying with URL rewriting
- Logs all proxy requests for monitoring
- Handles proxy errors gracefully

### Mobile Device Integration

The `/proxy.pac` endpoint generates a PAC file that can be used to automatically configure proxy settings on Android and iOS devices without manual proxy configuration.