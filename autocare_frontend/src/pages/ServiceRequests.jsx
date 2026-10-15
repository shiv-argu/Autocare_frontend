import { useEffect, useState } from 'react';
import { getServiceRequests, createServiceRequest } from '../api/serviceRequests';
import { getVehicles } from '../api/vehicles';
import { getMechanics } from '../api/mechanics';
import { Link } from 'react-router-dom';


export default function ServiceRequests() {
  const [requests, setRequests] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [mechanics, setMechanics] = useState([]);
  const [form, setForm] = useState({ vehicle_id: '', mechanic_id: '' });
  const [error, setError] = useState('');

  const load = async () => {
    try {
      const [r, v, m] = await Promise.all([getServiceRequests(), getVehicles(), getMechanics()]);
      setRequests(r);
      setVehicles(v);
      setMechanics(m);
    } catch {
      setError('Failed to load data');
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
    } catch {
      setError('Failed to create service request');
    }
  };

  const vehicleLabel = (id) => {
    const v = vehicles.find((x) => x.vehicle_id === id);
    return v ? `${v.vehicle_name} (${v.reg_no || 'no reg'})` : id;
  };

  const mechanicLabel = (id) => {
    const m = mechanics.find((x) => x.mechanic_id === id);
    return m ? m.mechanic_name : id;
  };

  return (
    <div style={{ maxWidth: 800, margin: '40px auto' }}>
      <h2>Service Requests</h2>

      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        <select name="vehicle_id" value={form.vehicle_id} onChange={handleChange} required>
          <option value="">Select vehicle</option>
          {vehicles.map((v) => (
            <option key={v.vehicle_id} value={v.vehicle_id}>
              {v.vehicle_name} ({v.reg_no || 'no reg'})
            </option>
          ))}
        </select>

        <select name="mechanic_id" value={form.mechanic_id} onChange={handleChange} required>
          <option value="">Select mechanic</option>
          {mechanics.map((m) => (
            <option key={m.mechanic_id} value={m.mechanic_id}>
              {m.mechanic_name}
            </option>
          ))}
        </select>

        <button type="submit">Create request</button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <table border="1" cellPadding="6" style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr><th>ID</th><th>Vehicle</th><th>Mechanic</th><th>Date</th><th>Status</th></tr>
        </thead>
        <tbody>
          {requests.map((r) => (
            <tr key={r.service_request_id}>
              <td><Link to={`/service-requests/${r.service_request_id}`}>{r.service_request_id}</Link></td>
              <td>{vehicleLabel(r.vehicle_id)}</td>
              <td>{mechanicLabel(r.mechanic_id)}</td>
              <td>{r.request_date}</td>
              <td>{r.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}