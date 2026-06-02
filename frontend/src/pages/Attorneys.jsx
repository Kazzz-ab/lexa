import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Scale, Plus, X, MoreHorizontal, Pencil, Trash2, DollarSign } from 'lucide-react';
import api from '../lib/api.js';

function CardMenu({ onEdit, onDelete }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button onClick={() => setOpen(o => !o)} className="p-1.5 rounded-md hover:bg-[#F5F2ED] text-[#6B6B7B]">
        <MoreHorizontal size={15} />
      </button>
      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 4 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
              className="absolute right-0 z-20 mt-1 w-40 rounded-xl overflow-hidden"
              style={{ background: 'var(--surface)', boxShadow: '0 8px 24px rgba(27,58,107,0.12)', border: '1px solid rgba(201,168,76,0.15)' }}>
              <button onClick={() => { setOpen(false); onEdit(); }}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-left hover:bg-[#F5F2ED] transition-colors"
                style={{ fontFamily: 'var(--font-body)', color: 'var(--text)' }}>
                <Pencil size={13} /> Edit
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

function AttorneyModal({ attorney, onClose, onSave }) {
  const isEdit = Boolean(attorney?._id);
  const [form, setForm] = useState({
    barNumber: attorney?.barNumber || '',
    practiceAreas: attorney?.practiceAreas?.join(', ') || '',
    hourlyRate: attorney?.hourlyRate || '',
    bio: attorney?.bio || '',
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form, practiceAreas: form.practiceAreas.split(',').map(s => s.trim()).filter(Boolean) };
      if (isEdit) { await api.put(`/attorneys/${attorney._id}`, payload); }
      else { await api.post('/attorneys', payload); }
      onSave();
    } finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(13,19,32,0.55)', backdropFilter: 'blur(4px)' }}>
      <motion.div initial={{ opacity: 0, scale: 0.95, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-md rounded-xl overflow-hidden"
        style={{ background: 'var(--surface)', boxShadow: '0 24px 64px rgba(27,58,107,0.2)', border: '1px solid rgba(201,168,76,0.2)' }}>
        <div className="flex items-center justify-between px-6 py-5" style={{ borderBottom: '1px solid rgba(201,168,76,0.12)' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: '1rem', color: 'var(--text)' }}>
            {isEdit ? 'Edit Attorney' : 'Add Attorney'}
          </h2>
          <button onClick={onClose}><X size={17} className="text-[#6B6B7B]" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {[
            { label: 'Bar Number', key: 'barNumber' },
            { label: 'Practice Areas (comma separated)', key: 'practiceAreas' },
            { label: 'Hourly Rate ($)', key: 'hourlyRate', type: 'number' },
          ].map(({ label, key, type = 'text' }) => (
            <div key={key}>
              <label style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', fontWeight: 600, color: 'var(--muted)', display: 'block', marginBottom: '0.35rem', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{label}</label>
              <input type={type} value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                style={{ fontFamily: 'var(--font-body)', background: '#FDFBF8', border: '1px solid rgba(201,168,76,0.25)' }}
                className="w-full px-3 py-2.5 rounded-lg text-sm focus:outline-none" />
            </div>
          ))}
          <div>
            <label style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', fontWeight: 600, color: 'var(--muted)', display: 'block', marginBottom: '0.35rem', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Biography</label>
            <textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} rows={3}
              style={{ fontFamily: 'var(--font-body)', background: '#FDFBF8', border: '1px solid rgba(201,168,76,0.25)', fontStyle: 'italic' }}
              className="w-full px-3 py-2.5 rounded-lg text-sm focus:outline-none resize-none" />
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <button type="button" onClick={onClose}
              className="px-5 py-2.5 rounded-lg text-sm text-[#6B6B7B]"
              style={{ fontFamily: 'var(--font-body)', border: '1px solid rgba(201,168,76,0.2)' }}>Cancel</button>
            <motion.button type="submit" disabled={saving} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              className="px-5 py-2.5 rounded-lg text-white text-sm font-semibold disabled:opacity-60"
              style={{ background: 'linear-gradient(135deg, #1B3A6B, #2E5FA3)', fontFamily: 'var(--font-body)', border: '1px solid rgba(201,168,76,0.2)' }}>
              {saving ? 'Saving…' : isEdit ? 'Save' : 'Add Attorney'}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export default function Attorneys() {
  const [attorneys, setAttorneys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);

  const handleDelete = async (id) => {
    await api.delete(`/attorneys/${id}`);
    load();
  };

  const load = useCallback(async () => {
    setLoading(true);
    try { const { data } = await api.get('/attorneys'); setAttorneys(data); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.75rem', fontWeight: 700, color: 'var(--text)', letterSpacing: '-0.02em' }}>Attorneys</h1>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.83rem', color: 'var(--muted)', fontStyle: 'italic', marginTop: '0.2rem' }}>{attorneys.length} counsel on record</p>
        </div>
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          onClick={() => setModal('new')}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-white text-sm font-semibold"
          style={{ background: 'linear-gradient(135deg, #1B3A6B, #2E5FA3)', fontFamily: 'var(--font-body)', border: '1px solid rgba(201,168,76,0.25)', boxShadow: '0 4px 14px rgba(27,58,107,0.2)' }}>
          <Plus size={15} /> Add Attorney
        </motion.button>
      </div>

      {loading ? (
        <div className="py-16 text-center text-[#6B6B7B]" style={{ fontFamily: 'var(--font-body)', fontStyle: 'italic' }}>Loading…</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {attorneys.map((att, i) => (
            <motion.div key={att._id}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
              className="card-3d rounded-xl p-5 cursor-default"
              style={{ background: 'var(--surface)', border: '1px solid rgba(201,168,76,0.15)', boxShadow: '0 2px 12px rgba(27,58,107,0.07)' }}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center text-[#C9A84C] font-bold text-lg border border-[#C9A84C]/25"
                    style={{ background: 'linear-gradient(135deg, #1B3A6B, #2E5FA3)' }}>
                    {att.user?.name?.charAt(0) || 'A'}
                  </div>
                  <div>
                    <p style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, color: 'var(--text)', fontSize: '0.92rem' }}>
                      {att.user?.name || '—'}, Esq.
                    </p>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: '#C9A84C', fontStyle: 'italic' }}>
                      {att.practiceAreas?.[0] || '—'}
                    </p>
                  </div>
                </div>
                <CardMenu onEdit={() => setModal(att)} onDelete={() => handleDelete(att._id)} />
              </div>
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between">
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: 'var(--muted)' }}>Bar No.</span>
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.77rem', fontWeight: 600, color: 'var(--text)' }}>{att.barNumber}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: 'var(--muted)' }}>Hourly Rate</span>
                  <div className="flex items-center gap-1">
                    <DollarSign size={12} className="text-[#C9A84C]" />
                    <span style={{ fontFamily: 'var(--font-heading)', fontSize: '0.88rem', fontWeight: 700, color: '#C9A84C' }}>{att.hourlyRate}/hr</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {(att.practiceAreas || []).slice(0, 3).map(area => (
                  <span key={area} className="px-2 py-0.5 rounded-md text-xs"
                    style={{ fontFamily: 'var(--font-body)', background: 'rgba(27,58,107,0.07)', color: '#1B3A6B', border: '1px solid rgba(27,58,107,0.12)' }}>
                    {area}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {modal && (
          <AttorneyModal attorney={modal === 'new' ? null : modal} onClose={() => setModal(null)} onSave={() => { setModal(null); load(); }} />
        )}
      </AnimatePresence>
    </div>
  );
}
