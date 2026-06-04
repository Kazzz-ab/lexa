import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, ChevronLeft, ChevronRight, DollarSign, Plus, X, Trash2, ChevronDown, Download, CheckSquare, Square, SquareCheck } from 'lucide-react';
import { exportInvoicePDF } from '../lib/exportPDF.js';
import { format } from 'date-fns';
import api from '../lib/api.js';

const STATUS = {
  draft: { bg: 'rgba(107,107,123,0.08)', color: '#6B6B7B', label: 'Draft' },
  sent: { bg: 'rgba(46,95,163,0.1)', color: '#2E5FA3', label: 'Sent' },
  paid: { bg: 'rgba(27,58,107,0.1)', color: '#1B3A6B', label: 'Paid' },
  overdue: { bg: 'rgba(180,83,9,0.1)', color: '#B45309', label: 'Overdue' },
  cancelled: { bg: 'rgba(107,107,123,0.06)', color: '#9CA3AF', label: 'Cancelled' },
};

const selectStyle = { fontFamily: 'var(--font-body)', background: '#FDFBF8', border: '1px solid rgba(201,168,76,0.25)' };
const labelStyle = { fontFamily: 'var(--font-body)', fontSize: '0.75rem', fontWeight: 600, color: 'var(--muted)', display: 'block', marginBottom: '0.35rem', textTransform: 'uppercase', letterSpacing: '0.06em' };

