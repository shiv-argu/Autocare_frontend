import { useEffect, useState } from 'react';
import { getServiceTypes, createServiceType } from '../api/serviceTypes';

const emptyForm = { service_name: '', price: '' };

export default function ServiceTypes() {
  const [services, setServices] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');

  const load = async () => {
    try {
      setServices(await getServiceTypes());
    } catch {
      setError('Failed to load service types');
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
        ...form,
        price: form.price === '' ? null : Number(form.price),
      });
      setForm(emptyForm);
      load();
    } catch {
      setError('Failed to create service type');
    }
  };

  return (
    <div style={{ maxWidth: 700, margin: '40px auto' }}>
      <h2>Service Types</h2>

      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        <input name="service_name" placeholder="Service name" value={form.service_name} onChange={handleChange} required />
        <input name="price" type="number" min="0" step="0.01" placeholder="Price" value={form.price} onChange={handleChange} />
        <button type="submit">Add</button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <table border="1" cellPadding="6" style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr><th>ID</th><th>Service</th><th>Price</th></tr>
        </thead>
        <tbody>
          {services.map((s) => (
            <tr key={s.service_id}>
              <td>{s.service_id}</td>
              <td>{s.service_name}</td>
              <td>{s.price}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}