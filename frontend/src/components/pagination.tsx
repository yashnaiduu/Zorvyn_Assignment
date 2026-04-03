export default function Pagination({ page, total, limit, onPageChange }: { page: number; total: number; limit: number; onPageChange: (p: number) => void }) {
  const totalPages = Math.ceil(total / limit) || 1;
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between pt-5">
      <p className="text-[13px]" style={{ color: 'var(--text-tertiary)' }}>
        {Math.min((page - 1) * limit + 1, total)}–{Math.min(page * limit, total)} of {total}
      </p>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="px-3 py-1.5 rounded-lg text-[13px] font-medium transition-colors disabled:opacity-30"
          style={{ color: 'var(--accent)' }}
        >
          Previous
        </button>
        <span className="px-3 py-1.5 text-[13px]" style={{ color: 'var(--text-secondary)' }}>
          {page} / {totalPages}
        </span>
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="px-3 py-1.5 rounded-lg text-[13px] font-medium transition-colors disabled:opacity-30"
          style={{ color: 'var(--accent)' }}
        >
          Next
        </button>
      </div>
    </div>
  );
}
