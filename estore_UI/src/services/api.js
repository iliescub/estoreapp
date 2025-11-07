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

export default api;
