import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ role, children }) {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" />;

  const userRole = user.role;
  const allowedRoles = Array.isArray(role) ? role : [role];

  return allowedRoles.includes(userRole) ? children : <Navigate to="/login" />;
}

export default ProtectedRoute;
