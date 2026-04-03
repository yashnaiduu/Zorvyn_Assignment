import { apiFetch } from './api';
import { RecordItem } from './records';

export interface SummaryData {
  totalIncome: number;
  totalExpenses: number;
  netBalance: number;
}

export interface CategoryBreakdown {
  category: string;
  type: string;
  total: number;
}

export interface MonthlyTrend {
  income: number;
  expense: number;
}

export const analyticsService = {
  getSummary: () => apiFetch<{ success: boolean; data: SummaryData }>('/analytics/summary', { method: 'GET' }),
  getBreakdown: () => apiFetch<{ success: boolean; data: CategoryBreakdown[] }>('/analytics/breakdown', { method: 'GET' }),
  getTrends: () => apiFetch<{ success: boolean; data: Record<string, MonthlyTrend> }>('/analytics/trends', { method: 'GET' }),
  getRecent: (limit: number = 5) => apiFetch<{ success: boolean; data: RecordItem[] }>('/analytics/recent', { method: 'GET', params: { limit } }),
};
