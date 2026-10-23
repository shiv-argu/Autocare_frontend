// import { useAuth } from '../context/AuthContext';
// import FetchData from '../components/Fetch';
// import { Link } from 'react-router-dom';

// export default function Home() {
//     const { logout } = useAuth();

//     return (
//         <div>
//             <h2>Logged in</h2>
            
//             <nav style={{ display: 'flex', gap: 12 }}>
//             <Link to="/customers">Customers</Link>
//             <Link to="/mechanics">Mechanics</Link>
//             <Link to="/service-types">Service Types</Link>
//             <Link to="/spares">Spares</Link>
//             <Link to="/service-requests">Service Requests</Link>
//             <Link to="/bills">Bills</Link>
//             </nav>
//             <button onClick={logout}>Logout</button>
//             {/* <FetchData /> */}
//         </div>
//     );
// }
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { user } = useAuth();
  return (
    <div className="card">
      <h2 className="page-title">Welcome{user ? `, ${user.email}` : ''}</h2>
      <p className="text-gray-600">Use the navigation above to manage customers, vehicles, service requests and bills.</p>
    </div>
  );
}