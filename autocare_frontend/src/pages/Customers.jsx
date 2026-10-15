import { useEffect, useState } from 'react';
import { getCustomers, createCustomer } from '../api/customers';
import { Link } from 'react-router-dom';

export default function Customers() {
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
    <div style={{ maxWidth: 700, margin: '40px auto' }}>
      <h2>Customers</h2>

      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        <input name="customer_name" placeholder="Name" value={form.customer_name} onChange={handleChange} required />
        <input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} />
        <input name="email" placeholder="Email" value={form.email} onChange={handleChange} />
        <button type="submit">Add</button>
      </form>
      
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <table border="1" cellPadding="6" style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr><th>ID</th><th>Name</th><th>Phone</th><th>Email</th></tr>
        </thead>
        <tbody>
          {customers.map((c) => (
            <tr key={c.customer_id}>
              <td>{c.customer_id}</td>
              <td><Link to={`/customers/${c.customer_id}/vehicles`}>{c.customer_name}</Link></td>
              <td>{c.phone}</td>
              <td>{c.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}