interface StatCardProps {
  title: string;
  value: number;
  prefix?: string;
}

export default function StatCard({ title, value, prefix = '' }: StatCardProps) {
  const formatted = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);

  return (
    <div
      className="p-6 rounded-2xl"
      style={{ background: 'var(--bg-secondary)', transition: 'background 200ms ease' }}
    >
      <p className="text-[13px] mb-2" style={{ color: 'var(--text-secondary)' }}>{title}</p>
      <p className="text-[32px] font-semibold tracking-tight leading-none" style={{ color: 'var(--text)', fontVariantNumeric: 'tabular-nums' }}>
        {prefix}{formatted}
      </p>
    </div>
  );
}
