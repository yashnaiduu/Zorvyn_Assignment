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
    Promise.all([analyticsService.getBreakdown(), analyticsService.getTrends()])
      .then(([b, t]) => { setBreakdown(b.data); setTrends(t.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="h-6 w-32 rounded-lg" style={{ background: 'var(--bg-secondary)' }} />
        <div className="grid grid-cols-2 gap-6">
          {[1, 2].map((i) => <div key={i} className="h-[430px] rounded-2xl" style={{ background: 'var(--bg-secondary)' }} />)}
        </div>
      </div>
    );
  }

  const aggregatedBreakdown = breakdown.reduce((acc, curr) => {
    if (!acc[curr.category]) acc[curr.category] = 0;
    acc[curr.category] += curr.total;
    return acc;
  }, {} as Record<string, number>);

  const barData = Object.entries(aggregatedBreakdown)
    .map(([label, value]) => ({ label, value, color: 'var(--accent)' }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  const lineData = Object.entries(trends).map(([month, d]) => ({
    label: month,
    values: [
      { name: 'Income', value: d.income || 0, color: '#34c759' },
      { name: 'Expense', value: d.expense || 0, color: '#ff3b30' },
    ],
  }));

  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-[28px] font-semibold tracking-tight" style={{ color: 'var(--text)' }}>Analytics</h1>
        <p className="text-[15px] mt-1" style={{ color: 'var(--text-secondary)' }}>Visual breakdown of your finances</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="p-8 rounded-[24px]" style={{ background: 'var(--bg-secondary)' }}>
          <h2 className="text-[17px] font-semibold mb-8" style={{ color: 'var(--text)' }}>By Category</h2>
          <div className="h-[360px] w-full">
            <BarChart data={barData} />
          </div>
        </div>

        <div className="p-8 rounded-[24px]" style={{ background: 'var(--bg-secondary)' }}>
          <h2 className="text-[17px] font-semibold mb-8" style={{ color: 'var(--text)' }}>Monthly Trends</h2>
          <div className="h-[360px] w-full">
            <LineChart data={lineData} />
          </div>
        </div>
      </div>
    </div>
  );
}
