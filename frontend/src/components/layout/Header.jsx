import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Scale, Bell, ChevronDown, LogOut, Menu, Settings, User, X } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth.js';

const navLinks = [
  { label: 'Dashboard', to: '/' },
  { label: 'Clients', to: '/clients' },
  { label: 'Attorneys', to: '/attorneys' },
  { label: 'Cases', to: '/cases' },
  { label: 'Billing', to: '/invoices' },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <motion.header
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 100, damping: 22 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'glass shadow-xl shadow-[#1B3A6B]/10 border-b border-[#C9A84C]/20' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <motion.div
              whileHover={{ scale: 1.08 }}
              transition={{ type: 'spring', stiffness: 250 }}
              className="w-10 h-10 rounded-lg flex items-center justify-center border border-[#C9A84C]/30"
              style={{ background: 'linear-gradient(135deg, #1B3A6B, #2E5FA3)' }}
            >
              <Scale size={18} className="text-[#C9A84C]" />
            </motion.div>
            <div>
              <span
                style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.2rem', letterSpacing: '-0.01em' }}
                className="gradient-text block leading-none"
              >
                CounselFlow
              </span>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.6rem', color: 'var(--muted)', letterSpacing: '0.12em' }}>
                LAW FIRM MANAGEMENT
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-0.5">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `px-4 py-2 text-sm font-medium transition-all duration-200 relative ${
                    isActive
                      ? 'text-[#1B3A6B]'
                      : 'text-[#1A1A2E]/60 hover:text-[#1B3A6B]'
                  }`
                }
                style={{ fontFamily: 'var(--font-body)' }}
              >
                {({ isActive }) => (
                  <>
                    {link.label}
                    {isActive && (
                      <motion.span
                        layoutId="nav-underline"
                        className="absolute bottom-0 left-4 right-4 h-0.5 rounded-full"
                        style={{ background: 'linear-gradient(90deg, #1B3A6B, #C9A84C)' }}
                      />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Right actions */}
          <div className="hidden lg:flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative w-10 h-10 rounded-lg flex items-center justify-center text-[#6B6B7B] hover:bg-[#1B3A6B]/6 transition-colors border border-transparent hover:border-[#C9A84C]/20"
            >
              <Bell size={17} />
              <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-[#C9A84C]" />
            </motion.button>

            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.02 }}
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-lg hover:bg-[#1B3A6B]/5 transition-colors border border-transparent hover:border-[#C9A84C]/20"
              >
                <div className="w-8 h-8 rounded-md flex items-center justify-center text-[#C9A84C] text-sm font-bold border border-[#C9A84C]/30"
                  style={{ background: 'linear-gradient(135deg, #1B3A6B, #2E5FA3)' }}>
                  {user?.name?.charAt(0) || 'U'}
                </div>
                <span className="text-sm font-medium text-[#1A1A2E]" style={{ fontFamily: 'var(--font-body)' }}>
                  {user?.name?.split(' ')[0] || 'Account'}
                </span>
                <ChevronDown size={13} className={`text-[#6B6B7B] transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
              </motion.button>

              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.18 }}
                    className="absolute right-0 top-full mt-2 w-52 glass rounded-xl shadow-xl overflow-hidden border border-[#C9A84C]/15"
                  >
                    <div className="p-1.5">
                      <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[#1A1A2E]/75 hover:bg-[#1B3A6B]/6 transition-colors" style={{ fontFamily: 'var(--font-body)' }}>
                        <User size={14} /> My Profile
                      </button>
                      <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[#1A1A2E]/75 hover:bg-[#1B3A6B]/6 transition-colors" style={{ fontFamily: 'var(--font-body)' }}>
                        <Settings size={14} /> Firm Settings
                      </button>
                      <div className="my-1 border-t border-[#C9A84C]/15" />
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-600 hover:bg-red-50 transition-colors"
                        style={{ fontFamily: 'var(--font-body)' }}
                      >
                        <LogOut size={14} /> Sign out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden p-2 rounded-lg hover:bg-[#1B3A6B]/6">
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden glass border-t border-[#C9A84C]/15"
          >
            <div className="px-4 py-4 space-y-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `block px-4 py-3 rounded-lg text-sm font-medium ${isActive ? 'bg-[#1B3A6B]/8 text-[#1B3A6B]' : 'text-[#1A1A2E]/75'}`
                  }
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  {link.label}
                </NavLink>
              ))}
              <button onClick={handleLogout} className="w-full mt-2 px-4 py-3 rounded-lg text-sm font-medium text-red-600 text-left" style={{ fontFamily: 'var(--font-body)' }}>
                Sign out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
