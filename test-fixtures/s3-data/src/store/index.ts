import { DataRecord } from '@test-fixtures/shared/src/types';

class InMemoryStore {
  private store: Map<string, DataRecord>;

  constructor() {
    this.store = new Map();
  }

  async get(id: string): Promise<DataRecord | undefined> {
    return this.store.get(id);
  }

  async getAll(): Promise<DataRecord[]> {
    return Array.from(this.store.values());
  }

  async create(data: Omit<DataRecord, 'id' | 'createdAt'>): Promise<DataRecord> {
    const id = Math.random().toString(36).substring(2, 15);
    const record: DataRecord = {
      id,
      ...data,
      createdAt: new Date().toISOString()
    };
    this.store.set(id, record);
    return record;
  }

  async update(id: string, data: Partial<DataRecord>): Promise<DataRecord | undefined> {
    const existing = this.store.get(id);
    if (!existing) return undefined;

    const updated = { ...existing, ...data };
    this.store.set(id, updated);
    return updated;
  }

  async delete(id: string): Promise<boolean> {
    return this.store.delete(id);
  }
}

export const store = new InMemoryStore();