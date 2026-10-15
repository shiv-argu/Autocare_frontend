import api from './client';


export const getServiceRequests = () => api.get('/service-requests/').then((r) => r.data);
export const createServiceRequest = (data) => api.post('/service-requests/', data).then((r) => r.data);

export const getServiceRequest = (id) => api.get(`/service-requests/${id}`).then((r) => r.data);

export const updateStatus = (id, status) =>
  api.patch(`/service-requests/${id}/status`, null, { params: { status } }).then((r) => r.data);

export const getRequestServices = (id) =>
  api.get(`/service-requests/${id}/services`).then((r) => r.data);
export const addRequestService = (id, data) =>
  api.post(`/service-requests/${id}/services`, data).then((r) => r.data);

export const getRequestSpares = (id) =>
  api.get(`/service-requests/${id}/spares`).then((r) => r.data);
export const addRequestSpare = (id, data) =>
  api.post(`/service-requests/${id}/spares`, data).then((r) => r.data);