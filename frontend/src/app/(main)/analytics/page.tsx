'use client';

import { useEffect, useState } from 'react';
import BarChart from '@/components/bar-chart';
import LineChart from '@/components/line-chart';
import { analyticsService, CategoryBreakdown, MonthlyTrend } from '@/services/analytics';

export default function AnalyticsPage() {
  const [breakdown, setBreakdown] = useState<CategoryBreakdown[]>([]);
  const [trends, setTrends] = useState<Record<string, MonthlyTrend>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      analyticsService.getBreakdown(),
      analyticsService.getTrends()
    ]).then(([resBreakdown, resTrends]) => {
      setBreakdown(resBreakdown.data);
      setTrends(resTrends.data);
    }).catch(err => {
      console.error(err);
    }).finally(() => {
      setLoading(false);
    });
  }, []);

  if (loading) return <div>Loading analytics...</div>;

  // Format data for BarChart (Grouped by Category, colored by Type)
  const barData = breakdown.map(b => ({
    label: b.category,
    value: b.total,
    color: b.type === 'INCOME' ? '#22c55e' : '#ef4444' // green/red
  })).sort((a, b) => b.value - a.value);

  // Format data for LineChart
  const lineData = Object.entries(trends).map(([month, data]) => ({
    label: month,
    values: [
      { name: 'Income', value: data.income || 0, color: '#22c55e' },
      { name: 'Expense', value: data.expense || 0, color: '#ef4444' }
    ]
  }));

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Category Breakdown</h2>
          <div className="h-64">
            <BarChart data={barData} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Monthly Trends</h2>
          <div className="h-64 pt-4">
            <LineChart data={lineData} />
          </div>
        </div>
      </div>
    </div>
  );
}
