import api from './client'

export const messagesService = {
  getConversations: () => api.get('/conversations'),
  getMessages: (conversationId) => api.get(`/conversations/${conversationId}/messages`),
  send: (conversationId, text) => api.post(`/conversations/${conversationId}/messages`, { text }),
  startConversation: (listingId, message) => api.post('/conversations', { listing_id: listingId, message }),
}
