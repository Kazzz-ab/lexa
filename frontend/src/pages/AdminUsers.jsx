import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Plus, Pencil, Trash2, X } from 'lucide-react';
import api from '../lib/api.js';
import { useAuth } from '../hooks/useAuth.js';

const ROLES = ['admin', 'attorney', 'paralegal'];

const ROLE_COLORS = {
  admin: { bg: 'rgba(139,92,246,0.12)', color: '#8B5CF6' },
  attorney: { bg: 'rgba(76,29,149,0.1)', color: '#4C1D95' },
  paralegal: { bg: 'rgba(100,116,139,0.1)', color: '#64748B' },
};

function RoleBadge({ role }) {
  const s = ROLE_COLORS[role] || { bg: 'rgba(100,116,139,0.1)', color: '#64748B' };
  return (
    <span className="px-2.5 py-1 rounded-full text-xs font-semibold capitalize"
      style={{ background: s.bg, color: s.color, fontFamily: 'var(--font-body)' }}>
      {role}
    </span>
  );
}

function UserModal({ user, onClose, onSave }) {
  const isEdit = Boolean(user);
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '', password: '', role: user?.role || 'paralegal' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      if (isEdit) {
        await api.put(`/admin/users/${user.id}/role`, { role: form.role });
      } else {
        await api.post('/admin/users', form);
      }
      onSave();
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(13,27,42,0.5)', backdropFilter: 'blur(4px)' }}>
      <motion.div initial={{ opacity: 0, scale: 0.95, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-md rounded-2xl overflow-hidden"
        style={{ background: 'var(--surface)', boxShadow: '0 24px 64px rgba(0,0,0,0.18)' }}>
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#F1F5F9]">
          <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1rem', color: 'var(--text)' }}>
            {isEdit ? 'Change Role' : 'Add User'}
          </h2>
          <button onClick={onClose}><X size={18} className="text-[#94A3B8]" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {!isEdit && (
            <>
              <div>
                <label style={{ fontFamily: 'var(--font-body)', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text)', display: 'block', marginBottom: '0.35rem' }}>Name</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required
                  style={{ fontFamily: 'var(--font-body)' }}
                  className="w-full px-3 py-2.5 rounded-xl border border-[#E2E8F0] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]/20 focus:border-[#8B5CF6]" />
              </div>
              <div>
                <label style={{ fontFamily: 'var(--font-body)', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text)', display: 'block', marginBottom: '0.35rem' }}>Email</label>
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required
                  style={{ fontFamily: 'var(--font-body)' }}
                  className="w-full px-3 py-2.5 rounded-xl border border-[#E2E8F0] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]/20 focus:border-[#8B5CF6]" />
              </div>
              <div>
                <label style={{ fontFamily: 'var(--font-body)', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text)', display: 'block', marginBottom: '0.35rem' }}>Password</label>
                <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required minLength={8}
                  style={{ fontFamily: 'var(--font-body)' }}
                  className="w-full px-3 py-2.5 rounded-xl border border-[#E2E8F0] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]/20 focus:border-[#8B5CF6]" />
              </div>
            </>
          )}
          {isEdit && (
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.88rem', color: 'var(--muted)' }}>
              Changing role for <strong style={{ color: 'var(--text)' }}>{user.name}</strong> ({user.email})
            </p>
          )}
          <div>
            <label style={{ fontFamily: 'var(--font-body)', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text)', display: 'block', marginBottom: '0.35rem' }}>Role</label>
            <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}
              style={{ fontFamily: 'var(--font-body)' }}
              className="w-full px-3 py-2.5 rounded-xl border border-[#E2E8F0] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]/20">
              {ROLES.map(r => <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>)}
            </select>
          </div>
          {error && <p className="text-sm text-red-500" style={{ fontFamily: 'var(--font-body)' }}>{error}</p>}
          <div className="flex gap-3 justify-end pt-2">
            <button type="button" onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-[#E2E8F0] text-sm text-[#64748B]"
              style={{ fontFamily: 'var(--font-body)' }}>Cancel</button>
            <motion.button type="submit" disabled={saving} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              className="px-5 py-2.5 rounded-xl text-white text-sm font-semibold disabled:opacity-60"
              style={{ background: 'linear-gradient(135deg, #4C1D95, #8B5CF6)', fontFamily: 'var(--font-body)' }}>
              {saving ? 'Saving…' : isEdit ? 'Update Role' : 'Create User'}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export default function AdminUsers() {
  const { user: me } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/admin/users');
      setUsers(data);
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async (id) => {
    if (!confirm('Remove this user permanently?')) return;
    await api.delete(`/admin/users/${id}`);
    load();
  };

  return (
    <div className="max-w-5xl mx-auto px-6 lg:px-8 py-8">
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #4C1D95, #8B5CF6)' }}>
            <ShieldCheck size={18} className="text-white" />
          </div>
          <div>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.75rem', fontWeight: 800, color: 'var(--text)' }}>User Management</h1>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: 'var(--muted)', marginTop: '0.1rem' }}>
              {users.length} team members
            </p>
          </div>
        </div>
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          onClick={() => setModal('new')}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-semibold"
          style={{ background: 'linear-gradient(135deg, #4C1D95, #8B5CF6)', fontFamily: 'var(--font-body)', boxShadow: '0 4px 14px rgba(76,29,149,0.25)' }}>
          <Plus size={16} /> Add User
        </motion.button>
      </motion.div>

      <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--surface)', border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
        <div className="grid grid-cols-12 px-6 py-3 border-b border-[#F1F5F9] text-xs font-semibold text-[#94A3B8] uppercase tracking-wide"
          style={{ fontFamily: 'var(--font-body)' }}>
          <div className="col-span-5">User</div>
          <div className="col-span-3">Role</div>
          <div className="col-span-3">Joined</div>
          <div className="col-span-1" />
        </div>

        {loading ? (
          <div className="py-16 text-center text-[#94A3B8]" style={{ fontFamily: 'var(--font-body)', fontSize: '0.9rem' }}>Loading…</div>
        ) : (
          <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.04 } } }}>
            {users.map((u) => (
              <motion.div key={u.id}
                variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
                className="grid grid-cols-12 px-6 py-4 border-b border-[#F8FAFC] last:border-0 hover:bg-[#F8FAFC] transition-colors items-center">
                <div className="col-span-5 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg, #4C1D95, #8B5CF6)' }}>
                    {u.name.charAt(0)}
                  </div>
                  <div>
                    <p style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '0.88rem', color: 'var(--text)' }}>
                      {u.name} {u.id === me?.id && <span className="text-xs text-[#94A3B8]">(you)</span>}
                    </p>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: 'var(--muted)' }}>{u.email}</p>
                  </div>
                </div>
                <div className="col-span-3"><RoleBadge role={u.role} /></div>
                <div className="col-span-3" style={{ fontFamily: 'var(--font-body)', fontSize: '0.82rem', color: 'var(--muted)' }}>
                  {new Date(u.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                </div>
                <div className="col-span-1 flex justify-end gap-1">
                  {u.id !== me?.id && (
                    <>
                      <button onClick={() => setModal(u)} title="Change role"
                        className="p-1.5 rounded-lg hover:bg-[#F1F5F9] text-[#94A3B8] hover:text-[#4C1D95] transition-colors">
                        <Pencil size={14} />
                      </button>
                      <button onClick={() => handleDelete(u.id)} title="Remove user"
                        className="p-1.5 rounded-lg hover:bg-red-50 text-[#94A3B8] hover:text-red-500 transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {modal && (
          <UserModal
            user={modal === 'new' ? null : modal}
            onClose={() => setModal(null)}
            onSave={() => { setModal(null); load(); }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
