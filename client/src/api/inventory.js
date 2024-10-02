import axios from 'axios';
axios.defaults.withCredentials = true;

const API_URL = 'http://localhost:8080/api/inventory'; // Adjust the port as needed

export async function fetchProducts() {
  return await axios.get(`${API_URL}/get-inv`); // Use get-inv to fetch all products
}

export async function addProduct(productData) {
  return await axios.post(`${API_URL}/add-inv`, productData); // Use add-inv to add a product
}

export async function updateProduct(productId, productData) {
  return await axios.put(`${API_URL}/inventory/${productId}`, productData); // Updated to match Express route
}

export async function deleteProduct(productId) {
  return await axios.delete(`${API_URL}/inventory/${productId}`); // Matches Express route
}
