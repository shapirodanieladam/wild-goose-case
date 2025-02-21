const express = require('express');
const path = require('path');
const axios = require('axios');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const port = process.env.PORT || 3000;

// Debug middleware for ALL requests
app.use((req, res, next) => {
  console.log('\n=== Incoming Request ===');
  console.log(`${req.method} ${req.url}`);
  console.log('Headers:', JSON.stringify(req.headers, null, 2));
  
  // Capture the raw body for debugging
  let data = '';
  req.on('data', chunk => {
    data += chunk;
  });
  
  req.on('end', () => {
    if (data) {
      console.log('Raw body:', data);
    }
  });

  // Log when the response is sent
  res.on('finish', () => {
    console.log(`=== Response Sent: ${res.statusCode} ===\n`);
  });

  next();
});

// Parse JSON bodies
app.use(express.json());

// API proxy middleware
app.post('/api/records', async (req, res) => {
  console.log('Handling POST to /api/records');
  try {
    const s2Url = process.env.S2_URL || 'http://localhost:8080';
    const targetUrl = `${s2Url}/api/records`;
    console.log(`Proxying POST request to: ${targetUrl}`);
    console.log('Request body:', req.body);

    const response = await axios.post(targetUrl, req.body, {
      headers: {
        'Content-Type': 'application/json',
        ...(req.headers['x-api-key'] && { 'X-API-Key': req.headers['x-api-key'] })
      }
    });
    
    console.log('Proxy response:', {
      status: response.status,
      data: response.data
    });
    
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error('Error proxying to S2:', error);
    const status = error.response?.status || 500;
    res.status(status).json({ 
      success: false, 
      error: 'Failed to proxy request to API',
      details: error.message
    });
  }
});

app.get('/api/records', async (req, res) => {
  console.log('Handling GET to /api/records');
  try {
    const s2Url = process.env.S2_URL || 'http://localhost:8080';
    const targetUrl = `${s2Url}/api/records`;
    console.log(`Proxying GET request to: ${targetUrl}`);

    const response = await axios.get(targetUrl);
    console.log('Proxy response:', {
      status: response.status,
      data: response.data
    });
    
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error('Error proxying to S2:', error);
    const status = error.response?.status || 500;
    res.status(status).json({ 
      success: false, 
      error: 'Failed to proxy request to API',
      details: error.message
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  console.log('Health check requested');
  res.json({ status: 'healthy' });
});

if (process.env.NODE_ENV === 'development') {
  // In development, proxy everything else to Vite dev server
  console.log('Development mode: Proxying to Vite dev server');
  app.use('/', createProxyMiddleware({
    target: 'http://localhost:5173',
    changeOrigin: true,
    ws: true, // needed for WebSocket (hot reload)
  }));
} else {
  // In production, serve static files
  app.use(express.static(path.join(__dirname, '../../dist/client')));
  
  // Handle React routing, return all requests to React app
  app.get('*', (req, res) => {
    console.log('Serving React app for:', req.url);
    res.sendFile(path.join(__dirname, '../../dist/client/index.html'));
  });
}

app.listen(port, () => {
  console.log('=== S1 Frontend Server Started ===');
  console.log(`Listening at http://localhost:${port}`);
  console.log(`Proxying API requests to: ${process.env.S2_URL || 'http://localhost:8080'}`);
  if (process.env.NODE_ENV === 'development') {
    console.log('Development mode: Proxying frontend requests to Vite dev server at http://localhost:5173');
  } else {
    console.log('Production mode: Serving static files from:', path.join(__dirname, '../../dist/client'));
  }
  console.log('=====================================');
});