import fetch from 'node-fetch';
import { ApiResponse, CreateDataRequest, DataRecord } from '@test-fixtures/shared/src/types';

export class DataService {
  private baseUrl: string;

  constructor() {
    // In a real app, this would come from config
    this.baseUrl = process.env.S3_URL || 'http://localhost:9090';
  }

  async getAllRecords(): Promise<ApiResponse<DataRecord[]>> {
    try {
      const response = await fetch(`${this.baseUrl}/data`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json() as ApiResponse<DataRecord[]>;
    } catch (error) {
      console.error('Error fetching records:', error);
      return {
        success: false,
        error: 'Failed to fetch records from data service'
      };
    }
  }

  async getRecord(id: string): Promise<ApiResponse<DataRecord>> {
    try {
      const response = await fetch(`${this.baseUrl}/data/${id}`);
      if (!response.ok) {
        if (response.status === 404) {
          return {
            success: false,
            error: 'Record not found'
          };
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json() as ApiResponse<DataRecord>;
    } catch (error) {
      console.error('Error fetching record:', error);
      return {
        success: false,
        error: 'Failed to fetch record from data service'
      };
    }
  }

  async createRecord(data: CreateDataRequest): Promise<ApiResponse<DataRecord>> {
    try {
      const response = await fetch(`${this.baseUrl}/data`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json() as ApiResponse<DataRecord>;
    } catch (error) {
      console.error('Error creating record:', error);
      return {
        success: false,
        error: 'Failed to create record in data service'
      };
    }
  }
}