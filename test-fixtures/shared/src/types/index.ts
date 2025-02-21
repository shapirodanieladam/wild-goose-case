export interface DataRecord {
  id: string;
  name: string;
  value: string;
  createdAt: string;
}

export interface CreateDataRequest {
  name: string;
  value: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface ServiceConfig {
  port: number;
  host: string;
}