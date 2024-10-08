import { useState, useEffect } from 'react';
import '../css/inventoryv2.css';
import React from 'react';

const InventoryDashboard = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedSection, setSelectedSection] = useState('main'); 
    const [inventoryData, setInventoryData] = useState([{

        id: 1,
        productId: '#ILWL02012',
        productName: 'Macbook Pro M1 2020',
        quantity: '',
        price: 'Warehouse 1',
        supplierId: 120,
        reorderLevel: 120,
        productStatus: 100,
        section: 'main' 
    }]);

    const [currentProduct, setCurrentProduct] = useState({
        id: null,
        productId: '',
        productName: '',
        quantity: '',
        price: '',
        supplierId: '',
        reorderLevel: '',
        productStatus: '',
        section: 'main' 
    });

    // Handle modal open for Add or Edit
    const openModal = (product = null) => {

        if (product) {
            setCurrentProduct(product);
            setIsEditing(true);
        } else {
            setCurrentProduct({
                id: null,
                productId: '',
                productName: '',
                quantity: '',
                price: '',
                supplierId: '',
                reorderLevel: '',
                productStatus: '',
                section: 'main'
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

    const filteredInventory = inventoryData.filter(item => item.section === selectedSection);

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
                        <select
                            className="inventory_section_dropdown"
                            value={selectedSection}
                            onChange={(e) => setSelectedSection(e.target.value)}>

                            <option value="main">Main Inventory</option>
                            <option value="lakbayKain">Lakbay Kain</option>
                            <option value="lakbayKape">Lakbay Kape</option>
                        </select>

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
                                <th>Product ID</th>
                                <th>Product Name</th>
                                <th>Quantity</th>
                                <th>Price</th>
                                <th>Supplier Id</th>
                                <th>Reorder Level</th>
                                <th>Product Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredInventory.length > 0 ? (
                                filteredInventory.map((item, index) => (

                                    <tr key={item.id}>
                                        <td>{index + 1}</td>
                                        <td>{item.productId}</td>
                                        <td>{item.productName}</td>
                                        <td>{item.quantity}</td>
                                        <td>{item.price}</td>
                                        <td>{item.supplierId}</td>
                                        <td>{item.reorderLevel}</td>
                                        <td>{item.productStatus}</td>
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
                    <span>Showing 1 to 10 of {filteredInventory.length} entries</span>
                    <button className="btn pagination_btn">1</button>
                    <button className="btn pagination_btn">2</button>
                </div>
            </div>

 
            {modalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>{isEditing ? 'Edit Inventory' : 'Add Inventory'}</h2>

                        <label htmlFor="productId">Product Name</label>
                        <input
                            type="text"
                            name="productId"
                            placeholder="Product Name"
                            value={currentProduct.productId}
                            onChange={handleInputChange}
                        />

                        <label htmlFor="productName">Product ID</label>
                        <input
                            type="text"
                            name="productName"
                            placeholder="Product ID"
                            value={currentProduct.productName}
                            onChange={handleInputChange}
                        />

                        <label htmlFor="quantity">Quantity</label>
                        <input
                            type="text"
                            name="quantity"
                            placeholder="Quantity"
                            value={currentProduct.quantity}
                            onChange={handleInputChange}
                        />

                        <label htmlFor="price">Price</label>
                        <input
                            type="text"
                            name="price"
                            placeholder="Price"
                            value={currentProduct.price}
                            onChange={handleInputChange}
                        />

                        <label htmlFor="supplierId">Supplier ID</label>
                        <input
                            type="number"
                            name="supplierId"
                            placeholder="Supplier ID"
                            value={currentProduct.supplierId}
                            onChange={handleInputChange}
                        />

                        <label htmlFor="reorderLevel">Reorder Level</label>
                        <input
                            type="number"
                            name="reorderLevel"
                            placeholder="Reorder Level"
                            value={currentProduct.reorderLevel}
                            onChange={handleInputChange}
                        />

                        <label htmlFor="productStatus">Product Status</label>
                        <input
                            type="text"
                            name="productStatus"
                            placeholder="Product Status"
                            value={currentProduct.productStatus}
                            onChange={handleInputChange}
                        />
                        <label htmlFor="section">Inventory Section</label>
                        <select
                            name="section"
                            value={currentProduct.section}
                            onChange={handleInputChange}
                        >
                            <option value="main">Main Inventory</option>
                            <option value="lakbayKain">Lakbay Kain</option>
                            <option value="lakbayKape">Lakbay Kape</option>
                        </select>

                        <button onClick={handleSubmit}>{isEditing ? 'Save Changes' : 'Add Inventory'}</button>
                        <button onClick={closeModal}>Cancel</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InventoryDashboard;
