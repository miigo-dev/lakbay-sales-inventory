import { DataGrid } from '@mui/x-data-grid';
import { useState, useEffect } from 'react';
import '../css/inventory.css';

const Inventory = () => {
    const [selectedSection, setSelectedSection] = useState('lakbayKain'); // Default to lakbayKain
    const [selectedInventoryType, setSelectedInventoryType] = useState('products');
    const [searchTerm, setSearchTerm] = useState('');
    const [inventoryData, setInventoryData] = useState([]);

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
    

    // Configure columns dynamically based on selected inventory type
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
                              <button className="btn view_btn" onClick={() => console.log(params.row)}>View</button>
                              <button className="btn out_btn" onClick={() => console.log('Delete', params.row.id)}>Delete</button>
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
                              <button className="btn view_btn" onClick={() => console.log(params.row)}>View</button>
                              <button className="btn out_btn" onClick={() => console.log('Delete', params.row.id)}>Delete</button>
                          </div>
                      ),
                  },
              ];

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
        </div>
    );
};

export default Inventory;