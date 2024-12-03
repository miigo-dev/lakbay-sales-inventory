import { DataGrid } from '@mui/x-data-grid';
import { useState, useEffect } from 'react';
import '../css/inventory.css';

const Inventory = () => {
    const [selectedSection, setSelectedSection] = useState('lakbayKain'); // Default to lakbayKain
    const [selectedInventoryType, setSelectedInventoryType] = useState('products');
    const [searchTerm, setSearchTerm] = useState('');
    const [inventoryData, setInventoryData] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState([]);
    const [quantityAdjustment, setQuantityAdjustment] = useState(0);
    const [quantityModalOpen, setQuantityModalOpen] = useState(false);
    const [adjustmentType, setAdjustmentType] = useState('');
    const [filteredView, setFilteredView] = useState([]);
    const [currentProductName, setCurrentProductName] = useState(null);
    const [viewFilter, setViewFilter] = useState('all');
    const [isLakbayKape, setIsLakbayKape] = useState(false);
    const [remarks, setRemarks] = useState('');

    const getWarehouseId = () => (selectedSection === 'lakbayKape' ? 2 : 1);

    // Fetch inventory data dynamically based on section and type
    const fetchInventoryData = async () => {
        try {
            const warehouseId = getWarehouseId();
            const type = selectedInventoryType;

            const url = `http://localhost:8080/api/${type}/warehouses/${warehouseId}`;
            const response = await fetch(url);
            const data = await response.json();

            // Ensure a unique ID exists for DataGrid
            setInventoryData(data.map((item, index) => ({ ...item, id: item.product_id || item.ingredient_id || index })));
        } catch (error) {
            console.error('Error fetching inventory data:', error);
        }
    };

    useEffect(() => {
        fetchInventoryData();
    }, [selectedSection, selectedInventoryType]);

    // Filter data based on the search term
    const filteredInventory = inventoryData.filter((item) =>
        selectedInventoryType === 'products'
            ? (item.product_name?.toLowerCase() || '').includes(searchTerm.toLowerCase())
            : (item.ingredient_name?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    );

    const columns =
        selectedInventoryType === 'products'
            ? [
                  { field: 'product_id', headerName: 'Product ID', width: 120 },
                  { field: 'product_name', headerName: 'Product Name', width: 200 },
                  { field: 'product_quantity', headerName: 'Quantity', width: 120 },
                  { field: 'product_price', headerName: 'Price', width: 120 },
                  { field: 'reorder_level', headerName: 'Reorder Trigger', width: 120 },
                  { field: 'category_id', headerName: 'Meal Type', width: 120 },
                  {
                      field: 'action',
                      headerName: 'Action',
                      width: 180,
                      renderCell: (params) => (
                          <div>
                              <button className="btn view_btn" onClick={() => handleView(params.row)}>
                                  View
                              </button>
                              <button className="btn out_btn" onClick={() => handleDelete(params.row.id)}>
                                  Delete
                              </button>
                          </div>
                      ),
                  },
              ]
            : [
                  { field: 'ingredient_id', headerName: 'Ingredient ID', width: 120 },
                  { field: 'ingredient_name', headerName: 'Ingredient Name', width: 200 },
                  { field: 'ingredient_quantity', headerName: 'Quantity', width: 120 },
                  { field: 'ingredient_unit', headerName: 'Unit', width: 120 },
                  { field: 'ingredient_price', headerName: 'Price', width: 120 },
                  { field: 'supplier_id', headerName: 'Supplier ID', width: 120 },
                  { field: 'reorder_level', headerName: 'Reorder Level', width: 120 },
                  {
                      field: 'action',
                      headerName: 'Action',
                      width: 180,
                      renderCell: (params) => (
                          <div>
                              <button className="btn view_btn" onClick={() => handleView(params.row)}>
                                  View
                              </button>
                              <button className="btn out_btn" onClick={() => handleDelete(params.row.id)}>
                                  Delete
                              </button>
                          </div>
                      ),
                  },
              ];

    const [currentProduct, setCurrentProduct] = useState({
        id: null,
        productId: '',
        productName: '',
        quantity: '',
        unitMeasure: '',
        price: '',
        supplierId: '',
        reorderLevel: '',
        expiryDate: 'date',
        productStatus: 'in',
        section: 'main',
        type: 'products',
    });

    const openModal = (product = null) => {
        if (product) {
            setCurrentProduct({
                ...product,
                quantity: product.quantity >= 0 ? product.quantity : 0,
            });
            setIsEditing(true);
        } else {
            setCurrentProduct({
                id: null,
                productId: '',
                productName: '',
                quantity: 0,
                price: '',
                supplierId: '',
                reorderLevel: 0,
                productStatus: 'in',
                section: selectedSection,
                type: selectedInventoryType,
            });
            setIsEditing(false);
        }
        setModalOpen(true);
        setQuantityAdjustment(0);
        setRemarks('');
    };

    const closeModal = () => {
        setModalOpen(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        if ((name === 'quantity' || name === 'reorderLevel') && value < 0) {
            alert(`${name} must be a positive value.`);
            return;
        }

        setCurrentProduct((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = () => {
        if (currentProduct.quantity < 0 || currentProduct.reorderLevel < 0) {
            alert('Quantity and Reorder Level must be positive values.');
            return;
        }

        const nameKey = selectedInventoryType === 'products' ? 'product_name' : 'ingredient_name';
        const newProduct = {
            ...currentProduct,
            section: selectedSection,
            type: selectedInventoryType,
            id: isEditing ? currentProduct.id : inventoryData.length + 1,
            quantity: parseInt(currentProduct.quantity) + parseInt(quantityAdjustment),
        };

        if (isEditing) {
            setInventoryData((prevData) =>
                prevData.map((item) => (item.id === currentProduct.id ? newProduct : item))
            );
        } else {
            setInventoryData((prevData) => [...prevData, newProduct]);
        }

        const transactionEntry = {
            [nameKey]: newProduct[nameKey],
            quantity: quantityAdjustment,
            price: newProduct.price,
            status: currentProduct.productStatus,
            productId: newProduct.productId || newProduct.ingredientId,
            remarks,
        };

        setSelectedProduct((prevTransactions) => [...prevTransactions, transactionEntry]);

        closeModal();
    };

    const handleDelete = (id) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this item?');
        if (confirmDelete) {
            setInventoryData((prevData) => prevData.filter((item) => item.id !== id));
        }
    };

    const openQuantityModal = (type) => {
        setAdjustmentType(type);
        setQuantityModalOpen(true);
    };

    const closeQuantityModal = () => {
        setQuantityModalOpen(false);
    };

    const handleView = (item) => {
        const nameKey = selectedInventoryType === 'products' ? 'product_name' : 'ingredient_name';
        const transactions = selectedProduct.filter(
            (transaction) => transaction[nameKey] === item[nameKey]
        );

        setCurrentProductName(item[nameKey]);
        setFilteredView(transactions);
        setViewFilter('all');
        setViewModalOpen(true);
    };

    const handleQuantityAdjustmentSubmit = () => {
        const adjustmentValue = parseInt(quantityAdjustment, 10);

        if (isNaN(adjustmentValue) || adjustmentValue <= 0) {
            alert('Please enter a positive integer for quantity adjustment.');
            return;
        }

        const nameKey = selectedInventoryType === 'products' ? 'product_name' : 'ingredient_name';
        const quantityKey = selectedInventoryType === 'products' ? 'product_quantity' : 'ingredient_quantity';

        const updatedData = inventoryData.map((item) => {
            if (item[nameKey] === currentProductName) {
                const currentQuantity = parseInt(item[quantityKey], 10) || 0;
                const newQuantity =
                    adjustmentType === 'in'
                        ? currentQuantity + adjustmentValue
                        : currentQuantity - adjustmentValue;

                if (newQuantity < 0) {
                    alert('Cannot reduce quantity below zero.');
                    return item;
                }

                return {
                    ...item,
                    [quantityKey]: newQuantity,
                };
            }
            return item;
        });

        setInventoryData(updatedData);

        const newTransaction = {
            date: new Date().toLocaleDateString(),
            [nameKey]: currentProductName,
            quantity: adjustmentValue,
            status: adjustmentType,
            remarks,
        };

        setSelectedProduct((prevTransactions) => [...prevTransactions, newTransaction]);

        setQuantityAdjustment('');
        setRemarks('');
        closeQuantityModal();
    };

    useEffect(() => {
        setSelectedSection(isLakbayKape ? 'lakbayKape' : 'lakbayKain');
    }, [isLakbayKape]);

    return (
        <div className="dashboard_container">
            <div className="dashboard_header">
                <input
                    className="search-bar"
                    placeholder="Search anything here"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="dashboard_content">
                <div className="dashboard_title">
                    <h2>Inventory</h2>
                    <div className="actions">
                        <select
                            className="inventory_section_dropdown"
                            value={selectedSection}
                            onChange={(e) => setSelectedSection(e.target.value)}
                        >
                            <option value="lakbayKain">Lakbay Kain</option>
                            <option value="lakbayKape">Lakbay Kape</option>
                        </select>

                        <select
                            className="inventory_type_dropdown"
                            value={selectedInventoryType}
                            onChange={(e) => setSelectedInventoryType(e.target.value)}
                        >
                            <option value="products">Products</option>
                            <option value="ingredients">Ingredients</option>
                        </select>

                        <button className="btn add-inventory_btn" onClick={() => openModal()}>
                            Add Item
                        </button>
                    </div>
                </div>

                <div className="inventory_table">
                    <DataGrid
                        rows={filteredInventory}
                        columns={columns}
                        pageSize={10}
                        rowsPerPageOptions={[10, 20, 50]}
                        components={{
                            NoRowsOverlay: () => <div>No data available</div>,
                        }}
                    />
                </div>
            </div>

            {modalOpen && (
                <div className="modal1">
                    <div className="modal-content1">
                        <h2>{isEditing ? 'Edit Inventory' : 'Add Inventory'}</h2>

                        {selectedInventoryType === 'products' ? (
                            <>
                                <label htmlFor="productName">Product Name</label>
                                <input
                                    type="text"
                                    name="product_name"
                                    placeholder="Product Name"
                                    value={currentProduct.product_name}
                                    onChange={handleInputChange}
                                />

                                <label htmlFor="quantity">Quantity</label>
                                <input
                                    type="number"
                                    name="product_quantity"
                                    placeholder="Quantity"
                                    value={currentProduct.product_quantity}
                                    onChange={handleInputChange}
                                />

                                <label htmlFor="price">Price</label>
                                <input
                                    type="text"
                                    name="product_price"
                                    placeholder="Price"
                                    value={currentProduct.product_price}
                                    onChange={handleInputChange}
                                />

                                <label htmlFor="reorderLevel">Reorder Trigger</label>
                                <input
                                    type="number"
                                    name="reorder_level"
                                    placeholder="Reorder Level"
                                    value={currentProduct.reorder_level}
                                    onChange={handleInputChange}
                                />

                                <label htmlFor="categoryid">Meal Type</label>
                                <input
                                    type="text"
                                    name="category_id"
                                    placeholder="Category ID"
                                    value={currentProduct.category_id}
                                    onChange={handleInputChange}
                                />
                            </>
                        ) : (
                            <>
                                <label htmlFor="ingredientName">Ingredient Name</label>
                                <input
                                    type="text"
                                    name="ingredient_name"
                                    placeholder="Ingredient Name"
                                    value={currentProduct.ingredient_name}
                                    onChange={handleInputChange}
                                />

                                <label htmlFor="quantity">Quantity</label>
                                <input
                                    type="number"
                                    name="ingredient_quantity"
                                    placeholder="Ingredient Quantity"
                                    value={currentProduct.ingredient_quantity}
                                    onChange={handleInputChange}
                                />

                                <label htmlFor="ingredient_unit">Unit of Measure</label>
                                <select
                                    name="ingredient_unit"
                                    value={currentProduct.ingredient_unit}
                                    onChange={handleInputChange}
                                >
                                    <option value="" disabled>
                                        Select Unit of Measure
                                    </option>
                                    <option value="kg">Kilograms (kg)</option>
                                    <option value="g">Grams (g)</option>
                                    <option value="L">Liters (L)</option>
                                    <option value="ml">Milliliters (ml)</option>
                                </select>

                                <label htmlFor="price">Price</label>
                                <input
                                    type="text"
                                    name="ingredient_price"
                                    placeholder="Ingredient Price"
                                    value={currentProduct.ingredient_price}
                                    onChange={handleInputChange}
                                />

                                <label htmlFor="reorderLevel">Reorder Level</label>
                                <input
                                    type="number"
                                    name="reorder_level"
                                    placeholder="Reorder Trigger"
                                    value={currentProduct.reorder_level}
                                    onChange={handleInputChange}
                                />
                            </>
                        )}

                        <button onClick={handleSubmit} className="btn submit_btn">
                            {isEditing ? 'Update' : 'Add'}
                        </button>
                        <button className="btn close_btn" onClick={closeModal}>
                            Close
                        </button>
                    </div>
                </div>
            )}

            {viewModalOpen && (
                <div className="modal_view">
                    <div className="modal_view2">
                        <div className="header_container">
                            <h2>
                                {selectedInventoryType === 'products'
                                    ? 'Inventory of Product'
                                    : 'Inventory of Ingredient'}
                                : {currentProductName}
                            </h2>
                            <span onClick={() => setViewModalOpen(false)} className="close">
                                &times;
                            </span>
                        </div>
                        <div className="viewModal_in_out_btn">
                            <button onClick={() => openQuantityModal('in')} className="btn_in_btn">
                                In
                            </button>
                            <button onClick={() => openQuantityModal('out')} className="btn_out_btn">
                                Out
                            </button>
                        </div>

                        <table>
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>
                                        {selectedInventoryType === 'products'
                                            ? 'Product Name'
                                            : 'Ingredient Name'}
                                    </th>
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
                                        <td>
                                            {selectedInventoryType === 'products'
                                                ? transaction.product_name
                                                : transaction.ingredient_name}
                                        </td>
                                        <td>{transaction.quantity}</td>
                                        <td>{transaction.status}</td>
                                        <td>{transaction.remarks}</td>
                                        <td>{transaction.supplier_id}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {quantityModalOpen && (
                <div className="modal1">
                    <div className="modal-content1">
                        <h3>Update Quantity</h3>

                        <label htmlFor="supplier_id">Supplier</label>
                                <select
                                    name="supplier_id"
                                    value={currentProduct.supplier_id}
                                    onChange={handleInputChange}
                                >
                                    <option value="" disabled>
                                        Select Supplier
                                    </option>
                                </select>

                        <label htmlFor="quantityAdjustment">Quantity</label>
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

                        <button
                            onClick={handleQuantityAdjustmentSubmit}
                            className="submit-btn"
                        >
                            Submit Adjustment
                        </button>
                        <button onClick={closeQuantityModal} className="btn close_btn">
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Inventory;