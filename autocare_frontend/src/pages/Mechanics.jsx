import { useEffect, useState } from 'react';
import { getMechanics, createMechanic } from '../api/mechanics';

const emptyForm = { mechanic_name: '', phone: '', years_experience: '' };

export default function Mechanics() {
  const [mechanics, setMechanics] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      setMechanics(await getMechanics());
    } catch {
      setError('Failed to load mechanics');
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
      await createMechanic({
        mechanic_name: form.mechanic_name,
        phone: form.phone || null,
        years_experience: form.years_experience === '' ? null : Number(form.years_experience),
      });
      setForm(emptyForm);
      load();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create mechanic');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="page-title mb-1">Mechanics</h2>
        <p className="text-sm text-gray-500">The team that works on service requests.</p>
      </div>

      <form onSubmit={handleSubmit} className="card">
        <h3 className="section-title">Add mechanic</h3>
        <div className="flex flex-wrap items-end gap-3">
          <div className="min-w-[12rem] flex-1">
            <label className="field-label">Name</label>
            <input className="input w-full" name="mechanic_name" placeholder="Full name" value={form.mechanic_name} onChange={handleChange} required />
          </div>
          <div className="min-w-[10rem] flex-1">
            <label className="field-label">Phone</label>
            <input className="input w-full" name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} />
          </div>
          <div className="w-36">
            <label className="field-label">Experience (yrs)</label>
            <input className="input w-full" name="years_experience" type="number" min="0" placeholder="Years" value={form.years_experience} onChange={handleChange} />
          </div>
          <button type="submit" className="btn">Add mechanic</button>
        </div>
      </form>

      {error && <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : mechanics.length === 0 ? (
        <div className="card text-gray-600">No mechanics added yet.</div>
      ) : (
        <div className="card overflow-x-auto p-0">
          <table className="table">
            <thead>
              <tr>
                <th>Mechanic</th>
                <th>Phone</th>
                <th>Experience</th>
              </tr>
            </thead>
            <tbody>
              {mechanics.map((m) => (
                <tr key={m.mechanic_id}>
                  <td>
                    <div className="font-medium text-gray-900">{m.mechanic_name}</div>
                    <div className="text-xs text-gray-500">ID {m.mechanic_id}</div>
                  </td>
                  <td>{m.phone || '—'}</td>
                  <td>
                    {m.years_experience === null || m.years_experience === undefined
                      ? '—'
                      : `${m.years_experience} yr${m.years_experience === 1 ? '' : 's'}`}
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