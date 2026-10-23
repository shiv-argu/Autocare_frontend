import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getServiceRequests } from '../api/serviceRequests';
import { getVehicles } from '../api/vehicles';
import { getMechanics } from '../api/mechanics';

const badge = {
  pending: 'bg-yellow-100 text-yellow-800',
  in_progress: 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
};

export default function MyRequests() {
  const [requests, setRequests] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [mechanics, setMechanics] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getServiceRequests(), getVehicles(), getMechanics()])
      .then(([r, v, m]) => {
        setRequests(r);
        setVehicles(v);
        setMechanics(m);
      })
      .catch(() => setError('Failed to load your service requests'))
      .finally(() => setLoading(false));
  }, []);

  const vehicleLabel = (id) => {
    const v = vehicles.find((x) => x.vehicle_id === id);
    return v ? `${v.vehicle_name} (${v.reg_no || 'no reg'})` : id;
  };

  const mechanicLabel = (id) => mechanics.find((x) => x.mechanic_id === id)?.mechanic_name ?? id;

  return (
    <div>
      <h2 className="page-title">My Service Requests</h2>

      {error && <p className="error-text">{error}</p>}

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : requests.length === 0 ? (
        <div className="card text-gray-600">
          No service requests yet. When you bring a vehicle in, the service center will create one here.
        </div>
      ) : (
        <div className="card overflow-x-auto p-0">
          <table className="table">
            <thead>
              <tr><th>Request</th><th>Vehicle</th><th>Mechanic</th><th>Date</th><th>Status</th></tr>
            </thead>
            <tbody>
              {requests.map((r) => (
                <tr key={r.service_request_id}>
                  <td>
                    <Link to={`/my/requests/${r.service_request_id}`} className="text-blue-600 hover:underline">
                      #{r.service_request_id}
                    </Link>
                  </td>
                  <td>{vehicleLabel(r.vehicle_id)}</td>
                  <td>{mechanicLabel(r.mechanic_id)}</td>
                  <td>{r.request_date}</td>
                  <td>
                    <span className={`rounded px-2 py-0.5 text-xs font-medium ${badge[r.status] || 'bg-gray-100 text-gray-700'}`}>
                      {r.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}