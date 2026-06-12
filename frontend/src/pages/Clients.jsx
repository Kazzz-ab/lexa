import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Search, Plus, Phone, Mail, Building2, MoreHorizontal, Pencil, Trash2, X, ChevronLeft, ChevronRight } from 'lucide-react';
import api from '../lib/api.js';

function RowMenu({ onEdit, onDelete }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button onClick={(e) => { e.stopPropagation(); setOpen(o => !o); }} className="p-1.5 rounded-lg hover:bg-[#F4F3F9] text-[#6B6B7B]">
        <MoreHorizontal size={15} />
      </button>
      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 4 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
              className="absolute right-0 z-20 mt-1 w-40 rounded-xl overflow-hidden"
              style={{ background: 'var(--surface)', boxShadow: '0 8px 24px rgba(76,29,149,0.12)', border: '1px solid rgba(139,92,246,0.15)' }}>
              <button onClick={() => { setOpen(false); onEdit(); }}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-left hover:bg-[#F4F3F9] transition-colors"
                style={{ fontFamily: 'var(--font-body)', color: 'var(--text)' }}>
                <Pencil size={13} /> Edit Client
              </button>
              <button onClick={() => { setOpen(false); onDelete(); }}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-left hover:bg-red-50 transition-colors text-red-500"
                style={{ fontFamily: 'var(--font-body)' }}>
                <Trash2 size={13} /> Remove
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function ClientModal({ client, onClose, onSave }) {
  const isEdit = Boolean(client?._id);
  const [form, setForm] = useState({
    firstName: client?.firstName || '',
    lastName: client?.lastName || '',
    email: client?.email || '',
    phone: client?.phone || '',
    company: client?.company || '',
    clientType: client?.clientType || 'individual',
    referredBy: client?.referredBy || '',
    notes: client?.notes || '',
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (isEdit) { await api.put(`/clients/${client._id}`, form); }
      else { await api.post('/clients', form); }
      onSave();
    } finally { setSaving(false); }
  };

  const field = (label, key, type = 'text', options = null) => (
    <div>
      <label style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', fontWeight: 600, color: 'var(--muted)', display: 'block', marginBottom: '0.35rem', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
        {label}
      </label>
      {options ? (
        <select value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })}
          style={{ fontFamily: 'var(--font-body)', background: '#FCFBFE', border: '1px solid rgba(139,92,246,0.25)' }}
          className="w-full px-3 py-2.5 rounded-lg text-sm focus:outline-none">
          {options.map(o => <option key={o.v || o} value={o.v || o}>{o.l || o}</option>)}
        </select>
      ) : (
        <input type={type} value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })}
          style={{ fontFamily: 'var(--font-body)', background: '#FCFBFE', border: '1px solid rgba(139,92,246,0.25)' }}
          className="w-full px-3 py-2.5 rounded-lg text-sm focus:outline-none" />
      )}
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(13,19,32,0.55)', backdropFilter: 'blur(4px)' }}>
      <motion.div initial={{ opacity: 0, scale: 0.95, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-lg rounded-xl overflow-hidden"
        style={{ background: 'var(--surface)', boxShadow: '0 24px 64px rgba(76,29,149,0.2)', border: '1px solid rgba(139,92,246,0.2)' }}>
        <div className="flex items-center justify-between px-6 py-5" style={{ borderBottom: '1px solid rgba(139,92,246,0.12)' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: '1rem', color: 'var(--text)' }}>
            {isEdit ? 'Edit Client' : 'Onboard New Client'}
          </h2>
          <button onClick={onClose} className="text-[#6B6B7B] hover:text-[#1A1A2E]"><X size={17} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 grid grid-cols-2 gap-4">
          {field('First Name', 'firstName')}
          {field('Last Name', 'lastName')}
          {field('Email', 'email', 'email')}
          {field('Phone', 'phone', 'tel')}
          {field('Company', 'company')}
          {field('Client Type', 'clientType', 'text', [{ v: 'individual', l: 'Individual' }, { v: 'corporate', l: 'Corporate' }])}
          {field('Referred By', 'referredBy')}
          <div className="col-span-2">
            <label style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', fontWeight: 600, color: 'var(--muted)', display: 'block', marginBottom: '0.35rem', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Notes</label>
            <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={3}
              style={{ fontFamily: 'var(--font-body)', background: '#FCFBFE', border: '1px solid rgba(139,92,246,0.25)' }}
              className="w-full px-3 py-2.5 rounded-lg text-sm focus:outline-none resize-none" />
          </div>
          <div className="col-span-2 flex gap-3 justify-end pt-2">
            <button type="button" onClick={onClose}
              className="px-5 py-2.5 rounded-lg text-sm font-medium text-[#6B6B7B]"
              style={{ fontFamily: 'var(--font-body)', border: '1px solid rgba(139,92,246,0.2)' }}>
              Cancel
            </button>
            <motion.button type="submit" disabled={saving}
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              className="px-5 py-2.5 rounded-lg text-white text-sm font-semibold disabled:opacity-60"
              style={{ background: 'linear-gradient(135deg, #4C1D95, #7C3AED)', fontFamily: 'var(--font-body)', border: '1px solid rgba(139,92,246,0.2)' }}>
              {saving ? 'Saving…' : isEdit ? 'Save Changes' : 'Onboard Client'}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

const itemVariant = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } };

