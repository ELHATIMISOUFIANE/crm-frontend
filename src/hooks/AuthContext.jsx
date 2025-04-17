// AuthContext.jsx
import { createContext, useState, useEffect } from 'react';
import { loginUser, logoutUser } from '../services/apiService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if user is already logged in
    const checkLoggedIn = () => {
      const user = localStorage.getItem('user');
      if (user) {
        setCurrentUser(JSON.parse(user));
      }
      setLoading(false);
    };

    checkLoggedIn();
  }, []);

  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      const data = await loginUser(email, password);
      setCurrentUser(data.user);
      setLoading(false);
      return data;
    } catch (error) {
      setError(error.error || 'Erreur de connexion');
      setLoading(false);
      throw error;
    }
  };

  const logout = () => {
    logoutUser();
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    loading,
    error,
    login,
    logout,
    isAuthenticated: !!currentUser,
    isEmployer: currentUser?.role === 'employer',
    isManager: currentUser?.role === 'manager',
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// useAuth.js
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export const useAuth = () => {
  return useContext(AuthContext);
};