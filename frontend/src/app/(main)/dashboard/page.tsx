'use client';

import { useEffect, useState } from 'react';
import StatCard from '@/components/stat-card';
import RecordTable from '@/components/record-table';
import { analyticsService, SummaryData } from '@/services/analytics';
import { RecordItem } from '@/services/records';

export default function DashboardPage() {
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [recent, setRecent] = useState<RecordItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([
      analyticsService.getSummary(),
      analyticsService.getRecent()
    ]).then(([resSummary, resRecent]) => {
      setSummary(resSummary.data);
      setRecent(resRecent.data);
    }).catch(err => {
      setError(err.message || 'Failed to load dashboard data');
    }).finally(() => {
      setLoading(false);
    });
  }, []);

  if (loading) return <div>Loading dashboard...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Total Income" 
          value={summary?.totalIncome || 0} 
          prefix="+$" 
          colorClass="text-green-600"
        />
        <StatCard 
          title="Total Expenses" 
          value={summary?.totalExpenses || 0} 
          prefix="-$" 
          colorClass="text-red-600"
        />
        <StatCard 
          title="Net Balance" 
          value={Math.abs(summary?.netBalance || 0)} 
          prefix={summary && summary.netBalance < 0 ? '-$' : '+$'} 
          colorClass={summary && summary.netBalance < 0 ? 'text-red-600' : 'text-gray-900'}
        />
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Transactions</h2>
        <RecordTable records={recent} onEdit={() => {}} onDelete={() => {}} />
      </div>
    </div>
  );
}
