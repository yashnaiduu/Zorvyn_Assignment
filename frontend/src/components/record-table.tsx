import { RecordItem } from '../services/records';
import { getUser, StoredUser } from '../utils/token';
import { hasPermission } from '../utils/rbac';

export default function RecordTable({ 
  records, 
  onEdit, 
  onDelete 
}: { 
  records: RecordItem[], 
  onEdit: (r: RecordItem) => void, 
  onDelete: (id: string) => void 
}) {
  const user = getUser() as StoredUser | null;
  const canUpdate = user ? hasPermission(user.role, 'record:update') : false;
  const canDelete = user ? hasPermission(user.role, 'record:delete') : false;

  if (records.length === 0) {
    return <div className="text-center py-8 text-gray-500 bg-white border border-gray-200 rounded">No records found.</div>;
  }

  return (
    <div className="overflow-x-auto bg-white border border-gray-200 rounded">
      <table className="w-full text-left text-sm whitespace-nowrap">
        <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 font-medium">
          <tr>
            <th className="px-6 py-3">Date</th>
            <th className="px-6 py-3">Type</th>
            <th className="px-6 py-3">Category</th>
            <th className="px-6 py-3">Description</th>
            <th className="px-6 py-3 text-right">Amount</th>
            {(canUpdate || canDelete) && <th className="px-6 py-3 text-right">Actions</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 text-gray-700">
          {records.map(record => (
            <tr key={record.id} className="hover:bg-gray-50">
              <td className="px-6 py-4">{new Date(record.date).toLocaleDateString()}</td>
              <td className="px-6 py-4">
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  record.type === 'INCOME' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {record.type}
                </span>
              </td>
              <td className="px-6 py-4">{record.category}</td>
              <td className="px-6 py-4 truncate max-w-[200px]" title={record.description}>{record.description}</td>
              <td className={`px-6 py-4 text-right font-medium ${
                  record.type === 'INCOME' ? 'text-green-600' : 'text-gray-900'
                }`}>
                {record.type === 'INCOME' ? '+' : '-'}${Number(record.amount).toFixed(2)}
              </td>
              {(canUpdate || canDelete) && (
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    {canUpdate && (
                      <button onClick={() => onEdit(record)} className="text-blue-600 hover:text-blue-800 font-medium text-xs">
                        Edit
                      </button>
                    )}
                    {canDelete && (
                      <button onClick={() => { if(confirm('Are you sure?')) onDelete(record.id) }} className="text-red-600 hover:text-red-800 font-medium text-xs">
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
