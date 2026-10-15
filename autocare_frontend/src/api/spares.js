import api from './client';

export const getSpares = () => api.get('/spares/').then((r) => r.data);