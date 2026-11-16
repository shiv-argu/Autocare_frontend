import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getBills } from '../api/bills';
import StatusBadge from '../components/StatusBadge';
import { money } from '../utils/format';

export default function Bills() {
  const { user } = useAuth();
  const isStaff = user?.role === 'staff';
  const base = isStaff ? '/service-requests' : '/my/requests';

  const [bills, setBills] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBills()
      .then(setBills)
      .catch(() => setError('Failed to load bills'))
      .finally(() => setLoading(false));
  }, []);

  const sorted = useMemo(() => [...bills].sort((a, b) => b.bill_id - a.bill_id), [bills]);

  const stats = useMemo(
    () => ({
      count: bills.length,
      total: bills.reduce((sum, b) => sum + Number(b.amount || 0), 0),
      unpaid: bills.filter((b) => b.status === 'unpaid').length,
    }),
    [bills]
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="page-title mb-1">{isStaff ? 'Bills' : 'My Bills'}</h2>
        <p className="text-sm text-gray-500">
          {isStaff ? 'Bills generated for completed service requests.' : 'Bills for your completed services.'}
        </p>
      </div>

      {error && <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

      {!loading && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="card">
            <p className="field-label">Bills</p>
            <p className="text-2xl font-semibold text-gray-900">{stats.count}</p>
          </div>
          <div className="card">
            <p className="field-label">Total billed</p>
            <p className="text-2xl font-semibold text-gray-900">{money(stats.total)}</p>
          </div>
          <div className="card">
            <p className="field-label">Unpaid</p>
            <p className="text-2xl font-semibold text-gray-900">{stats.unpaid}</p>
          </div>
        </div>
      )}

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : sorted.length === 0 ? (
        <div className="card text-gray-600">No bills yet.</div>
      ) : (
        <div className="card overflow-x-auto p-0">
          <table className="table">
            <thead>
              <tr>
                <th>Bill</th>
                <th>Ticket</th>
                <th>Date</th>
                <th className="text-right">Amount</th>
                <th>Status</th>
                <th className="text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((b) => (
                <tr key={b.bill_id}>
                  <td className="font-semibold text-gray-900">#{b.bill_id}</td>
                  <td>#{b.service_request_id}</td>
                  <td className="whitespace-nowrap text-gray-600">{b.bill_date}</td>
                  <td className="text-right font-medium tabular-nums text-gray-900">{money(b.amount)}</td>
                  <td><StatusBadge status={b.status} /></td>
                  <td className="text-right">
                    <Link to={`${base}/${b.service_request_id}`} className="btn-secondary">
                      View ticket
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