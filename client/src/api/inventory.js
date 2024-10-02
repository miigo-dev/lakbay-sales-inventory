import axios from 'axios';
axios.defaults.withCredentials = true;

const API_URL = 'http://localhost:8080/api/inventory'; // Adjust the port as needed

export async function fetchProducts() {
  return await axios.get(API_URL);
}

export async function addProduct(productData) {
  return await axios.post(API_URL, productData);
}

export async function updateProduct(productId, productData) {
  return await axios.put(`${API_URL}/${productId}`, productData);
}

export async function deleteProduct(productId) {
  return await axios.delete(`${API_URL}/${productId}`);
}
