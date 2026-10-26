import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const homeFor = (role) => {
  if (role === 'staff') return '/';
  if (role === 'mechanic') return '/mechanic';
  if (role === 'customer') return '/my/vehicles';

  return '/login';
};

export default function RoleRoute({ role, children }) {
  const { user } = useAuth();

  if (!user) {
    return <p className="p-8">Loading user...</p>;
  }

  if (user.role !== role) {
    const destination = homeFor(user.role);

    // Prevent redirecting to the same URL repeatedly.
    if (window.location.pathname === destination) {
      return <p className="p-8">Checking your access permissions...</p>;
    }

    return <Navigate to={destination} replace />;
  }

  return children;
}
