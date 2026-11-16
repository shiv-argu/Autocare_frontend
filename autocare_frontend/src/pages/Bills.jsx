import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getBills, payBill } from '../api/bills';
import StatusBadge from '../components/StatusBadge';
import { money } from '../utils/format';

const tabs = [
  ['all', 'All'],
  ['unpaid', 'Unpaid'],
  ['paid', 'Paid'],
];

const sum = (list) => list.reduce((total, b) => total + Number(b.amount || 0), 0);

export default function Bills() {
  const { user } = useAuth();
  const isStaff = user?.role === 'staff';
  const base = isStaff ? '/service-requests' : '/my/requests';

  const [bills, setBills] = useState([]);
  const [filter, setFilter] = useState('all');
  const [busyId, setBusyId] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      setBills(await getBills());
    } catch {
      setError('Failed to load bills');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handlePay = async (bill) => {
    if (!window.confirm(`Mark bill #${bill.bill_id} (${money(bill.amount)}) as paid?`)) return;
    setError('');
    setBusyId(bill.bill_id);
    try {
      await payBill(bill.bill_id);
      await load();
    } catch (e) {
      setError(e.response?.data?.detail || 'Failed to mark bill as paid');
    } finally {
      setBusyId(null);
    }
  };

  const stats = useMemo(() => {
    const paid = bills.filter((b) => b.status === 'paid');
    const unpaid = bills.filter((b) => b.status !== 'paid');
    return {
      total: sum(bills),
      paidAmount: sum(paid),
      paidCount: paid.length,
      unpaidAmount: sum(unpaid),
      unpaidCount: unpaid.length,
    };
  }, [bills]);

  const visible = useMemo(
    () =>
      [...bills]
        .filter((b) => filter === 'all' || (filter === 'paid' ? b.status === 'paid' : b.status !== 'paid'))
        .sort((a, b) => b.bill_id - a.bill_id),
    [bills, filter]
  );

  const countFor = (key) =>
    key === 'all' ? bills.length : key === 'paid' ? stats.paidCount : stats.unpaidCount;

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
            <p className="field-label">Total billed</p>
            <p className="text-2xl font-semibold text-gray-900">{money(stats.total)}</p>
            <p className="text-xs text-gray-500">{bills.length} bill{bills.length === 1 ? '' : 's'}</p>
          </div>
          <div className="card">
            <p className="field-label">Paid</p>
            <p className="text-2xl font-semibold text-green-700">{money(stats.paidAmount)}</p>
            <p className="text-xs text-gray-500">{stats.paidCount} bill{stats.paidCount === 1 ? '' : 's'}</p>
          </div>
          <div className="card">
            <p className="field-label">Unpaid</p>
            <p className="text-2xl font-semibold text-amber-700">{money(stats.unpaidAmount)}</p>
            <p className="text-xs text-gray-500">{stats.unpaidCount} bill{stats.unpaidCount === 1 ? '' : 's'}</p>
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {tabs.map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => setFilter(key)}
            className={`cursor-pointer rounded-full px-3 py-1 text-sm font-medium ${
              filter === key
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 ring-1 ring-inset ring-gray-300 hover:bg-gray-50'
            }`}
          >
            {label} <span className="ml-1 opacity-70">{countFor(key)}</span>
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : visible.length === 0 ? (
        <div className="card text-gray-600">No bills in this view.</div>
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
              {visible.map((b) => (
                <tr key={b.bill_id}>
                  <td className="font-semibold text-gray-900">#{b.bill_id}</td>
                  <td>#{b.service_request_id}</td>
                  <td className="whitespace-nowrap text-gray-600">{b.bill_date}</td>
                  <td className="text-right font-medium tabular-nums text-gray-900">{money(b.amount)}</td>
                  <td><StatusBadge status={b.status} /></td>
                  <td className="text-right">
                    <div className="flex justify-end gap-2">
                      {b.status !== 'paid' && (
                        <button
                          onClick={() => handlePay(b)}
                          disabled={busyId === b.bill_id}
                          className="btn"
                        >
                          {busyId === b.bill_id ? 'Saving...' : 'Mark as paid'}
                        </button>
                      )}
                      <Link to={`${base}/${b.service_request_id}`} className="btn-secondary">
                        View ticket
                      </Link>
                    </div>
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