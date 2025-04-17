import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import logo from '../assets/logo.png';

const Header = () => {
  const { currentUser, logout, isEmployer, isManager } = useAuth();

  return (
    <header className="header">
      <div className="logo">
        <img src={logo} alt="Logo" />
        <h1>Lead Management System</h1>
      </div>
      <nav>
        {currentUser ? (
          <>
            <span>Bienvenue, {currentUser.name}</span>
            {isEmployer && (
              <>
                <Link to="/employer/dashboard">Dashboard</Link>
                <Link to="/employer/leads">Leads</Link>
                <Link to="/employer/managers">Managers</Link>
              </>
            )}
            {isManager && (
              <Link to="/manager/leads">Mes Leads</Link>
            )}
            <button onClick={logout}>Déconnexion</button>
          </>
        ) : (
          <Link to="/login">Se connecter</Link>
        )}
      </nav>
    </header>
  );
};

export default Header;