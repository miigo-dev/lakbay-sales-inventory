import { useState, useEffect } from 'react';
import '../css/inventoryv2.css';
import React from 'react';

const InventoryDashboard = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [inventoryData, setInventoryData] = useState([
    {
      id: 1,
      productId: '#ILWL02012',
      productName: 'Macbook Pro M1 2020',
      quantity: '',
      location: 'Warehouse 1',
      available: 120,
      reserved: 120,
      onHand: 100
    },
    // Add more initial data if needed
  ]);

  const [currentProduct, setCurrentProduct] = useState({
    id: null,
    productId: '',
    productName: '',
    quantity: '',
    price: '',
    supplierId: '',
    reorderLevel: '',
    productStatus: ''
  });

  // Handle modal open for Add or Edit
  const openModal = (product = null) => {
    if (product) {
      setCurrentProduct(product);
      setIsEditing(true);
    } else {
      setCurrentProduct({
        id: null,
        product: '',
        productId: '',
        category: '',
        location: '',
        available: '',
        reserved: '',
        onHand: ''
      });
      setIsEditing(false);
    }
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentProduct((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    if (isEditing) {
      setInventoryData((prevData) =>
        prevData.map((item) =>
          item.id === currentProduct.id ? currentProduct : item
        )
      );
    } else {
      const newProduct = {
        ...currentProduct,
        id: inventoryData.length + 1
      };
      setInventoryData((prevData) => [...prevData, newProduct]);
    }
    closeModal();
  };

  const handleDelete = (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this item?');
    if (confirmDelete) {
      setInventoryData((prevData) => prevData.filter((item) => item.id !== id));
    }
  };

  return (
    <div className="dashboard_container">
      <header className="dashboard_header">
        <input type="text" placeholder="Search anything here" className="search_bar" />
        <div className="profile_section">
          <span className="username">Miguel Luayon</span>
          <img src="/path-to-avatar.jpg" alt="Profile" className="profile_pic" />
        </div>
      </header>

      <div className="dashboard_content">
        <div className="dashboard_title">
          <h2>Inventory</h2>
          <div className="actions">
            <button className="btn export_btn">Export</button>
            <button className="btn add-inventory_btn" onClick={() => openModal()}>
              Add Inventory
            </button>
          </div>
        </div>

        <div className="inventory_table">
          <table>
            <thead>
              <tr>
                <th>No</th>
                <th>Product</th>
                <th>Product ID</th>
                <th>Category</th>
                <th>Location</th>
                <th>Available</th>
                <th>Reserved</th>
                <th>On Hand</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {inventoryData.length > 0 ? (
                inventoryData.map((item, index) => (
                  <tr key={item.id}>
                    <td>{index + 1}</td>
                    <td>{item.product}</td>
                    <td>{item.productId}</td>
                    <td>{item.category}</td>
                    <td>{item.location}</td>
                    <td>{item.available}</td>
                    <td>{item.reserved}</td>
                    <td>{item.onHand}</td>
                    <td>
                      <button className="btn edit_btn" onClick={() => openModal(item)}>
                        Edit
                      </button>
                      <button className="btn delete_btn" onClick={() => handleDelete(item.id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9">No inventory items found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="pagination">
          <span>Showing 1 to 10 of {inventoryData.length} entries</span>
          <button className="btn pagination_btn">1</button>
          <button className="btn pagination_btn">2</button>
        </div>
      </div>

      {/* Modal for Adding/Editing Inventory */}
      {modalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>{isEditing ? 'Edit Inventory' : 'Add Inventory'}</h2>
            <input
              type="text"
              name="product"
              placeholder="Product Name"
              value={currentProduct.product}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="productId"
              placeholder="Product ID"
              value={currentProduct.productId}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="category"
              placeholder="Category"
              value={currentProduct.category}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="location"
              placeholder="Location"
              value={currentProduct.location}
              onChange={handleInputChange}
            />
            <input
              type="number"
              name="available"
              placeholder="Available"
              value={currentProduct.available}
              onChange={handleInputChange}
            />
            <input
              type="number"
              name="reserved"
              placeholder="Reserved"
              value={currentProduct.reserved}
              onChange={handleInputChange}
            />
            <input
              type="number"
              name="onHand"
              placeholder="On Hand"
              value={currentProduct.onHand}
              onChange={handleInputChange}
            />
            <button onClick={handleSubmit}>{isEditing ? 'Save Changes' : 'Add Inventory'}</button>
            <button onClick={closeModal}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryDashboard;
