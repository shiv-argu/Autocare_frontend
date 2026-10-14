import { useAuth } from '../context/AuthContext';
import FetchData from '../components/Fetch';
import { Link } from 'react-router-dom';

export default function Home() {
    const { logout } = useAuth();

    return (
        <div>
            <h2>Logged in</h2>
            
            <nav>
                 <Link to="/customers">Customers</Link>
            </nav>
            <button onClick={logout}>Logout</button>
            <FetchData />
        </div>
    );
}
