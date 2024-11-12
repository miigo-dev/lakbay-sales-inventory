import { DataGrid } from '@mui/x-data-grid';
import { useState, useEffect} from 'react';
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
    const [inventoryData, setInventoryData] = useState([{
        id: 1,
        productId: '#ILWL02012',
        productName: 'Macbook Pro M1 2020',
        quantity: 10,
        price: 'Warehouse 1',
        supplierId: 120,
        reorderLevel: 120,
        productStatus: 'in',
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
        productStatus: 'in',
        section: 'main',
        type: 'products'
    });

    const [selectedProduct, setSelectedProduct] = useState([]);
    const [quantityAdjustment, setQuantityAdjustment] = useState(0);
    const [remarks, setRemarks] = useState('');
    const [suppliers, setSuppliers] = useState([]);
    const [supplierId, setSupplierId] = useState('');
    const [adjustmentType, setAdjustmentType] = useState('');
    

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
                productStatus: 'in',
                section: selectedSection,
                type: selectedInventoryType
            });
            setIsEditing(false);
        }
        setModalOpen(true);
        setQuantityAdjustment(0); // Reset quantity adjustment
        setRemarks(''); // Reset remarks
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
        const nameKey = selectedInventoryType === 'products' ? 'productName' : 'ingredientName';
        const newProduct = {
            ...currentProduct,
            section: selectedSection,
            type: selectedInventoryType,
            id: isEditing ? currentProduct.id : inventoryData.length + 1,
            quantity: parseInt(currentProduct.quantity) + parseInt(quantityAdjustment)
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

        const transactionEntry = {
            date: new Date().toLocaleDateString(),
            [nameKey]: newProduct[nameKey], // Dynamically use product or ingredient name
            quantity: quantityAdjustment,
            price: newProduct.price,
            status: currentProduct.productStatus,
            productId: newProduct.productId || newProduct.ingredientId, // Use appropriate ID
            remarks,
            supplierId: supplierId
        };
    
        setSelectedProduct((prevTransactions) => [
            ...prevTransactions,
            transactionEntry
        ]);
    
        closeModal();
    };

    const handleDelete = (id) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this item?');
        if (confirmDelete) {
            setInventoryData((prevData) => prevData.filter((item) => item.id !== id));
        }
    };

    const handleViewTransactions = (item) => {
        const nameKey = selectedInventoryType === 'products' ? 'productName' : 'ingredientName';
        const transactions = selectedProduct.filter(
            (transaction) => transaction[nameKey] === item[nameKey]
        );
        setCurrentProductName(item[nameKey]);
        setFilteredView(transactions);
        setTransactionFilter('all');
        setViewModalOpen(true);
    };

    
    const openQuantityModal = (type) => {
        setAdjustmentType(type); // Set adjustment type to "in" or "out"
        setQuantityModalOpen(true);
    };

    const closeQuantityModal = () => {
        setQuantityModalOpen(false); // Close quantity adjustment modal
    };

    const viewFilter = (status) => {
        setTransactionFilter(status);
        setFilteredView(
            status === 'all'
                ? selectedProduct.filter((t) => t.productId === currentProductName)
                : selectedProduct.filter((t) => t.productId === currentProductName && t.status === status)
        );
    };

    const filteredInventory = inventoryData.filter(item =>
        item.section === selectedSection &&
        item.type === selectedInventoryType &&
        (selectedInventoryStatus === 'all' || item.productStatus === selectedInventoryStatus)
    );

    useEffect(() => {
        if (currentProduct.supplierId && !suppliers.includes(currentProduct.supplierId)) {
            setSuppliers(prevSuppliers => [...prevSuppliers, currentProduct.supplierId]);
        }
    }, [currentProduct.supplierId]);
    
    const handleQuantityAdjustmentSubmit = () => {
        const adjustmentValue = parseInt(quantityAdjustment);
    
        
        if ((adjustmentType === 'in' && adjustmentValue <= 0) || 
            (adjustmentType === 'out' && adjustmentValue >= 0)) {
            alert(`Please enter a valid quantity. 
            For "In", you can only add, 
            and for "Out", you can only deduct.`);
            return;
        }
    
        setInventoryData((prevData) =>
            prevData.map((item) =>
                item.productName === currentProductName
                    ? { ...item, quantity: item.quantity + adjustmentValue }
                    : item
            )
        );
    
        // Log the adjustment as a transaction
        setSelectedProduct((prevTransactions) => [
            ...prevTransactions,
            {
                date: new Date().toLocaleDateString(),
                productName: currentProductName,
                quantity: adjustmentValue,
                price: '',
                status: adjustmentType,
                remarks,
                supplierId: supplierId
            }
        ]);
    
        // Reset and close the quantity adjustment modal
        setQuantityAdjustment('');
        setRemarks('');
        closeQuantityModal();
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
                            className="inventory_status_dropdown"
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
                            selectedInventoryType === 'products' 
                                ? { field: 'productId', headerName: 'Product ID', width: 180 } 
                                : { field: 'ingredientId', headerName: 'Ingredient ID', width: 180 },
                            selectedInventoryType === 'products' 
                                ? { field: 'productName', headerName: 'Product Name', width: 180 } 
                                : { field: 'ingredientName', headerName: 'Ingredient Name', width: 180 },
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
                                        <button className="btn view_btn" onClick={() => handleViewTransactions(params.row)}>View</button>
                                        <button className="btn out_btn" onClick={() => handleDelete(params.row.id)}>Delete</button>
                                    </div>
                                )
                            }
                        ]}
                        pageSize={10}
                        rowsPerPageOptions={[10, 20, 50]}
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

                        {/* Inventory fields for Product or Ingredient */}
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
                                    type="text"
                                    name="price"
                                    placeholder="Price"
                                    value={currentProduct.price}
                                    onChange={handleInputChange}
                                />

                                <label htmlFor="supplierId">Supplier ID</label>
                                <input
                                    type="text"
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
                            </>
                        ) : (
                            // Fields for Ingredients (if applicable)
                            <>
                                <label htmlFor="ingredientId">Ingredient ID</label>
                                <input
                                    type="text"
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
                                    type="text"
                                    name="price"
                                    placeholder="Price"
                                    value={currentProduct.price}
                                    onChange={handleInputChange}
                                />

                                <label htmlFor="supplierId">Supplier ID</label>
                                <input
                                    type="text"
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
                            </>
                        )}

                        <button onClick={handleSubmit} className="submit-btn">{isEditing ? 'Update' : 'Add'}</button>
                        <button onClick={closeModal} className="close-btn">Close</button>
                    </div>
                </div>
            )}

            {viewModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>{selectedInventoryType === 'products' ? 'Inventory of Product' : 'Inventory of Ingredient'}: {currentProductName}</h2>

                        <div className="viewModal_in_out_btn">
                            <button onClick={() => openQuantityModal('in')} className="btn_in_btn">In</button>
                            <button onClick={() => openQuantityModal('out')} className="btn_out_btn">Out</button>
                        </div>

                        <table>
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>{selectedInventoryType === 'products' ? 'Product Name' : 'Ingredient Name'}</th>
                                    <th>Quantity</th>
                                    <th>Status</th>
                                    <th>Remarks</th>
                                    <th>Supplier Id</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredView.map((transaction, index) => (
                                    <tr key={index}>
                                        <td>{transaction.date}</td>
                                        <td>{selectedInventoryType === 'products' ? transaction.productName : transaction.ingredientName}</td>
                                        <td>{transaction.quantity}</td>
                                        <td>{transaction.status}</td>
                                        <td>{transaction.remarks}</td>
                                        <td>{transaction.supplierId}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <button onClick={() => setViewModalOpen(false)} className="close-btn">Close</button>
                    </div>
                </div>

            )}

            {/* Quantity Adjustment Modal */}
            {quantityModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>Adjust Quantity and Add Remarks</h3>

                        <label htmlFor="quantityAdjustment">Adjust Quantity</label>
                        <input
                            type="number"
                            name="quantityAdjustment"
                            placeholder="Enter quantity to add"
                            value={quantityAdjustment}
                            onChange={(e) => setQuantityAdjustment(e.target.value)}
                        />

                        <label htmlFor="remarks">Remarks</label>
                        <input
                            type="text"
                            name="remarks"
                            placeholder="Enter remarks"
                            value={remarks}
                            onChange={(e) => setRemarks(e.target.value)}
                        />

                    <label htmlFor="supplierId">Supplier ID</label>
                                <select
                                    name="supplierId"
                                    value={supplierId}  // Bind to a state for supplierId (or current supplier from modal)
                                    onChange={(e) => setSupplierId(e.target.value)}  // Update the selected supplierId
                                >
                                    <option value="">Select Supplier</option>
                                    {suppliers.map((supplier, index) => (
                                        <option key={index} value={supplier}>{supplier}</option>
                                    ))}
                                </select>

                        <button onClick={handleQuantityAdjustmentSubmit} className="submit-btn">Submit Adjustment</button>
                        <button onClick={closeQuantityModal} className="close-btn">Close</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Inventory;
