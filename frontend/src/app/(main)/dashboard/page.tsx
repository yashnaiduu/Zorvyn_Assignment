'use client';

import { useEffect, useState } from 'react';
import StatCard from '@/components/stat-card';
import RecordTable from '@/components/record-table';
import { analyticsService, SummaryData } from '@/services/analytics';
import { RecordItem } from '@/services/records';
import { getUser } from '@/utils/token';

export default function DashboardPage() {
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [recent, setRecent] = useState<RecordItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const user = getUser();

  useEffect(() => {
    Promise.all([analyticsService.getSummary(), analyticsService.getRecent()])
      .then(([s, r]) => { setSummary(s.data); setRecent(r.data); })
      .catch((e) => setError(e.message || 'Failed to load'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="h-6 w-40 rounded-lg" style={{ background: 'var(--bg-secondary)' }} />
        <div className="grid grid-cols-3 gap-5">
          {[1, 2, 3].map((i) => <div key={i} className="h-[100px] rounded-2xl" style={{ background: 'var(--bg-secondary)' }} />)}
        </div>
      </div>
    );
  }

  if (error) return <p className="text-[15px]" style={{ color: 'var(--danger)' }}>{error}</p>;

  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-[28px] font-semibold tracking-tight" style={{ color: 'var(--text)' }}>
          Welcome, {user?.name}
        </h1>
        <p className="text-[15px] mt-1" style={{ color: 'var(--text-secondary)' }}>
          Here&apos;s your financial overview.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <StatCard title="Total Income" value={summary?.totalIncome || 0} prefix="+$" />
        <StatCard title="Total Expenses" value={summary?.totalExpenses || 0} prefix="−$" />
        <StatCard title="Net Balance" value={Math.abs(summary?.netBalance || 0)} prefix={summary && summary.netBalance < 0 ? '−$' : '$'} />
      </div>

      <div>
        <h2 className="text-[18px] font-semibold mb-5" style={{ color: 'var(--text)' }}>Recent Transactions</h2>
        <RecordTable records={recent} onEdit={() => {}} onDelete={() => {}} />
      </div>
    </div>
  );
}
