import { useEffect, useState } from 'react';
import { signup } from '../api/auth';
import { getMechanics } from '../api/mechanics';

const roles = [
  ['customer', 'Customer'],
  ['mechanic', 'Mechanic'],
  ['staff', 'Staff'],
];

const emptyForm = {
  email: '',
  password: '',
  confirm: '',
  customer_name: '',
  mechanic_name: '',
  phone: '',
  years_experience: '',
  mechanic_id: '',
};

const pill = (active) =>
  `cursor-pointer rounded-full px-3 py-1 text-sm font-medium ${
    active
      ? 'bg-blue-600 text-white'
      : 'bg-white text-gray-600 ring-1 ring-inset ring-gray-300 hover:bg-gray-50'
  }`;

export default function CreateUser() {
  const [role, setRole] = useState('customer');
  const [mechanicMode, setMechanicMode] = useState('new');
  const [form, setForm] = useState(emptyForm);
  const [mechanics, setMechanics] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const loadMechanics = () => getMechanics().then(setMechanics).catch(() => {});

  useEffect(() => {
    loadMechanics();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (form.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (form.password !== form.confirm) {
      setError('Passwords do not match');
      return;
    }

    const email = form.email.trim();
    const payload = { email, password: form.password, role };

    if (role === 'customer' && form.customer_name.trim()) {
      payload.customer_name = form.customer_name.trim();
    }

    if (role === 'mechanic') {
      if (mechanicMode === 'existing') {
        if (!form.mechanic_id) {
          setError('Choose a mechanic to link');
          return;
        }
        payload.mechanic_id = Number(form.mechanic_id);
      } else {
        payload.mechanic_name = form.mechanic_name.trim();
        payload.phone = form.phone.trim() || null;
        payload.years_experience =
          form.years_experience === '' ? null : Number(form.years_experience);
      }
    }

    setSubmitting(true);
    try {
      await signup(payload);
      setSuccess(`Created ${role} account for ${email}`);
      setForm(emptyForm);
      if (role === 'mechanic') loadMechanics();
    } catch (err) {
      const detail = err.response?.data?.detail;
      setError(typeof detail === 'string' ? detail : 'Please check the details and try again');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="page-title mb-1">Add User</h2>
        <p className="text-sm text-gray-500">Create login accounts for customers, mechanics and staff.</p>
      </div>

      <form onSubmit={handleSubmit} className="card max-w-2xl space-y-5">
        <div>
          <label className="field-label">Role</label>
          <div className="flex flex-wrap gap-2">
            {roles.map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => {
                  setRole(key);
                  setError('');
                  setSuccess('');
                }}
                className={pill(role === key)}
              >
                {label}
              </button>
            ))}
          </div>
          {role === 'staff' && (
            <p className="mt-2 rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-800">
              Staff accounts have full access, including creating other accounts. Only add people you trust.
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="field-label">Email</label>
            <input
              className="input w-full"
              name="email"
              type="email"
              autoComplete="off"
              placeholder="name@example.com"
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
        </div>

        {role === 'customer' && (
          <div className="border-t border-gray-100 pt-4">
            <label className="field-label">Customer name</label>
            <input
              className="input w-full"
              name="customer_name"
              placeholder="Full name (defaults to the email if left blank)"
              value={form.customer_name}
              onChange={handleChange}
            />
          </div>
        )}

        {role === 'mechanic' && (
          <div className="space-y-4 border-t border-gray-100 pt-4">
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={() => setMechanicMode('new')} className={pill(mechanicMode === 'new')}>
                New mechanic
              </button>
              <button type="button" onClick={() => setMechanicMode('existing')} className={pill(mechanicMode === 'existing')}>
                Link existing mechanic
              </button>
            </div>

            {mechanicMode === 'new' ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="sm:col-span-3">
                  <label className="field-label">Mechanic name</label>
                  <input
                    className="input w-full"
                    name="mechanic_name"
                    placeholder="Full name"
                    value={form.mechanic_name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="field-label">Phone</label>
                  <input
                    className="input w-full"
                    name="phone"
                    placeholder="Phone"
                    value={form.phone}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="field-label">Experience (yrs)</label>
                  <input
                    className="input w-full"
                    name="years_experience"
                    type="number"
                    min="0"
                    placeholder="Years"
                    value={form.years_experience}
                    onChange={handleChange}
                  />
                </div>
              </div>
            ) : (
              <div>
                <label className="field-label">Existing mechanic</label>
                <select
                  className="input w-full"
                  name="mechanic_id"
                  value={form.mechanic_id}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select mechanic</option>
                  {mechanics.map((m) => (
                    <option key={m.mechanic_id} value={m.mechanic_id}>
                      {m.mechanic_name} (ID {m.mechanic_id})
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-xs text-gray-500">
                  Use this for a mechanic already added on the Mechanics page who doesn't have a login yet.
                </p>
              </div>
            )}
          </div>
        )}

        {error && <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
        {success && <p className="rounded-md bg-green-50 px-3 py-2 text-sm text-green-700">{success}</p>}

        <button type="submit" className="btn" disabled={submitting}>
          {submitting ? 'Creating...' : `Create ${role} account`}
        </button>
      </form>
    </div>
  );
}