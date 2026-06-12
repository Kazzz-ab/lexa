import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ClipboardList, ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import { format } from 'date-fns';
import api from '../lib/api.js';

const ACTION_COLORS = {
  CREATE: { bg: 'rgba(139,92,246,0.12)', color: '#8B5CF6' },
  UPDATE: { bg: 'rgba(76,29,149,0.1)', color: '#4C1D95' },
  DELETE: { bg: 'rgba(234,88,12,0.1)', color: '#EA580C' },
};

const RESOURCES = ['clients', 'attorneys', 'cases', 'invoices', 'admin'];

function ActionBadge({ action }) {
  const s = ACTION_COLORS[action] || { bg: 'rgba(100,116,139,0.1)', color: '#64748B' };
  return (
    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide"
      style={{ background: s.bg, color: s.color, fontFamily: 'var(--font-body)' }}>
      {action}
    </span>
  );
}

export default function AuditLog() {
  const [logs, setLogs] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [filterResource, setFilterResource] = useState('');
  const [filterAction, setFilterAction] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 50 };
      if (filterResource) params.resource = filterResource;
      if (filterAction) params.action = filterAction;
      const { data } = await api.get('/admin/audit', { params });
      setLogs(data.logs);
      setTotal(data.total);
    } finally { setLoading(false); }
  }, [page, filterResource, filterAction]);

  useEffect(() => { load(); }, [load]);

  const totalPages = Math.ceil(total / 50);

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #4C1D95, #8B5CF6)' }}>
              <ClipboardList size={18} className="text-white" />
            </div>
            <div>
              <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.75rem', fontWeight: 800, color: 'var(--text)' }}>Audit Log</h1>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: 'var(--muted)', marginTop: '0.1rem' }}>
                {total} recorded actions
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Filter size={15} className="text-[#94A3B8]" />
            <select value={filterResource} onChange={(e) => { setFilterResource(e.target.value); setPage(1); }}
              style={{ fontFamily: 'var(--font-body)' }}
              className="px-3 py-2 rounded-xl border border-[#E2E8F0] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]/20">
              <option value="">All resources</option>
              {RESOURCES.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
            <select value={filterAction} onChange={(e) => { setFilterAction(e.target.value); setPage(1); }}
              style={{ fontFamily: 'var(--font-body)' }}
              className="px-3 py-2 rounded-xl border border-[#E2E8F0] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]/20">
              <option value="">All actions</option>
              <option value="CREATE">CREATE</option>
              <option value="UPDATE">UPDATE</option>
              <option value="DELETE">DELETE</option>
            </select>
          </div>
        </div>
      </motion.div>

      <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--surface)', border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
        <div className="grid grid-cols-12 px-6 py-3 border-b border-[#F1F5F9] text-xs font-semibold text-[#94A3B8] uppercase tracking-wide"
          style={{ fontFamily: 'var(--font-body)' }}>
          <div className="col-span-2">Time</div>
          <div className="col-span-3">User</div>
          <div className="col-span-1">Action</div>
          <div className="col-span-2">Resource</div>
          <div className="col-span-4">Details</div>
        </div>

        {loading ? (
          <div className="py-16 text-center text-[#94A3B8]" style={{ fontFamily: 'var(--font-body)', fontSize: '0.9rem' }}>Loading…</div>
        ) : logs.length === 0 ? (
          <div className="py-16 text-center">
            <ClipboardList size={36} className="mx-auto mb-3 text-[#CBD5E1]" />
            <p style={{ fontFamily: 'var(--font-body)', color: 'var(--muted)', fontSize: '0.9rem' }}>No audit entries found</p>
          </div>
        ) : (
          <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.02 } } }}>
            {logs.map((log) => (
              <motion.div key={log.id}
                variants={{ hidden: { opacity: 0, y: 6 }, visible: { opacity: 1, y: 0 } }}
                className="grid grid-cols-12 px-6 py-3.5 border-b border-[#F8FAFC] last:border-0 hover:bg-[#F8FAFC] transition-colors items-start">
                <div className="col-span-2" style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: 'var(--muted)' }}>
                  {format(new Date(log.createdAt), 'dd MMM yy')}
                  <br />
                  <span className="text-[0.7rem]">{format(new Date(log.createdAt), 'HH:mm:ss')}</span>
                </div>
                <div className="col-span-3">
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text)' }}>
                    {log.userEmail || '—'}
                  </p>
                  {log.ip && (
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.7rem', color: 'var(--muted)' }}>{log.ip}</p>
                  )}
                </div>
                <div className="col-span-1"><ActionBadge action={log.action} /></div>
                <div className="col-span-2">
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.82rem', color: 'var(--text)' }}>{log.resource}</span>
                  {log.resourceId && (
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.7rem', color: 'var(--muted)' }} className="truncate max-w-[120px]">
                      {log.resourceId}
                    </p>
                  )}
                </div>
                <div className="col-span-4">
                  {log.details && (
                    <pre className="text-[0.7rem] text-[#64748B] truncate max-w-xs overflow-hidden"
                      style={{ fontFamily: 'monospace', background: 'rgba(0,0,0,0.03)', padding: '4px 8px', borderRadius: 6 }}>
                      {JSON.stringify(log.details).slice(0, 120)}
                      {JSON.stringify(log.details).length > 120 ? '…' : ''}
                    </pre>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-5">
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.82rem', color: 'var(--muted)' }}>
            Page {page} of {totalPages} · {total} entries
          </p>
          <div className="flex gap-2">
            <button disabled={page === 1} onClick={() => setPage(p => p - 1)}
              className="p-2 rounded-xl border border-[#E2E8F0] disabled:opacity-40 hover:bg-[#F8FAFC]">
              <ChevronLeft size={16} />
            </button>
            <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)}
              className="p-2 rounded-xl border border-[#E2E8F0] disabled:opacity-40 hover:bg-[#F8FAFC]">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
