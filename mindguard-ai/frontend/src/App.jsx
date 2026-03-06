import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Screening from './pages/Screening';
import Login from './pages/Login';
import Register from './pages/Register';
import Resources from './pages/Resources';
import Counseling from './pages/Counseling';
import DefenceDashboard from './pages/DefenceDashboard';
import CollegeAdminDKTE from './pages/CollegeAdminDKTE';
import CollegeAdminSharad from './pages/CollegeAdminSharad';
import Chatbot from './components/Chatbot';
import { Activity, LogOut } from 'lucide-react';
import axios from 'axios';

// Automatically attach token to all axios requests if it exists
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!localStorage.getItem('token'));
  const [userRole, setUserRole] = useState(() => localStorage.getItem('userRole') || 'user');

  // Ensure auth state is updated if token is manually removed
  useEffect(() => {
    const checkAuth = () => {
      setIsAuthenticated(!!localStorage.getItem('token'));
      setUserRole(localStorage.getItem('userRole') || 'user');
    };
    window.addEventListener('storage', checkAuth);
    // Also trigger on mount to be absolutely sure
    checkAuth();
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    setIsAuthenticated(false);
    setUserRole('user');
  };

  return (
    <Router>
      <nav className="nav-bar glass-panel">
        <Link to="/" className="nav-logo">
          <Activity size={28} color="#ec4899" />
          <span>MindGuard AI</span>
        </Link>

        {isAuthenticated && (
          <div className="nav-links" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            {userRole === 'user' || userRole === 'student' || userRole === 'adult' ? (
              <>
                <Link to="/resources" className="btn btn-glass">Resources</Link>
                <Link to="/counseling" className="btn btn-glass">Counseling</Link>
                <Link to="/dashboard" className="btn btn-glass">Dashboard</Link>
              </>
            ) : null}

            {userRole === 'soldier' && (
              <Link to="/defence-dashboard" className="btn btn-glass" style={{ borderColor: 'var(--danger)', color: 'var(--danger)' }}>
                Defence Dashboard
              </Link>
            )}

            {userRole === 'college_admin_dkte' && (
              <Link to="/admin/dkte" className="btn btn-glass" style={{ borderColor: 'var(--primary)' }}>DKTE Admin</Link>
            )}

            {userRole === 'college_admin_sharad' && (
              <Link to="/admin/sharad" className="btn btn-glass" style={{ borderColor: 'var(--primary)' }}>Sharad Admin</Link>
            )}
            <button onClick={handleLogout} className="btn" style={{ background: 'transparent', color: 'var(--text-muted)', border: '1px solid var(--glass-border)', padding: '0.5rem 1rem' }}>
              <LogOut size={18} />
              Logout
            </button>
          </div>
        )}
      </nav>

      <main className="container">
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <Login setAuth={setIsAuthenticated} />} />
          <Route path="/register" element={isAuthenticated ? <Navigate to="/" /> : <Register />} />

          {/* Protected Routes */}
          <Route path="/" element={isAuthenticated ? <Home /> : <Navigate to="/login" />} />
          <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="/defence-dashboard" element={(isAuthenticated && userRole === 'soldier') ? <DefenceDashboard /> : <Navigate to="/dashboard" />} />
          <Route path="/screening" element={isAuthenticated ? <Screening /> : <Navigate to="/login" />} />
          <Route path="/resources" element={isAuthenticated ? <Resources /> : <Navigate to="/login" />} />
          <Route path="/counseling" element={isAuthenticated ? <Counseling /> : <Navigate to="/login" />} />
          <Route path="/admin/dkte" element={isAuthenticated && userRole === 'college_admin_dkte' ? <CollegeAdminDKTE /> : <Navigate to="/" />} />
          <Route path="/admin/sharad" element={isAuthenticated && userRole === 'college_admin_sharad' ? <CollegeAdminSharad /> : <Navigate to="/" />} />
        </Routes>
      </main>

      {/* Only show chatbot if authenticated */}
      {isAuthenticated && <Chatbot />}
    </Router>
  );
}

export default App;
