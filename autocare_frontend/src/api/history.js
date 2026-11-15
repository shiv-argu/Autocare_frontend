import api from './client';

export const getRequestHistory = (id) =>
  api.get(`/service-requests/${id}/history`).then((r) => r.data);

export const getVehicleHistory = (vehicleId) =>
  api.get(`/vehicles/${vehicleId}/history`).then((r) => r.data);