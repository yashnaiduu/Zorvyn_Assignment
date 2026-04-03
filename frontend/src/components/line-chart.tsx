export default function LineChart({ data }: { data: { label: string; values: { name: string, value: number, color: string }[] }[] }) {
  if (!data || data.length === 0) return <div className="text-gray-500 text-sm text-center py-10">No data available</div>;

  const width = 600;
  const height = 250;
  const padding = 40;

  // Find max value across all series
  let maxVal = 0;
  data.forEach(d => {
    d.values.forEach(v => {
      if (v.value > maxVal) maxVal = v.value;
    });
  });

  // Calculate coordinates
  const points: Record<string, string> = {};
  const colors: Record<string, string> = {};
  
  // Initialize series
  if (data.length > 0) {
    data[0].values.forEach(v => {
      points[v.name] = '';
      colors[v.name] = v.color;
    });
  }

  const xStep = (width - padding * 2) / Math.max(data.length - 1, 1);

  data.forEach((d, i) => {
    const x = padding + i * xStep;
    d.values.forEach(v => {
      const y = height - padding - (maxVal > 0 ? (v.value / maxVal) * (height - padding * 2) : 0);
      points[v.name] += `${i === 0 ? 'M' : 'L'} ${x} ${y} `;
    });
  });

  return (
    <div className="w-full overflow-hidden flex flex-col justify-center">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
          const y = padding + ratio * (height - padding * 2);
          return (
            <g key={`grid-${i}`}>
              <line x1={padding} y1={y} x2={width - padding} y2={y} stroke="#f3f4f6" strokeWidth="1" />
              <text x={padding - 5} y={y + 4} fontSize="10" fill="#9ca3af" textAnchor="end">
                ${(maxVal * (1 - ratio)).toFixed(0)}
              </text>
            </g>
          );
        })}
        
        {/* Lines */}
        {Object.entries(points).map(([name, pathD]) => (
          <path key={name} d={pathD} fill="none" stroke={colors[name] || '#000'} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        ))}
        
        {/* Data points */}
        {data.map((d, i) => {
          const x = padding + i * xStep;
          return d.values.map(v => {
            const y = height - padding - (maxVal > 0 ? (v.value / maxVal) * (height - padding * 2) : 0);
            return (
              <circle key={`${i}-${v.name}`} cx={x} cy={y} r="4" fill={colors[v.name] || '#000'} stroke="#fff" strokeWidth="2" />
            );
          });
        })}

        {/* X Axis Labels */}
        {data.map((d, i) => {
          const x = padding + i * xStep;
          return (
            <text key={`label-${i}`} x={x} y={height - 10} fontSize="12" fill="#6b7280" textAnchor="middle">
              {d.label}
            </text>
          );
        })}
      </svg>
      
      {/* Legend */}
      <div className="flex justify-center gap-4 mt-2">
        {Object.keys(colors).map(name => (
          <div key={name} className="flex items-center gap-1 text-sm text-gray-600">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors[name] }}></div>
            {name}
          </div>
        ))}
      </div>
    </div>
  );
}
