import api from './client'

export const listingsService = {
  getAll: (params) => api.get('/listings', { params }),
  getById: (id) => api.get(`/listings/${id}`),
  create: (data) => api.post('/listings', data),
  update: (id, data) => api.put(`/listings/${id}`, data),
  delete: (id) => api.delete(`/listings/${id}`),
  search: (query, filters) => api.get('/listings/search', { params: { q: query, ...filters } }),
  getByUser: (userId) => api.get(`/users/${userId}/listings`),
}
