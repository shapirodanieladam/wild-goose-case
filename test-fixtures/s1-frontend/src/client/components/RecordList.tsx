import { useState } from 'react';
import { DataRecord } from '@test-fixtures/shared/src/types';
import { useRecords } from '../hooks/useRecords';

export function RecordList() {
  const { records, loading, error, createRecord, refreshRecords } = useRecords();
  const [newName, setNewName] = useState('');
  const [newValue, setNewValue] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createRecord(newName, newValue);
      setNewName('');
      setNewValue('');
    } catch (err) {
      console.error('Failed to create record:', err);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Records</h1>
      
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Name:
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Value:
            <input
              type="text"
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              required
            />
          </label>
        </div>
        <button type="submit">Add Record</button>
      </form>

      <button onClick={refreshRecords}>Refresh</button>
      
      <ul>
        {records.map((record: DataRecord) => (
          <li key={record.id}>
            <strong>{record.name}</strong>: {record.value}
            <br />
            <small>Created: {new Date(record.createdAt).toLocaleString()}</small>
          </li>
        ))}
      </ul>
    </div>
  );
}