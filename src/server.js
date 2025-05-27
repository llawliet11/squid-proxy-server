const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const basicAuth = require('basic-auth');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3128;
const PROXY_USER = process.env.PROXY_USER || 'admin';
const PROXY_PASS = process.env.PROXY_PASS || 'password';
const SERVER_HOST = process.env.SERVER_HOST || 'localhost';

app.use(cors());
app.use(express.json());

function authenticate(req, res, next) {
  const user = basicAuth(req);
  
  if (!user || user.name !== PROXY_USER || user.pass !== PROXY_PASS) {
    res.set('WWW-Authenticate', 'Basic realm="Proxy Authentication"');
    return res.status(401).send('Unauthorized');
  }
  
  next();
}

app.get('/proxy.pac', (req, res) => {
  const proxyPort = process.env.PROXY_PORT || 3128;
  const pacContent = `function FindProxyForURL(url, host) {
    // Use HTTPS proxy for all traffic
    return "PROXY ${SERVER_HOST}:${proxyPort}";
}`;
  
  res.set({
    'Content-Type': 'application/x-ns-proxy-autoconfig',
    'Content-Disposition': 'attachment; filename="proxy.pac"'
  });
  res.send(pacContent);
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/', (req, res) => {
  res.json({
    message: 'HTTP Proxy Server',
    endpoints: {
      pac: '/proxy.pac',
      health: '/health'
    },
    proxy: {
      host: SERVER_HOST,
      port: PORT,
      authentication: 'Basic Auth required'
    }
  });
});

const proxyMiddleware = createProxyMiddleware({
  target: 'http://httpbin.org',
  changeOrigin: true,
  followRedirects: true,
  onProxyReq: (proxyReq, req, res) => {
    console.log(`Proxying: ${req.method} ${req.url}`);
  },
  onError: (err, req, res) => {
    console.error('Proxy error:', err);
    res.status(500).send('Proxy error');
  },
  router: (req) => {
    const targetHost = req.headers['x-target-host'] || req.headers.host;
    if (targetHost && targetHost !== SERVER_HOST && !targetHost.includes(':')) {
      return `http://${targetHost}`;
    }
    return null;
  }
});

app.use('/proxy', authenticate, proxyMiddleware);

app.use('*', authenticate, (req, res, next) => {
  if (req.method === 'CONNECT') {
    res.status(405).send('CONNECT method not supported in HTTP mode');
    return;
  }
  
  const targetUrl = req.originalUrl.substring(1);
  
  if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
    res.status(400).send('Invalid URL format. Use: http://proxy-server/http://target-url');
    return;
  }
  
  createProxyMiddleware({
    target: targetUrl,
    changeOrigin: true,
    followRedirects: true,
    pathRewrite: {
      [`^/${targetUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`]: ''
    },
    onProxyReq: (proxyReq, req, res) => {
      console.log(`Proxying: ${req.method} ${targetUrl}`);
    },
    onError: (err, req, res) => {
      console.error('Proxy error:', err);
      res.status(500).send('Proxy error');
    }
  })(req, res, next);
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`HTTP Proxy Server running on port ${PORT}`);
  console.log(`PAC file available at: http://${SERVER_HOST}:${PORT}/proxy.pac`);
  console.log(`Credentials: ${PROXY_USER}:${PROXY_PASS}`);
});