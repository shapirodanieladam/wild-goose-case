import { useState } from 'react';
import { DataRecord } from '@test-fixtures/shared/src/types';
import { useRecords } from '../hooks/useRecords';

export function RecordList() {
  const { records, loading, error, createRecord, refreshRecords } = useRecords();
  const [newName, setNewName] = useState('');
  const [newValue, setNewValue] = useState('');
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    try {
      console.log('Submitting new record:', { name: newName, value: newValue });
      await createRecord(newName, newValue);
      setNewName('');
      setNewValue('');
      await refreshRecords();
    } catch (err) {
      console.error('Failed to create record:', err);
      setSubmitError(err instanceof Error ? err.message : 'Failed to create record');
    }
  };

  if (loading) return <div>Loading records...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div>
      <h1>Records Manager</h1>
      
      <form onSubmit={handleSubmit}>
        <div className="form-field">
          <label>Name</label>
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Enter record name"
            required
          />
        </div>
        <div className="form-field">
          <label>Value</label>
          <input
            type="text"
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            placeholder="Enter record value"
            required
          />
        </div>
        <div className="form-actions">
          <button type="submit">Add Record</button>
          <button type="button" onClick={refreshRecords}>Refresh List</button>
        </div>
        {submitError && <div className="error">{submitError}</div>}
      </form>

      <ul>
        {records.length === 0 ? (
          <li>No records found. Create one above!</li>
        ) : (
          records.map((record: DataRecord) => (
            <li key={record.id}>
              <strong>{record.name}</strong>: {record.value}
              <br />
              <small>Created: {new Date(record.createdAt).toLocaleString()}</small>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}