import { useEffect, useState } from 'react';
import { getMechanics, createMechanic } from '../api/mechanics';

const emptyForm = { mechanic_name: '', phone: '', years_experience: '' };

export default function Mechanics() {
  const [mechanics, setMechanics] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');

  const load = async () => {
    try {
      setMechanics(await getMechanics());
    } catch {
      setError('Failed to load mechanics');
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
      await createMechanic({
        ...form,
        years_experience: form.years_experience === '' ? null : Number(form.years_experience),
      });
      setForm(emptyForm);
      load();
    } catch {
      setError('Failed to create mechanic');
    }
  };

  return (
    <div style={{ maxWidth: 700, margin: '40px auto' }}>
      <h2>Mechanics</h2>

      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        <input name="mechanic_name" placeholder="Name" value={form.mechanic_name} onChange={handleChange} required />
        <input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} />
        <input name="years_experience" type="number" min="0" placeholder="Years exp." value={form.years_experience} onChange={handleChange} />
        <button type="submit">Add</button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <table border="1" cellPadding="6" style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr><th>ID</th><th>Name</th><th>Phone</th><th>Experience (yrs)</th></tr>
        </thead>
        <tbody>
          {mechanics.map((m) => (
            <tr key={m.mechanic_id}>
              <td>{m.mechanic_id}</td>
              <td>{m.mechanic_name}</td>
              <td>{m.phone}</td>
              <td>{m.years_experience}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}