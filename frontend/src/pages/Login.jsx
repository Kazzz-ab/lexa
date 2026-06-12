import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Landmark, Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../hooks/useAuth.js';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch {
      setError('Invalid credentials. Please verify and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--bg)' }}>

      {/* Left — Prestige panel */}
      <div className="hidden lg:flex flex-col justify-between w-[48%] relative overflow-hidden p-12"
        style={{ background: 'linear-gradient(160deg, #150A30 0%, #2E1065 50%, #4C1D95 100%)' }}>

        {/* Accent top line */}
        <div className="absolute top-0 left-0 right-0 h-1" style={{ background: 'linear-gradient(90deg, #8B5CF6, #C4B5FD, #8B5CF6)' }} />

        {/* Decorative orbs */}
        <motion.div animate={{ opacity: [0.06, 0.12, 0.06] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-20 right-10 w-64 h-64 rounded-full blur-3xl"
          style={{ background: 'radial-gradient(circle, #8B5CF6, transparent)' }} />

        {/* Logo */}
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-11 h-11 rounded-lg flex items-center justify-center border border-[#8B5CF6]/30"
            style={{ background: 'linear-gradient(135deg, #4C1D95, #7C3AED)' }}>
            <Landmark size={20} className="text-[#C4B5FD]" />
          </div>
          <div>
            <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.35rem', color: 'white', display: 'block', lineHeight: 1 }}>
              Lexa
            </span>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.58rem', color: 'rgba(139,92,246,0.7)', letterSpacing: '0.14em' }}>
              PRACTICE INTELLIGENCE
            </span>
          </div>
        </div>

        {/* Main pitch */}
        <div className="relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.7 }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.6rem', fontWeight: 700, color: 'white', lineHeight: 1.2, marginBottom: '1.2rem', letterSpacing: '-0.02em' }}>
              Every matter,<br />
              <span className="accent-shimmer">in focus.</span>
            </h2>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.95rem', color: 'rgba(255,255,255,0.55)', lineHeight: 1.75, maxWidth: '340px' }}>
              Intake, matters, attorney time, and billing — Lexa keeps your firm's caseload clear, current, and accounted for.
            </p>
          </motion.div>

          {/* Divider */}
          <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.6, duration: 0.8 }}
            className="my-8 h-px origin-left"
            style={{ background: 'linear-gradient(90deg, rgba(139,92,246,0.5), transparent)' }} />

          {/* Stats */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
            className="flex gap-10">
            {[['Minutes', 'To open a matter'], ['4', 'Billing models'], ['100%', 'Actions logged']].map(([v, l]) => (
              <div key={l}>
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', fontWeight: 700, color: '#8B5CF6' }}>{v}</div>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.73rem', color: 'rgba(255,255,255,0.4)', marginTop: '0.15rem' }}>{l}</div>
              </div>
            ))}
          </motion.div>
        </div>

        <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.72rem', color: 'rgba(255,255,255,0.22)' }} className="relative z-10">
          © {new Date().getFullYear()} Lexa. All rights reserved. For authorized firm personnel.
        </p>
      </div>

      {/* Right — Login form */}
      <div className="flex-1 flex items-center justify-center px-6 lg:px-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}
          className="w-full max-w-md">

          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-10 lg:hidden">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center border border-[#8B5CF6]/30"
              style={{ background: 'linear-gradient(135deg, #4C1D95, #7C3AED)' }}>
              <Landmark size={18} className="text-[#C4B5FD]" />
            </div>
            <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.2rem' }} className="gradient-text">
              Lexa
            </span>
          </div>

          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.75rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
            Access your firm
          </h1>
          <p style={{ fontFamily: 'var(--font-body)', color: 'var(--muted)', marginBottom: '2rem', fontSize: '0.88rem' }}>
            Authorised personnel only. All access is logged.
          </p>

          {error && (
            <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
              className="mb-5 px-4 py-3 rounded-lg text-sm"
              style={{ background: 'rgba(180,83,9,0.07)', color: '#B45309', border: '1px solid rgba(180,83,9,0.15)', fontFamily: 'var(--font-body)' }}>
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text)', display: 'block', marginBottom: '0.5rem', letterSpacing: '0.04em' }} className="uppercase text-xs tracking-widest">
                Email
              </label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6B6B7B]" />
                <input
                  type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                  placeholder="attorney@firm.com"
                  className="w-full pl-10 pr-4 py-3 rounded-lg text-[#1A1A2E] text-sm focus:outline-none transition-all placeholder:text-[#B4B0C4]"
                  onFocus={(e) => { e.target.style.border = '1px solid #8B5CF6'; e.target.style.boxShadow = '0 0 0 3px rgba(139,92,246,0.1)'; }}
                  onBlur={(e) => { e.target.style.border = '1px solid rgba(139,92,246,0.25)'; e.target.style.boxShadow = 'none'; }}
                  style={{ background: '#FCFBFE', border: '1px solid rgba(139,92,246,0.25)', fontFamily: 'var(--font-body)' }}
                />
              </div>
            </div>

            <div>
              <label style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text)', display: 'block', marginBottom: '0.5rem', letterSpacing: '0.04em' }} className="uppercase text-xs tracking-widest">
                Password
              </label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6B6B7B]" />
                <input
                  type={showPass ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} required
                  placeholder="••••••••"
                  className="w-full pl-10 pr-11 py-3 rounded-lg text-[#1A1A2E] text-sm focus:outline-none transition-all"
                  style={{ background: '#FCFBFE', border: '1px solid rgba(139,92,246,0.25)', fontFamily: 'var(--font-body)' }}
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#6B6B7B] hover:text-[#1A1A2E]">
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <motion.button
              type="submit" disabled={loading}
              whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-lg text-white font-semibold text-sm transition-all disabled:opacity-60 mt-2"
              style={{
                background: 'linear-gradient(135deg, #4C1D95, #7C3AED)',
                fontFamily: 'var(--font-body)',
                boxShadow: '0 4px 20px rgba(76,29,149,0.3), inset 0 1px 0 rgba(139,92,246,0.2)',
                border: '1px solid rgba(139,92,246,0.2)',
              }}
            >
              {loading ? 'Authenticating…' : (<>Access Firm Portal <ArrowRight size={15} /></>)}
            </motion.button>
            <div className="text-center mt-4">
              <Link to="/forgot-password" style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: '#4C1D95' }}
                className="hover:underline">
                Forgot your password?
              </Link>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
