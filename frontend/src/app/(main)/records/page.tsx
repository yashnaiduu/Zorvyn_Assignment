'use client';

import { useEffect, useState } from 'react';
import RecordTable from '@/components/record-table';
import RecordForm from '@/components/record-form';
import Pagination from '@/components/pagination';
import { recordsService, RecordItem, PaginationMeta } from '@/services/records';
import { getUser, StoredUser } from '@/utils/token';
import { hasPermission } from '@/utils/rbac';

export default function RecordsPage() {
  const user = getUser() as StoredUser | null;
  const canCreate = user ? hasPermission(user.role, 'record:create') : false;
  const [records, setRecords] = useState<RecordItem[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>({ page: 1, limit: 10, total: 0 });
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<RecordItem | null>(null);

  const fetchRecords = async (page = 1) => {
    setLoading(true);
    try {
      const res = await recordsService.getAll({ page, limit: 10, type: typeFilter, category: categoryFilter });
      setRecords(res.data);
      setMeta(res.meta);
    } catch { /* ignore */ } finally { setLoading(false); }
  };

  useEffect(() => { fetchRecords(1); }, [typeFilter, categoryFilter]);

  const handleSubmit = async (data: Record<string, unknown>) => {
    if (editingRecord) await recordsService.update(editingRecord.id, data);
    else await recordsService.create(data);
    setIsFormOpen(false);
    setEditingRecord(null);
    fetchRecords(meta.page);
  };

  const handleDelete = async (id: string) => {
    try { await recordsService.delete(id); fetchRecords(meta.page); } catch { /* ignore */ }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-[28px] font-semibold tracking-tight" style={{ color: 'var(--text)' }}>Records</h1>
          <p className="text-[15px] mt-1" style={{ color: 'var(--text-secondary)' }}>Manage financial records</p>
        </div>
        {canCreate && (
          <button
            onClick={() => { setEditingRecord(null); setIsFormOpen(true); }}
            className="px-5 py-2.5 rounded-xl text-[14px] font-medium text-white"
            style={{ background: 'var(--accent)' }}
          >
            Add Record
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} style={{ maxWidth: 160 }}>
          <option value="">All types</option>
          <option value="INCOME">Income</option>
          <option value="EXPENSE">Expense</option>
        </select>
        <input type="text" placeholder="Search category…" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} style={{ maxWidth: 240 }} />
      </div>

      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3, 4].map((i) => <div key={i} className="h-12 rounded-lg" style={{ background: 'var(--bg-secondary)' }} />)}
        </div>
      ) : (
        <>
          <RecordTable records={records} onEdit={(r) => { setEditingRecord(r); setIsFormOpen(true); }} onDelete={handleDelete} />
          <Pagination page={meta.page} total={meta.total} limit={meta.limit} onPageChange={fetchRecords} />
        </>
      )}

      {isFormOpen && (
        <RecordForm record={editingRecord} onSubmit={handleSubmit} onCancel={() => { setIsFormOpen(false); setEditingRecord(null); }} />
      )}
    </div>
  );
}
