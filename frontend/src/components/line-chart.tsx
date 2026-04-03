'use client';

import { LineChart as RechartsLineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';

export default function LineChart({ data }: { data: { label: string; values: { name: string; value: number; color: string }[] }[] }) {
  if (!data || data.length === 0) {
    return <div className="flex items-center justify-center h-full"><p className="text-[14px]" style={{ color: 'var(--text-tertiary)' }}>No data</p></div>;
  }

  const formattedData = data.map(d => {
    let shortLabel = d.label;
    if (/^\d{4}-\d{2}$/.test(d.label)) {
      const date = new Date(`${d.label}-01T00:00:00`);
      shortLabel = date.toLocaleDateString('en-US', { month: 'short' });
    }
    
    const obj: any = { name: shortLabel };
    d.values.forEach(v => {
      obj[v.name] = v.value;
    });
    return obj;
  });

  const lines: Record<string, string> = {};
  if (data.length > 0) {
    data[0].values.forEach(v => {
      lines[v.name] = v.color;
    });
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="px-5 py-4 rounded-[16px] shadow-sm border backdrop-blur-md min-w-[140px]" style={{ background: 'var(--bg)', borderColor: 'var(--border-subtle)', boxShadow: '0 8px 30px rgba(0,0,0,0.1)' }}>
          <p className="text-[13px] font-medium mb-3" style={{ color: 'var(--text-secondary)' }}>{label} 2024</p>
          <div className="space-y-2">
            {payload.map((entry: any, index: number) => (
              <div key={index} className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: entry.color }} />
                  <span className="text-[13px]" style={{ color: 'var(--text-tertiary)' }}>{entry.name}</span>
                </div>
                <span className="text-[14px] font-semibold" style={{ color: 'var(--text)', fontVariantNumeric: 'tabular-nums' }}>
                  ${entry.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsLineChart data={formattedData} margin={{ top: 20, right: 20, left: 0, bottom: 20 }}>
        <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="var(--border-subtle)" />
        <XAxis 
          dataKey="name" 
          axisLine={false} 
          tickLine={false} 
          tick={{ fill: 'var(--text-tertiary)', fontSize: 10, fontFamily: 'system-ui' }} 
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
          cursor={{ stroke: 'var(--border-subtle)', strokeWidth: 1, strokeDasharray: '4 4' }} 
          animationDuration={300}
          animationEasing="ease-out"
        />
        <Legend iconType="circle" iconSize={7} wrapperStyle={{ fontSize: 12, color: 'var(--text-secondary)', bottom: -5, fontFamily: 'system-ui' }} />

        
        {Object.entries(lines).map(([name, color]) => (
          <Line 
            key={name}
            type="monotone" 
            dataKey={name} 
            stroke={color} 
            strokeWidth={3}
            dot={false}
            activeDot={{ r: 5, strokeWidth: 3, stroke: 'var(--bg)', fill: color }}
            animationDuration={1500}
            animationEasing="ease"
          />
        ))}
      </RechartsLineChart>
    </ResponsiveContainer>
  );
}
