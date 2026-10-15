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

  const load = async () => {
    try {
      setCustomer(await getCustomer(id));
      setVehicles(await getCustomerVehicles(id));
    } catch {
      setError('Failed to load data');
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
    } catch {
      setError('Failed to add vehicle');
    }
  };

  return (
    <div style={{ maxWidth: 700, margin: '40px auto' }}>
      <Link to="/customers">&larr; Back to customers</Link>
      <h2>{customer ? `${customer.customer_name}'s vehicles` : 'Vehicles'}</h2>

      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        <input name="vehicle_name" placeholder="Vehicle name" value={form.vehicle_name} onChange={handleChange} required />
        <input name="model_no" placeholder="Model no" value={form.model_no} onChange={handleChange} />
        <input name="reg_no" placeholder="Reg no" value={form.reg_no} onChange={handleChange} />
        <button type="submit">Add</button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <table border="1" cellPadding="6" style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr><th>ID</th><th>Name</th><th>Model</th><th>Reg No</th></tr>
        </thead>
        <tbody>
          {vehicles.map((v) => (
            <tr key={v.vehicle_id}>
              <td>{v.vehicle_id}</td>
              <td>{v.vehicle_name}</td>
              <td>{v.model_no}</td>
              <td>{v.reg_no}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}