import { useEffect, useState } from 'react';
import { getSpares, createSpare } from '../api/spares';
import { useAuth } from '../context/AuthContext';

const emptyForm = { spare_name: '', stock: '', price: '' };

export default function Spares() {
  const { user } = useAuth();
  const isStaff = user?.role === 'staff';

  const [spares, setSpares] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');

  const load = async () => {
    try {
      setSpares(await getSpares());
    } catch {
      setError('Failed to load spares');
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
      await createSpare({
        spare_name: form.spare_name,
        stock: form.stock === '' ? 0 : Number(form.stock),
        price: form.price === '' ? null : Number(form.price),
      });
      setForm(emptyForm);
      load();
    } catch (e) {
      setError(e.response?.data?.detail || 'Failed to create spare');
    }
  };

  return (
    <div style={{ maxWidth: 700, margin: '40px auto' }}>
      <h2>Spares</h2>

      {isStaff && (
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
          <input name="spare_name" placeholder="Spare name" value={form.spare_name} onChange={handleChange} required />
          <input name="stock" type="number" min="0" placeholder="Stock" value={form.stock} onChange={handleChange} />
          <input name="price" type="number" min="0" step="0.01" placeholder="Price" value={form.price} onChange={handleChange} />
          <button type="submit">Add</button>
        </form>
      )}

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <table border="1" cellPadding="6" style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr><th>ID</th><th>Spare</th><th>Stock</th><th>Price</th></tr>
        </thead>
        <tbody>
          {spares.map((s) => (
            <tr key={s.spare_id}>
              <td>{s.spare_id}</td>
              <td>{s.spare_name}</td>
              <td style={{ color: s.stock < 5 ? 'red' : 'inherit' }}>{s.stock}</td>
              <td>{s.price}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}