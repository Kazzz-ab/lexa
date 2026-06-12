import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp } from 'lucide-react';
import api from '../lib/api.js';

const COLORS = ['#4C1D95', '#8B5CF6', '#7C3AED', '#B45309', '#6B6B7B'];

const ChartCard = ({ title, children, loading }) => (
  <div className="rounded-xl p-6" style={{ background: 'var(--surface)', border: '1px solid rgba(139,92,246,0.15)', boxShadow: '0 2px 12px rgba(76,29,149,0.07)' }}>
    <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: '0.95rem', color: 'var(--text)', marginBottom: '1.25rem' }}>{title}</h3>
    {loading ? <div className="h-48 flex items-center justify-center text-[#6B6B7B] text-sm italic" style={{ fontFamily: 'var(--font-body)' }}>Loading…</div> : children}
  </div>
);

export default function Analytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/analytics').then(({ data }) => setData(data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center border border-[#8B5CF6]/30" style={{ background: 'linear-gradient(135deg,#4C1D95,#7C3AED)' }}>
            <TrendingUp size={17} className="text-[#8B5CF6]" />
          </div>
          <div>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.75rem', fontWeight: 700, color: 'var(--text)', letterSpacing: '-0.02em' }}>Analytics</h1>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.83rem', color: 'var(--muted)', marginTop: '0.1rem' }}>Firm performance overview</p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Cases Opened — Last 6 Months" loading={loading}>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={data?.casesOpened || []} margin={{ left: -20 }}>
              <XAxis dataKey="month" tick={{ fontSize: 11, fontFamily: 'var(--font-body)', fill: '#6B6B7B' }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#6B6B7B' }} tickLine={false} axisLine={false} allowDecimals={false} />
              <Tooltip contentStyle={{ fontFamily: 'var(--font-body)', fontSize: 12, borderRadius: 8, border: '1px solid rgba(139,92,246,0.2)' }} />
              <Bar dataKey="cases" fill="#4C1D95" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Billing Collected — Last 6 Months" loading={loading}>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={data?.billing || []} margin={{ left: -20 }}>
              <XAxis dataKey="month" tick={{ fontSize: 11, fontFamily: 'var(--font-body)', fill: '#6B6B7B' }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#6B6B7B' }} tickLine={false} axisLine={false} tickFormatter={v => `$${v >= 1000 ? (v/1000).toFixed(0)+'k' : v}`} />
              <Tooltip formatter={v => [`$${v.toLocaleString()}`, 'Collected']} contentStyle={{ fontFamily: 'var(--font-body)', fontSize: 12, borderRadius: 8 }} />
              <Line type="monotone" dataKey="revenue" stroke="#8B5CF6" strokeWidth={2.5} dot={{ fill: '#8B5CF6', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Case Status Distribution" loading={loading}>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={data?.statusData || []} cx="50%" cy="50%" outerRadius={80} dataKey="value" nameKey="name"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                labelLine={false} style={{ fontSize: 11, fontFamily: 'var(--font-body)' }}>
                {(data?.statusData || []).map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ fontFamily: 'var(--font-body)', fontSize: 12, borderRadius: 8 }} />
              <Legend wrapperStyle={{ fontFamily: 'var(--font-body)', fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Top Practice Areas" loading={loading}>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={data?.areaData || []} layout="vertical" margin={{ left: 8 }}>
              <XAxis type="number" tick={{ fontSize: 11, fill: '#6B6B7B' }} tickLine={false} axisLine={false} allowDecimals={false} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fontFamily: 'var(--font-body)', fill: '#6B6B7B' }} tickLine={false} axisLine={false} width={100} />
              <Tooltip contentStyle={{ fontFamily: 'var(--font-body)', fontSize: 12, borderRadius: 8 }} />
              <Bar dataKey="value" fill="#8B5CF6" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}
