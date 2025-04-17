// Dashboard.jsx
import { useState, useEffect } from 'react';
import { getLeadStats } from '../../services/apiService';
import Sidebar from '../../components/Sidebar';

const EmployerDashboard = () => {
  const [stats, setStats] = useState({
    leadsInProgress: 0,
    leadsCompleted: 0,
    leadsCanceled: 0,
    totalLeads: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await getLeadStats();
        setStats(response.data);
        setLoading(false);
      } catch (error) {
        setError('Erreur lors du chargement des statistiques');
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="page-container">
      <Sidebar />
      <main className="dashboard">
        <h1>Tableau de bord</h1>
        
        {loading ? (
          <div className="loader">Chargement des statistiques...</div>
        ) : error ? (
          <div className="error">{error}</div>
        ) : (
          <>
            <div className="stats-container">
              <div className="stat-card total">
                <h3>Total des leads</h3>
                <p className="stat-value">{stats.totalLeads}</p>
              </div>
              
              <div className="stat-card in-progress">
                <h3>En cours</h3>
                <p className="stat-value">{stats.leadsInProgress}</p>
                <p className="stat-percent">
                  {stats.totalLeads > 0 
                    ? `${Math.round((stats.leadsInProgress / stats.totalLeads) * 100)}%` 
                    : '0%'}
                </p>
              </div>
              
              <div className="stat-card completed">
                <h3>Terminés</h3>
                <p className="stat-value">{stats.leadsCompleted}</p>
                <p className="stat-percent">
                  {stats.totalLeads > 0 
                    ? `${Math.round((stats.leadsCompleted / stats.totalLeads) * 100)}%` 
                    : '0%'}
                </p>
              </div>
              
              <div className="stat-card canceled">
                <h3>Annulés</h3>
                <p className="stat-value">{stats.leadsCanceled}</p>
                <p className="stat-percent">
                  {stats.totalLeads > 0 
                    ? `${Math.round((stats.leadsCanceled / stats.totalLeads) * 100)}%` 
                    : '0%'}
                </p>
              </div>
            </div>
            
            <div className="dashboard-actions">
              <button onClick={() => window.location.href = '/employer/leads'}>
                Gérer les leads
              </button>
              <button onClick={() => window.location.href = '/employer/managers'}>
                Gérer les managers
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default EmployerDashboard;


