import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getVehicle } from '../api/vehicles';
import { getVehicleHistory } from '../api/history';
import Timeline from '../components/Timeline';

export default function VehicleHistory() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const ticketBase =
    user?.role === 'staff' ? '/service-requests'
    : user?.role === 'mechanic' ? '/mechanic/requests'
    : '/my/requests';

  useEffect(() => {
    Promise.all([getVehicle(id), getVehicleHistory(id)])
      .then(([v, t]) => {
        setVehicle(v);
        setTickets(t);
      })
      .catch((e) => setError(e.response?.data?.detail || 'Failed to load history'))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <div>
      <button onClick={() => navigate(-1)} className="mb-3 text-sm text-blue-600 hover:underline">
        &larr; Back
      </button>
      <h2 className="page-title">
        {vehicle ? `${vehicle.vehicle_name} (${vehicle.reg_no || 'no reg'}) — Service history` : 'Service history'}
      </h2>

      {error && <p className="error-text">{error}</p>}

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : tickets.length === 0 && !error ? (
        <div className="card text-gray-600">No service tickets for this vehicle yet.</div>
      ) : (
        <div className="space-y-6">
          {tickets.map((t) => (
            <div key={t.service_request_id} className="card">
              <div className="mb-3 flex items-center justify-between">
                <Link to={`${ticketBase}/${t.service_request_id}`} className="font-semibold text-blue-600 hover:underline">
                  Ticket #{t.service_request_id}
                </Link>
                <span className="text-sm text-gray-500">{t.request_date} · {t.status}</span>
              </div>
              <Timeline events={t.events} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}