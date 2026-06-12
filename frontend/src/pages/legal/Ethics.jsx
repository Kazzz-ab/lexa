import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, Scale } from 'lucide-react';

export default function Ethics() {
  return (
    <div className="min-h-screen py-16 px-6" style={{ background: 'var(--bg)' }}>
      <div className="max-w-3xl mx-auto">
        <Link to="/" className="flex items-center gap-2 hover:underline mb-8 text-sm" style={{ fontFamily: 'var(--font-body)', color: '#4C1D95' }}>
          <ArrowLeft size={14} /> Back to Dashboard
        </Link>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center border border-[#8B5CF6]/30" style={{ background: 'linear-gradient(135deg,#4C1D95,#7C3AED)' }}>
              <Scale size={17} className="text-[#8B5CF6]" />
            </div>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 700, color: 'var(--text)', letterSpacing: '-0.02em' }}>
              Attorney Ethics Guidelines
            </h1>
          </div>
          <div className="rounded-xl p-8 space-y-6" style={{ background: 'var(--surface)', border: '1px solid rgba(139,92,246,0.15)' }}>
            <p style={{ fontFamily: 'var(--font-body)', color: 'var(--muted)', fontSize: '0.85rem' }}>Effective: June 2026 — Based on ABA Model Rules of Professional Conduct</p>
            {[
              { title: 'Competence (Rule 1.1)', body: 'Attorneys must provide competent representation, including the legal knowledge, skill, thoroughness, and preparation reasonably necessary. This system helps maintain organized case records to support competent representation.' },
              { title: 'Confidentiality (Rule 1.6)', body: 'All client information in this system is strictly confidential. Attorneys must not reveal information relating to client representation unless the client gives informed consent or disclosure is required by law.' },
              { title: 'Conflict of Interest (Rule 1.7)', body: 'Attorneys must run conflict checks before accepting new matters. This system maintains client and case records to facilitate conflict checking. Representation is prohibited when a direct conflict exists.' },
              { title: 'Communication (Rule 1.4)', body: 'Attorneys must keep clients reasonably informed about case status. Case notes and status updates recorded in this system support the obligation to promptly respond to client inquiries.' },
              { title: 'Fees (Rule 1.5)', body: 'Fees must be reasonable. Time records and billing entries in this system must accurately reflect actual work performed. Padding time entries or double-billing is an ethical violation.' },
              { title: 'Supervision (Rule 5.1)', body: 'Supervising attorneys are responsible for the ethical conduct of supervised paralegals and staff. Role-based access controls in this system help maintain appropriate supervision.' },
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
