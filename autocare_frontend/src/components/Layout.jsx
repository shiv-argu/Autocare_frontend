import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const links = [
  ['/customers', 'Customers'],
  ['/mechanics', 'Mechanics'],
  ['/service-types', 'Service Types'],
  ['/spares', 'Spares'],
  ['/service-requests', 'Service Requests'],
  ['/bills', 'Bills'],
];

export default function Layout() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-x-6 gap-y-2 px-4 py-3">
          <NavLink to="/" className="text-lg font-bold text-blue-600">
            AutoCare
          </NavLink>

          <nav className="flex flex-wrap gap-4">
            {links.map(([to, label]) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `text-sm ${isActive ? 'font-semibold text-blue-600' : 'text-gray-600 hover:text-gray-900'}`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-3">
            {user && (
              <span className="text-sm text-gray-500">
                {user.email} <span className="rounded bg-gray-100 px-1.5 py-0.5 text-xs">{user.role}</span>
              </span>
            )}
            <button onClick={logout} className="btn-secondary">Logout</button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}