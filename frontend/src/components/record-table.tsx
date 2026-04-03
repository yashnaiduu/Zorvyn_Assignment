import { RecordItem } from '../services/records';
import { getUser, StoredUser } from '../utils/token';
import { hasPermission } from '../utils/rbac';

export default function RecordTable({
  records,
  onEdit,
  onDelete,
}: {
  records: RecordItem[];
  onEdit: (r: RecordItem) => void;
  onDelete: (id: string) => void;
}) {
  const user = getUser() as StoredUser | null;
  const canUpdate = user ? hasPermission(user.role, 'record:update') : false;
  const canDelete = user ? hasPermission(user.role, 'record:delete') : false;

  if (records.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="text-[15px]" style={{ color: 'var(--text-tertiary)' }}>No records found.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border" style={{ borderColor: 'var(--border-subtle)' }}>
      <table className="w-full text-left text-[14px]" style={{ borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
            {['Date', 'Type', 'Category', 'Description', 'Amount'].map((h) => (
              <th
                key={h}
                className="px-5 py-3 text-[12px] font-medium uppercase tracking-wider"
                style={{ color: 'var(--text-tertiary)', textAlign: h === 'Amount' ? 'right' : 'left' }}
              >
                {h}
              </th>
            ))}
            {(canUpdate || canDelete) && (
              <th className="px-5 py-3 text-[12px] font-medium uppercase tracking-wider text-right" style={{ color: 'var(--text-tertiary)' }} />
            )}
          </tr>
        </thead>
        <tbody>
          {records.map((r) => (
            <tr
              key={r.id}
              className="transition-colors"
              style={{ borderBottom: '1px solid var(--border-subtle)' }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-secondary)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
            >
              <td className="px-5 py-3.5" style={{ color: 'var(--text)' }}>
                {new Date(r.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </td>
              <td className="px-5 py-3.5">
                <span
                  className="text-[12px] font-medium px-2 py-0.5 rounded-md"
                  style={{
                    color: r.type === 'INCOME' ? 'var(--success)' : 'var(--danger)',
                    background: r.type === 'INCOME' ? 'rgba(52,199,89,0.1)' : 'rgba(255,59,48,0.1)',
                  }}
                >
                  {r.type}
                </span>
              </td>
              <td className="px-5 py-3.5" style={{ color: 'var(--text-secondary)' }}>{r.category}</td>
              <td className="px-5 py-3.5 max-w-[200px] truncate" style={{ color: 'var(--text-secondary)' }} title={r.description}>
                {r.description}
              </td>
              <td className="px-5 py-3.5 text-right font-medium" style={{ color: 'var(--text)', fontVariantNumeric: 'tabular-nums' }}>
                {r.type === 'INCOME' ? '+' : '−'}${Number(r.amount).toFixed(2)}
              </td>
              {(canUpdate || canDelete) && (
                <td className="px-5 py-3.5 text-right">
                  <div className="flex items-center justify-end gap-3">
                    {canUpdate && (
                      <button onClick={() => onEdit(r)} className="text-[13px] transition-colors" style={{ color: 'var(--accent)' }}>
                        Edit
                      </button>
                    )}
                    {canDelete && (
                      <button
                        onClick={() => { if (confirm('Delete this record?')) onDelete(r.id); }}
                        className="text-[13px] transition-colors"
                        style={{ color: 'var(--danger)' }}
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
