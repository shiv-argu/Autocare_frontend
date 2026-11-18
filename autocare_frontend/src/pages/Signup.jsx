import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { signup } from '../api/auth';

export default function Signup() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ customer_name: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (form.password !== form.confirm) {
      setError('Passwords do not match');
      return;
    }

    const email = form.email.trim();
    setSubmitting(true);

    try {
      await signup({
        customer_name: form.customer_name.trim(),
        email,
        password: form.password,
      });
    } catch (err) {
      const detail = err.response?.data?.detail;
      setError(typeof detail === 'string' ? detail : 'Please check your details and try again');
      setSubmitting(false);
      return;
    }

    try {
      await login(email, form.password);
      navigate('/');
    } catch {
      navigate('/login');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-8">
      <form onSubmit={handleSubmit} className="card w-full max-w-sm space-y-4">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Create your account</h2>
          <p className="mt-1 text-sm text-gray-500">Register to track your vehicles and service requests.</p>
        </div>

        <div>
          <label className="field-label">Full name</label>
          <input
            className="input w-full"
            name="customer_name"
            autoComplete="name"
            placeholder="Your name"
            value={form.customer_name}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="field-label">Email</label>
          <input
            className="input w-full"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="field-label">Password</label>
          <input
            className="input w-full"
            name="password"
            type="password"
            autoComplete="new-password"
            placeholder="At least 6 characters"
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="field-label">Confirm password</label>
          <input
            className="input w-full"
            name="confirm"
            type="password"
            autoComplete="new-password"
            placeholder="Repeat password"
            value={form.confirm}
            onChange={handleChange}
            required
          />
        </div>

        {error && <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

        <button type="submit" className="btn w-full" disabled={submitting}>
          {submitting ? 'Creating account...' : 'Sign up'}
        </button>

        <p className="text-center text-sm text-gray-500">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 hover:underline">Log in</Link>
        </p>
      </form>
    </div>
  );
}