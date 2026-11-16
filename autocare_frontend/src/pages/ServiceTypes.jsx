import { useEffect, useState } from 'react';
import { getServiceTypes, createServiceType } from '../api/serviceTypes';
import { money } from '../utils/format';

const emptyForm = { service_name: '', price: '' };

export default function ServiceTypes() {
  const [services, setServices] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      setServices(await getServiceTypes());
    } catch {
      setError('Failed to load service types');
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
      await createServiceType({
        service_name: form.service_name,
        price: form.price === '' ? null : Number(form.price),
      });
      setForm(emptyForm);
      load();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create service type');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="page-title mb-1">Service Types</h2>
        <p className="text-sm text-gray-500">The catalog of services and their standard prices.</p>
      </div>

      <form onSubmit={handleSubmit} className="card">
        <h3 className="section-title">Add service type</h3>
        <div className="flex flex-wrap items-end gap-3">
          <div className="min-w-[14rem] flex-1">
            <label className="field-label">Service name</label>
            <input className="input w-full" name="service_name" placeholder="e.g. Oil Change" value={form.service_name} onChange={handleChange} required />
          </div>
          <div className="w-40">
            <label className="field-label">Price</label>
            <input className="input w-full" name="price" type="number" min="0" step="0.01" placeholder="Price" value={form.price} onChange={handleChange} />
          </div>
          <button type="submit" className="btn">Add service</button>
        </div>
      </form>

      {error && <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : services.length === 0 ? (
        <div className="card text-gray-600">No service types added yet.</div>
      ) : (
        <div className="card overflow-x-auto p-0">
          <table className="table">
            <thead>
              <tr>
                <th>Service</th>
                <th className="text-right">Price</th>
              </tr>
            </thead>
            <tbody>
              {services.map((s) => (
                <tr key={s.service_id}>
                  <td>
                    <div className="font-medium text-gray-900">{s.service_name}</div>
                    <div className="text-xs text-gray-500">ID {s.service_id}</div>
                  </td>
                  <td className="text-right tabular-nums">{money(s.price)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}