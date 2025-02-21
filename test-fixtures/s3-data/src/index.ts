import express from 'express';
import cors from 'cors';
import { store } from './store';
import { ApiResponse, CreateDataRequest, DataRecord } from '@test-fixtures/shared/src/types';

const app = express();
const port = process.env.PORT || 9090;

app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'healthy' });
});

// Get all records
app.get('/data', async (req, res) => {
  const records = await store.getAll();
  const response: ApiResponse<DataRecord[]> = { success: true, data: records };
  res.json(response);
});

// Get single record
app.get('/data/:id', async (req, res) => {
  const record = await store.get(req.params.id);
  if (!record) {
    const response: ApiResponse<undefined> = { 
      success: false, 
      error: 'Record not found' 
    };
    return res.status(404).json(response);
  }
  
  const response: ApiResponse<DataRecord> = { success: true, data: record };
  res.json(response);
});

// Create record
app.post('/data', async (req, res) => {
  const createRequest: CreateDataRequest = req.body;
  const record = await store.create(createRequest);
  const response: ApiResponse<DataRecord> = { success: true, data: record };
  res.status(201).json(response);
});

app.listen(port, () => {
  console.log(`S3 Data service listening at http://localhost:${port}`);
});