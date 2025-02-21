import { useState, useEffect } from 'react';
import { ApiResponse, DataRecord } from '@test-fixtures/shared/src/types';

export const useRecords = () => {
  const [records, setRecords] = useState<DataRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/records');
      const data: ApiResponse<DataRecord[]> = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch records');
      }
      
      setRecords(data.data || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const createRecord = async (name: string, value: string) => {
    try {
      const response = await fetch('/api/records', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': 'test-api-key'
        },
        body: JSON.stringify({ name, value })
      });
      
      const data: ApiResponse<DataRecord> = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to create record');
      }
      
      // Refresh records after creation
      await fetchRecords();
      return data.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create record');
      throw err;
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  return {
    records,
    loading,
    error,
    createRecord,
    refreshRecords: fetchRecords
  };
};