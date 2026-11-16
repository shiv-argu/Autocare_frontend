import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getCustomer } from '../api/customers';
import { getCustomerVehicles, createVehicle } from '../api/vehicles';

const emptyForm = { vehicle_name: '', model_no: '', reg_no: '' };

export default function CustomerVehicles() {
  const { id } = useParams();
  const [customer, setCustomer] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      setCustomer(await getCustomer(id));
      setVehicles(await getCustomerVehicles(id));
    } catch {
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [id]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await createVehicle({ ...form, customer_id: Number(id) });
      setForm(emptyForm);
      load();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to add vehicle');
    }
  };

  const contact = [customer?.phone, customer?.email].filter(Boolean).join(' · ');

  return (
    <div className="space-y-6">
      <Link to="/customers" className="text-sm text-blue-600 hover:underline">
        &larr; Back to customers
      </Link>

      <div>
        <h2 className="page-title mb-1">{customer ? customer.customer_name : 'Customer'}</h2>
        <p className="text-sm text-gray-500">{contact || 'Vehicles registered to this customer'}</p>
      </div>

      <form onSubmit={handleSubmit} className="card">
        <h3 className="section-title">Register a vehicle</h3>
        <div className="flex flex-wrap items-end gap-3">
          <div className="min-w-[12rem] flex-1">
            <label className="field-label">Vehicle name</label>
            <input className="input w-full" name="vehicle_name" placeholder="e.g. Honda City" value={form.vehicle_name} onChange={handleChange} required />
          </div>
          <div className="min-w-[10rem] flex-1">
            <label className="field-label">Model no</label>
            <input className="input w-full" name="model_no" placeholder="Model no" value={form.model_no} onChange={handleChange} />
          </div>
          <div className="min-w-[10rem] flex-1">
            <label className="field-label">Registration no</label>
            <input className="input w-full" name="reg_no" placeholder="Reg no" value={form.reg_no} onChange={handleChange} />
          </div>
          <button type="submit" className="btn">Add vehicle</button>
        </div>
      </form>

      {error && <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : vehicles.length === 0 ? (
        <div className="card text-gray-600">No vehicles registered for this customer yet.</div>
      ) : (
        <div className="card overflow-x-auto p-0">
          <table className="table">
            <thead>
              <tr>
                <th>Vehicle</th>
                <th>Model</th>
                <th>Reg No</th>
                <th className="text-right">History</th>
              </tr>
            </thead>
            <tbody>
              {vehicles.map((v) => (
                <tr key={v.vehicle_id}>
                  <td className="font-medium text-gray-900">{v.vehicle_name}</td>
                  <td>{v.model_no || '—'}</td>
                  <td>{v.reg_no || '—'}</td>
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