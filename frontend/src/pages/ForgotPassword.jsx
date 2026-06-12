import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Scale, Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import api from '../lib/api.js';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.post('/auth/forgot-password', { email });
      setSent(true);
    } catch {
      setError('Something went wrong. Please try again.');
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
            Forgot Password
          </h1>
          <p style={{ fontFamily: 'var(--font-body)', color: 'var(--muted)', marginTop: '0.4rem', fontSize: '0.88rem' }}>
            Enter your email and we'll send a reset link
          </p>
        </div>
        <div className="rounded-xl p-8" style={{ background: 'var(--surface)', boxShadow: '0 20px 60px rgba(76,29,149,0.15)', border: '1px solid rgba(139,92,246,0.2)' }}>
          {sent ? (
            <div className="text-center py-4">
              <CheckCircle2 size={48} className="mx-auto mb-4" style={{ color: '#8B5CF6' }} />
              <p style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.1rem', color: 'var(--text)' }}>Check your inbox</p>
              <p style={{ fontFamily: 'var(--font-body)', color: 'var(--muted)', marginTop: '0.5rem', fontSize: '0.88rem' }}>
                If <strong>{email}</strong> is registered, a reset link has been sent.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', fontWeight: 600, color: 'var(--muted)', display: 'block', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Email Address
                </label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6B6B7B]" />
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                    placeholder="counsel@firm.com"
                    style={{ fontFamily: 'var(--font-body)', background: '#FCFBFE', border: '1px solid rgba(139,92,246,0.25)' }}
                    className="w-full pl-10 pr-4 py-3 rounded-lg text-sm focus:outline-none" />
                </div>
              </div>
              {error && <p className="text-sm text-red-500" style={{ fontFamily: 'var(--font-body)' }}>{error}</p>}
              <motion.button type="submit" disabled={loading} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                className="w-full py-3 rounded-lg text-white font-semibold text-sm disabled:opacity-60"
                style={{ background: 'linear-gradient(135deg, #4C1D95, #7C3AED)', fontFamily: 'var(--font-body)', border: '1px solid rgba(139,92,246,0.3)' }}>
                {loading ? 'Sending…' : 'Send Reset Link'}
              </motion.button>
            </form>
          )}
          <div className="mt-6 text-center">
            <Link to="/login" className="flex items-center justify-center gap-1.5 text-sm hover:underline"
              style={{ fontFamily: 'var(--font-body)', color: '#4C1D95' }}>
              <ArrowLeft size={13} /> Back to sign in
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
