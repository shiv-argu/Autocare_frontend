import api from './client';

export const getCustomerVehicles = (customerId) =>
  api.get(`/customers/${customerId}/vehicles`).then((r) => r.data);

export const createVehicle = (data) => api.post('/vehicles/', data).then((r) => r.data);

export const getVehicles = () => api.get('/vehicles/').then((r) => r.data);
export const getVehicle = (id) => api.get(`/vehicles/${id}`).then((r) => r.data);