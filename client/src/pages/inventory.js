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
    const [suppliers, setSuppliers] = useState([]);
    const [editModalOpen, setEditModalOpen] = useState(false); 
    const [editedProductName, setEditedProductName] = useState(''); 
    const [editedProductPrice, setEditedProductPrice] = useState(0); 
    const [currentProductPrice, setCurrentProductPrice] = useState(0); 
    const [showArchived, setShowArchived] = useState(false);
    const [archivedItems, setArchivedItems] = useState([]);
    const [categories, setCategories] = useState([]);
    

    const getWarehouseId = () => (selectedSection === 'lakbayKape' ? 2 : 1);

    const fetchCategories = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/product-categories');
            const data = await response.json();
            setCategories(data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };
    
    // Call fetchCategories on component mount
    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchSuppliers = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/suppliers');
            const data = await response.json();
            setSuppliers(data);
        } catch (error) {
            console.error('Error fetching suppliers:', error);
        }
    };

    const fetchInventoryData = async () => {
        try {
            const warehouseId = getWarehouseId();
            const type = selectedInventoryType;
    
            const url = `http://localhost:8080/api/${type}/warehouses/${warehouseId}`;
            const response = await fetch(url);
            const data = await response.json();
    
            setInventoryData(
                data.map((item) => ({
                    ...item,
                    id: selectedInventoryType === 'products' ? item.product_id : item.ingredient_id, // Explicit id assignment
                }))
            );
        } catch (error) {
            console.error('Error fetching inventory data:', error);
        }
    };

    const fetchMovementsByID = async (itemId, itemType) => {
        try {
            const response = await fetch(`http://localhost:8080/api/movements/${itemType}/${itemId}`);
            if (!response.ok) {
                throw new Error(`Error fetching movements: ${response.statusText}`);
            }
    
            const data = await response.json();
    
            // Map the data to only include necessary fields
            const mappedData = data.map((movement) => ({
                supplier_id: movement.supplier_id,
                movement_quantity: movement.movement_quantity,
                movement_type: movement.movement_type,
                remarks: movement.remarks,
                movement_date: new Date(movement.movement_date).toLocaleDateString(),
            }));
    
            setFilteredView(mappedData);
        } catch (error) {
            console.error('Error fetching movements:', error);
            alert('Failed to fetch movement history. Please try again.');
        }
    };
    

    useEffect(() => {
        fetchInventoryData();
        fetchSuppliers();
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
                { field: 'product_id', headerName: 'Product ID', width: 150 },
                { field: 'product_name', headerName: 'Product Name', width: 200 },
                { field: 'product_quantity', headerName: 'Quantity', width: 120 },
                { field: 'product_price', headerName: 'Price', width: 120 },
                { field: 'reorder_level', headerName: 'Reorder Trigger', width: 170 },
                { field: 'category_id', headerName: 'Meal Type', width: 120 },
                {
                    field: 'action',
                    headerName: 'Action',
                    width: 300,
                    
                    renderCell: (params) => (
                    <div>
                        <button className="btn view_btn" onClick={() => handleView(params.row)}>
                            View
                        </button>
                        {showArchived ? (
                            <button className="btn unarchive_btn" onClick={() => handleUnarchive(params.row)}>
                                Unarchive
                            </button>
                            ) : (
                            
                            <button className="btn archive_btn" onClick={() => handleArchive(params.row)}>
                                Archive
                            </button>
                        )}
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
                { field: 'supplier_id', headerName: 'Supplier ID', width: 170 },
                { field: 'reorder_level', headerName: 'Reorder Level', width: 150 },
                {
                    field: 'action',
                    headerName: 'Action',
                    width: 300,
                    renderCell: (params) => (
                        <div>
                            <button className="btn view_btn" onClick={() => handleView(params.row)}>
                                View
                            </button>
                            {showArchived ? (
                                <button className="btn unarchive_btn" onClick={() => handleUnarchive(params.row)}>
                                    Unarchive
                                </button>
                            ) : (
                                <button className="btn archive_btn" onClick={() => handleArchive(params.row)}>
                                    Archive
                                </button>
                            )}
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

    const handleArchive = (item) => {
        const confirmArchive = window.confirm(`Are you sure you want to archive "${item.name}"?`);

        if (confirmArchive) {
            setArchivedItems((prevArchived) => [...prevArchived, item]);
            setInventoryData((prevData) => prevData.filter((dataItem) => dataItem.id !== item.id));
            alert(`${item.name} has been archived.`);
        }
    };

    const handleUnarchive = (item) => {
        const confirmUnarchive = window.confirm(`Are you sure you want to unarchive "${item.name}"?`);

        if (confirmUnarchive) {
            setInventoryData((prevData) => [...prevData, item]);
            setArchivedItems((prevArchived) => prevArchived.filter((archivedItem) => archivedItem.id !== item.id));
            alert(`${item.name} has been unarchived.`);
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
        console.log('Selected Item:', item);
    
        setCurrentProduct({
            ...item,
            id: selectedInventoryType === 'products' ? item.product_id : item.ingredient_id,
        });
    
        setCurrentProductName(
            selectedInventoryType === 'products' ? item.product_name : item.ingredient_name
        );
    
        const itemType = selectedInventoryType === 'products' ? 'product' : 'ingredient'; 
        const itemId = selectedInventoryType === 'products' ? item.product_id : item.ingredient_id;
    
        if (!itemId || !itemType) {
            console.error('Invalid itemId or itemType:', { itemId, itemType });
            return;
        }

        fetchMovementsByID(itemId, itemType);
    
        setViewModalOpen(true);
    };

    const handleQuantityAdjustmentSubmit = async () => {
        const adjustmentValue = parseInt(quantityAdjustment, 10);
    
        if (isNaN(adjustmentValue) || adjustmentValue <= 0) {
            alert('Please enter a positive integer for quantity adjustment.');
            return;
        }
    
        const itemType = selectedInventoryType === 'products' ? 'product' : 'ingredient'; 
        const itemId = currentProduct.id;
    
        if (!itemId) {
            alert('Error: Item ID is missing. Please try again.');
            console.error('Missing Item ID:', currentProduct);
            return;
        }
    
        console.log('Payload being sent:', {
            itemType: itemType.toUpperCase(),
            itemId,
            quantity: adjustmentValue,
            movementType: adjustmentType.toUpperCase(),
            supplierId: currentProduct.supplier_id || null,
            remarks,
        });
    
        try {
            const response = await fetch('http://localhost:8080/api/movements', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    itemType: itemType.toUpperCase(),
                    itemId,
                    quantity: adjustmentValue,
                    movementType: adjustmentType.toUpperCase(),
                    supplierId: currentProduct.supplier_id || null,
                    remarks,
                }),
            });
    
            if (!response.ok) {
                throw new Error(`Error creating movement: ${response.statusText}`);
            }
    
            const newMovement = await response.json();
            console.log('New movement created:', newMovement);
    
            const updatedMovement = {
                supplier_id: newMovement.supplier_id,
                movement_quantity: newMovement.movement_quantity,
                movement_type: newMovement.movement_type,
                remarks: newMovement.remarks,
                movement_date: new Date(newMovement.movement_date).toLocaleDateString(),
            };
    
            setFilteredView((prevMovements) => [...prevMovements, updatedMovement]);
    
            setInventoryData((prevInventory) =>
                prevInventory.map((item) => {
                    if (item.id === itemId) {
                        const updatedQuantity =
                            adjustmentType.toUpperCase() === 'IN'
                                ? item[selectedInventoryType === 'products' ? 'product_quantity' : 'ingredient_quantity'] + adjustmentValue
                                : item[selectedInventoryType === 'products' ? 'product_quantity' : 'ingredient_quantity'] - adjustmentValue;
            
                        return {
                            ...item,
                            [selectedInventoryType === 'products' ? 'product_quantity' : 'ingredient_quantity']: updatedQuantity,
                        };
                    }
                    return item;
                })
            );
            
    
            setQuantityAdjustment('');
            setRemarks('');
            closeQuantityModal();
            alert(`Movement ${adjustmentType.toUpperCase()} created successfully!`);
        } catch (error) {
            console.error('Error creating movement:', error);
            alert('Failed to create movement. Please try again.');
        }
    };

    const openEditModal = () => {
        if (
            !currentProduct || 
            (selectedInventoryType === 'products' && !currentProduct.product_id) ||
            (selectedInventoryType === 'ingredients' && !currentProduct.ingredient_id)
        ) {
            alert('No item selected. Please try again.');
            return;
        }
    
        // Pre-fill the modal with product or ingredient details
        if (selectedInventoryType === 'products') {
            setEditedProductName(currentProduct.product_name);
            setEditedProductPrice(currentProduct.product_price);
        } else {
            setEditedProductName(currentProduct.ingredient_name);
            setEditedProductPrice(currentProduct.ingredient_price);
        }
    
        setEditModalOpen(true); // Open the modal
    };       
    
    const saveEditChanges = async () => {
        if (!editedProductName || editedProductPrice <= 0) {
            alert('Please provide valid details.');
            return;
        }
    
        // Determine the payload and endpoint based on selectedInventoryType
        const payload =
            selectedInventoryType === 'products'
                ? {
                      product_name: editedProductName,
                      product_price: editedProductPrice,
                  }
                : {
                      ingredient_name: editedProductName,
                      ingredient_price: editedProductPrice,
                  };
    
        const endpoint =
            selectedInventoryType === 'products'
                ? `http://localhost:8080/api/products/${currentProduct.product_id}`
                : `http://localhost:8080/api/ingredients/${currentProduct.ingredient_id}`;
    
        try {
            const response = await fetch(endpoint, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });
    
            if (!response.ok) {
                throw new Error(`Failed to update ${selectedInventoryType}: ${response.statusText}`);
            }
    
            const updatedItem = await response.json();
    
            // Update the state with the new product/ingredient details
            setInventoryData((prevData) =>
                prevData.map((item) =>
                    item.id === currentProduct.id ? {
                        ...item,
                        ...(selectedInventoryType === 'products' ? {
                            product_name: updatedItem.product_name,
                            product_price: updatedItem.product_price,
                        } : {
                                ingredient_name: updatedItem.ingredient_name,
                                ingredient_price: updatedItem.ingredient_price,
                            }),
                        }
                    : item
                )
            );
    
            alert(`${selectedInventoryType === 'products' ? 'Product' : 'Ingredient'} updated successfully!`);
            setEditModalOpen(false);
            setViewModalOpen(false);
        } catch (error) {
            console.error(`Error updating ${selectedInventoryType}:`, error);
            alert('Failed to update item. Please try again.');
        }
    };
    
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

                        <button
                            className="btn toggle_archive_btn"
                            onClick={() => setShowArchived(!showArchived)}
                        >
                            {showArchived ? 'Show Active Items' : 'Show Archived Items'}
                        </button>
                    </div>
                </div>

                <div className="inventory_table">
                    <DataGrid
                         rows={showArchived ? archivedItems : filteredInventory}
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
                <div className="modal">
                    <div className="modal_content">
                        <h2>{isEditing ? 'Edit Inventory' : 'Add Inventory'}</h2>

                        {selectedInventoryType === 'products' ? (
                            <>
                                <label htmlFor="product_category">Product Category</label>
                                <select
                                    name="product_category"
                                    value={currentProduct.category_id}
                                    onChange={handleInputChange}
                                >
                                    <option value="" disabled>
                                        Select Type
                                    </option>
                                </select>

                                

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
                            </>
                        ) : (
                            <>
                                <label htmlFor="ingredient_type">Ingredient Type</label>
                                <select
                                    name="ingredient_typpe"
                                    value={currentProduct.ingredient_id}
                                    onChange={handleInputChange}
                                >
                                    <option value="" disabled>
                                        Select Type
                                    </option>
                                </select>

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

                        <button onClick={handleSubmit} className="submit_add">
                            {isEditing ? 'Update' : 'Add'}
                        </button>
                        <button className="close_button" onClick={closeModal}>
                            &times;
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
                            <span onClick={() => setViewModalOpen(false)} className="close_button">
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

                            <button onClick={openEditModal} className="btn_edit_btn">
                                Edit
                            </button>
                        </div>
                        <div className="table_container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Quantity</th>
                                    <th>Type</th>
                                    <th>Remarks</th>
                                    <th>Supplier</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredView.map((movement, index) => {
                                    // Find the supplier name using the supplier_id
                                    const supplier = suppliers.find(
                                        (sup) => sup.supplier_id === movement.supplier_id
                                    );
                                    return (
                                        <tr key={index}>
                                            <td>{movement.movement_date}</td>
                                            <td>{movement.movement_quantity}</td>
                                            <td>{movement.movement_type}</td>
                                            <td>{movement.remarks}</td>
                                            <td>{supplier ? supplier.supplier_name : 'N/A'}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                        </div>
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
                            onChange={(e) => setCurrentProduct({ ...currentProduct, supplier_id: e.target.value })}
                        >
                            <option value="">Select Supplier</option>
                            {suppliers.map((supplier) => (
                                <option key={supplier.supplier_id} value={supplier.supplier_id}>
                                    {supplier.supplier_name} 
                                </option>
                            ))}
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
                            className="btn submit-btn"
                        >
                            Submit Adjustment
                        </button>
                        <button onClick={closeQuantityModal} className="btn close_btn">
                            Close
                        </button>
                    </div>
                </div>
            )}

{editModalOpen && (
    <div className="modal_view">
        <div className="modal_view2">
            <div className="header_container">
                <h2>Edit Product Details</h2>
                <span onClick={() => setEditModalOpen(false)} className="close_button">
                    &times;
                </span>
            </div>
            <div className="edit_form">
                <label>
                    Product Name:
                    <input
                        type="text"
                        value={editedProductName}
                        onChange={(e) => setEditedProductName(e.target.value)}
                    />
                </label>
                <label>
                    Product Price:
                    <input
                        type="number"
                        value={editedProductPrice}
                        onChange={(e) => {
                            const value = e.target.value;
                            // Allow empty string or convert to number
                            setEditedProductPrice(value === '' ? '' : Number(value));
                        }}
                    />
                </label>
                <button onClick={saveEditChanges} className="save_button">
                    Save Changes
                </button>
            </div>
        </div>
    </div>
)}
        </div>
    );
};
export default Inventory;