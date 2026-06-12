import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield } from 'lucide-react';

export default function Privacy() {
  return (
    <div className="min-h-screen py-16 px-6" style={{ background: 'var(--bg)' }}>
      <div className="max-w-3xl mx-auto">
        <Link to="/" className="flex items-center gap-2 hover:underline mb-8 text-sm" style={{ fontFamily: 'var(--font-body)', color: '#4C1D95' }}>
          <ArrowLeft size={14} /> Back to Dashboard
        </Link>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center border border-[#8B5CF6]/30" style={{ background: 'linear-gradient(135deg,#4C1D95,#7C3AED)' }}>
              <Shield size={17} className="text-[#8B5CF6]" />
            </div>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 700, color: 'var(--text)', letterSpacing: '-0.02em' }}>
              Privacy Policy
            </h1>
          </div>
          <div className="rounded-xl p-8 space-y-6" style={{ background: 'var(--surface)', border: '1px solid rgba(139,92,246,0.15)' }}>
            <p style={{ fontFamily: 'var(--font-body)', color: 'var(--muted)', fontSize: '0.85rem' }}>Last updated: June 2026</p>
            {[
              { title: '1. Information We Collect', body: 'Lexa collects client personal information, case details, billing records, and attorney credentials necessary for law firm operations. All data is stored securely in encrypted PostgreSQL databases.' },
              { title: '2. Attorney-Client Privilege', body: 'All client communications and case information entered into Lexa is subject to attorney-client privilege. The system is designed to maintain confidentiality in accordance with applicable bar rules and professional ethics standards.' },
              { title: '3. Data Security', body: 'All data is encrypted in transit (TLS 1.3) and at rest. Access is controlled through role-based JWT authentication. The system implements audit logging and regular security reviews.' },
              { title: '4. Third-Party Disclosure', body: 'Client data is never sold or shared with third parties. Disclosure is limited to: direct representation requirements, court-ordered production, and situations where the client provides informed consent.' },
              { title: '5. Data Retention', body: 'Matter records are retained for a minimum of 7 years after case closure as required by state bar rules. Financial records are retained for 7 years for tax and compliance purposes.' },
              { title: '6. Your Rights', body: 'Clients have the right to access their matter files, request corrections, and obtain copies of documents. Contact your attorney to exercise these rights.' },
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
