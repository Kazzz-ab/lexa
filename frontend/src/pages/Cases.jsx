import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, Plus, X, ChevronLeft, ChevronRight, MoreHorizontal, Pencil, XCircle } from 'lucide-react';
import api from '../lib/api.js';

const STATUS_COLORS = {
  open: { bg: 'rgba(46,95,163,0.1)', color: '#2E5FA3', label: 'Open' },
  active: { bg: 'rgba(27,58,107,0.1)', color: '#1B3A6B', label: 'Active' },
  pending: { bg: 'rgba(180,83,9,0.1)', color: '#B45309', label: 'Pending' },
  closed: { bg: 'rgba(107,107,123,0.1)', color: '#6B6B7B', label: 'Closed' },
  'on-hold': { bg: 'rgba(201,168,76,0.1)', color: '#8B6914', label: 'On Hold' },
};

const PRIORITY_COLOR = { low: '#6B6B7B', medium: '#2E5FA3', high: '#B45309', urgent: '#DC2626' };

const selectStyle = { fontFamily: 'var(--font-body)', background: '#FDFBF8', border: '1px solid rgba(201,168,76,0.25)' };
const labelStyle = { fontFamily: 'var(--font-body)', fontSize: '0.75rem', fontWeight: 600, color: 'var(--muted)', display: 'block', marginBottom: '0.35rem', textTransform: 'uppercase', letterSpacing: '0.06em' };

