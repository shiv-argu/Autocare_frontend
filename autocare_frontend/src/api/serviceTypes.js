import api from './client';

export const getServiceTypes = () => api.get('/service-types/').then((r) => r.data);
export const createServiceType = (data) => api.post('/service-types/', data).then((r) => r.data);