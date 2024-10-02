import { useState, useEffect } from 'react';
import '../css/inventory.css';

const Inventory = () => {
  const [activeTab, setActiveTab] = useState('Order Status');
  const [products, setProducts] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState({
    productName: '',
    category: '',
    unitofMeasure: '',
    price: '',
    stockQuantity: '',
    reorderLevel: '',
    productStatus: '',
    supplierId: ''
  });

  const openModal = () => {
    console.log("Add Product button clicked!");
    setModalData({
      productName: '',
      category: '',
      unitofMeasure: '',
      price: '',
      stockQuantity: '',
      reorderLevel: '',
      productStatus: '',
      supplierId: ''
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const inputChange = (e) => {
    const { name, value } = e.target;
    setModalData((prevData) => ({ ...prevData, [name]: value }));
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/get-inv'); // Update with your API endpoint
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const submitForm = async () => {
    const url = 'http://localhost:8080/api/add-inv'; // Only POST for adding products

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                ProductName: modalData.productName,
                Category: modalData.category,
                UnitOfMeasure: modalData.unitofMeasure,
                Price: modalData.price,
                StockQuantity: modalData.stockQuantity,
                SupplierID: modalData.supplierId || null,
            })
        });

        if (response.ok) {
            const newProduct = await response.json();
            console.log('New Product:', newProduct); // Log the new product
            setProducts((prevProducts) => [...prevProducts, newProduct]);
            setModalOpen(false);
        } else {
            console.error('Failed to save product:', response.statusText);
        }
    } catch (error) {
        console.error('Error saving product:', error);
    }
  };

  const deleteItem = async (productId) => { // Accept productId as parameter
    const confirmDelete = window.confirm('Delete this item?');
  
    if (confirmDelete) {
      try {
        const response = await fetch(`http://localhost:8080/api/inventory/${productId}`, { // Correct endpoint with productId
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });
  
        if (response.ok) {
          // Filter out the deleted product from the state
          setProducts((prevProducts) => prevProducts.filter((item) => item.productid !== productId));
        } else {
          const errorData = await response.json();
          console.error('Failed to delete item:', response.statusText, errorData);
        }
      } catch (error) {
        console.error('Error deleting item:', error);
      }
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="inventory_container">
      <div className="searchbar">
        <input type="text" placeholder="Search a product" className="searchbar_input" />
        <button className="search_btn">Search</button>
        <button className="filter_btn">Filter</button>
      </div>

      <div className="tabs">
        <button
          className={`tab ${activeTab === 'Order Status' ? 'active' : ''}`}
          onClick={() => setActiveTab('Order Status')}
        >
          Order Status
        </button>

        <button
          className={`tab ${activeTab === 'Product Status' ? 'active' : ''}`}
          onClick={() => setActiveTab('Product Status')}
        >
          Product Status
        </button>

        <button className="add_product_btn2" onClick={openModal} disabled={activeTab === 'Order Status'}>
          Add Product
        </button>
      </div>

      {activeTab === 'Order Status' ? (
        <div>
          <table className="order_table">
            <thead>
              <tr>
                <td>
                  <input type="checkbox" className="hidden_checkbox" />
                </td>
                <th>Order ID</th>
                <th>Product</th>
                <th>Category</th>
                <th>Store</th>
                <th>Instruction</th>
                <th>Items</th>
                <th>Status</th>
              </tr>
            </thead>
          </table>
        </div>
      ) : (
        <table className="order_table">
          <thead>
            <tr>
              <th>Product ID</th>
              <th>Product Name</th>
              <th>Category</th>
              <th>Unit of Measure</th>
              <th>Price</th>
              <th>Stock Quantity</th>
              <th>Reorder Level</th>
              <th>Product Status</th>
              <th>Supplier ID</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(products) && products.length > 0 ? (
              products.map((product) => (
                <tr key={product.id}>
                  <td>{product.productid}</td>
                  <td>{product.productname}</td>
                  <td>{product.category}</td>
                  <td>{product.unitofmeasure}</td>
                  <td>{product.price}</td>
                  <td>{product.stockquantity}</td>
                  <td>{product.reorderlevel}</td>
                  <td>{product.productstatus}</td>
                  <td>{product.supplierId}</td>
              <td>
                <button onClick={() => deleteItem(product.productid)}>Delete</button> {/* Pass the whole product object */}
              </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10">No products available.</td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      {modalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeModal}>&times;</span>

            <h2>Add Product</h2>

            <form onSubmit={(e) => { e.preventDefault(); submitForm(); }}>
              <label>Product Name:</label>
              <input type="text" name="productName" value={modalData.productName} onChange={inputChange} required />
              <br />

              <label>Category:</label>
              <input type="text" name="category" value={modalData.category} onChange={inputChange} required />
              <br />

              <label>Unit of Measure:</label>
              <input type="text" name="unitofMeasure" value={modalData.unitofMeasure} onChange={inputChange} required />
              <br />

              <label>Price:</label>
              <input type="number" name="price" value={modalData.price} onChange={inputChange} required /><br />
              <label>Stock Quantity:</label>
              <input type="number" name="stockQuantity" value={modalData.stockQuantity} onChange={inputChange} required /><br />
              <label>Reorder Level:</label>
              <input type="number" name="reorderLevel" value={modalData.reorderLevel} onChange={inputChange} required /><br />
              <label>Product Status:</label>
              <input type="text" name="productStatus" value={modalData.productStatus} onChange={inputChange} required /><br />
              <label>Supplier ID (optional):</label>
              <input type="text" name="supplierId" value={modalData.supplierId} onChange={inputChange} /><br />
              <button type="submit">Add Product</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;