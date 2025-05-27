# HTTP Proxy Server

A Docker-based HTTP proxy server with authentication and PAC file support for easy configuration on mobile devices.

## Features

- HTTP proxy with Basic Authentication
- PAC (Proxy Auto-Configuration) file generation
- Docker containerized for easy deployment
- Support for Android, iOS, and desktop clients
- Environment-based configuration

## Quick Start

1. Clone and setup:
```bash
cp .env.example .env
# Edit .env with your credentials and server details
```

2. Run with Docker Compose:
```bash
docker-compose up -d
```

3. Access PAC file:
```
http://your-server:3128/proxy.pac
```

## Configuration

### Environment Variables

- `PROXY_USER`: Username for proxy authentication (default: admin)
- `PROXY_PASS`: Password for proxy authentication (default: password)
- `SERVER_HOST`: Your server's IP or domain (default: localhost)
- `PORT`: Proxy server port (default: 3128)

### Mobile Device Setup

#### Android
1. Go to WiFi settings → Advanced → Proxy
2. Select "Proxy Auto-Config"
3. Enter PAC URL: `http://your-server:3128/proxy.pac`

#### iOS
1. Go to Settings → WiFi → (i) next to your network
2. Scroll to "Configure Proxy" → Automatic
3. Enter PAC URL: `http://your-server:3128/proxy.pac`

## API Endpoints

- `GET /` - Server information
- `GET /proxy.pac` - Download PAC file
- `GET /health` - Health check
- `ALL /proxy/*` - Proxy endpoint (requires auth)

## Development

```bash
npm install
npm run dev
```

## Security Notes

- Change default credentials in production
- Use HTTPS in production environments
- Consider firewall rules to restrict access