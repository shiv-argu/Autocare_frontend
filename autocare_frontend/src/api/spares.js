import api from './client';

export const getSpares = () => api.get('/spares/').then((r) => r.data);
export const createSpare = (data) => api.post('/spares/', data).then((r) => r.data);