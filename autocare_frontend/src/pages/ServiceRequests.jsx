import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { getServiceRequests, createServiceRequest } from '../api/serviceRequests';
import { getVehicles } from '../api/vehicles';
import { getMechanics } from '../api/mechanics';
import StatusBadge from '../components/StatusBadge';

const tabs = [
  ['all', 'All'],
  ['pending', 'Pending'],
  ['in_progress', 'In progress'],
  ['completed', 'Completed'],
];

export default function ServiceRequests() {
  const [requests, setRequests] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [mechanics, setMechanics] = useState([]);
  const [form, setForm] = useState({ vehicle_id: '', mechanic_id: '' });
  const [filter, setFilter] = useState('all');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const [r, v, m] = await Promise.all([getServiceRequests(), getVehicles(), getMechanics()]);
      setRequests(r);
      setVehicles(v);
      setMechanics(m);
    } catch {
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await createServiceRequest({
        vehicle_id: Number(form.vehicle_id),
        mechanic_id: Number(form.mechanic_id),
      });
      setForm({ vehicle_id: '', mechanic_id: '' });
      load();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create service request');
    }
  };

  const vehicleOf = (id) => vehicles.find((x) => x.vehicle_id === id);
  const mechanicName = (id) => mechanics.find((x) => x.mechanic_id === id)?.mechanic_name ?? `#${id}`;

  const counts = useMemo(() => {
    const c = { all: requests.length, pending: 0, in_progress: 0, completed: 0 };
    requests.forEach((r) => {
      if (c[r.status] !== undefined) c[r.status] += 1;
    });
    return c;
  }, [requests]);

  const visible = useMemo(
    () =>
      requests
        .filter((r) => filter === 'all' || r.status === filter)
        .sort((a, b) => b.service_request_id - a.service_request_id),
    [requests, filter]
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="page-title mb-1">Service Requests</h2>
        <p className="text-sm text-gray-500">Create tickets and track their progress.</p>
      </div>

      <form onSubmit={handleSubmit} className="card">
        <h3 className="section-title">New service request</h3>
        <div className="flex flex-wrap items-end gap-3">
          <div className="min-w-[14rem] flex-1">
            <label className="field-label">Vehicle</label>
            <select name="vehicle_id" className="input w-full" value={form.vehicle_id} onChange={handleChange} required>
              <option value="">Select vehicle</option>
              {vehicles.map((v) => (
                <option key={v.vehicle_id} value={v.vehicle_id}>
                  {v.vehicle_name} ({v.reg_no || 'no reg'})
                </option>
              ))}
            </select>
          </div>

          <div className="min-w-[14rem] flex-1">
            <label className="field-label">Mechanic</label>
            <select name="mechanic_id" className="input w-full" value={form.mechanic_id} onChange={handleChange} required>
              <option value="">Select mechanic</option>
              {mechanics.map((m) => (
                <option key={m.mechanic_id} value={m.mechanic_id}>
                  {m.mechanic_name}
                </option>
              ))}
            </select>
          </div>

          <button type="submit" className="btn">Create request</button>
        </div>
      </form>

      {error && <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

      <div className="flex flex-wrap gap-2">
        {tabs.map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => setFilter(key)}
            className={`cursor-pointer rounded-full px-3 py-1 text-sm font-medium ${
              filter === key
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 ring-1 ring-inset ring-gray-300 hover:bg-gray-50'
            }`}
          >
            {label} <span className="ml-1 opacity-70">{counts[key]}</span>
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : visible.length === 0 ? (
        <div className="card text-gray-600">No service requests in this view.</div>
      ) : (
        <div className="card overflow-x-auto p-0">
          <table className="table">
            <thead>
              <tr>
                <th>Ticket</th>
                <th>Vehicle</th>
                <th>Mechanic</th>
                <th>Date</th>
                <th>Status</th>
                <th className="text-right">Details</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((r) => {
                const v = vehicleOf(r.vehicle_id);
                return (
                  <tr key={r.service_request_id}>
                    <td className="font-semibold text-gray-900">#{r.service_request_id}</td>
                    <td>
                      <div className="font-medium text-gray-900">{v ? v.vehicle_name : `#${r.vehicle_id}`}</div>
                      <div className="text-xs text-gray-500">{v?.reg_no || 'no reg'}</div>
                    </td>
                    <td>{mechanicName(r.mechanic_id)}</td>
                    <td className="whitespace-nowrap text-gray-600">{r.request_date}</td>
                    <td><StatusBadge status={r.status} /></td>
                    <td className="text-right">
                      <Link to={`/service-requests/${r.service_request_id}`} className="btn-secondary">
                        View
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}