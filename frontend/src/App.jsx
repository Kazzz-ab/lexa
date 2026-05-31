import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth.js';
import Header from './components/layout/Header.jsx';
import Footer from './components/layout/Footer.jsx';
import Dashboard from './pages/Dashboard.jsx';
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
      <Route path="/" element={<ProtectedLayout><Dashboard /></ProtectedLayout>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
