'use client';

import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function BarChart({ data }: { data: { label: string; value: number; color?: string }[] }) {
  if (!data || data.length === 0) {
    return <div className="flex items-center justify-center h-full"><p className="text-[14px]" style={{ color: 'var(--text-tertiary)' }}>No data</p></div>;
  }

  const topData = data.slice(0, 7);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="px-4 py-3 rounded-[14px] shadow-sm border backdrop-blur-md" style={{ background: 'var(--bg)', borderColor: 'var(--border-subtle)', boxShadow: '0 8px 30px rgba(0,0,0,0.1)' }}>
          <p className="text-[12px] font-medium" style={{ color: 'var(--text-secondary)' }}>{payload[0].payload.label}</p>
          <p className="text-[15px] font-semibold mt-0.5" style={{ color: 'var(--text)', fontVariantNumeric: 'tabular-nums' }}>
            ${payload[0].value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsBarChart data={topData} margin={{ top: 20, right: 20, left: 0, bottom: 20 }}>
        <XAxis 
          dataKey="label" 
          axisLine={false} 
          tickLine={false} 
          tick={{ fill: 'var(--text-tertiary)', fontSize: 11, fontFamily: 'system-ui' }} 
          tickMargin={15}
          interval={0}
        />
        <YAxis 
          axisLine={false} 
          tickLine={false} 
          tick={{ fill: 'var(--text-tertiary)', fontSize: 11, fontFamily: 'system-ui' }}
          tickFormatter={(val) => `$${val}`}
          width={60}
        />
        <Tooltip 
          content={<CustomTooltip />} 
          cursor={{ fill: 'var(--border-subtle)', opacity: 0.15, radius: 6 }} 
          animationDuration={300}
          animationEasing="ease-out"
        />
        <Bar 
          dataKey="value" 
          radius={[6, 6, 6, 6]} 
          barSize={28}
          animationDuration={1200}
          animationEasing="ease"
        >
          {topData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color || 'var(--accent)'} />
          ))}
        </Bar>
      </RechartsBarChart>
    </ResponsiveContainer>
  );
}
