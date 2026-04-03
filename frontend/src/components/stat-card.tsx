export default function StatCard({ title, value, prefix = '', suffix = '', colorClass = 'text-gray-900' }: { title: string, value: number, prefix?: string, suffix?: string, colorClass?: string }) {
  const formattedValue = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col">
      <h3 className="text-sm font-medium text-gray-500 mb-2">{title}</h3>
      <p className={`text-3xl font-bold ${colorClass}`}>
        {prefix}{formattedValue}{suffix}
      </p>
    </div>
  );
}
