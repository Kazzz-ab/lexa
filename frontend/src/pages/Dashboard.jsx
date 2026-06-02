import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Scale, Briefcase, DollarSign, TrendingUp, Clock, CheckCircle2, AlertTriangle } from 'lucide-react';
import api from '../lib/api.js';
import { useAuth } from '../hooks/useAuth.js';

const container = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };
const item = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 90, damping: 18 } } };

const statusConfig = {
  active: { label: 'Active', color: '#1B3A6B', bg: 'rgba(27,58,107,0.1)' },
  open: { label: 'Open', color: '#2E5FA3', bg: 'rgba(46,95,163,0.1)' },
  pending: { label: 'Pending', color: '#B45309', bg: 'rgba(180,83,9,0.1)' },
  closed: { label: 'Closed', color: '#6B6B7B', bg: 'rgba(107,107,123,0.1)' },
  'on-hold': { label: 'On Hold', color: '#8B6914', bg: 'rgba(201,168,76,0.1)' },
};
const priorityDot = { low: '#6B6B7B', medium: '#2E5FA3', high: '#B45309', urgent: '#DC2626' };

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentCases, setRecentCases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/stats'),
      api.get('/cases', { params: { limit: 5, page: 1 } }),
    ]).then(([s, c]) => {
      setStats(s.data);
      setRecentCases(c.data.cases || []);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const fmt = (n) => n >= 1000 ? `$${(n / 1000).toFixed(0)}K` : `$${n?.toLocaleString() || 0}`;

  const statCards = stats ? [
    { label: 'Active Clients', value: stats.activeClients.toLocaleString(), change: 'on record', icon: Users, color: '#1B3A6B', bg: 'rgba(27,58,107,0.08)', trend: 'up' },
    { label: 'Attorneys', value: stats.totalAttorneys, change: 'all active', icon: Scale, color: '#C9A84C', bg: 'rgba(201,168,76,0.08)', trend: 'neutral' },
    { label: 'Open Cases', value: stats.openCases, change: `${stats.caseBreakdown?.active || 0} active`, icon: Briefcase, color: '#2E5FA3', bg: 'rgba(46,95,163,0.08)', trend: 'up' },
    { label: 'Billable (MTD)', value: fmt(stats.paidMTD), change: `${stats.overdueInvoices} overdue`, icon: DollarSign, color: '#B45309', bg: 'rgba(180,83,9,0.08)', trend: stats.overdueInvoices > 0 ? 'down' : 'up' },
  ] : [];

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }} className="mb-10">
        <div className="flex items-end gap-3 flex-wrap">
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 700, color: 'var(--text)', letterSpacing: '-0.02em' }}>
            Welcome back, <span className="gradient-text">{user?.name?.split(' ')[0] || 'Counsel'}</span>
          </h1>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: 'var(--muted)', fontStyle: 'italic', marginBottom: '0.2rem' }}>Esq.</span>
        </div>
        <p style={{ fontFamily: 'var(--font-body)', color: 'var(--muted)', marginTop: '0.4rem', fontStyle: 'italic' }}>
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} — Your firm's matters at a glance.
        </p>
      </motion.div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          {[1,2,3,4].map(i => (
            <div key={i} className="rounded-xl p-5 animate-pulse" style={{ background: 'var(--surface)', border: '1px solid rgba(201,168,76,0.15)', height: 120 }} />
          ))}
        </div>
      ) : (
        <motion.div variants={container} initial="hidden" animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          {statCards.map((stat) => (
            <motion.div key={stat.label} variants={item}
              className="card-3d rounded-xl p-5 cursor-default"
              style={{ background: 'var(--surface)', border: '1px solid rgba(201,168,76,0.15)', boxShadow: '0 2px 12px rgba(27,58,107,0.07)' }}>
              <div className="flex items-start justify-between mb-4">
                <div className="w-11 h-11 rounded-lg flex items-center justify-center float-anim border"
                  style={{ background: stat.bg, borderColor: 'rgba(201,168,76,0.15)' }}>
                  <stat.icon size={19} style={{ color: stat.color }} />
                </div>
                <span className="text-xs font-medium px-2.5 py-1 rounded-md"
                  style={{
                    background: stat.trend === 'up' ? 'rgba(27,58,107,0.08)' : stat.trend === 'down' ? 'rgba(180,83,9,0.08)' : 'rgba(201,168,76,0.1)',
                    color: stat.trend === 'up' ? '#1B3A6B' : stat.trend === 'down' ? '#B45309' : '#8B6914',
                    fontFamily: 'var(--font-body)',
                    border: '1px solid',
                    borderColor: stat.trend === 'up' ? 'rgba(27,58,107,0.12)' : stat.trend === 'down' ? 'rgba(180,83,9,0.12)' : 'rgba(201,168,76,0.2)',
                  }}>
                  {stat.change}
                </span>
              </div>
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', fontWeight: 700, color: 'var(--text)', lineHeight: 1 }}>
                {stat.value}
              </div>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: 'var(--muted)', marginTop: '0.35rem' }}>
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3, duration: 0.55 }}
          className="lg:col-span-2 rounded-xl overflow-hidden"
          style={{ background: 'var(--surface)', border: '1px solid rgba(201,168,76,0.15)', boxShadow: '0 2px 12px rgba(27,58,107,0.07)' }}>
          <div className="px-6 py-5 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(201,168,76,0.12)' }}>
            <div>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: '1rem', color: 'var(--text)' }}>Active Matters</h2>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.77rem', color: 'var(--muted)', fontStyle: 'italic' }}>
                {stats?.openCases ?? '—'} cases in progress
              </p>
            </div>
            <Briefcase size={15} className="text-[#6B6B7B]" />
          </div>
          <div className="divide-y" style={{ borderColor: 'rgba(201,168,76,0.08)' }}>
            {loading ? (
              <div className="py-10 text-center text-[#6B6B7B]" style={{ fontFamily: 'var(--font-body)', fontStyle: 'italic' }}>Loading…</div>
            ) : recentCases.length === 0 ? (
              <div className="py-10 text-center text-[#6B6B7B]" style={{ fontFamily: 'var(--font-body)', fontStyle: 'italic' }}>No active matters</div>
            ) : recentCases.map((c, i) => {
              const sc = statusConfig[c.status] || statusConfig.open;
              return (
                <motion.div key={c._id}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 + i * 0.07 }}
                  className="px-6 py-4 flex items-start gap-4 hover:bg-[#F5F2ED] transition-colors cursor-pointer">
                  <div className="flex-1 min-w-0">
                    <p style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, color: 'var(--text)', fontSize: '0.88rem' }} className="truncate">
                      {c.title}
                    </p>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.77rem', color: 'var(--muted)', fontStyle: 'italic' }}>
                      {c.client?.firstName} {c.client?.lastName} · {c.leadAttorney?.user?.name || '—'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: priorityDot[c.priority] || '#6B6B7B' }} />
                    <span className="px-2.5 py-1 rounded-md text-xs font-medium"
                      style={{ background: sc.bg, color: sc.color, fontFamily: 'var(--font-body)', border: '1px solid', borderColor: `${sc.color}20` }}>
                      {sc.label}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4, duration: 0.55 }} className="space-y-4">
          <div className="rounded-xl p-5"
            style={{ background: 'linear-gradient(135deg, #1B3A6B 0%, #2E5FA3 100%)', border: '1px solid rgba(201,168,76,0.3)', boxShadow: '0 8px 32px rgba(27,58,107,0.25)' }}>
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp size={14} className="text-[#C9A84C]" />
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.78rem', color: 'rgba(255,255,255,0.7)', letterSpacing: '0.06em' }} className="uppercase">
                Monthly Billing
              </span>
            </div>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '2.2rem', fontWeight: 700, color: 'white', lineHeight: 1 }}>
              {loading ? '—' : fmt(stats?.paidMTD || 0)}
            </div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.77rem', color: 'rgba(201,168,76,0.8)', marginTop: '0.3rem' }}>
              {loading ? '' : `$${(stats?.pendingBillable || 0).toLocaleString()} pending collection`}
            </div>
            <div className="mt-3 h-1.5 rounded-full bg-white/15">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: stats && stats.paidMTD + stats.pendingBillable > 0
                  ? `${Math.min(100, (stats.paidMTD / (stats.paidMTD + stats.pendingBillable)) * 100).toFixed(0)}%`
                  : '0%'
                }}
                transition={{ delay: 0.8, duration: 1.2, ease: 'easeOut' }}
                className="h-full rounded-full"
                style={{ background: 'linear-gradient(90deg, #C9A84C, #E8CC80)' }}
              />
            </div>
          </div>

          <div className="rounded-xl p-5"
            style={{ background: 'var(--surface)', border: '1px solid rgba(201,168,76,0.15)', boxShadow: '0 2px 12px rgba(27,58,107,0.07)' }}>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: '0.88rem', color: 'var(--text)', marginBottom: '1rem' }}>
              Case Breakdown
            </h3>
            {[
              { label: 'Active', key: 'active', icon: CheckCircle2, color: '#1B3A6B' },
              { label: 'Pending Review', key: 'pending', icon: Clock, color: '#C9A84C' },
              { label: 'Overdue Invoices', key: '_overdue', icon: AlertTriangle, color: '#DC2626' },
            ].map((s) => (
              <div key={s.label} className="flex items-center gap-3 mb-3.5 last:mb-0">
                <s.icon size={14} style={{ color: s.color }} />
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: 'var(--muted)', fontStyle: 'italic', flex: 1 }}>{s.label}</span>
                <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, color: 'var(--text)', fontSize: '0.9rem' }}>
                  {loading ? '—' : s.key === '_overdue' ? (stats?.overdueInvoices || 0) : (stats?.caseBreakdown?.[s.key] || 0)}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
