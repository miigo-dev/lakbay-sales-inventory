import { DataGrid } from '@mui/x-data-grid';
import { useState, useEffect } from 'react';
import '../css/inventory.css';

const Inventory = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [quantityModalOpen, setQuantityModalOpen] = useState(false);
    const [currentProductName, setCurrentProductName] = useState(null);
    const [selectedSection, setSelectedSection] = useState('main');
    const [selectedInventoryType, setSelectedInventoryType] = useState('products');
    const [selectedInventoryStatus, setSelectedInventoryStatus] = useState('all');
    const [filteredView, setFilteredView] = useState([]);
    const [transactionFilter, setTransactionFilter] = useState('all');
    const [inventoryData, setInventoryData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentProduct, setCurrentProduct] = useState({
        id: null,
        productName: '',
        quantity: '',
        price: '',
        supplierId: '',
        reorderLevel: '',
        productStatus: 'Active',
        warehouseId: null,
    });

    const [selectedProduct, setSelectedProduct] = useState([]);
    const [quantityAdjustment, setQuantityAdjustment] = useState(0);
    const [remarks, setRemarks] = useState('');
    const [suppliers, setSuppliers] = useState([]);
    const [supplierId, setSupplierId] = useState('');
    const [adjustmentType, setAdjustmentType] = useState('');

    const API_BASE_URL = 'http://localhost:8080/api';

    // Fetch products and suppliers from the database
    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const [productsResponse, suppliersResponse] = await Promise.all([
                fetch(`${API_BASE_URL}/products`),
                fetch(`${API_BASE_URL}/suppliers`),
            ]);

            if (!productsResponse.ok || !suppliersResponse.ok) {
                throw new Error('Error fetching data');
            }

            const products = await productsResponse.json();
            const suppliers = await suppliersResponse.json();

            setInventoryData(products);
            setSuppliers(suppliers);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Open Add/Edit modal
    const openModal = (product = null) => {
        if (product) {
            setCurrentProduct(product);
            setIsEditing(true);
        } else {
            setCurrentProduct({
                id: null,
                productName: '',
                quantity: '',
                price: '',
                supplierId: '',
                reorderLevel: '',
                productStatus: 'Active',
                warehouseId: null,
            });
            setIsEditing(false);
        }
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
    };

    // Handle input changes in modal
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCurrentProduct((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // Submit Add/Edit product
    const handleSubmit = async () => {
        try {
            const method = isEditing ? 'PUT' : 'POST';
            const endpoint = isEditing
                ? `${API_BASE_URL}/products/${currentProduct.id}`
                : `${API_BASE_URL}/products`;

            const response = await fetch(endpoint, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(currentProduct),
            });

            if (!response.ok) {
                throw new Error('Error saving product');
            }

            await fetchData(); // Refresh the data
            closeModal();
        } catch (err) {
            alert(err.message);
        }
    };

    // Delete product
    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            try {
                const response = await fetch(`${API_BASE_URL}/products/${id}`, { method: 'DELETE' });

                if (!response.ok) {
                    throw new Error('Error deleting product');
                }

                await fetchData(); // Refresh the data
            } catch (err) {
                alert(err.message);
            }
        }
    };

    const openQuantityModal = (type) => {
        setAdjustmentType(type);
        setQuantityModalOpen(true);
    };

    const closeQuantityModal = () => {
        setQuantityModalOpen(false);
    };

    const handleQuantityAdjustmentSubmit = async () => {
        try {
            const adjustmentValue = parseInt(quantityAdjustment);
            if ((adjustmentType === 'IN' && adjustmentValue <= 0) ||
                (adjustmentType === 'OUT' && adjustmentValue >= 0)) {
                alert('Invalid quantity adjustment');
                return;
            }

            const endpoint = `${API_BASE_URL}/product_movements`;
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    productId: currentProduct.id,
                    pmove_quantity: adjustmentValue,
                    pmove_type: adjustmentType,
                    remarks,
                }),
            });

            if (!response.ok) {
                throw new Error('Error adjusting quantity');
            }

            await fetchData(); // Refresh the data
            closeQuantityModal();
        } catch (err) {
            alert(err.message);
        }
    };

    const filteredInventory = inventoryData.filter(
        (item) =>
            item.section === selectedSection &&
            (selectedInventoryStatus === 'all' || item.productStatus === selectedInventoryStatus)
    );

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

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
                    <button className="btn add-inventory_btn" onClick={() => openModal()}>
                        Add Item
                    </button>
                </div>

                <div className="inventory_table">
                    <DataGrid
                        rows={filteredInventory}
                        columns={[
                            { field: 'id', headerName: 'No', width: 90 },
                            { field: 'productName', headerName: 'Product Name', width: 180 },
                            { field: 'quantity', headerName: 'Quantity', width: 120 },
                            { field: 'price', headerName: 'Price', width: 120 },
                            { field: 'supplierId', headerName: 'Supplier', width: 120 },
                            {
                                field: 'action',
                                headerName: 'Action',
                                width: 180,
                                renderCell: (params) => (
                                    <div>
                                        <button className="btn out_btn" onClick={() => handleDelete(params.row.id)}>
                                            Delete
                                        </button>
                                    </div>
                                ),
                            },
                        ]}
                        pageSize={10}
                        rowsPerPageOptions={[10, 20, 50]}
                    />
                </div>
            </div>

            {/* Add/Edit Modal */}
            {modalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>{isEditing ? 'Edit Product' : 'Add Product'}</h2>
                        <label>Product Name</label>
                        <input
                            type="text"
                            name="productName"
                            value={currentProduct.productName}
                            onChange={handleInputChange}
                        />
                        <label>Quantity</label>
                        <input
                            type="number"
                            name="quantity"
                            value={currentProduct.quantity}
                            onChange={handleInputChange}
                        />
                        <label>Price</label>
                        <input
                            type="text"
                            name="price"
                            value={currentProduct.price}
                            onChange={handleInputChange}
                        />
                        <button onClick={handleSubmit}>Save</button>
                        <button onClick={closeModal}>Cancel</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Inventory;