import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getCustomers, createCustomer } from '../api/customers';

const emptyForm = { customer_name: '', phone: '', email: '' };

export default function Customers() {
  const { user } = useAuth();
  const isStaff = user?.role === 'staff';

  const [customers, setCustomers] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [query, setQuery] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      setCustomers(await getCustomers());
    } catch {
      setError('Failed to load customers');
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
      await createCustomer({
        customer_name: form.customer_name,
        phone: form.phone || null,
        email: form.email || null,
      });
      setForm(emptyForm);
      load();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create customer');
    }
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return customers;
    return customers.filter((c) =>
      [c.customer_name, c.phone, c.email].some((x) => (x || '').toLowerCase().includes(q))
    );
  }, [customers, query]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="page-title mb-1">Customers</h2>
          <p className="text-sm text-gray-500">Registered customers and their vehicles.</p>
        </div>
        <input
          className="input w-full sm:w-72"
          placeholder="Search by name, phone or email"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {/* {isStaff && (
        <form onSubmit={handleSubmit} className="card">
          <h3 className="section-title">Add customer</h3>
          <div className="flex flex-wrap items-end gap-3">
            <div className="min-w-[12rem] flex-1">
              <label className="field-label">Name</label>
              <input className="input w-full" name="customer_name" placeholder="Full name" value={form.customer_name} onChange={handleChange} required />
            </div>
            <div className="min-w-[10rem] flex-1">
              <label className="field-label">Phone</label>
              <input className="input w-full" name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} />
            </div>
            <div className="min-w-[12rem] flex-1">
              <label className="field-label">Email</label>
              <input className="input w-full" name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} />
            </div>
            <button type="submit" className="btn">Add customer</button>
          </div>
        </form>
      )} */}

      {error && <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : filtered.length === 0 ? (
        <div className="card text-gray-600">No customers found.</div>
      ) : (
        <div className="card overflow-x-auto p-0">
          <table className="table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Phone</th>
                <th>Email</th>
                <th className="text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.customer_id}>
                  <td>
                    <div className="font-medium text-gray-900">{c.customer_name}</div>
                    <div className="text-xs text-gray-500">ID {c.customer_id}</div>
                  </td>
                  <td>{c.phone || '—'}</td>
                  <td>{c.email || '—'}</td>
                  <td className="text-right">
                    <Link to={`/customers/${c.customer_id}/vehicles`} className="btn-secondary">
                      Vehicles
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