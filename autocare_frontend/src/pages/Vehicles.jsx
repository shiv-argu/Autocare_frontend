import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { getVehicles } from '../api/vehicles';
import { getCustomers } from '../api/customers';

export default function Vehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [query, setQuery] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getVehicles(), getCustomers()])
      .then(([v, c]) => {
        setVehicles(v);
        setCustomers(c);
      })
      .catch(() => setError('Failed to load vehicles'))
      .finally(() => setLoading(false));
  }, []);

  const ownerName = (id) =>
    customers.find((c) => c.customer_id === id)?.customer_name ?? `#${id}`;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return vehicles;
    return vehicles.filter((v) =>
      [v.vehicle_name, v.model_no, v.reg_no, ownerName(v.customer_id)].some((x) =>
        (x || '').toLowerCase().includes(q)
      )
    );
  }, [vehicles, customers, query]);

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="page-title mb-0">Vehicles</h2>
        <input
          className="input w-full sm:w-72"
          placeholder="Search by name, reg no or owner"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {error && <p className="error-text">{error}</p>}

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : filtered.length === 0 ? (
        <div className="card text-gray-600">No vehicles found.</div>
      ) : (
        <div className="card overflow-x-auto p-0">
          <table className="table">
            <thead>
              <tr>
                <th>Vehicle</th>
                <th>Model</th>
                <th>Reg No</th>
                <th>Owner</th>
                <th className="text-right">History</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((v) => (
                <tr key={v.vehicle_id}>
                  <td className="font-medium text-gray-900">{v.vehicle_name}</td>
                  <td>{v.model_no}</td>
                  <td>{v.reg_no}</td>
                  <td>
                    <Link to={`/customers/${v.customer_id}/vehicles`} className="text-blue-600 hover:underline">
                      {ownerName(v.customer_id)}
                    </Link>
                  </td>
                  <td className="text-right">
                    <Link to={`/vehicles/${v.vehicle_id}/history`} className="btn-secondary">
                      History
                    </Link>
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