function CaseModal({ caseData, onClose, onSave }) {
  const isEdit = Boolean(caseData?._id);
  const [form, setForm] = useState({
    title: caseData?.title || '',
    client: caseData?.client?._id || caseData?.client || '',
    leadAttorney: caseData?.leadAttorney?._id || caseData?.leadAttorney || '',
    practiceArea: caseData?.practiceArea || '',
    caseType: caseData?.caseType || 'other',
    status: caseData?.status || 'open',
    priority: caseData?.priority || 'medium',
    description: caseData?.description || '',
  });
  const [clients, setClients] = useState([]);
  const [attorneys, setAttorneys] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get('/clients', { params: { limit: 200 } }).then(r => setClients(r.data.clients));
    api.get('/attorneys').then(r => setAttorneys(r.data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (isEdit) {
        await api.put(`/cases/${caseData._id}`, form);
      } else {
        await api.post('/cases', form);
      }
      onSave();
    } finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(13,19,32,0.55)', backdropFilter: 'blur(4px)' }}>
      <motion.div initial={{ opacity: 0, scale: 0.95, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-lg rounded-xl overflow-hidden"
        style={{ background: 'var(--surface)', boxShadow: '0 24px 64px rgba(27,58,107,0.2)', border: '1px solid rgba(201,168,76,0.2)' }}>
        <div className="flex items-center justify-between px-6 py-5" style={{ borderBottom: '1px solid rgba(201,168,76,0.12)' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: '1rem', color: 'var(--text)' }}>
            {isEdit ? 'Edit Matter' : 'Open New Matter'}
          </h2>
          <button onClick={onClose}><X size={17} className="text-[#6B6B7B]" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label style={labelStyle}>Matter Title</label>
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required
              style={{ ...selectStyle, fontStyle: 'italic' }}
              className="w-full px-3 py-2.5 rounded-lg text-sm focus:outline-none" />
          </div>
          {[
            { label: 'Client', key: 'client', options: clients.map(c => ({ v: c._id, l: `${c.firstName} ${c.lastName}${c.company ? ` (${c.company})` : ''}` })) },
            { label: 'Lead Attorney', key: 'leadAttorney', options: attorneys.map(a => ({ v: a._id, l: `${a.user?.name || '—'}, Esq.` })) },
            { label: 'Case Type', key: 'caseType', options: ['litigation','corporate','family','criminal','real-estate','immigration','other'].map(v => ({ v, l: v.charAt(0).toUpperCase() + v.slice(1) })) },
          ].map(({ label, key, options }) => (
            <div key={key}>
              <label style={labelStyle}>{label}</label>
              <select value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} required
                style={selectStyle} className="w-full px-3 py-2.5 rounded-lg text-sm focus:outline-none">
                <option value="">Select…</option>
                {options.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
              </select>
            </div>
          ))}
          <div>
            <label style={labelStyle}>Practice Area</label>
            <input value={form.practiceArea} onChange={(e) => setForm({ ...form, practiceArea: e.target.value })} required
              style={selectStyle} className="w-full px-3 py-2.5 rounded-lg text-sm focus:outline-none" />
          </div>
          {isEdit && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label style={labelStyle}>Status</label>
                <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}
                  style={selectStyle} className="w-full px-3 py-2.5 rounded-lg text-sm focus:outline-none">
                  {Object.entries(STATUS_COLORS).map(([v, { label }]) => <option key={v} value={v}>{label}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Priority</label>
                <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}
                  style={selectStyle} className="w-full px-3 py-2.5 rounded-lg text-sm focus:outline-none">
                  {['low','medium','high','urgent'].map(v => <option key={v} value={v}>{v.charAt(0).toUpperCase() + v.slice(1)}</option>)}
                </select>
              </div>
            </div>
          )}
          <div className="flex gap-3 justify-end pt-2">
            <button type="button" onClick={onClose}
              className="px-5 py-2.5 rounded-lg text-sm text-[#6B6B7B]"
              style={{ fontFamily: 'var(--font-body)', border: '1px solid rgba(201,168,76,0.2)' }}>Cancel</button>
            <motion.button type="submit" disabled={saving} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              className="px-5 py-2.5 rounded-lg text-white text-sm font-semibold disabled:opacity-60"
              style={{ background: 'linear-gradient(135deg, #1B3A6B, #2E5FA3)', fontFamily: 'var(--font-body)', border: '1px solid rgba(201,168,76,0.2)' }}>
              {saving ? 'Saving…' : isEdit ? 'Save Changes' : 'Open Matter'}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

function RowMenu({ caseData, onEdit, onClose: onCloseCase }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button onClick={() => setOpen(o => !o)} className="p-1.5 rounded-lg text-[#6B6B7B] hover:bg-[#F5F2ED]">
        <MoreHorizontal size={15} />
      </button>
      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute right-0 z-20 mt-1 w-40 rounded-xl overflow-hidden"
              style={{ background: 'var(--surface)', boxShadow: '0 8px 24px rgba(27,58,107,0.12)', border: '1px solid rgba(201,168,76,0.15)' }}>
              <button onClick={() => { setOpen(false); onEdit(); }}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-left hover:bg-[#F5F2ED] transition-colors"
                style={{ fontFamily: 'var(--font-body)', color: 'var(--text)' }}>
                <Pencil size={13} /> Edit Matter
              </button>
              {caseData.status !== 'closed' && (
                <button onClick={() => { setOpen(false); onCloseCase(); }}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-left hover:bg-red-50 transition-colors text-red-500"
                  style={{ fontFamily: 'var(--font-body)' }}>
                  <XCircle size={13} /> Close Matter
                </button>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Cases() {
  const [cases, setCases] = useState([]);
  const [total, setTotal] = useState(0);
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // null | 'new' | case object

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/cases', { params: { status: statusFilter || undefined, page, limit: 15 } });
      setCases(data.cases);
      setTotal(data.total);
    } finally { setLoading(false); }
  }, [statusFilter, page]);

  useEffect(() => { load(); }, [load]);

  const handleClose = async (id) => {
    await api.put(`/cases/${id}`, { status: 'closed' });
    load();
  };

  const totalPages = Math.ceil(total / 15);

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.75rem', fontWeight: 700, color: 'var(--text)', letterSpacing: '-0.02em' }}>Cases & Matters</h1>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.83rem', color: 'var(--muted)', fontStyle: 'italic', marginTop: '0.2rem' }}>{total} matters on record</p>
        </div>
        <div className="flex items-center gap-3">
          <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            style={{ fontFamily: 'var(--font-body)', background: '#FDFBF8', border: '1px solid rgba(201,168,76,0.2)' }}
            className="px-3 py-2.5 rounded-lg text-sm focus:outline-none">
            <option value="">All statuses</option>
            {Object.entries(STATUS_COLORS).map(([v, { label }]) => <option key={v} value={v}>{label}</option>)}
          </select>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={() => setModal('new')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-white text-sm font-semibold"
            style={{ background: 'linear-gradient(135deg, #1B3A6B, #2E5FA3)', fontFamily: 'var(--font-body)', border: '1px solid rgba(201,168,76,0.25)', boxShadow: '0 4px 14px rgba(27,58,107,0.2)' }}>
            <Plus size={15} /> Open Matter
          </motion.button>
        </div>
      </div>

      <div className="rounded-xl overflow-hidden" style={{ background: 'var(--surface)', border: '1px solid rgba(201,168,76,0.15)', boxShadow: '0 2px 12px rgba(27,58,107,0.07)' }}>
        <div className="grid grid-cols-12 px-6 py-3 text-xs font-semibold text-[#6B6B7B] uppercase tracking-widest"
          style={{ fontFamily: 'var(--font-body)', borderBottom: '1px solid rgba(201,168,76,0.1)' }}>
          <div className="col-span-1">No.</div>
          <div className="col-span-4">Matter</div>
          <div className="col-span-2">Client</div>
          <div className="col-span-2">Attorney</div>
          <div className="col-span-1">Priority</div>
          <div className="col-span-1">Status</div>
          <div className="col-span-1" />
        </div>

        {loading ? (
          <div className="py-16 text-center text-[#6B6B7B]" style={{ fontFamily: 'var(--font-body)', fontStyle: 'italic' }}>Loading…</div>
        ) : cases.length === 0 ? (
          <div className="py-16 text-center">
            <Briefcase size={32} className="mx-auto mb-3 text-[#C9A84C]/30" />
            <p style={{ fontFamily: 'var(--font-body)', color: 'var(--muted)', fontStyle: 'italic' }}>No matters found</p>
          </div>
        ) : (
          <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.04 } } }}>
            {cases.map((c) => {
              const sc = STATUS_COLORS[c.status] || STATUS_COLORS.open;
              return (
                <motion.div key={c._id}
                  variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
                  className="grid grid-cols-12 px-6 py-4 items-center hover:bg-[#F5F2ED] transition-colors"
                  style={{ borderBottom: '1px solid rgba(201,168,76,0.06)' }}>
                  <div className="col-span-1" style={{ fontFamily: 'var(--font-body)', fontSize: '0.72rem', color: '#C9A84C', fontWeight: 600 }}>{c.caseNumber}</div>
                  <div className="col-span-4">
                    <p style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: '0.87rem', color: 'var(--text)' }}>{c.title}</p>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.73rem', color: 'var(--muted)', fontStyle: 'italic' }}>{c.practiceArea}</p>
                  </div>
                  <div className="col-span-2" style={{ fontFamily: 'var(--font-body)', fontSize: '0.82rem', color: 'var(--text)' }}>
                    {c.client?.firstName} {c.client?.lastName}
                  </div>
                  <div className="col-span-2" style={{ fontFamily: 'var(--font-body)', fontSize: '0.82rem', color: 'var(--muted)', fontStyle: 'italic' }}>
                    {c.leadAttorney?.user?.name || '—'}
                  </div>
                  <div className="col-span-1 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full" style={{ background: PRIORITY_COLOR[c.priority] || '#6B6B7B' }} />
                    <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.73rem', color: 'var(--muted)', textTransform: 'capitalize' }}>{c.priority}</span>
                  </div>
                  <div className="col-span-1">
                    <span className="px-2.5 py-1 rounded-md text-xs"
                      style={{ background: sc.bg, color: sc.color, fontFamily: 'var(--font-body)', border: `1px solid ${sc.color}20` }}>
                      {sc.label}
                    </span>
                  </div>
                  <div className="col-span-1 flex justify-end">
                    <RowMenu
                      caseData={c}
                      onEdit={() => setModal(c)}
                      onClose={() => handleClose(c._id)}
                    />
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

      <AnimatePresence>
        {modal && (
          <CaseModal
            caseData={modal === 'new' ? null : modal}
            onClose={() => setModal(null)}
            onSave={() => { setModal(null); load(); }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
