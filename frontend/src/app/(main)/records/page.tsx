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
  
  // Filters
  const [typeFilter, setTypeFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  // Form State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<RecordItem | null>(null);

  const fetchRecords = async (page = 1) => {
    setLoading(true);
    try {
      const res = await recordsService.getAll({
        page,
        limit: 10,
        type: typeFilter,
        category: categoryFilter
      });
      setRecords(res.data);
      setMeta(res.meta);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords(1);
  }, [typeFilter, categoryFilter]);

  const handleCreateOrUpdate = async (data: any) => {
    if (editingRecord) {
      await recordsService.update(editingRecord.id, data);
    } else {
      await recordsService.create(data);
    }
    setIsFormOpen(false);
    fetchRecords(meta.page);
  };

  const handleDelete = async (id: string) => {
    try {
      await recordsService.delete(id);
      fetchRecords(meta.page);
    } catch (err) {
      alert('Failed to delete record');
    }
  };

  const openNewForm = () => {
    setEditingRecord(null);
    setIsFormOpen(true);
  };

  const openEditForm = (record: RecordItem) => {
    setEditingRecord(record);
    setIsFormOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Records</h1>
        {canCreate && (
          <button 
            onClick={openNewForm}
            className="px-4 py-2 bg-blue-600 text-white font-medium rounded hover:bg-blue-700"
          >
            + Add Record
          </button>
        )}
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Type</label>
          <select 
            value={typeFilter} 
            onChange={(e) => setTypeFilter(e.target.value)}
            className="border rounded px-3 py-1.5 text-sm"
          >
            <option value="">All</option>
            <option value="INCOME">Income</option>
            <option value="EXPENSE">Expense</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Category</label>
          <input 
            type="text" 
            placeholder="Search category..." 
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="border rounded px-3 py-1.5 text-sm"
          />
        </div>
      </div>

      {loading ? (
        <div>Loading records...</div>
      ) : (
        <>
          <RecordTable 
            records={records} 
            onEdit={openEditForm} 
            onDelete={handleDelete} 
          />
          <Pagination 
            page={meta.page} 
            total={meta.total} 
            limit={meta.limit} 
            onPageChange={fetchRecords} 
          />
        </>
      )}

      {isFormOpen && (
        <RecordForm 
          record={editingRecord} 
          onSubmit={handleCreateOrUpdate}
          onCancel={() => setIsFormOpen(false)}
        />
      )}
    </div>
  );
}
