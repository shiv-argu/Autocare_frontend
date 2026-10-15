import api from './client';

export const getMechanics = () => api.get('/mechanics/').then((r) => r.data);
export const createMechanic = (data) => api.post('/mechanics/', data).then((r) => r.data);

export const getMechanic = (id) => api.get(`/mechanics/${id}`).then((r) => r.data);