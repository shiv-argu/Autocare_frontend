import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getSpares, createSpare } from '../api/spares';
import { money } from '../utils/format';

const emptyForm = { spare_name: '', stock: '', price: '' };

const stockBadge = (n) => {
  const v = n ?? 0;
  if (v <= 0) return ['bg-red-100 text-red-800 ring-red-200', 'Out of stock'];
  if (v < 5) return ['bg-amber-100 text-amber-800 ring-amber-200', `${v} · low`];
  return ['bg-green-100 text-green-800 ring-green-200', String(v)];
};

export default function Spares() {
  const { user } = useAuth();
  const isStaff = user?.role === 'staff';

  const [spares, setSpares] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      setSpares(await getSpares());
    } catch {
      setError('Failed to load spares');
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
      await createSpare({
        spare_name: form.spare_name,
        stock: form.stock === '' ? 0 : Number(form.stock),
        price: form.price === '' ? null : Number(form.price),
      });
      setForm(emptyForm);
      load();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create spare');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="page-title mb-1">Spares</h2>
        <p className="text-sm text-gray-500">Spare parts inventory. Low stock is highlighted.</p>
      </div>

      {isStaff && (
        <form onSubmit={handleSubmit} className="card">
          <h3 className="section-title">Add spare</h3>
          <div className="flex flex-wrap items-end gap-3">
            <div className="min-w-[14rem] flex-1">
              <label className="field-label">Spare name</label>
              <input className="input w-full" name="spare_name" placeholder="e.g. Brake Pad Set" value={form.spare_name} onChange={handleChange} required />
            </div>
            <div className="w-32">
              <label className="field-label">Stock</label>
              <input className="input w-full" name="stock" type="number" min="0" placeholder="0" value={form.stock} onChange={handleChange} />
            </div>
            <div className="w-40">
              <label className="field-label">Unit price</label>
              <input className="input w-full" name="price" type="number" min="0" step="0.01" placeholder="Price" value={form.price} onChange={handleChange} />
            </div>
            <button type="submit" className="btn">Add spare</button>
          </div>
        </form>
      )}

      {error && <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : spares.length === 0 ? (
        <div className="card text-gray-600">No spares added yet.</div>
      ) : (
        <div className="card overflow-x-auto p-0">
          <table className="table">
            <thead>
              <tr>
                <th>Spare</th>
                <th>Stock</th>
                <th className="text-right">Unit price</th>
              </tr>
            </thead>
            <tbody>
              {spares.map((s) => {
                const [cls, label] = stockBadge(s.stock);
                return (
                  <tr key={s.spare_id}>
                    <td>
                      <div className="font-medium text-gray-900">{s.spare_name}</div>
                      <div className="text-xs text-gray-500">ID {s.spare_id}</div>
                    </td>
                    <td>
                      <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${cls}`}>
                        {label}
                      </span>
                    </td>
                    <td className="text-right tabular-nums">{money(s.price)}</td>
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