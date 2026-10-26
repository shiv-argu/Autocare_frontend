import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getServiceRequests } from '../api/serviceRequests';

export default function MechanicHome() {
  const { user, logout } = useAuth();
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    getServiceRequests().then(setRequests).catch(() => {});
  }, []);

  return (
    <div className="mx-auto max-w-3xl p-8">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="page-title">My assigned requests</h2>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">{user?.email}</span>
          <button onClick={logout} className="btn-secondary">Logout</button>
        </div>
      </div>
      <div className="card overflow-x-auto p-0">
        <table className="table">
          <thead><tr><th>Request</th><th>Date</th><th>Status</th></tr></thead>
          <tbody>
            {requests.map((r) => (
              <tr key={r.service_request_id}>
                <td>
                  <Link to={`/mechanic/requests/${r.service_request_id}`} className="text-blue-600 hover:underline">
                    #{r.service_request_id}
                  </Link>
                </td>
                <td>{r.request_date}</td>
                <td>{r.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}