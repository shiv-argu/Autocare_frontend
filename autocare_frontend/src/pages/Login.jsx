import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      navigate('/');
    } catch {
      setError('Incorrect email or password');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <form onSubmit={handleSubmit} className="card w-full max-w-sm space-y-4">
        <h2 className="text-2xl font-semibold text-gray-900">AutoCare Login</h2>

        <div>
          <label className="field-label">Email</label>
          <input
            className="input w-full"
            type="email"
            autoComplete="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="field-label">Password</label>
          <input
            className="input w-full"
            type="password"
            autoComplete="current-password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {error && <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

        <button type="submit" className="btn w-full">Login</button>

        <p className="text-center text-sm text-gray-500">
          New here?{' '}
          <Link to="/signup" className="text-blue-600 hover:underline">Create an account</Link>
        </p>
      </form>
    </div>
  );
}