import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Landmark, Mail, Phone, MapPin, Twitter, Linkedin } from 'lucide-react';

const quickLinks = [
  { label: 'Dashboard', to: '/' },
  { label: 'Clients', to: '/clients' },
  { label: 'Attorneys', to: '/attorneys' },
  { label: 'Cases', to: '/cases' },
  { label: 'Billing', to: '/invoices' },
];

const practiceAreas = [
  'Corporate Law', 'Civil Litigation', 'Family Law',
  'Criminal Defense', 'Real Estate', 'Immigration',
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

export default function Footer() {
  return (
    <footer className="relative overflow-hidden mt-20" style={{ background: 'linear-gradient(160deg, #150A30 0%, #2E1065 55%, #4C1D95 100%)' }}>
      {/* Accent line at top */}
      <div className="h-px w-full" style={{ background: 'linear-gradient(90deg, transparent, #8B5CF6, transparent)' }} />

      {/* Decorative */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full opacity-5 blur-3xl"
        style={{ background: 'radial-gradient(circle, #8B5CF6, transparent)' }} />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 pt-16 pb-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-14"
        >
          {/* Brand column */}
          <motion.div variants={itemVariants} className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center border border-[#8B5CF6]/30"
                style={{ background: 'linear-gradient(135deg, #4C1D95, #7C3AED)' }}>
                <Landmark size={18} className="text-[#C4B5FD]" />
              </div>
              <div>
                <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.15rem', color: 'white' }} className="block leading-none">
                  Lexa
                </span>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.58rem', color: 'rgba(139,92,246,0.7)', letterSpacing: '0.14em' }}>
                  PRACTICE INTELLIGENCE
                </span>
              </div>
            </Link>
            <p className="text-white/45 text-sm leading-relaxed mb-6" style={{ fontFamily: 'var(--font-body)' }}>
              "Every matter, in focus." — Lexa keeps your firm's caseload clear, current, and accounted for.
            </p>
            <div className="flex gap-3">
              {[Twitter, Linkedin].map((Icon, i) => (
                <motion.a
                  key={i}
                  href="#"
                  whileHover={{ scale: 1.12, y: -2 }}
                  className="w-9 h-9 rounded-lg flex items-center justify-center text-white/45 hover:text-[#8B5CF6] transition-colors border border-white/8 hover:border-[#8B5CF6]/40"
                >
                  <Icon size={15} />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Navigation */}
          <motion.div variants={itemVariants}>
            <h4 style={{ fontFamily: 'var(--font-heading)', color: '#8B5CF6', fontWeight: 600 }} className="text-xs mb-5 tracking-widest uppercase">
              Navigation
            </h4>
            <ul className="space-y-3.5">
              {quickLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-white/45 hover:text-white text-sm transition-colors flex items-center gap-2.5 group"
                    style={{ fontFamily: 'var(--font-body)' }}
                  >
                    <span className="w-3 h-px bg-[#8B5CF6]/40 group-hover:w-4 group-hover:bg-[#8B5CF6] transition-all" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Practice Areas */}
          <motion.div variants={itemVariants}>
            <h4 style={{ fontFamily: 'var(--font-heading)', color: '#8B5CF6', fontWeight: 600 }} className="text-xs mb-5 tracking-widest uppercase">
              Practice Areas
            </h4>
            <ul className="space-y-3.5">
              {practiceAreas.map((area) => (
                <li key={area} className="text-white/45 text-sm flex items-center gap-2.5" style={{ fontFamily: 'var(--font-body)' }}>
                  <span className="w-3 h-px bg-white/20" />
                  {area}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div variants={itemVariants}>
            <h4 style={{ fontFamily: 'var(--font-heading)', color: '#8B5CF6', fontWeight: 600 }} className="text-xs mb-5 tracking-widest uppercase">
              Contact
            </h4>
            <ul className="space-y-4">
              {[
                { icon: Mail, text: 'hello@lexa.legal' },
                { icon: Phone, text: '+1 (312) 555-0271' },
                { icon: MapPin, text: 'One Federal Plaza, Suite 2200\nChicago, IL 60602' },
              ].map(({ icon: Icon, text }, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5 border border-[#8B5CF6]/20"
                    style={{ background: 'rgba(139,92,246,0.08)' }}>
                    <Icon size={12} className="text-[#8B5CF6]" />
                  </div>
                  <span className="text-white/45 text-sm leading-relaxed whitespace-pre-line" style={{ fontFamily: 'var(--font-body)' }}>{text}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>

        {/* Disclaimer */}
        <div className="border-t border-white/6 pt-6 mb-6">
          <p className="text-white/25 text-xs leading-relaxed" style={{ fontFamily: 'var(--font-body)' }}>
            This platform is a practice management tool. Nothing herein constitutes legal advice. Attorney-client privilege is maintained through your firm's independent processes.
          </p>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/30 text-xs" style={{ fontFamily: 'var(--font-body)' }}>
            © {new Date().getFullYear()} Lexa. All rights reserved.
          </p>
          <div className="flex gap-5">
            {[['Privacy Policy', '/privacy'], ['Terms of Service', '/terms'], ['Attorney Ethics', '/ethics']].map(([l, href]) => (
              <a key={l} href={href} className="text-white/30 hover:text-[#8B5CF6]/70 text-xs transition-colors" style={{ fontFamily: 'var(--font-body)' }}>{l}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
