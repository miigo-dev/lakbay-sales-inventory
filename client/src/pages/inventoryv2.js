import { useState } from 'react';
import '../css/inventoryv2.css';
import React from 'react';

const InventoryDashboard = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedSection, setSelectedSection] = useState('main'); 
    const [selectedInventoryType, setSelectedInventoryType] = useState('products'); // New state for inventory type
    const [inventoryData, setInventoryData] = useState([{
        id: 1,
        productId: '#ILWL02012',
        productName: 'Macbook Pro M1 2020',
        quantity: '',
        price: 'Warehouse 1',
        supplierId: 120,
        reorderLevel: 120,
        productStatus: 100,
        section: 'main',
        type: 'products' // Added inventory type
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
        section: 'main',
        type: 'products' // Default to products
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
                section: selectedSection,
                type: selectedInventoryType // Set default type based on selection
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
        // Set the section and type of the current product based on selections
        const newProduct = {
            ...currentProduct,
            section: selectedSection,
            type: selectedInventoryType,
            id: inventoryData.length + 1 // Increment ID
        };

        // Handle adding or editing based on the modal state
        if (isEditing) {
            setInventoryData((prevData) =>
                prevData.map((item) =>
                    item.id === currentProduct.id ? newProduct : item
                )
            );
        } else {
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

    const filteredInventory = inventoryData.filter(item => item.section === selectedSection && item.type === selectedInventoryType);

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

                        <select
                            className="inventory_type_dropdown" // Dropdown for inventory type
                            value={selectedInventoryType}
                            onChange={(e) => setSelectedInventoryType(e.target.value)}>
                            <option value="products">Products</option>
                            <option value="ingredients">Ingredients</option>
                        </select>

                        <select
                            className="inventory_type_dropdown" // Dropdown for inventory type
                            value={selectedInventoryType}
                            onChange={(e) => setSelectedInventoryType(e.target.value)}>
                                <option value="products">All</option>
                            <option value="products">IN</option>
                            <option value="ingredients">OUT</option>
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
                                {selectedInventoryType === 'products' ? (
                                    <>
                                        <th>Product ID</th>
                                        <th>Product Name</th>
                                    </>
                                ) : (
                                    <>
                                        <th>Ingredient ID</th>
                                        <th>Ingredient Name</th>
                                    </>
                                )}
                                <th>Quantity</th>
                                <th>Price</th>
                                <th>Supplier Id</th>
                                <th>Reorder Level</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredInventory.length > 0 ? (
                                filteredInventory.map((item, index) => (
                                    <tr key={item.id}>
                                        <td>{index + 1}</td>
                                        {selectedInventoryType === 'products' ? (
                                            <>
                                                <td>{item.productId}</td>
                                                <td>{item.productName}</td>
                                            </>
                                        ) : (
                                            <>
                                                <td>{item.ingredient_id}</td>
                                                <td>{item.ingredient_name}</td>
                                            </>
                                        )}
                                        <td>{item.quantity}</td>
                                        <td>{item.price}</td>
                                        <td>{item.supplierId || item.supplier_id}</td>
                                        <td>{item.reorderLevel || item.reorder_level}</td>
                                        <td>{item.productStatus || item.ingredient_status}</td>
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
                                    <td colSpan="8">No inventory items found.</td>
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

                        <label htmlFor="section">Inventory Section</label>
                        <select
                            name="section"
                            value={selectedSection}
                            onChange={(e) => setSelectedSection(e.target.value)}
                        >
                            <option value="main">Main Inventory</option>
                            <option value="lakbayKain">Lakbay Kain</option>
                            <option value="lakbayKape">Lakbay Kape</option>
                        </select>

                        {selectedInventoryType === 'products' ? (
                            <>
                                <label htmlFor="productId">Product ID</label>
                                <input
                                    type="text"
                                    name="productId"
                                    placeholder="Product ID"
                                    value={currentProduct.productId}
                                    onChange={handleInputChange}
                                />

                                <label htmlFor="productName">Product Name</label>
                                <input
                                    type="text"
                                    name="productName"
                                    placeholder="Product Name"
                                    value={currentProduct.productName}
                                    onChange={handleInputChange}
                                />
                            </>
                        ) : (
                            <>
                                <label htmlFor="ingredient_id">Ingredient ID</label>
                                <input
                                    type="number"
                                    name="ingredient_id"
                                    placeholder="Ingredient ID"
                                    value={currentProduct.ingredient_id}
                                    onChange={handleInputChange}
                                />

                                <label htmlFor="ingredient_name">Ingredient Name</label>
                                <input
                                    type="text"
                                    name="ingredient_name"
                                    placeholder="Ingredient Name"
                                    value={currentProduct.ingredient_name}
                                    onChange={handleInputChange}
                                />
                            </>
                        )}

                        <label htmlFor="quantity">Quantity</label>
                        <input
                            type="number"
                            name="quantity"
                            placeholder="Quantity"
                            value={currentProduct.quantity}
                            onChange={handleInputChange}
                        />

                        <label htmlFor="price">Price</label>
                        <input
                            type="number"
                            step="0.01"
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
                        
                    

                        <button onClick={handleSubmit}>
                            {isEditing ? 'Save Changes' : 'Add Inventory'}
                        </button>
                        <button onClick={closeModal}>Cancel</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InventoryDashboard;
