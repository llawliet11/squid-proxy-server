# Production HTTPS Proxy Server

A production-ready Squid-based HTTP/HTTPS proxy server with authentication, designed for containerized deployment behind a reverse proxy.

## Architecture

```
Internet → [Reverse Proxy (nginx/traefik) + SSL] → [Squid Container] → Target Servers
           ↓
      [PAC Server Container]
```

## Features

- **Full HTTPS Support**: CONNECT method tunneling for secure HTTPS traffic
- **Basic Authentication**: Username/password authentication
- **PAC File Support**: Automatic proxy configuration for mobile devices
- **Container Ready**: Docker deployment with exposed ports
- **Health Checks**: Built-in monitoring and health endpoints
- **Production Optimized**: Squid caching, logging, and performance tuning

## Quick Start

1. **Configure Environment**:
```bash
cp .env.example .env
# Edit SERVER_HOST to your domain/IP
# Update PROXY_USER and PROXY_PASS
```

2. **Start Services**:
```bash
docker-compose -f docker-compose.squid.yml up -d
```

3. **Verify Setup**:
```bash
./scripts/test-proxy.sh
```

## Port Configuration

- **Port 3128**: Squid proxy server (HTTP/HTTPS)
- **Port 8080**: PAC file server (HTTP only)

## Reverse Proxy Setup

### nginx Configuration
```nginx
# HTTP proxy endpoint
location /proxy/ {
    proxy_pass http://localhost:3128/;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
}

# PAC file endpoint  
location /proxy.pac {
    proxy_pass http://localhost:8080/proxy.pac;
}
```

### Traefik Configuration
```yaml
http:
  routers:
    proxy-router:
      rule: "Host(`your-domain.com`) && PathPrefix(`/proxy`)"
      service: squid-proxy
      tls:
        certResolver: letsencrypt
  
  services:
    squid-proxy:
      loadBalancer:
        servers:
          - url: "http://localhost:3128"
```

## Testing

**HTTP Proxy**:
```bash
curl --proxy http://admin:password@your-domain.com:443 http://httpbin.org/ip
```

**HTTPS Proxy**:
```bash
curl --proxy http://admin:password@your-domain.com:443 https://httpbin.org/ip
```

**PAC File**:
```bash
curl https://your-domain.com/proxy.pac
```

## Mobile Configuration

### Android
1. WiFi Settings → Advanced → Proxy → Auto-config
2. PAC URL: `https://your-domain.com/proxy.pac`

### iOS  
1. Settings → WiFi → (i) → Configure Proxy → Automatic
2. PAC URL: `https://your-domain.com/proxy.pac`

## Authentication Management

Update proxy credentials:
```bash
./scripts/update-auth.sh newuser newpassword
```

## Monitoring

- **Health Check**: `curl http://localhost:8080/health`
- **Logs**: `docker logs squid-proxy -f`
- **Stats**: `docker exec squid-proxy squid -k check`

## Security Notes

- Change default credentials before production deployment
- Use strong passwords (12+ characters, mixed case, numbers, symbols)
- Configure firewall rules to restrict proxy access
- Monitor access logs regularly
- Consider IP whitelist for additional security

## Production Deployment

1. **SSL Certificate**: Configure your reverse proxy with valid SSL certificates
2. **Domain Setup**: Point your domain to the VPS IP
3. **Firewall**: Restrict access to ports 3128 and 8080 to localhost only
4. **Authentication**: Use strong, unique credentials
5. **Monitoring**: Set up log monitoring and alerting

## How It Works

1. **Client** connects to your domain (HTTPS via reverse proxy)
2. **Reverse Proxy** terminates SSL and forwards to Squid container
3. **Squid** authenticates user and proxies requests
4. **HTTPS Traffic** uses CONNECT tunneling (end-to-end encryption maintained)
5. **HTTP Traffic** is proxied directly through Squid

This setup provides enterprise-grade HTTPS proxy capabilities with proper SSL termination handled by your reverse proxy infrastructure.