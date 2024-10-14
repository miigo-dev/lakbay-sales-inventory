import axios from 'axios';

axios.defaults.withCredentials = true;

export async function addProduct(productData) {
  return await axios.post('http://localhost:8080/api/inventory/add-product', productData);
}

export async function addIngredient(ingredientData) {
  return await axios.post('http://localhost:8080/api/inventory/add-ingredient', ingredientData);
}

export async function addIngredientType(typeData) {
  return await axios.post('http://localhost:8080/api/inventory/add-ingredient-type', typeData);
}

export async function addProductCategory(categoryData) {
  return await axios.post('http://localhost:8080/api/inventory/add-product-category', categoryData);
}

export async function addSupplier(supplierData) {
  return await axios.post('http://localhost:8080/api/inventory/add-supplier', supplierData);
}

export async function productIn(movementData) {
  return await axios.post('http://localhost:8080/api/inventory/product-in', movementData);
}

export async function productOut(movementData) {
  return await axios.post('http://localhost:8080/api/inventory/product-out', movementData);
}

export async function ingredientIn(movementData) {
  return await axios.post('http://localhost:8080/api/inventory/ingredient-in', movementData);
}

export async function ingredientOut(movementData) {
  return await axios.post('http://localhost:8080/api/inventory/ingredient-out', movementData);
}