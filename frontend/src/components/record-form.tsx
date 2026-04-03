import { useState } from 'react';
import { RecordItem, RecordType, RecordPayload } from '../services/records';

interface RecordFormProps {
  record?: RecordItem | null;
  onSubmit: (data: RecordPayload) => Promise<void>;
  onCancel: () => void;
}

export default function RecordForm({ record, onSubmit, onCancel }: RecordFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [type, setType] = useState<RecordType>(record?.type || 'EXPENSE');
  const [amount, setAmount] = useState(record?.amount?.toString() || '');
  const [category, setCategory] = useState(record?.category || '');
  const [date, setDate] = useState(
    record ? new Date(record.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
  );
  const [description, setDescription] = useState(record?.description || '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await onSubmit({
        amount: Number(amount),
        type,
        category,
        date: new Date(date).toISOString(),
        description,
      });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.3)' }}>
      <div
        className="w-full max-w-[420px] rounded-2xl p-7"
        style={{ background: 'var(--bg)', boxShadow: '0 24px 80px rgba(0,0,0,0.15)', border: '1px solid var(--border-subtle)' }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[20px] font-semibold" style={{ color: 'var(--text)' }}>
            {record ? 'Edit Record' : 'New Record'}
          </h2>
          <button onClick={onCancel} className="text-[13px]" style={{ color: 'var(--text-secondary)' }}>Cancel</button>
        </div>

        {error && (
          <p className="text-[13px] mb-4 py-2.5 px-4 rounded-lg" style={{ color: 'var(--danger)', background: 'var(--bg-secondary)' }}>{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[13px] font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Type</label>
            <select value={type} onChange={(e) => setType(e.target.value as RecordType)} required>
              <option value="EXPENSE">Expense</option>
              <option value="INCOME">Income</option>
            </select>
          </div>
          <div>
            <label className="block text-[13px] font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Amount</label>
            <input type="number" step="0.01" min="0" placeholder="0.00" value={amount} onChange={(e) => setAmount(e.target.value)} required />
          </div>
          <div>
            <label className="block text-[13px] font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Category</label>
            <input type="text" placeholder="e.g. Salary" value={category} onChange={(e) => setCategory(e.target.value)} required />
          </div>
          <div>
            <label className="block text-[13px] font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Date</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
          </div>
          <div>
            <label className="block text-[13px] font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Optional" rows={2} />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onCancel} disabled={loading} className="px-5 py-2.5 rounded-xl text-[14px] font-medium transition-colors" style={{ color: 'var(--text-secondary)', background: 'var(--bg-secondary)' }}>
              Cancel
            </button>
            <button type="submit" disabled={loading} className="px-5 py-2.5 rounded-xl text-[14px] font-medium text-white disabled:opacity-50" style={{ background: 'var(--accent)' }}>
              {loading ? 'Saving…' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
