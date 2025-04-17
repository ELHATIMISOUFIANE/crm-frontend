// PrivateRoute.jsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const PrivateRoute = ({ allowedRoles = [] }) => {
  const { currentUser, isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Chargement...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(currentUser.role)) {
    return <Navigate to="/unauthorized" />;
  }

  return <Outlet />;
};

// App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { PrivateRoute } from './routes/PrivateRoute';
import Header from './components/Header';
import Footer from './components/Footer';
import Login from './pages/Login';
import EmployerDashboard from './pages/Employer/Dashboard';
import ManageLeads from './pages/Employer/ManageLeads';
import ManageManagers from './pages/Employer/ManageManagers';
import ManagerLeadsList from './pages/Manager/LeadsList';
import NotFound from './pages/NotFound';
import './styles/main.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Header />
          <div className="content">
            <Routes>
              <Route path="/login" element={<Login />} />
              
              {/* Employer Routes */}
              <Route element={<PrivateRoute allowedRoles={['employer']} />}>
                <Route path="/employer/dashboard" element={<EmployerDashboard />} />
                <Route path="/employer/leads" element={<ManageLeads />} />
                <Route path="/employer/managers" element={<ManageManagers />} />
              </Route>
              
              {/* Manager Routes */}
              <Route element={<PrivateRoute allowedRoles={['manager']} />}>
                <Route path="/manager/leads" element={<ManagerLeadsList />} />
              </Route>
              
              {/* Redirect based on role */}
              <Route path="/" element={<Navigate to="/login" replace />} />
              
              {/* 404 Page */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

// main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);