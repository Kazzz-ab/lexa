import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { FileText, ChevronLeft, ChevronRight, DollarSign } from 'lucide-react';
import { format } from 'date-fns';
import api from '../lib/api.js';

const STATUS = {
  draft: { bg: 'rgba(107,107,123,0.08)', color: '#6B6B7B', label: 'Draft' },
  sent: { bg: 'rgba(46,95,163,0.1)', color: '#2E5FA3', label: 'Sent' },
  paid: { bg: 'rgba(27,58,107,0.1)', color: '#1B3A6B', label: 'Paid' },
  overdue: { bg: 'rgba(180,83,9,0.1)', color: '#B45309', label: 'Overdue' },
  cancelled: { bg: 'rgba(107,107,123,0.06)', color: '#9CA3AF', label: 'Cancelled' },
};

export default function Invoices() {
  const [invoices, setInvoices] = useState([]);
  const [total, setTotal] = useState(0);
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/invoices', { params: { status: statusFilter || undefined, page, limit: 15 } });
      setInvoices(data.invoices);
      setTotal(data.total);
    } finally { setLoading(false); }
  }, [statusFilter, page]);

  useEffect(() => { load(); }, [load]);

  const totalPages = Math.ceil(total / 15);
  const pageTotal = invoices.reduce((s, inv) => s + (inv.total || 0), 0);

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.75rem', fontWeight: 700, color: 'var(--text)', letterSpacing: '-0.02em' }}>Billing</h1>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.83rem', color: 'var(--muted)', fontStyle: 'italic', marginTop: '0.2rem' }}>
            {total} invoices · Page total: ${pageTotal.toLocaleString()}
          </p>
        </div>
        <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          style={{ fontFamily: 'var(--font-body)', background: '#FDFBF8', border: '1px solid rgba(201,168,76,0.2)' }}
          className="px-3 py-2.5 rounded-lg text-sm focus:outline-none max-w-xs">
          <option value="">All statuses</option>
          {Object.entries(STATUS).map(([v, { label }]) => <option key={v} value={v}>{label}</option>)}
        </select>
      </div>

      <div className="rounded-xl overflow-hidden" style={{ background: 'var(--surface)', border: '1px solid rgba(201,168,76,0.15)', boxShadow: '0 2px 12px rgba(27,58,107,0.07)' }}>
        <div className="grid grid-cols-12 px-6 py-3 text-xs font-semibold text-[#6B6B7B] uppercase tracking-widest"
          style={{ fontFamily: 'var(--font-body)', borderBottom: '1px solid rgba(201,168,76,0.1)' }}>
          <div className="col-span-2">Invoice</div>
          <div className="col-span-3">Client</div>
          <div className="col-span-2">Matter</div>
          <div className="col-span-2">Due Date</div>
          <div className="col-span-1">Amount</div>
          <div className="col-span-2">Status</div>
        </div>

        {loading ? (
          <div className="py-16 text-center text-[#6B6B7B]" style={{ fontFamily: 'var(--font-body)', fontStyle: 'italic' }}>Loading…</div>
        ) : invoices.length === 0 ? (
          <div className="py-16 text-center">
            <FileText size={32} className="mx-auto mb-3 text-[#C9A84C]/30" />
            <p style={{ fontFamily: 'var(--font-body)', color: 'var(--muted)', fontStyle: 'italic' }}>No invoices on record</p>
          </div>
        ) : (
          <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.04 } } }}>
            {invoices.map((inv) => {
              const sc = STATUS[inv.status] || STATUS.draft;
              return (
                <motion.div key={inv._id}
                  variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
                  className="grid grid-cols-12 px-6 py-4 items-center hover:bg-[#F5F2ED] transition-colors cursor-pointer"
                  style={{ borderBottom: '1px solid rgba(201,168,76,0.06)' }}>
                  <div className="col-span-2" style={{ fontFamily: 'var(--font-body)', fontSize: '0.78rem', fontWeight: 600, color: '#C9A84C' }}>{inv.invoiceNumber}</div>
                  <div className="col-span-3" style={{ fontFamily: 'var(--font-heading)', fontSize: '0.85rem', color: 'var(--text)' }}>
                    {inv.client?.firstName} {inv.client?.lastName}
                    {inv.client?.company && <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.73rem', color: 'var(--muted)', fontStyle: 'italic', display: 'block' }}>{inv.client.company}</span>}
                  </div>
                  <div className="col-span-2" style={{ fontFamily: 'var(--font-body)', fontSize: '0.78rem', color: 'var(--muted)', fontStyle: 'italic' }}>
                    {inv.case?.title ? inv.case.title.substring(0, 24) + (inv.case.title.length > 24 ? '…' : '') : '—'}
                  </div>
                  <div className="col-span-2" style={{ fontFamily: 'var(--font-body)', fontSize: '0.78rem', color: inv.status === 'overdue' ? '#B45309' : 'var(--muted)' }}>
                    {inv.dueDate ? format(new Date(inv.dueDate), 'dd MMM yyyy') : '—'}
                  </div>
                  <div className="col-span-1 flex items-center gap-0.5">
                    <DollarSign size={12} className="text-[#C9A84C]" />
                    <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '0.85rem', color: 'var(--text)' }}>
                      {inv.total?.toLocaleString()}
                    </span>
                  </div>
                  <div className="col-span-2">
                    <span className="px-2.5 py-1 rounded-md text-xs"
                      style={{ background: sc.bg, color: sc.color, fontFamily: 'var(--font-body)', border: `1px solid ${sc.color}25` }}>
                      {sc.label}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-5">
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: 'var(--muted)', fontStyle: 'italic' }}>Page {page} of {totalPages}</p>
          <div className="flex gap-2">
            <button disabled={page === 1} onClick={() => setPage(p => p - 1)}
              className="p-2 rounded-lg disabled:opacity-40" style={{ border: '1px solid rgba(201,168,76,0.2)' }}><ChevronLeft size={15} /></button>
            <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)}
              className="p-2 rounded-lg disabled:opacity-40" style={{ border: '1px solid rgba(201,168,76,0.2)' }}><ChevronRight size={15} /></button>
          </div>
        </div>
      )}
    </div>
  );
}
