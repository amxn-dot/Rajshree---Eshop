import axios from 'axios';
import api from './api';

const API_URL = 'http://localhost:5000/api/products';

const getProducts = () => {
  return axios.get(API_URL);
};

const getProductById = (id: string) => {
  return axios.get(`${API_URL}/${id}`);
};

const createProduct = (productData) => {
  return api.post('/products', productData);
};

const updateProduct = (id, productData) => {
  return api.put(`/products/${id}`, productData);
};

const deleteProduct = (id) => {
  return api.delete(`/products/${id}`);
};

const uploadProductImage = (formData) => {
  return api.post('/products/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};

export const productService = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImage
};
