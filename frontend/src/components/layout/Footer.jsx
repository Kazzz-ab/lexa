import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Scale, Mail, Phone, MapPin, Twitter, Linkedin } from 'lucide-react';

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
    <footer className="relative overflow-hidden mt-20" style={{ background: 'linear-gradient(160deg, #0D1320 0%, #12203A 55%, #1B3A6B 100%)' }}>
      {/* Gold accent line at top */}
      <div className="h-px w-full" style={{ background: 'linear-gradient(90deg, transparent, #C9A84C, transparent)' }} />

      {/* Decorative */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full opacity-5 blur-3xl"
        style={{ background: 'radial-gradient(circle, #C9A84C, transparent)' }} />

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
              <div className="w-10 h-10 rounded-lg flex items-center justify-center border border-[#C9A84C]/30"
                style={{ background: 'linear-gradient(135deg, #1B3A6B, #2E5FA3)' }}>
                <Scale size={18} className="text-[#C9A84C]" />
              </div>
              <div>
                <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.15rem', color: 'white' }} className="block leading-none">
                  CounselFlow
                </span>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.58rem', color: 'rgba(201,168,76,0.7)', letterSpacing: '0.14em' }}>
                  LAW FIRM MANAGEMENT
                </span>
              </div>
            </Link>
            <p className="text-white/45 text-sm leading-relaxed mb-6" style={{ fontFamily: 'var(--font-body)', fontStyle: 'italic' }}>
              "Precision. Integrity. Excellence." — CounselFlow brings the same standards to your practice management.
            </p>
            <div className="flex gap-3">
              {[Twitter, Linkedin].map((Icon, i) => (
                <motion.a
                  key={i}
                  href="#"
                  whileHover={{ scale: 1.12, y: -2 }}
                  className="w-9 h-9 rounded-lg flex items-center justify-center text-white/45 hover:text-[#C9A84C] transition-colors border border-white/8 hover:border-[#C9A84C]/40"
                >
                  <Icon size={15} />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Navigation */}
          <motion.div variants={itemVariants}>
            <h4 style={{ fontFamily: 'var(--font-heading)', color: '#C9A84C', fontWeight: 600 }} className="text-xs mb-5 tracking-widest uppercase">
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
                    <span className="w-3 h-px bg-[#C9A84C]/40 group-hover:w-4 group-hover:bg-[#C9A84C] transition-all" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Practice Areas */}
          <motion.div variants={itemVariants}>
            <h4 style={{ fontFamily: 'var(--font-heading)', color: '#C9A84C', fontWeight: 600 }} className="text-xs mb-5 tracking-widest uppercase">
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
            <h4 style={{ fontFamily: 'var(--font-heading)', color: '#C9A84C', fontWeight: 600 }} className="text-xs mb-5 tracking-widest uppercase">
              Contact
            </h4>
            <ul className="space-y-4">
              {[
                { icon: Mail, text: 'contact@counselflow.io' },
                { icon: Phone, text: '+1 (888) 555-0200' },
                { icon: MapPin, text: '1 Legal District, 38th Floor\nNew York, NY 10004' },
              ].map(({ icon: Icon, text }, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5 border border-[#C9A84C]/20"
                    style={{ background: 'rgba(201,168,76,0.08)' }}>
                    <Icon size={12} className="text-[#C9A84C]" />
                  </div>
                  <span className="text-white/45 text-sm leading-relaxed whitespace-pre-line" style={{ fontFamily: 'var(--font-body)' }}>{text}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>

        {/* Disclaimer */}
        <div className="border-t border-white/6 pt-6 mb-6">
          <p className="text-white/25 text-xs leading-relaxed" style={{ fontFamily: 'var(--font-body)', fontStyle: 'italic' }}>
            This platform is a practice management tool. Nothing herein constitutes legal advice. Attorney-client privilege is maintained through your firm's independent processes.
          </p>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/30 text-xs" style={{ fontFamily: 'var(--font-body)' }}>
            © {new Date().getFullYear()} CounselFlow. All rights reserved.
          </p>
          <div className="flex gap-5">
            {['Privacy Policy', 'Terms of Service', 'Attorney Ethics'].map((l) => (
              <a key={l} href="#" className="text-white/30 hover:text-[#C9A84C]/70 text-xs transition-colors" style={{ fontFamily: 'var(--font-body)' }}>{l}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
