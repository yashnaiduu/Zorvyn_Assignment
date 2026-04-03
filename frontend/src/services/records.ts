import { apiFetch } from './api';

export type RecordType = 'INCOME' | 'EXPENSE';

export interface RecordItem {
  id: string;
  userId: string;
  amount: number;
  type: RecordType;
  category: string;
  date: string;
  description: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
}

export interface RecordsResponse {
  success: boolean;
  data: RecordItem[];
  meta: PaginationMeta;
}

export interface RecordResponse {
  success: boolean;
  data: RecordItem;
}

export interface RecordFilters {
  [key: string]: string | number | undefined;
  page?: number;
  limit?: number;
  type?: string;
  category?: string;
}

export interface RecordPayload {
  amount: number;
  type: RecordType;
  category: string;
  date: string;
  description: string;
}

export const recordsService = {
  getAll: (params?: RecordFilters) => apiFetch<RecordsResponse>('/records', { method: 'GET', params }),
  getOne: (id: string) => apiFetch<RecordResponse>(`/records/${id}`, { method: 'GET' }),
  create: (data: RecordPayload) => apiFetch<RecordResponse>('/records', { method: 'POST', body: data }),
  update: (id: string, data: Partial<RecordPayload>) => apiFetch<RecordResponse>(`/records/${id}`, { method: 'PATCH', body: data }),
  delete: (id: string) => apiFetch<{ success: boolean; message: string }>(`/records/${id}`, { method: 'DELETE' }),
};
