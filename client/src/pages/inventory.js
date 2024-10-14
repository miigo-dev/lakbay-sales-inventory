import { DataGrid } from '@mui/x-data-grid';
import { useState } from 'react';
import '../css/inventory.css';

const Inventory = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedSection, setSelectedSection] = useState('main'); 
    const [selectedInventoryType, setSelectedInventoryType] = useState('products');
    const [selectedInventoryStatus, setSelectedInventoryStatus] = useState('all'); // New state for "In/Out/All" dropdown
    const [inventoryData, setInventoryData] = useState([{
        id: 1,
        productId: '#ILWL02012',
        productName: 'Macbook Pro M1 2020',
        quantity: '',
        price: 'Warehouse 1',
        supplierId: 120,
        reorderLevel: 120,
        productStatus: 'in', // Status like "in" or "out"
        section: 'main',
        type: 'products'
    }]);

    const [currentProduct, setCurrentProduct] = useState({
        id: null,
        productId: '',
        productName: '',
        quantity: '',
        price: '',
        supplierId: '',
        reorderLevel: '',
        productStatus: 'in', // Default status
        section: 'main',
        type: 'products'
    });

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
                productStatus: 'in', // Set default to "in"
                section: selectedSection,
                type: selectedInventoryType
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
        const newProduct = {
            ...currentProduct,
            section: selectedSection,
            type: selectedInventoryType,
            id: inventoryData.length + 1
        };

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

    const filteredInventory = inventoryData.filter(item => 
        item.section === selectedSection && 
        item.type === selectedInventoryType &&
        (selectedInventoryStatus === 'all' || item.productStatus === selectedInventoryStatus)
    );

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
                            className="inventory_type_dropdown"
                            value={selectedInventoryType}
                            onChange={(e) => setSelectedInventoryType(e.target.value)}>
                            <option value="products">Products</option>
                            <option value="ingredients">Ingredients</option>
                        </select>

                        <select
                            className="inventory_status_dropdown" // Dropdown for "In/Out/All" selection
                            value={selectedInventoryStatus}
                            onChange={(e) => setSelectedInventoryStatus(e.target.value)}>
                            <option value="all">All</option>
                            <option value="in">In</option>
                            <option value="out">Out</option>
                        </select>

                        <button className="btn export_btn">Export</button>
                        <button className="btn add-inventory_btn" onClick={() => openModal()}>
                            Add Item
                        </button>
                    </div>
                </div>

                <div className="inventory_table">
                    <DataGrid
                        rows={filteredInventory}
                        columns={[
                            { field: 'id', headerName: 'No', width: 90 },
                            selectedInventoryType === 'products'? { field: 'productId', headerName: 'Product ID', width: 180 }: { field: 'ingredientId', headerName: 'Ingredient ID', width: 180 },
                            selectedInventoryType === 'products'? { field: 'productName', headerName: 'Product Name', width: 180 }: { field: 'ingredientName', headerName: 'Ingredient Name', width: 180 },
                            
                            { field: 'quantity', headerName: 'Quantity', width: 120 },
                            { field: 'price', headerName: 'Price', width: 120 },
                            { field: 'supplierId', headerName: 'Supplier Id', width: 120 },
                            { field: 'reorderLevel', headerName: 'Reorder Level', width: 120 },
                            { field: 'productStatus', headerName: 'Status', width: 120 },
                            {
                                field: 'action',
                                headerName: 'Action',
                                width: 180,
                                renderCell: (params) => (
                                    <div>
                                        <button className="btn edit_btn" onClick={() => openModal(params.row)}>In</button>
                                        <button className="btn delete_btn" onClick={() => handleDelete(params.row.id)}>Out</button>
                                    </div>
                                )
                            }
                        ]}
                        pageSize={10}
                        rowsPerPageOptions={[10, 20, 50]}
                        checkboxSelection
                    />
                </div>

                <div className="pagination">
                    <span>Showing 1 to {filteredInventory.length} of {filteredInventory.length} entries</span>
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
                                <label htmlFor="ingredientId">Ingredient ID</label>
                                <input
                                    type="number"
                                    name="ingredientId"
                                    placeholder="Ingredient ID"
                                    value={currentProduct.ingredientId}
                                    onChange={handleInputChange}
                                />

                                <label htmlFor="ingredientName">Ingredient Name</label>
                                <input
                                    type="text"
                                    name="ingredientName"
                                    placeholder="Ingredient Name"
                                    value={currentProduct.ingredientName}
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

                        <label htmlFor="productStatus">Status</label>
                        <select
                            name="productStatus"
                            value={currentProduct.productStatus}
                            onChange={handleInputChange}
                        >
                            <option value="in">In</option>
                            <option value="out">Out</option>
                        </select>

                        <button className="btn save_btn" onClick={handleSubmit}>
                            {isEditing ? 'Save Changes' : 'Add Item'}
                        </button>
                        <button className="btn cancel_btn" onClick={closeModal}>Cancel</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Inventory;
