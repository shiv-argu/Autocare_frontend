import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getVehicles, createVehicle } from '../api/vehicles';

const emptyForm = { vehicle_name: '', model_no: '', reg_no: '' };

export default function MyVehicles() {
  const { user } = useAuth();
  const [vehicles, setVehicles] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      setVehicles(await getVehicles());
    } catch {
      setError('Failed to load your vehicles');
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
      await createVehicle({ ...form, customer_id: user.customer_id });
      setForm(emptyForm);
      load();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to register vehicle');
    }
  };

  if (user.customer_id == null) {
    return (
      <div className="card">
        <p className="text-gray-600">
          Your account isn't linked to a customer profile yet. Please contact the service center.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="page-title">My Vehicles</h2>

      <form onSubmit={handleSubmit} className="card mb-6">
        <h3 className="mb-3 font-semibold text-gray-800">Register a vehicle</h3>
        <div className="flex flex-wrap gap-3">
          <input className="input" name="vehicle_name" placeholder="Vehicle name (e.g. Honda City)" value={form.vehicle_name} onChange={handleChange} required />
          <input className="input" name="model_no" placeholder="Model no" value={form.model_no} onChange={handleChange} />
          <input className="input" name="reg_no" placeholder="Registration no" value={form.reg_no} onChange={handleChange} />
          <button type="submit" className="btn">Register</button>
        </div>
      </form>

      {error && <p className="error-text">{error}</p>}

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : vehicles.length === 0 ? (
        <div className="card text-gray-600">No vehicles registered yet. Add your first one above.</div>
      ) : (
        <div className="card overflow-x-auto p-0">
          <table className="table">
            <thead>
              <tr><th>Vehicle</th><th>Model</th><th>Reg No</th></tr>
            </thead>
            <tbody>
              {vehicles.map((v) => (
                <tr key={v.vehicle_id}>
                  <td>{v.vehicle_name}</td>
                  <td>{v.model_no}</td>
                  <td>{v.reg_no}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}