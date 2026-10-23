import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RoleRoute({ role, children }) {
  const { user } = useAuth();

  if (!user) return <p className="p-8 text-gray-500">Loading...</p>;

  if (user.role !== role) {
    return <Navigate to={user.role === 'staff' ? '/' : '/my/vehicles'} replace />;
  }

  return children;
}