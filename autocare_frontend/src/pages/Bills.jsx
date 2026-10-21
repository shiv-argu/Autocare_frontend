import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getBills } from '../api/bills';

export default function Bills() {
  const [bills, setBills] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    getBills()
      .then(setBills)
      .catch(() => setError('Failed to load bills'));
  }, []);

  return (
    <div style={{ maxWidth: 700, margin: '40px auto' }}>
      <h2>Bills</h2>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <table border="1" cellPadding="6" style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr><th>Bill</th><th>Service Request</th><th>Amount</th><th>Date</th><th>Status</th></tr>
        </thead>
        <tbody>
          {bills.map((b) => (
            <tr key={b.bill_id}>
              <td>{b.bill_id}</td>
              <td>
                <Link to={`/service-requests/${b.service_request_id}`}>
                  #{b.service_request_id}
                </Link>
              </td>
              <td>{b.amount}</td>
              <td>{b.bill_date}</td>
              <td>{b.status}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {bills.length === 0 && !error && <p>No bills yet.</p>}
    </div>
  );
}