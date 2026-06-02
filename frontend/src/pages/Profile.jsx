import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Shield, Save, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth.js';
import api from '../lib/api.js';

export default function Profile() {
  const { user: authUser, setUser } = useAuth();
  const [form, setForm] = useState({ name: '', email: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/auth/me').then(({ data }) => {
      setForm({ name: data.name, email: data.email });
    }).finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const { data } = await api.put('/auth/me', form);
      if (setUser) setUser(data);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally { setSaving(false); }
  };

  const inputStyle = { fontFamily: 'var(--font-body)', background: '#FDFBF8', border: '1px solid rgba(201,168,76,0.25)' };

  return (
    <div className="max-w-2xl mx-auto px-6 lg:px-8 py-10">
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} className="mb-8">
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.75rem', fontWeight: 700, color: 'var(--text)', letterSpacing: '-0.02em' }}>
          My Profile
        </h1>
        <p style={{ fontFamily: 'var(--font-body)', color: 'var(--muted)', marginTop: '0.25rem', fontSize: '0.85rem', fontStyle: 'italic' }}>
          Update your display name and email address.
        </p>
      </motion.div>

      {loading ? (
        <div className="py-16 text-center text-[#6B6B7B]" style={{ fontFamily: 'var(--font-body)', fontStyle: 'italic' }}>Loading…</div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="rounded-xl p-6"
          style={{ background: 'var(--surface)', border: '1px solid rgba(201,168,76,0.15)', boxShadow: '0 2px 12px rgba(27,58,107,0.07)' }}>

          <div className="flex items-center gap-4 mb-6 pb-6" style={{ borderBottom: '1px solid rgba(201,168,76,0.12)' }}>
            <div className="w-16 h-16 rounded-lg flex items-center justify-center text-[#C9A84C] text-2xl font-bold flex-shrink-0 border border-[#C9A84C]/25"
              style={{ background: 'linear-gradient(135deg, #1B3A6B, #2E5FA3)' }}>
              {form.name?.charAt(0) || 'U'}
            </div>
            <div>
              <p style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.1rem', color: 'var(--text)' }}>{form.name}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <Shield size={13} style={{ color: '#C9A84C' }} />
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: '#C9A84C', textTransform: 'capitalize', fontStyle: 'italic' }}>
                  {authUser?.role || 'staff'}
                </span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="flex items-center gap-1.5 mb-1.5"
                style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                <User size={12} /> Full Name
              </label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required
                style={inputStyle} className="w-full px-4 py-2.5 rounded-lg text-sm focus:outline-none" />
            </div>
            <div>
              <label className="flex items-center gap-1.5 mb-1.5"
                style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                <Mail size={12} /> Email Address
              </label>
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required
                style={inputStyle} className="w-full px-4 py-2.5 rounded-lg text-sm focus:outline-none" />
            </div>

            {error && <p className="text-sm text-red-500" style={{ fontFamily: 'var(--font-body)' }}>{error}</p>}

            <div className="flex items-center gap-3 pt-2">
              <motion.button type="submit" disabled={saving} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-white text-sm font-semibold disabled:opacity-60"
                style={{ background: 'linear-gradient(135deg, #1B3A6B, #2E5FA3)', fontFamily: 'var(--font-body)', border: '1px solid rgba(201,168,76,0.2)' }}>
                <Save size={14} /> {saving ? 'Saving…' : 'Save Changes'}
              </motion.button>
              {saved && (
                <motion.span initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-1.5 text-sm" style={{ fontFamily: 'var(--font-body)', color: '#C9A84C' }}>
                  <CheckCircle2 size={14} /> Saved
                </motion.span>
              )}
            </div>
          </form>
        </motion.div>
      )}
    </div>
  );
}
