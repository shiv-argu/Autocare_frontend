import { useEffect, useState } from 'react';
import { getCustomers, createCustomer } from '../api/customers';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Customers() {
  const { user } = useAuth();
  const [customers, setCustomers] = useState([]);
  const [form, setForm] = useState({ customer_name: '', phone: '', email: '' });
  const [error, setError] = useState('');


  const load = async () => {
    try {
      setCustomers(await getCustomers());
    } catch {
      setError('Failed to load customers');
    }
  };

  useEffect(() => 
    {
    load();
    }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await createCustomer(form);
      setForm({ customer_name: '', phone: '', email: '' });
      load();
    } catch {
      setError('Failed to create customer');
    }
  };

  return (
    <div>
      <h2 className="page-title">Customers</h2>

      {user?.role === 'staff' && (
        <form onSubmit={handleSubmit} className="card mb-6 flex flex-wrap gap-3">
          <input className="input" name="customer_name" placeholder="Name" value={form.customer_name} onChange={handleChange} required />
          <input className="input" name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} />
          <input className="input" name="email" placeholder="Email" value={form.email} onChange={handleChange} />
          <button type="submit" className="btn">Add</button>
        </form>
      )}

      {error && <p className="error-text">{error}</p>}

      <div className="card overflow-x-auto p-0">
        <table className="table">
          <thead>
            <tr><th>ID</th><th>Name</th><th>Phone</th><th>Email</th></tr>
          </thead>
          <tbody>
            {customers.map((c) => (
              <tr key={c.customer_id}>
                <td>{c.customer_id}</td>
                <td>
                  <Link to={`/customers/${c.customer_id}/vehicles`} className="text-blue-600 hover:underline">
                    {c.customer_name}
                  </Link>
                </td>
                <td>{c.phone}</td>
                <td>{c.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}