import api from './client';

export const getBills = () => api.get('/bills/').then((r) => r.data);
export const generateBill = (requestId) =>
  api.post(`/bills/service-requests/${requestId}`).then((r) => r.data);

export const payBill = (billId) => api.patch(`/bills/${billId}/pay`).then((r) => r.data);

export const getBillForRequest = (requestId) =>
  api.get(`/bills/service-requests/${requestId}`).then((r) => r.data);