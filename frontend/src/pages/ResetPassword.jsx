import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Scale, Lock, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import api from '../lib/api.js';

export default function ResetPassword() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const token = params.get('token');
  const [form, setForm] = useState({ newPassword: '', confirmPassword: '' });
  const [show, setShow] = useState({ new: false, confirm: false });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  if (!token) return (
    <div className="min-h-screen flex items-center justify-center">
      <p style={{ fontFamily: 'var(--font-body)', color: 'var(--muted)' }}>
        Invalid reset link. <Link to="/forgot-password" style={{ color: '#4C1D95' }}>Request a new one</Link>.
      </p>
    </div>
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.newPassword !== form.confirmPassword) { setError('Passwords do not match'); return; }
    if (form.newPassword.length < 8) { setError('Password must be at least 8 characters'); return; }
    setLoading(true);
    setError('');
    try {
      await api.post('/auth/reset-password', { token, newPassword: form.newPassword });
      setDone(true);
      setTimeout(() => navigate('/login'), 2500);
    } catch (err) {
      setError(err.response?.data?.message || 'Reset failed. The link may have expired.');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4"
      style={{ background: 'linear-gradient(135deg, #F4F3F9 0%, #E8E5F2 50%, #F4F3F9 100%)' }}>
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}
        className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-lg flex items-center justify-center mx-auto mb-4 border border-[#8B5CF6]/30"
            style={{ background: 'linear-gradient(135deg, #4C1D95, #7C3AED)' }}>
            <Scale size={24} className="text-[#8B5CF6]" />
          </div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.75rem', fontWeight: 700, color: 'var(--text)', letterSpacing: '-0.02em' }}>
            Reset Password
          </h1>
        </div>
        <div className="rounded-xl p-8" style={{ background: 'var(--surface)', boxShadow: '0 20px 60px rgba(76,29,149,0.15)', border: '1px solid rgba(139,92,246,0.2)' }}>
          {done ? (
            <div className="text-center py-4">
              <CheckCircle2 size={48} className="mx-auto mb-4" style={{ color: '#8B5CF6' }} />
              <p style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, color: 'var(--text)' }}>Password reset!</p>
              <p style={{ fontFamily: 'var(--font-body)', color: 'var(--muted)', fontSize: '0.88rem', marginTop: '0.4rem' }}>Redirecting to sign in…</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {[
                { key: 'newPassword', label: 'New Password', showKey: 'new' },
                { key: 'confirmPassword', label: 'Confirm Password', showKey: 'confirm' },
              ].map(({ key, label, showKey }) => (
                <div key={key}>
                  <label style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', fontWeight: 600, color: 'var(--muted)', display: 'block', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</label>
                  <div className="relative">
                    <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6B6B7B]" />
                    <input type={show[showKey] ? 'text' : 'password'} value={form[key]}
                      onChange={(e) => setForm({ ...form, [key]: e.target.value })} required
                      style={{ fontFamily: 'var(--font-body)', background: '#FCFBFE', border: '1px solid rgba(139,92,246,0.25)' }}
                      className="w-full pl-10 pr-10 py-3 rounded-lg text-sm focus:outline-none" />
                    <button type="button" onClick={() => setShow({ ...show, [showKey]: !show[showKey] })}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B6B7B]">
                      {show[showKey] ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>
              ))}
              {error && <p className="text-sm text-red-500" style={{ fontFamily: 'var(--font-body)' }}>{error}</p>}
              <motion.button type="submit" disabled={loading} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                className="w-full py-3 rounded-lg text-white font-semibold text-sm disabled:opacity-60"
                style={{ background: 'linear-gradient(135deg, #4C1D95, #7C3AED)', fontFamily: 'var(--font-body)', border: '1px solid rgba(139,92,246,0.3)' }}>
                {loading ? 'Resetting…' : 'Reset Password'}
              </motion.button>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}
