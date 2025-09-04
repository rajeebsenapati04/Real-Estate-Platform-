export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

export const API_ENDPOINTS = {
  auth: {
    login: `${API_BASE_URL}/api/auth/login`,
    register: `${API_BASE_URL}/api/auth/register`,
    me: `${API_BASE_URL}/api/auth/me`,
  },
  properties: {
    list: `${API_BASE_URL}/api/properties`,
    detail: (id: string) => `${API_BASE_URL}/api/properties/${id}`,
    create: `${API_BASE_URL}/api/properties`,
    update: (id: string) => `${API_BASE_URL}/api/properties/${id}`,
  },
  orders: {
    create: `${API_BASE_URL}/api/orders`,
    user: (userId: string) => `${API_BASE_URL}/api/orders/user/${userId}`,
  },
};


