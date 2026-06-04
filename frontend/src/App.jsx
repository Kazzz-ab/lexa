import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth.js';
import Header from './components/layout/Header.jsx';
import Footer from './components/layout/Footer.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Clients from './pages/Clients.jsx';
import Attorneys from './pages/Attorneys.jsx';
import Cases from './pages/Cases.jsx';
import Invoices from './pages/Invoices.jsx';
import Profile from './pages/Profile.jsx';
import Settings from './pages/Settings.jsx';
import ForgotPassword from './pages/ForgotPassword.jsx';
import ResetPassword from './pages/ResetPassword.jsx';
import Analytics from './pages/Analytics.jsx';
import AdminUsers from './pages/AdminUsers.jsx';
import AuditLog from './pages/AuditLog.jsx';
import Privacy from './pages/legal/Privacy.jsx';
import Terms from './pages/legal/Terms.jsx';
import Ethics from './pages/legal/Ethics.jsx';
import Login from './pages/Login.jsx';

function ProtectedLayout({ children }) {
  const { token } = useAuth();
  if (!token) return <Navigate to="/login" replace />;
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-20 lg:pt-24">{children}</main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/ethics" element={<Ethics />} />
      <Route path="/" element={<ProtectedLayout><Dashboard /></ProtectedLayout>} />
      <Route path="/clients" element={<ProtectedLayout><Clients /></ProtectedLayout>} />
      <Route path="/attorneys" element={<ProtectedLayout><Attorneys /></ProtectedLayout>} />
      <Route path="/cases" element={<ProtectedLayout><Cases /></ProtectedLayout>} />
      <Route path="/invoices" element={<ProtectedLayout><Invoices /></ProtectedLayout>} />
      <Route path="/profile" element={<ProtectedLayout><Profile /></ProtectedLayout>} />
      <Route path="/settings" element={<ProtectedLayout><Settings /></ProtectedLayout>} />
      <Route path="/analytics" element={<ProtectedLayout><Analytics /></ProtectedLayout>} />
      <Route path="/admin/users" element={<ProtectedLayout><AdminUsers /></ProtectedLayout>} />
      <Route path="/admin/audit" element={<ProtectedLayout><AuditLog /></ProtectedLayout>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