export default function Clients() {
  const [clients, setClients] = useState([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);

  const handleDelete = async (id) => {
    await api.delete(`/clients/${id}`);
    load();
  };

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/clients', { params: { search, page, limit: 15 } });
      setClients(data.clients);
      setTotal(data.total);
    } finally { setLoading(false); }
  }, [search, page]);

  useEffect(() => { load(); }, [load]);

  const totalPages = Math.ceil(total / 15);

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.75rem', fontWeight: 700, color: 'var(--text)', letterSpacing: '-0.02em' }}>Clients</h1>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.83rem', color: 'var(--muted)', marginTop: '0.2rem' }}>
            {total} clients on record
          </p>
        </div>
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          onClick={() => setModal('new')}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-white text-sm font-semibold"
          style={{ background: 'linear-gradient(135deg, #4C1D95, #7C3AED)', fontFamily: 'var(--font-body)', border: '1px solid rgba(139,92,246,0.25)', boxShadow: '0 4px 14px rgba(76,29,149,0.2)' }}>
          <Plus size={15} /> Onboard Client
        </motion.button>
      </div>

      <div className="relative mb-6 max-w-sm">
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6B6B7B]" />
        <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          placeholder="Search clients…"
          style={{ fontFamily: 'var(--font-body)', background: '#FCFBFE', border: '1px solid rgba(139,92,246,0.2)' }}
          className="w-full pl-10 pr-4 py-2.5 rounded-lg text-sm focus:outline-none" />
      </div>

      <div className="rounded-xl overflow-hidden" style={{ background: 'var(--surface)', border: '1px solid rgba(139,92,246,0.15)', boxShadow: '0 2px 12px rgba(76,29,149,0.07)' }}>
        <div className="grid grid-cols-12 px-6 py-3 text-xs font-semibold text-[#6B6B7B] uppercase tracking-widest"
          style={{ fontFamily: 'var(--font-body)', borderBottom: '1px solid rgba(139,92,246,0.1)' }}>
          <div className="col-span-4">Client</div>
          <div className="col-span-2">Type</div>
          <div className="col-span-3">Company</div>
          <div className="col-span-2">Contact</div>
          <div className="col-span-1" />
        </div>

        {loading ? (
          <div className="py-16 text-center text-[#6B6B7B]" style={{ fontFamily: 'var(--font-body)' }}>Loading…</div>
        ) : clients.length === 0 ? (
          <div className="py-16 text-center">
            <Users size={32} className="mx-auto mb-3 text-[#8B5CF6]/30" />
            <p style={{ fontFamily: 'var(--font-body)', color: 'var(--muted)' }}>No clients found</p>
          </div>
        ) : (
          <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.04 } } }}>
            {clients.map((c) => (
              <motion.div key={c._id} variants={itemVariant}
                className="grid grid-cols-12 px-6 py-4 items-center hover:bg-[#F4F3F9] transition-colors cursor-pointer"
                style={{ borderBottom: '1px solid rgba(139,92,246,0.06)' }}>
                <div className="col-span-4 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-md flex items-center justify-center text-[#8B5CF6] text-sm font-bold border border-[#8B5CF6]/25 flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg, #4C1D95, #7C3AED)' }}>
                    {c.firstName.charAt(0)}
                  </div>
                  <div>
                    <p style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: '0.88rem', color: 'var(--text)' }}>
                      {c.firstName} {c.lastName}
                    </p>
                  </div>
                </div>
                <div className="col-span-2">
                  <span className="px-2.5 py-1 rounded-md text-xs"
                    style={{
                      fontFamily: 'var(--font-body)',
                      background: c.clientType === 'corporate' ? 'rgba(76,29,149,0.08)' : 'rgba(139,92,246,0.08)',
                      color: c.clientType === 'corporate' ? '#4C1D95' : '#5B21B6',
                      border: '1px solid',
                      borderColor: c.clientType === 'corporate' ? 'rgba(76,29,149,0.15)' : 'rgba(139,92,246,0.2)',
                    }}>
                    {c.clientType === 'corporate' ? 'Corporate' : 'Individual'}
                  </span>
                </div>
                <div className="col-span-3" style={{ fontFamily: 'var(--font-body)', fontSize: '0.83rem', color: 'var(--muted)' }}>
                  {c.company ? (
                    <div className="flex items-center gap-1.5"><Building2 size={12} /> {c.company}</div>
                  ) : '—'}
                </div>
                <div className="col-span-2 space-y-0.5">
                  {c.phone && <div className="flex items-center gap-1.5 text-xs text-[#6B6B7B]" style={{ fontFamily: 'var(--font-body)' }}><Phone size={10} /> {c.phone}</div>}
                  {c.email && <div className="flex items-center gap-1.5 text-xs text-[#6B6B7B]" style={{ fontFamily: 'var(--font-body)' }}><Mail size={10} /> {c.email}</div>}
                </div>
                <div className="col-span-1 flex justify-end">
                  <RowMenu onEdit={() => setModal(c)} onDelete={() => handleDelete(c._id)} />
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-5">
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: 'var(--muted)' }}>
            Page {page} of {totalPages}
          </p>
          <div className="flex gap-2">
            <button disabled={page === 1} onClick={() => setPage(p => p - 1)}
              className="p-2 rounded-lg disabled:opacity-40 hover:bg-[#F4F3F9]"
              style={{ border: '1px solid rgba(139,92,246,0.2)' }}>
              <ChevronLeft size={15} />
            </button>
            <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)}
              className="p-2 rounded-lg disabled:opacity-40 hover:bg-[#F4F3F9]"
              style={{ border: '1px solid rgba(139,92,246,0.2)' }}>
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      )}

      <AnimatePresence>
        {modal && (
          <ClientModal
            client={modal === 'new' ? null : modal}
            onClose={() => setModal(null)}
            onSave={() => { setModal(null); load(); }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
