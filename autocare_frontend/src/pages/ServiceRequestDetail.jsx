import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  getServiceRequest, updateStatus,
  getRequestServices, addRequestService, removeRequestService,
  getRequestSpares, addRequestSpare, removeRequestSpare,
} from '../api/serviceRequests';
import { getVehicle } from '../api/vehicles';
import { getMechanic } from '../api/mechanics';
import { getServiceTypes } from '../api/serviceTypes';
import { getSpares } from '../api/spares';
import { getBillForRequest, generateBill, payBill } from '../api/bills';
import { getRequestHistory } from '../api/history';
import Timeline from '../components/Timeline';
import StatusBadge from '../components/StatusBadge';

const errMsg = (e, fallback) => e.response?.data?.detail || fallback;

export default function ServiceRequestDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const isStaff = user?.role === 'staff';
  const isMechanic = user?.role === 'mechanic';
  const backTo = isStaff ? '/service-requests' : isMechanic ? '/mechanic' : '/my/requests';

  const [request, setRequest] = useState(null);
  const [vehicle, setVehicle] = useState(null);
  const [mechanic, setMechanic] = useState(null);
  const [services, setServices] = useState([]);
  const [spares, setSpares] = useState([]);
  const [serviceTypes, setServiceTypes] = useState([]);
  const [spareCatalog, setSpareCatalog] = useState([]);
  const [bill, setBill] = useState(null);
  const [history, setHistory] = useState([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const [svcForm, setSvcForm] = useState({ service_id: '', cost: '' });
  const [spareForm, setSpareForm] = useState({ spare_id: '', quantity: 1, price: '' });

  // Runs once when the page opens: everything, in as few round trips as possible
  const loadAll = async () => {
    try {
      const [req, svc, spr, types, catalog, billData, hist] = await Promise.all([
        getServiceRequest(id),
        getRequestServices(id),
        getRequestSpares(id),
        getServiceTypes(),
        getSpares(),
        getBillForRequest(id),
        getRequestHistory(id),
      ]);
      setRequest(req);
      setServices(svc);
      setSpares(spr);
      setServiceTypes(types);
      setSpareCatalog(catalog);
      setBill(billData);
      setHistory(hist);

      const [veh, mech] = await Promise.all([
        getVehicle(req.vehicle_id),
        getMechanic(req.mechanic_id),
      ]);
      setVehicle(veh);
      setMechanic(mech);
    } catch (e) {
      setError(errMsg(e, 'Failed to load service request'));
    }
  };

  useEffect(() => {
    loadAll();
  }, [id]);

  // After an action: refetch only what that action changed (plus the timeline)
  const refreshRequest = async () => {
    const [req, hist] = await Promise.all([getServiceRequest(id), getRequestHistory(id)]);
    setRequest(req);
    setHistory(hist);
  };

  const refreshServices = async () => {
    const [svc, hist] = await Promise.all([getRequestServices(id), getRequestHistory(id)]);
    setServices(svc);
    setHistory(hist);
  };

  const refreshSpares = async () => {
    const [spr, catalog, hist] = await Promise.all([
      getRequestSpares(id),
      getSpares(), // stock changed
      getRequestHistory(id),
    ]);
    setSpares(spr);
    setSpareCatalog(catalog);
    setHistory(hist);
  };

  const refreshBill = async () => {
    const [billData, hist] = await Promise.all([getBillForRequest(id), getRequestHistory(id)]);
    setBill(billData);
    setHistory(hist);
  };

  const run = async (action, refresh, fallback) => {
    setError('');
    setBusy(true);
    try {
      await action();
      await refresh();
    } catch (e) {
      setError(errMsg(e, fallback));
    } finally {
      setBusy(false);
    }
  };

  const serviceName = (sid) => serviceTypes.find((s) => s.service_id === sid)?.service_name ?? sid;
  const spareName = (sid) => spareCatalog.find((s) => s.spare_id === sid)?.spare_name ?? sid;

  const onPickService = (e) => {
    const sid = e.target.value;
    const type = serviceTypes.find((s) => s.service_id === Number(sid));
    setSvcForm({ service_id: sid, cost: type?.price ?? '' });
  };

  const onPickSpare = (e) => {
    const sid = e.target.value;
    const spare = spareCatalog.find((s) => s.spare_id === Number(sid));
    setSpareForm({ ...spareForm, spare_id: sid, price: spare?.price ?? '' });
  };

  const submitService = (e) => {
    e.preventDefault();
    run(
      async () => {
        await addRequestService(id, {
          service_id: Number(svcForm.service_id),
          cost: svcForm.cost === '' ? null : Number(svcForm.cost),
        });
        setSvcForm({ service_id: '', cost: '' });
      },
      refreshServices,
      'Failed to add service'
    );
  };

  const submitSpare = (e) => {
    e.preventDefault();
    run(
      async () => {
        await addRequestSpare(id, {
          spare_id: Number(spareForm.spare_id),
          quantity: Number(spareForm.quantity),
          price: spareForm.price === '' ? null : Number(spareForm.price),
        });
        setSpareForm({ spare_id: '', quantity: 1, price: '' });
      },
      refreshSpares,
      'Failed to add spare'
    );
  };

  const removeService = (sid) => {
    if (!window.confirm('Remove this service from the request?')) return;
    run(() => removeRequestService(id, sid), refreshServices, 'Failed to remove service');
  };

  const removeSpare = (sid) => {
    if (!window.confirm('Remove this spare? Its quantity will be returned to stock.')) return;
    run(() => removeRequestSpare(id, sid), refreshSpares, 'Failed to remove spare');
  };

  const payThisBill = (billId) => {
    if (!window.confirm('Mark this bill as paid?')) return;
    run(() => payBill(billId), refreshBill, 'Failed to mark bill as paid');
  };

  if (!request) return <p className="text-gray-500">{error || 'Loading...'}</p>;

  const completed = request.status === 'completed';
  const canEdit = (isStaff || isMechanic) && !completed;
  const canAdd = canEdit && request.status === 'in_progress';
  const availableServices = serviceTypes.filter((s) => !services.some((x) => x.service_id === s.service_id));
  const availableSpares = spareCatalog.filter((s) => !spares.some((x) => x.spare_id === s.spare_id));

  return (
    <div className="space-y-6">
      <Link to={backTo} className="text-sm text-blue-600 hover:underline">
        &larr; Back to requests
      </Link>

      {error && <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

      {/* Header */}
      <section className="card">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">
              Service Request #{request.service_request_id}
            </h2>
            <div className="mt-2">
              <StatusBadge status={request.status} />
            </div>
          </div>

          {canEdit && (
            <div>
              <label className="field-label">Change status</label>
              <select
                className="input"
                value={request.status}
                disabled={busy}
                onChange={(e) => run(() => updateStatus(id, e.target.value), refreshRequest, 'Failed to update status')}
              >
                <option value="pending">pending</option>
                <option value="in_progress">in progress</option>
                <option value="completed">completed</option>
              </select>
            </div>
          )}
        </div>

        <dl className="mt-5 grid grid-cols-1 gap-4 border-t border-gray-100 pt-4 sm:grid-cols-3">
          <div>
            <dt className="field-label">Vehicle</dt>
            <dd className="text-sm text-gray-900">
              {vehicle?.vehicle_name} ({vehicle?.reg_no || 'no reg'})
            </dd>
          </div>
          <div>
            <dt className="field-label">Mechanic</dt>
            <dd className="text-sm text-gray-900">{mechanic?.mechanic_name}</dd>
          </div>
          <div>
            <dt className="field-label">Date</dt>
            <dd className="text-sm text-gray-900">{request.request_date}</dd>
          </div>
        </dl>
      </section>

      {/* Services */}
      <section className="card">
        <h3 className="section-title">Services</h3>

        {services.length === 0 ? (
          <p className="text-sm text-gray-500">No services added yet.</p>
        ) : (
          <div className="overflow-x-auto rounded-md border border-gray-200">
            <table className="table">
              <thead>
                <tr>
                  <th>Service</th>
                  <th>Cost</th>
                  {canEdit && <th className="text-right">Action</th>}
                </tr>
              </thead>
              <tbody>
                {services.map((s) => (
                  <tr key={s.service_id}>
                    <td>{serviceName(s.service_id)}</td>
                    <td>{s.cost}</td>
                    {canEdit && (
                      <td className="text-right">
                        <button
                          onClick={() => removeService(s.service_id)}
                          disabled={busy}
                          className="btn-danger disabled:opacity-50"
                        >
                          Remove
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {canEdit && !canAdd && (
          <p className="mt-4 rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-800">
            Set the status to "in progress" to add services.
          </p>
        )}

        {canAdd && (
          <form onSubmit={submitService} className="mt-4 flex flex-wrap items-end gap-3 border-t border-gray-100 pt-4">
            <div className="min-w-[12rem] flex-1">
              <label className="field-label">Service</label>
              <select className="input w-full" value={svcForm.service_id} onChange={onPickService} required>
                <option value="">Select service</option>
                {availableServices.map((s) => (
                  <option key={s.service_id} value={s.service_id}>{s.service_name}</option>
                ))}
              </select>
            </div>
            <div className="w-32">
              <label className="field-label">Cost</label>
              <input
                className="input w-full"
                type="number"
                min="0"
                step="0.01"
                placeholder="Cost"
                value={svcForm.cost}
                onChange={(e) => setSvcForm({ ...svcForm, cost: e.target.value })}
              />
            </div>
            <button type="submit" disabled={busy} className="btn">
              {busy ? 'Saving...' : 'Add service'}
            </button>
          </form>
        )}
      </section>

      {/* Spares */}
      <section className="card">
        <h3 className="section-title">Spares used</h3>

        {spares.length === 0 ? (
          <p className="text-sm text-gray-500">No spares used yet.</p>
        ) : (
          <div className="overflow-x-auto rounded-md border border-gray-200">
            <table className="table">
              <thead>
                <tr>
                  <th>Spare</th>
                  <th>Qty</th>
                  <th>Unit price</th>
                  {canEdit && <th className="text-right">Action</th>}
                </tr>
              </thead>
              <tbody>
                {spares.map((s) => (
                  <tr key={s.spare_id}>
                    <td>{spareName(s.spare_id)}</td>
                    <td>{s.quantity}</td>
                    <td>{s.price}</td>
                    {canEdit && (
                      <td className="text-right">
                        <button
                          onClick={() => removeSpare(s.spare_id)}
                          disabled={busy}
                          className="btn-danger disabled:opacity-50"
                        >
                          Remove
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {canEdit && !canAdd && (
          <p className="mt-4 rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-800">
            Set the status to "in progress" to add spares.
          </p>
        )}

        {canAdd && (
          <form onSubmit={submitSpare} className="mt-4 flex flex-wrap items-end gap-3 border-t border-gray-100 pt-4">
            <div className="min-w-[12rem] flex-1">
              <label className="field-label">Spare</label>
              <select className="input w-full" value={spareForm.spare_id} onChange={onPickSpare} required>
                <option value="">Select spare</option>
                {availableSpares.map((s) => (
                  <option key={s.spare_id} value={s.spare_id}>
                    {s.spare_name} (stock: {s.stock})
                  </option>
                ))}
              </select>
            </div>
            <div className="w-24">
              <label className="field-label">Qty</label>
              <input
                className="input w-full"
                type="number"
                min="1"
                value={spareForm.quantity}
                onChange={(e) => setSpareForm({ ...spareForm, quantity: e.target.value })}
                required
              />
            </div>
            <div className="w-32">
              <label className="field-label">Unit price</label>
              <input
                className="input w-full"
                type="number"
                min="0"
                step="0.01"
                placeholder="Price"
                value={spareForm.price}
                onChange={(e) => setSpareForm({ ...spareForm, price: e.target.value })}
              />
            </div>
            <button type="submit" disabled={busy} className="btn">
              {busy ? 'Saving...' : 'Add spare'}
            </button>
          </form>
        )}
      </section>

      {/* Bill */}
      <section className="card">
        <h3 className="section-title">Bill</h3>
        {bill ? (
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-3xl font-semibold text-gray-900">{bill.amount}</p>
              <p className="text-sm text-gray-500">Bill #{bill.bill_id} · {bill.bill_date}</p>
            </div>
            <div className="flex items-center gap-3">
              <StatusBadge status={bill.status} />
              {bill.status !== 'paid' && !isMechanic && (
                <button onClick={() => payThisBill(bill.bill_id)} disabled={busy} className="btn">
                  Mark as paid
                </button>
              )}
            </div>
          </div>
        ) : completed && isStaff ? (
          <button
            onClick={() => run(() => generateBill(id), refreshBill, 'Failed to generate bill')}
            disabled={busy}
            className="btn"
          >
            Generate bill
          </button>
        ) : (
          <p className="text-sm text-gray-500">
            {completed ? 'No bill generated yet.' : 'A bill can be generated once the request is completed.'}
          </p>
        )}
      </section>

      {/* Timeline */}
      <section>
        <h3 className="section-title">Timeline</h3>
        <Timeline events={history} status={request.status} />
      </section>
    </div>
  );
}