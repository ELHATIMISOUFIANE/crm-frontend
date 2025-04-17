import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const { login, loading, isAuthenticated, isEmployer, isManager } = useAuth();
  const navigate = useNavigate();

  // If already logged in, redirect to the appropriate dashboard
  if (isAuthenticated) {
    if (isEmployer) {
      navigate('/employer/dashboard');
    } else if (isManager) {
      navigate('/manager/leads');
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const { user } = await login(formData.email, formData.password);
      
      // Redirect based on role
      if (user.role === 'employer') {
        navigate('/employer/dashboard');
      } else if (user.role === 'manager') {
        navigate('/manager/leads');
      }
    } catch (error) {
      setError(error.error || 'Email ou mot de passe incorrect');
    }
  };

  return (
    <div className="login-container">
      <div className="login-form-box">
        <h2>Connexion</h2>
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Mot de passe</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>
          
          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;