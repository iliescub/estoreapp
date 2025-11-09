import axios from 'axios';

const API_BASE_URL = 'http://localhost:5138/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

  const mapProduct = apiProduct => ({
    id: apiProduct.productId,
    name: apiProduct.productName,
    description: apiProduct.description,
    price: apiProduct.price,
    imageUrl: apiProduct.imageUrl,
    stock: apiProduct.stock,
    categoryId: apiProduct.categoryId,
  });

  const mapCategory = apiCategory => ({
    id: apiCategory.categoryId,
    name: apiCategory.categoryName,
  });

    const mapOrderItem = (apiItem) => ({
    id: apiItem.orderItemId,
    productId: apiItem.productId,
    quantity: apiItem.quantity,
    price: apiItem.price,
  });

  const mapOrder = (apiOrder) => ({
    id: apiOrder.orderId,
    userId: apiOrder.userId,
    total: apiOrder.totalAmount,
    status: apiOrder.status,
    createdAt: apiOrder.createdAt,
    items: (apiOrder.orderItems ?? []).map(mapOrderItem),
  });

    const mapUser = (apiUser) => ({
    id: apiUser.userId,
    firstName: apiUser.firstName,
    lastName: apiUser.lastName,
    email: apiUser.customerEmail,
    role: apiUser.role,
    status: apiUser.userStatus,
  });

  export const productsAPI = {
    getAll: () => api.get('/products').then(res => res.data.map(mapProduct)),
    getById: id => api.get(`/products/${id}`).then(res => mapProduct(res.data)),
    getByCategory: categoryId =>
      api.get(`/products/category/${categoryId}`).then(res => res.data.map(mapProduct)),
    search: term =>
      api.get('/products/search', { params: { term } }).then(res => res.data.map(mapProduct)),
    create: product => api.post('/products', product).then(res => mapProduct(res.data)),
    update: (id, product) => api.put(`/products/${id}`, product),
    delete: id => api.delete(`/products/${id}`),
  };

  export const categoriesAPI = {
    getAll: () => api.get('/categories').then(res => res.data.map(mapCategory)),
  };

    export const ordersAPI = {
    create: (items) => api.post('/orders', { items }),
    getMine: (userId) => api.get(`/orders/user/${userId}`).then((res) => res.data.map(mapOrder)),
  };

  export const usersAPI = {
  me: () => api.get('/auth/me').then(res => res.data),
   updateMe: (payload) => api.put('/users/me', payload),
  };

  export const adminUsersAPI = {
    getAll: () => api.get('/users').then((res) => res.data.map(mapUser)),
    update: (id, payload) => api.put(`/users/${id}`, payload),
    delete: (id) => api.delete(`/users/${id}`),
  };

export default api;
