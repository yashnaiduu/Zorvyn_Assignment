import { apiFetch } from './api';

export interface RecordItem {
  id: string;
  userId: string;
  amount: number;
  type: 'INCOME' | 'EXPENSE';
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

export const recordsService = {
  getAll: (params?: any) => apiFetch<RecordsResponse>('/records', { method: 'GET', params }),
  getOne: (id: string) => apiFetch<RecordResponse>(`/records/${id}`, { method: 'GET' }),
  create: (data: any) => apiFetch<RecordResponse>('/records', { method: 'POST', body: data }),
  update: (id: string, data: any) => apiFetch<RecordResponse>(`/records/${id}`, { method: 'PATCH', body: data }),
  delete: (id: string) => apiFetch<{ success: boolean; message: string }>(`/records/${id}`, { method: 'DELETE' }),
};
