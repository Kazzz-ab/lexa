import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, FileText } from 'lucide-react';

export default function Terms() {
  return (
    <div className="min-h-screen py-16 px-6" style={{ background: 'var(--bg)' }}>
      <div className="max-w-3xl mx-auto">
        <Link to="/" className="flex items-center gap-2 hover:underline mb-8 text-sm" style={{ fontFamily: 'var(--font-body)', color: '#4C1D95' }}>
          <ArrowLeft size={14} /> Back to Dashboard
        </Link>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center border border-[#8B5CF6]/30" style={{ background: 'linear-gradient(135deg,#4C1D95,#7C3AED)' }}>
              <FileText size={17} className="text-[#8B5CF6]" />
            </div>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 700, color: 'var(--text)', letterSpacing: '-0.02em' }}>
              Terms of Service
            </h1>
          </div>
          <div className="rounded-xl p-8 space-y-6" style={{ background: 'var(--surface)', border: '1px solid rgba(139,92,246,0.15)' }}>
            <p style={{ fontFamily: 'var(--font-body)', color: 'var(--muted)', fontSize: '0.85rem' }}>Last updated: June 2026</p>
            {[
              { title: '1. Authorized Personnel Only', body: 'Lexa is a restricted system for authorized law firm staff. Access credentials are personal and non-transferable. All activity is logged and attributed to the authenticated user.' },
              { title: '2. Confidentiality Obligations', body: 'All users are bound by attorney-client privilege and applicable confidentiality rules. Unauthorized disclosure of client information or case strategy is prohibited and may constitute a violation of bar rules.' },
              { title: '3. Accurate Record-Keeping', body: 'Users must maintain accurate time records, billing entries, and case notes. Falsifying billing records or case documentation is a violation of professional ethics and these terms.' },
              { title: '4. Prohibited Activities', body: 'Users may not: access matters beyond their assigned role; export client data without authorization; share login credentials; or use the system for purposes unrelated to firm operations.' },
              { title: '5. Billing and Time Records', body: 'Time entries must accurately reflect work performed. Bill only for time actually spent on client matters. Ethical billing practices are mandatory.' },
              { title: '6. Modifications', body: 'These terms may be updated periodically. Continued use of Lexa constitutes acceptance of any revised terms.' },
            ].map(({ title, body }) => (
              <div key={title}>
                <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: '1rem', color: 'var(--text)', marginBottom: '0.5rem' }}>{title}</h2>
                <p style={{ fontFamily: 'var(--font-body)', color: 'var(--muted)', fontSize: '0.9rem', lineHeight: 1.7 }}>{body}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
