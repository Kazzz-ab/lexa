import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Briefcase, FileText, Scale, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../lib/api.js';

const TYPE_ICON = { urgent: Briefcase, court: Scale, invoice: FileText };
const TYPE_COLOR = { urgent: '#DC2626', court: '#4C1D95', invoice: '#B45309' };

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const navigate = useNavigate();

  const load = () => {
    api.get('/notifications').then(({ data }) => {
      setNotifications(data.notifications);
      setCount(data.count);
    }).catch(() => {});
  };

  useEffect(() => {
    load();
    const interval = setInterval(load, 2 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(o => !o)}
        className="relative w-10 h-10 rounded-lg flex items-center justify-center text-[#6B6B7B] hover:bg-[#4C1D95]/6 transition-colors border border-transparent hover:border-[#8B5CF6]/20">
        <Bell size={17} />
        {count > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] rounded-full flex items-center justify-center text-white text-[10px] font-bold px-1"
            style={{ background: '#B45309', fontFamily: 'var(--font-body)' }}>
            {count > 9 ? '9+' : count}
          </span>
        )}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.18 }}
            className="absolute right-0 top-full mt-2 w-80 rounded-xl overflow-hidden z-50"
            style={{ background: 'var(--surface)', boxShadow: '0 20px 60px rgba(76,29,149,0.18)', border: '1px solid rgba(139,92,246,0.2)' }}>
            <div className="px-4 py-3 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(139,92,246,0.12)' }}>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: '0.9rem', color: 'var(--text)' }}>
                Notifications
              </h3>
              <button onClick={() => setOpen(false)} className="text-[#6B6B7B] hover:text-[#4C1D95]">
                <X size={14} />
              </button>
            </div>
            <div className="max-h-72 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="py-8 text-center">
                  <Bell size={24} className="mx-auto mb-2 text-[#8B5CF6]/30" />
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.82rem', color: 'var(--muted)' }}>All clear — no alerts</p>
                </div>
              ) : notifications.map((n) => {
                const Icon = TYPE_ICON[n.type] || Bell;
                const color = TYPE_COLOR[n.type] || '#4C1D95';
                return (
                  <button key={n.id} onClick={() => { setOpen(false); navigate(n.href); }}
                    className="w-full flex items-start gap-3 px-4 py-3 hover:bg-[#F4F3F9] transition-colors text-left"
                    style={{ borderBottom: '1px solid rgba(139,92,246,0.06)' }}>
                    <div className="w-8 h-8 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ background: `${color}15`, border: `1px solid ${color}25` }}>
                      <Icon size={13} style={{ color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text)' }} className="truncate">
                        {n.title}
                      </p>
                      <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: 'var(--muted)' }}>
                        {n.body}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
