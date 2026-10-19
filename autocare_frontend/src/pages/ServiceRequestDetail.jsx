import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  getServiceRequest, updateStatus,
  getRequestServices, addRequestService,
  getRequestSpares, addRequestSpare,
} from '../api/serviceRequests';
import { getVehicle } from '../api/vehicles';
import { getMechanic } from '../api/mechanics';
import { getServiceTypes } from '../api/serviceTypes';
import { getSpares } from '../api/spares';
import { getBills, generateBill } from '../api/bills';

const errMsg = (e, fallback) => e.response?.data?.detail || fallback;

export default function ServiceRequestDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  let isStaff = false;
  if (user && user.role === 'staff')
    {
  isStaff = true;
    }
 
  const [request, setRequest] = useState(null);
  const [vehicle, setVehicle] = useState(null);
  const [mechanic, setMechanic] = useState(null);
  const [services, setServices] = useState([]);
  const [spares, setSpares] = useState([]);
  const [serviceTypes, setServiceTypes] = useState([]);
  const [spareCatalog, setSpareCatalog] = useState([]);
  const [bill, setBill] = useState(null);
  const [error, setError] = useState('');

  const [svcForm, setSvcForm] = useState({ service_id: '', cost: '' });
  const [spareForm, setSpareForm] = useState({ spare_id: '', quantity: 1, price: '' });

  const load = async () => 
    {

    try {
      const req = await getServiceRequest(id);
      setRequest(req);
      const [veh, mech, svc, spr, types, catalog, bills] = await Promise.all([
        getVehicle(req.vehicle_id),
        getMechanic(req.mechanic_id),
        getRequestServices(id),
        getRequestSpares(id),
        getServiceTypes(),
        getSpares(),
        getBills(),
      ]);
  
      setVehicle(veh);
      setMechanic(mech);
      setServices(svc);
      setSpares(spr);
      setServiceTypes(types);
      setSpareCatalog(catalog);
      setBill(bills.find((b) => b.service_request_id === Number(id)) || null);
    } catch (e) {
      setError(errMsg(e, 'Failed to load service request'));
    }
  };

  useEffect(() => {
    load();
  }, [id]);

  const run = async (fn, fallback) => {
    setError('');
    try {
      await fn();
      await load();
    } catch (e) {
      setError(errMsg(e, fallback));
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
    run(async () => {
      await addRequestService(id, {
        service_id: Number(svcForm.service_id),
        cost: svcForm.cost === '' ? null : Number(svcForm.cost),
      });
      setSvcForm({ service_id: '', cost: '' });
    }, 'Failed to add service');
  };

  const submitSpare = (e) => {
    e.preventDefault();
    run(async () => {
      await addRequestSpare(id, {
        spare_id: Number(spareForm.spare_id),
        quantity: Number(spareForm.quantity),
        price: spareForm.price === '' ? null : Number(spareForm.price),
      });
      setSpareForm({ spare_id: '', quantity: 1, price: '' });
    }, 'Failed to add spare');
  };

  if (!request) return <p style={{ margin: 40 }}>{error || 'Loading...'}</p>;

  const completed = request.status === 'completed';
const availableServices = serviceTypes.filter((s) => 
  !services.some((x) => x && Number(x.service_id) === Number(s.service_id))
);

const availableSpares = spareCatalog.filter((s) => 
  !spares.some((x) => Number(x.spare_id) === Number(s.spare_id))
);
  return (
    <div style={{ maxWidth: 800, margin: '40px auto' }}>
      <Link to="/service-requests">&larr; Back to requests</Link>
      <h2>Service Request #{request.service_request_id}</h2>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <p>
        <b>Vehicle:</b> {vehicle?.vehicle_name} ({vehicle?.reg_no || 'no reg'})<br />
        <b>Mechanic:</b> {mechanic?.mechanic_name}<br />
        <b>Date:</b> {request.request_date}<br />
        <b>Status:</b> {request.status}
      </p>

      {isStaff && !completed && (
        <p>
          Change status:{' '}
          <select
            value={request.status}
            onChange={(e) => run(() => updateStatus(id, e.target.value), 'Failed to update status')}
          >
            <option value="pending">pending</option>
            <option value="in_progress">in_progress</option>
            <option value="completed">completed</option>
          </select>
        </p>
      )}

      <h3>Services</h3>
      <table border="1" cellPadding="6" style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead><tr><th>Service</th><th>Cost</th></tr></thead>
        <tbody>
          {services.map((s) => (
            <tr key={s.service_id}>
              <td>{serviceName(s.service_id)}</td>
              <td>{s.cost}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {isStaff && !completed && (
        <form onSubmit={submitService} style={{ display: 'flex', gap: 8, margin: '12px 0' }}>
          <select value={svcForm.service_id} onChange={onPickService} required>
            <option value="">Select service</option>
            {availableServices.map((s) => (
              <option key={s.service_id} value={s.service_id}>{s.service_name}</option>
            ))}
          </select>
          <input type="number" min="0" step="0.01" placeholder="Cost" value={svcForm.cost}
            onChange={(e) => setSvcForm({ ...svcForm, cost: e.target.value })} />
          <button type="submit">Add service</button>
        </form>
      )}

      <h3>Spares used</h3>
      <table border="1" cellPadding="6" style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead><tr><th>Spare</th><th>Qty</th><th>Unit price</th></tr></thead>
        <tbody>
          {spares.map((s) => (
            <tr key={s.spare_id}>
              <td>{spareName(s.spare_id)}</td>
              <td>{s.quantity}</td>
              <td>{s.price}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {isStaff && !completed && (
        <form onSubmit={submitSpare} style={{ display: 'flex', gap: 8, margin: '12px 0' }}>
          <select value={spareForm.spare_id} onChange={onPickSpare} required>
            <option value="">Select spare</option>
            {availableSpares.map((s) => (
              <option key={s.spare_id} value={s.spare_id}>{s.spare_name} (stock: {s.stock})</option>
            ))}
          </select>
          <input type="number" min="1" placeholder="Qty" value={spareForm.quantity}
            onChange={(e) => setSpareForm({ ...spareForm, quantity: e.target.value })} required />
          <input type="number" min="0" step="0.01" placeholder="Unit price" value={spareForm.price}
            onChange={(e) => setSpareForm({ ...spareForm, price: e.target.value })} />
          <button type="submit">Add spare</button>
        </form>
      )}

      <h3>Bill</h3>
      {bill ? (
        <p>
          Bill {bill.bill_id}: <b>{bill.amount}</b> ({bill.status}), dated {bill.bill_date}
        </p>
      ) : completed && isStaff ? (
        <button onClick={() => run(() => generateBill(id), 'Failed to generate bill')}>
          Generate bill
        </button>
      ) : (
        <p>{completed ? 'No bill generated yet.' : 'Bill can be generated once the request is completed.'}</p>
      )}
    </div>
  );
}