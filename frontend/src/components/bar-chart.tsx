export default function BarChart({ data }: { data: { label: string; value: number; color?: string }[] }) {
  if (!data || data.length === 0) return <div className="text-gray-500 text-sm text-center py-10">No data available</div>;

  const maxVal = Math.max(...data.map(d => d.value));
  const height = 250;
  
  return (
    <div className="w-full flex items-end h-[250px] gap-2 pt-4">
      {data.map((item, i) => {
        const barHeight = maxVal > 0 ? (item.value / maxVal) * (height - 30) : 0;
        return (
          <div key={i} className="flex flex-col items-center flex-1 group relative">
            <div 
              className="w-full rounded-t-sm transition-all duration-300 hover:opacity-80"
              style={{ 
                height: `${Math.max(barHeight, 4)}px`, 
                backgroundColor: item.color || '#3b82f6' 
              }}
            >
              <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded pointer-events-none whitespace-nowrap transition-opacity">
                ${item.value.toFixed(2)}
              </div>
            </div>
            <div className="w-full text-center text-xs text-gray-500 mt-2 truncate px-1" title={item.label}>
              {item.label}
            </div>
          </div>
        );
      })}
    </div>
  );
}
