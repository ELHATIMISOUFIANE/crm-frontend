import { NavLink } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Sidebar = () => {
  const { isEmployer, isManager } = useAuth();

  return (
    <aside className="sidebar">
      <nav>
        <ul>
          {isEmployer && (
            <>
              <li>
                <NavLink to="/employer/dashboard" className={({ isActive }) => isActive ? 'active' : ''}>
                  Dashboard
                </NavLink>
              </li>
              <li>
                <NavLink to="/employer/leads" className={({ isActive }) => isActive ? 'active' : ''}>
                  Gestion des Leads
                </NavLink>
              </li>
              <li>
                <NavLink to="/employer/managers" className={({ isActive }) => isActive ? 'active' : ''}>
                  Gestion des Managers
                </NavLink>
              </li>
            </>
          )}
          {isManager && (
            <li>
              <NavLink to="/manager/leads" className={({ isActive }) => isActive ? 'active' : ''}>
                Mes Leads
              </NavLink>
            </li>
          )}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;