function InvoiceModal({ onClose, onSave }) {
  const [clients, setClients] = useState([]);
  const [cases, setCases] = useState([]);
  const [attorneys, setAttorneys] = useState([]);
  const [form, setForm] = useState({
    client: '',
    case: '',
    attorney: '',
    billingType: 'hourly',
    status: 'draft',
    dueDate: format(new Date(Date.now() + 30 * 86400000), 'yyyy-MM-dd'),
    notes: '',
  });
  const [lineItems, setLineItems] = useState([{ description: '', hours: '', rate: '', amount: '' }]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all([
      api.get('/clients', { params: { limit: 200 } }),
      api.get('/cases', { params: { limit: 200 } }),
      api.get('/attorneys'),
    ]).then(([c, cs, a]) => {
      setClients(c.data.clients);
      setCases(cs.data.cases);
      setAttorneys(a.data);
    });
  }, []);

  const updateLine = (i, key, val) => {
    const items = [...lineItems];
    const updated = { ...items[i], [key]: val };
    if (form.billingType === 'hourly' && (key === 'hours' || key === 'rate')) {
      updated.amount = ((Number(updated.hours) || 0) * (Number(updated.rate) || 0)).toFixed(2);
    }
    items[i] = updated;
    setLineItems(items);
  };

  const subtotal = lineItems.reduce((s, l) => s + (Number(l.amount) || 0), 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        case: form.case || undefined,
        attorney: form.attorney || undefined,
        lineItems: lineItems.filter(l => l.description && l.amount),
        subtotal,
        total: subtotal,
      };
      await api.post('/invoices', payload);
      onSave();
    } finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(13,19,32,0.55)', backdropFilter: 'blur(4px)' }}>
      <motion.div initial={{ opacity: 0, scale: 0.95, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-xl rounded-xl overflow-hidden"
        style={{ background: 'var(--surface)', boxShadow: '0 24px 64px rgba(27,58,107,0.2)', border: '1px solid rgba(201,168,76,0.2)' }}>
        <div className="flex items-center justify-between px-6 py-5" style={{ borderBottom: '1px solid rgba(201,168,76,0.12)' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: '1rem', color: 'var(--text)' }}>New Invoice</h2>
          <button onClick={onClose}><X size={17} className="text-[#6B6B7B]" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label style={labelStyle}>Client *</label>
              <select value={form.client} onChange={(e) => setForm({ ...form, client: e.target.value })} required style={selectStyle}
                className="w-full px-3 py-2.5 rounded-lg text-sm focus:outline-none">
                <option value="">Select…</option>
                {clients.map(c => <option key={c._id} value={c._id}>{c.firstName} {c.lastName}{c.company ? ` (${c.company})` : ''}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Matter (optional)</label>
              <select value={form.case} onChange={(e) => setForm({ ...form, case: e.target.value })} style={selectStyle}
                className="w-full px-3 py-2.5 rounded-lg text-sm focus:outline-none">
                <option value="">None</option>
                {cases.map(c => <option key={c._id} value={c._id}>{c.caseNumber} — {c.title.substring(0, 30)}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label style={labelStyle}>Attorney (optional)</label>
              <select value={form.attorney} onChange={(e) => setForm({ ...form, attorney: e.target.value })} style={selectStyle}
                className="w-full px-3 py-2.5 rounded-lg text-sm focus:outline-none">
                <option value="">None</option>
                {attorneys.map(a => <option key={a._id} value={a._id}>{a.user?.name}, Esq.</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Billing Type</label>
              <select value={form.billingType} onChange={(e) => setForm({ ...form, billingType: e.target.value })} style={selectStyle}
                className="w-full px-3 py-2.5 rounded-lg text-sm focus:outline-none">
                {['hourly','flat-fee','retainer','contingency'].map(v => <option key={v} value={v}>{v.charAt(0).toUpperCase() + v.slice(1)}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label style={labelStyle}>Status</label>
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} style={selectStyle}
                className="w-full px-3 py-2.5 rounded-lg text-sm focus:outline-none">
                {Object.entries(STATUS).map(([v, { label }]) => <option key={v} value={v}>{label}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Due Date</label>
              <input type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                style={selectStyle} className="w-full px-3 py-2.5 rounded-lg text-sm focus:outline-none" />
            </div>
          </div>

          {/* Line items */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label style={labelStyle}>Line Items</label>
              <button type="button"
                onClick={() => setLineItems([...lineItems, { description: '', hours: '', rate: '', amount: '' }])}
                className="text-xs hover:underline" style={{ fontFamily: 'var(--font-body)', color: '#C9A84C' }}>+ Add line</button>
            </div>
            <div className="grid grid-cols-12 gap-2 text-xs font-semibold text-[#6B6B7B] uppercase px-1 mb-1" style={{ fontFamily: 'var(--font-body)' }}>
              <div className="col-span-5">Description</div>
              {form.billingType === 'hourly' ? (
                <><div className="col-span-2">Hrs</div><div className="col-span-2">Rate</div></>
              ) : <div className="col-span-4">—</div>}
              <div className="col-span-2">Amount</div>
              <div className="col-span-1" />
            </div>
            <div className="space-y-2">
              {lineItems.map((line, i) => (
                <div key={i} className="grid grid-cols-12 gap-2 items-center">
                  <input value={line.description} onChange={(e) => updateLine(i, 'description', e.target.value)}
                    placeholder="Service description…" style={{ ...selectStyle, fontStyle: 'italic' }}
                    className="col-span-5 px-3 py-2 rounded-lg text-sm focus:outline-none" />
                  {form.billingType === 'hourly' ? (
                    <>
                      <input type="number" min="0" step="0.5" value={line.hours} onChange={(e) => updateLine(i, 'hours', e.target.value)}
                        placeholder="0" style={selectStyle} className="col-span-2 px-3 py-2 rounded-lg text-sm focus:outline-none" />
                      <input type="number" min="0" step="0.01" value={line.rate} onChange={(e) => updateLine(i, 'rate', e.target.value)}
                        placeholder="0.00" style={selectStyle} className="col-span-2 px-3 py-2 rounded-lg text-sm focus:outline-none" />
                    </>
                  ) : <div className="col-span-4" />}
                  <input type="number" min="0" step="0.01" value={line.amount} onChange={(e) => updateLine(i, 'amount', e.target.value)}
                    placeholder="0.00" style={selectStyle} className="col-span-2 px-3 py-2 rounded-lg text-sm focus:outline-none" />
                  <button type="button" onClick={() => setLineItems(lineItems.filter((_, j) => j !== i))}
                    className="col-span-1 flex justify-center text-[#6B6B7B] hover:text-red-500">
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex justify-end mt-3 pt-3" style={{ borderTop: '1px solid rgba(201,168,76,0.1)' }}>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.82rem', color: 'var(--muted)', fontStyle: 'italic' }}>Total: </span>
              <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, color: 'var(--text)', marginLeft: '0.5rem' }}>${subtotal.toFixed(2)}</span>
            </div>
          </div>

          <div>
            <label style={labelStyle}>Notes</label>
            <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={2}
              style={{ ...selectStyle, fontStyle: 'italic' }} className="w-full px-3 py-2.5 rounded-lg text-sm focus:outline-none resize-none" />
          </div>

          <div className="flex gap-3 justify-end pt-2">
            <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-lg text-sm text-[#6B6B7B]"
              style={{ fontFamily: 'var(--font-body)', border: '1px solid rgba(201,168,76,0.2)' }}>Cancel</button>
            <motion.button type="submit" disabled={saving} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              className="px-5 py-2.5 rounded-lg text-white text-sm font-semibold disabled:opacity-60"
              style={{ background: 'linear-gradient(135deg, #1B3A6B, #2E5FA3)', fontFamily: 'var(--font-body)', border: '1px solid rgba(201,168,76,0.2)' }}>
              {saving ? 'Creating…' : 'Create Invoice'}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

function StatusDropdown({ invoiceId, current, onUpdate }) {
  const [open, setOpen] = useState(false);
  const [updating, setUpdating] = useState(false);
  const sc = STATUS[current] || STATUS.draft;

  const handleChange = async (newStatus) => {
    setOpen(false);
    setUpdating(true);
    try {
      await api.put(`/invoices/${invoiceId}`, { status: newStatus });
      onUpdate();
    } finally { setUpdating(false); }
  };

  return (
    <div className="relative inline-block">
      <button onClick={() => setOpen(o => !o)} disabled={updating}
        className="flex items-center gap-1 px-2.5 py-1 rounded-md text-xs disabled:opacity-60 transition-opacity"
        style={{ background: sc.bg, color: sc.color, fontFamily: 'var(--font-body)', border: `1px solid ${sc.color}25` }}>
        {sc.label}
        <ChevronDown size={10} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 4 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
              className="absolute left-0 z-20 mt-1 w-32 rounded-xl overflow-hidden"
              style={{ background: 'var(--surface)', boxShadow: '0 8px 24px rgba(27,58,107,0.12)', border: '1px solid rgba(201,168,76,0.15)' }}>
              {Object.entries(STATUS).map(([v, { label, color }]) => (
                <button key={v} onClick={() => handleChange(v)}
                  className="w-full text-left px-3 py-2 text-xs hover:bg-[#F5F2ED] transition-colors"
                  style={{ fontFamily: 'var(--font-body)', color: v === current ? color : 'var(--text)', fontWeight: v === current ? 600 : 400 }}>
                  {label}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Invoices() {
  const [invoices, setInvoices] = useState([]);
  const [total, setTotal] = useState(0);
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [selected, setSelected] = useState(new Set());
  const [bulkStatus, setBulkStatus] = useState('');
  const [bulking, setBulking] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setSelected(new Set());
    try {
      const { data } = await api.get('/invoices', { params: { status: statusFilter || undefined, page, limit: 15 } });
      setInvoices(data.invoices);
      setTotal(data.total);
    } finally { setLoading(false); }
  }, [statusFilter, page]);

  useEffect(() => { load(); }, [load]);

  const toggleSelect = (id) => {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (selected.size === invoices.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(invoices.map(i => i._id)));
    }
  };

  const handleBulkUpdate = async () => {
    if (!bulkStatus || selected.size === 0) return;
    setBulking(true);
    try {
      await api.patch('/invoices/bulk-status', { ids: Array.from(selected), status: bulkStatus });
      setSelected(new Set());
      setBulkStatus('');
      load();
    } finally { setBulking(false); }
  };

  const totalPages = Math.ceil(total / 15);
  const pageTotal = invoices.reduce((s, inv) => s + (inv.total || 0), 0);
  const allSelected = invoices.length > 0 && selected.size === invoices.length;
  const someSelected = selected.size > 0 && !allSelected;

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.75rem', fontWeight: 700, color: 'var(--text)', letterSpacing: '-0.02em' }}>Billing</h1>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.83rem', color: 'var(--muted)', fontStyle: 'italic', marginTop: '0.2rem' }}>
            {total} invoices · Page total: ${pageTotal.toLocaleString()}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            style={{ fontFamily: 'var(--font-body)', background: '#FDFBF8', border: '1px solid rgba(201,168,76,0.2)' }}
            className="px-3 py-2.5 rounded-lg text-sm focus:outline-none">
            <option value="">All statuses</option>
            {Object.entries(STATUS).map(([v, { label }]) => <option key={v} value={v}>{label}</option>)}
          </select>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={() => setModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-white text-sm font-semibold"
            style={{ background: 'linear-gradient(135deg, #1B3A6B, #2E5FA3)', fontFamily: 'var(--font-body)', border: '1px solid rgba(201,168,76,0.25)', boxShadow: '0 4px 14px rgba(27,58,107,0.2)' }}>
            <Plus size={15} /> New Invoice
          </motion.button>
        </div>
      </div>

      {/* Bulk action bar */}
      <AnimatePresence>
        {selected.size > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            className="flex items-center gap-3 mb-4 px-4 py-3 rounded-xl"
            style={{ background: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.22)' }}>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', fontWeight: 600, color: '#C9A84C' }}>
              {selected.size} selected
            </span>
            <span style={{ color: 'rgba(201,168,76,0.35)' }}>|</span>
            <select value={bulkStatus} onChange={(e) => setBulkStatus(e.target.value)}
              style={{ fontFamily: 'var(--font-body)', background: '#FDFBF8', border: '1px solid rgba(201,168,76,0.2)' }}
              className="px-3 py-1.5 rounded-lg text-sm focus:outline-none">
              <option value="">Set status…</option>
              {Object.entries(STATUS).map(([v, { label }]) => <option key={v} value={v}>{label}</option>)}
            </select>
            <motion.button
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              onClick={handleBulkUpdate}
              disabled={!bulkStatus || bulking}
              className="px-4 py-1.5 rounded-lg text-white text-sm font-semibold disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg, #1B3A6B, #C9A84C)', fontFamily: 'var(--font-body)' }}>
              {bulking ? 'Updating…' : 'Apply'}
            </motion.button>
            <button onClick={() => setSelected(new Set())} className="ml-auto text-[#6B6B7B] hover:text-[#1B3A6B]">
              <X size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="rounded-xl overflow-hidden" style={{ background: 'var(--surface)', border: '1px solid rgba(201,168,76,0.15)', boxShadow: '0 2px 12px rgba(27,58,107,0.07)' }}>
        <div className="grid grid-cols-12 px-6 py-3 text-xs font-semibold text-[#6B6B7B] uppercase tracking-widest"
          style={{ fontFamily: 'var(--font-body)', borderBottom: '1px solid rgba(201,168,76,0.1)' }}>
          <div className="col-span-1 flex items-center">
            <button onClick={toggleAll} className="text-[#6B6B7B] hover:text-[#C9A84C] transition-colors">
              {allSelected ? <CheckSquare size={14} style={{ color: '#C9A84C' }} /> : someSelected ? <SquareCheck size={14} style={{ color: '#C9A84C' }} /> : <Square size={14} />}
            </button>
          </div>
          <div className="col-span-2">Invoice</div>
          <div className="col-span-2">Client</div>
          <div className="col-span-2">Matter</div>
          <div className="col-span-2">Due Date</div>
          <div className="col-span-1">Amount</div>
          <div className="col-span-1">Status</div>
          <div className="col-span-1" />
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
            {invoices.map((inv) => (
              <motion.div key={inv._id}
                variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
                className={`grid grid-cols-12 px-6 py-4 items-center transition-colors ${selected.has(inv._id) ? 'bg-[#F5F0E8]' : 'hover:bg-[#F5F2ED]'}`}
                style={{ borderBottom: '1px solid rgba(201,168,76,0.06)' }}>
                <div className="col-span-1">
                  <button onClick={() => toggleSelect(inv._id)} className="text-[#6B6B7B] hover:text-[#C9A84C] transition-colors">
                    {selected.has(inv._id) ? <CheckSquare size={14} style={{ color: '#C9A84C' }} /> : <Square size={14} />}
                  </button>
                </div>
                <div className="col-span-2" style={{ fontFamily: 'var(--font-body)', fontSize: '0.78rem', fontWeight: 600, color: '#C9A84C' }}>{inv.invoiceNumber}</div>
                <div className="col-span-2">
                  <p style={{ fontFamily: 'var(--font-heading)', fontSize: '0.85rem', color: 'var(--text)' }}>
                    {inv.client?.firstName} {inv.client?.lastName}
                  </p>
                  {inv.client?.company && (
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.73rem', color: 'var(--muted)', fontStyle: 'italic' }}>{inv.client.company}</p>
                  )}
                </div>
                <div className="col-span-2" style={{ fontFamily: 'var(--font-body)', fontSize: '0.78rem', color: 'var(--muted)', fontStyle: 'italic' }}>
                  {inv.case?.title ? inv.case.title.substring(0, 20) + (inv.case.title.length > 20 ? '…' : '') : '—'}
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
                <div className="col-span-1">
                  <StatusDropdown invoiceId={inv._id} current={inv.status} onUpdate={load} />
                </div>
                <div className="col-span-1 flex justify-end">
                  <button onClick={() => exportInvoicePDF(inv)} title="Download PDF"
                    className="p-1.5 rounded-md hover:bg-[#F5F2ED] text-[#6B6B7B] hover:text-[#1B3A6B] transition-colors">
                    <Download size={13} />
                  </button>
                </div>
              </motion.div>
            ))}
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
        {modal && <InvoiceModal onClose={() => setModal(false)} onSave={() => { setModal(false); load(); }} />}
      </AnimatePresence>
    </div>
  );
}
