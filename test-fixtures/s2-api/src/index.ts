import express from 'express';
import cors from 'cors';
import { DataService } from './services/data-service';
import { ApiResponse, CreateDataRequest, DataRecord } from '@test-fixtures/shared/src/types';

const app = express();
const port = process.env.PORT || 8080;
const dataService = new DataService();

// Middleware
app.use(cors());
app.use(express.json());

// Simple API key auth middleware
const apiKeyAuth = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const apiKey = req.header('X-API-Key');
  
  if (!apiKey || apiKey !== 'test-api-key') {
    return res.status(401).json({
      success: false,
      error: 'Invalid or missing API key'
    });
  }
  
  next();
};

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'healthy' });
});

// Get all records (public endpoint)
app.get('/api/records', async (req, res) => {
  const response = await dataService.getAllRecords();
  
  if (!response.success) {
    return res.status(500).json(response);
  }
  
  res.json(response);
});

// Get single record (public endpoint)
app.get('/api/records/:id', async (req, res) => {
  const response = await dataService.getRecord(req.params.id);
  
  if (!response.success) {
    return res.status(404).json(response);
  }
  
  res.json(response);
});

// Create record (protected endpoint)
app.post('/api/records', apiKeyAuth, async (req, res) => {
  const createRequest: CreateDataRequest = req.body;
  
  // Basic validation
  if (!createRequest.name || !createRequest.value) {
    const response: ApiResponse<undefined> = {
      success: false,
      error: 'Name and value are required'
    };
    return res.status(400).json(response);
  }
  
  const response = await dataService.createRecord(createRequest);
  
  if (!response.success) {
    return res.status(500).json(response);
  }
  
  res.status(201).json(response);
});

// Internal endpoint example (protected)
app.get('/internal/records/stats', apiKeyAuth, async (req, res) => {
  const records = await dataService.getAllRecords();
  
  if (!records.success || !records.data) {
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch records for stats'
    });
  }
  
  const stats = {
    total: records.data.length,
    lastUpdated: records.data.length > 0 
      ? Math.max(...records.data.map(r => new Date(r.createdAt).getTime()))
      : null
  };
  
  res.json({
    success: true,
    data: stats
  });
});

app.listen(port, () => {
  console.log(`S2 API service listening at http://localhost:${port}`);
});