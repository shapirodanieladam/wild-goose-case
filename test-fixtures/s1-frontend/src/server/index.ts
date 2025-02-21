import express from 'express';
import path from 'path';
import fetch from 'node-fetch';

const app = express();
const port = process.env.PORT || 3000;

// Parse JSON bodies
app.use(express.json());

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../../dist/client')));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'healthy' });
});

// Proxy all API requests to S2
app.all('/api/*', async (req, res) => {
  try {
    const s2Url = process.env.S2_URL || 'http://localhost:8080';
    const response = await fetch(`${s2Url}${req.path}`, {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        ...(req.headers['x-api-key'] && { 'X-API-Key': req.headers['x-api-key'] })
      },
      ...(req.method !== 'GET' && { body: JSON.stringify(req.body) })
    });
    
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    console.error('Error proxying to S2:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to proxy request to API' 
    });
  }
});

// Handle React routing, return all requests to React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../dist/client/index.html'));
});

app.listen(port, () => {
  console.log(`S1 Frontend server listening at http://localhost:${port}`);
});