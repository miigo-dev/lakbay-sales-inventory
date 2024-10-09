import { useEffect, useState } from 'react';
import '../css/inventoryv2.css';
import React from 'react';
import axios from 'axios';

const InventoryDashboard = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedSection, setSelectedSection] = useState('main');
    const [selectedInventoryType, setSelectedInventoryType] = useState('products');
    const [selectedMovementType, setSelectedMovementType] = useState('none');
    const [inventoryData, setInventoryData] = useState([]);
    const [movementData, setMovementData] = useState([]);
    const [products, setProducts] = useState([]);
    const [ingredients, setIngredients] = useState([]);

    const fetchInventoryData = async () => {
        try {
            const baseURL = `http://localhost:8080/api/inventory/`;
            const inventoryURL = selectedInventoryType === 'products' ? `${baseURL}products` : `${baseURL}ingredients`;
            const movementURL = selectedInventoryType === 'products' ? `${baseURL}product-movements` : `${baseURL}ingredient-movements`;

            const [inventoryResponse, movementsResponse] = await Promise.all([
                axios.get(inventoryURL),
                axios.get(movementURL)
            ]);

            const inventoryData = inventoryResponse.data;

            // Store products and ingredients separately
            if (selectedInventoryType === 'products') {
                setProducts(inventoryData);
            } else {
                setIngredients(inventoryData);
            }

            setInventoryData(inventoryData);
            setMovementData(movementsResponse.data);
        } catch (error) {
            console.error('Error fetching inventory data:', error);
        }
    };

    useEffect(() => {
        fetchInventoryData();
    }, [selectedSection, selectedInventoryType]);

    const openModal = (item = null) => {
        setIsEditing(!!item);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
    };

    const handleInputChange = (e) => {
        // Input change logic
    };

    const handleSubmit = async () => {
        // Submission logic
    };

    const handleDelete = async (id) => {
        // Deletion logic
    };

    const getProductNameById = (id) => {
        const product = products.find(prod => prod.id === id);
        return product ? product.product_name : 'Unknown Product';
    };

    const getIngredientNameById = (id) => {
        const ingredient = ingredients.find(ing => ing.id === id);
        return ingredient ? ingredient.ingredient_name : 'Unknown Ingredient';
    };

    // Filtering movement data based on selected movement type
    const filteredMovementData = movementData.filter(movement => {
        if (selectedMovementType === 'none') return false; // No movements to show
        if (selectedMovementType === 'all') return true; // Show all movements
        return movement.movement_type === selectedMovementType.toUpperCase(); // Filter by movement type
    });

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
                            onChange={(e) => setSelectedSection(e.target.value)}
                        >
                            <option value="main">Main Inventory</option>
                            <option value="lakbayKain">Lakbay Kain</option>
                            <option value="lakbayKape">Lakbay Kape</option>
                        </select>

                        <select
                            className="inventory_type_dropdown"
                            value={selectedInventoryType}
                            onChange={(e) => {
                                setSelectedInventoryType(e.target.value);
                                setSelectedMovementType('none'); // Reset movement type on inventory type change
                            }}
                        >
                            <option value="products">Products</option>
                            <option value="ingredients">Ingredients</option>
                        </select>

                        <select
                            className="inventory_movement_dropdown"
                            value={selectedMovementType}
                            onChange={(e) => setSelectedMovementType(e.target.value)}
                        >
                            <option value="none">None</option>
                            <option value="all">All</option>
                            <option value="in">In</option>
                            <option value="out">Out</option>
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
                                    selectedMovementType === 'none' ? (
                                        <>
                                            <th>Product Name</th>
                                            <th>Quantity</th>
                                            <th>Price</th>
                                            <th>Reorder Level</th>
                                            <th>Status</th>
                                            <th>Remarks</th>
                                            <th>Updated</th>
                                            <th>Action</th>
                                        </>
                                    ) : (
                                        <>
                                            <th>Product Name</th>
                                            <th>Quantity</th>
                                            <th>Movement Type</th>
                                            <th>Remarks</th>
                                            <th>Added</th>
                                        </>
                                    )
                                ) : selectedMovementType === 'none' ? (
                                    <>
                                        <th>Ingredient Name</th>
                                        <th>Quantity</th>
                                        <th>Unit</th>
                                        <th>Price</th>
                                        <th>Reorder Level</th>
                                        <th>Status</th>
                                        <th>Updated</th>
                                        <th>Action</th>
                                    </>
                                ) : (
                                    <>
                                        <th>Ingredient Name</th>
                                        <th>Quantity</th>
                                        <th>Movement Type</th>
                                        <th>Remarks</th>
                                        <th>Added</th>
                                    </>
                                )}
                            </tr>
                        </thead>

                        <tbody>
                            {selectedMovementType === 'none' ? (
                                inventoryData.map((item, index) => (
                                    <tr key={item.id}>
                                        <td>{index + 1}</td>
                                        {selectedInventoryType === 'products' ? (
                                            <>
                                                <td>{getProductNameById(item.id)}</td>
                                                <td>{item.product_quantity}</td>
                                                <td>{item.product_price}</td>
                                                <td>{item.reorder_level}</td>
                                                <td>{item.product_status}</td>
                                                <td>{item.remarks}</td>
                                                <td>{new Date(item.updated_at).toLocaleString()}</td>
                                                <td>
                                                    <button className="btn edit_btn" onClick={() => openModal(item)}>
                                                        Edit
                                                    </button>
                                                    <button className="btn delete_btn" onClick={() => handleDelete(item.id)}>
                                                        Delete
                                                    </button>
                                                </td>
                                            </>
                                        ) : (
                                            <>
                                                <td>{getIngredientNameById(item.id)}</td>
                                                <td>{item.ingredient_quantity}</td>
                                                <td>{item.ingredient_unit}</td>
                                                <td>{item.ingredient_price}</td>
                                                <td>{item.reorder_level}</td>
                                                <td>{item.ingredient_status}</td>
                                                <td>{new Date(item.updated_at).toLocaleString()}</td>
                                                <td>
                                                    <button className="btn edit_btn" onClick={() => openModal(item)}>
                                                        Edit
                                                    </button>
                                                    <button className="btn delete_btn" onClick={() => handleDelete(item.id)}>
                                                        Delete
                                                    </button>
                                                </td>
                                            </>
                                        )}
                                    </tr>
                                ))
                            ) : (
                                filteredMovementData.length > 0 ? (
                                    filteredMovementData.map((movement, index) => (
                                        <tr key={movement.pmovement_id || movement.imovement_id}>
                                            <td>{index + 1}</td>
                                            {selectedInventoryType === 'products' ? (
                                                <>
                                                    <td>{getProductNameById(movement.ingredient_id)}</td>
                                                    <td>{movement.pmove_quantity}</td>
                                                    <td>{movement.movement_type}</td>
                                                    <td>{movement.remarks}</td>
                                                    <td>{new Date(movement.movement_date).toLocaleString()}</td>
                                                </>
                                            ) : (
                                                <>
                                                    <td>{getIngredientNameById(movement.ingredient_id)}</td>
                                                    <td>{movement.imove_quantity}</td>
                                                    <td>{movement.movement_type}</td>
                                                    <td>{movement.remarks}</td>
                                                    <td>{new Date(movement.movement_date).toLocaleString()}</td>
                                                </>
                                            )}
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={8}>No movements available</td>
                                    </tr>
                                )
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default InventoryDashboard;
