import { useState } from 'react';
import '../css/inventory.css';

const Inventory = () => {
  const [activeTab, setActiveTab] = useState('Order Status');
  
  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };

  const [products, setProducts] = useState([]);

  const [modalOpen, setModalOpen] = useState (false);
  const [modalData, setModalData] = useState ({
        id: '',
        productName: '',
        category: '',
        unitofMeasure: '',
        price: '',
        stockQuantity: '',
        reorderLevel: '',
        productStatus: '',
        supplierId: ''
      });

  const [edit, setEdit] = useState(false);

  const openModal = (product = null) => {
  
    if (product) {
      setModalData (product);
      setEdit (true);
    } else {
      setModalData ({
        id: '',
        productName: '',
        category: '',
        unitofMeasure: '',
        price: '',
        stockQuantity: '',
        reorderLevel: '',
        productStatus: '',
        supplierId: ''
      });
      setEdit (false);
    }
    
    setModalOpen (true);
  };
  
  const closeModal = () => {
    setModalOpen (false);
  };

  const inputChange = (e) => {
    const { 
      name,
      value 
    } = e.target;
    setModalData((prevData) => ({ ...prevData, [name]: value }));
  };

  const submitForm = () => {

    if (edit) {
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.id === modalData.id ? modalData : product
        )
      );
    } else {
      setProducts([...products, modalData]);
    }
    setModalOpen(false);
  };
  
  const deleteItem = (id, type) => {

    const confirmDelete = window.confirm('Delete this item?');
    
    if (confirmDelete) {
      if (type === 'product') {
        setProducts(products.filter((product) => product.id !== id));
      }
      else {
        console.log('Invalid');
      }
    }

  }

  return (
    <div className="inventory_container">
      <div className="searchbar">

        <input
          type="text"
          placeholder="Search a product"
          className="searchbar_input"/>
        <button className="search_btn">Search</button>
        <button className="filter_btn">Filter</button>
      </div>

      <div className="tabs">
          <button
            className={`tab ${activeTab === 'Order Status' ? 'active' : ''}`}
            onClick={() => handleTabClick('Order Status')}>
            Order Status
          </button>

          <button
            className={`tab ${activeTab === 'Product Status' ? 'active' : ''}`}
            onClick={() => handleTabClick('Product Status')}>
            Product Status
          </button>

          
          <button className="add_product_btn2" onClick={() => openModal()} disabled={activeTab === 'Order Status'}>
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
            
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => (
            <tr key={index}>
              <td>{product.id}</td>
              <td>{product.productName}</td>
              <td>{product.category}</td>
              <td>{product.unitofMeasure}</td>
              <td>{product.price}</td>
              <td>{product.stockQuantity}</td>
              <td>{product.reorderLevel}</td>
              <td>{product.productStatus}</td>
              <td>{product.supplierId}</td>
              <td>
                  <button onClick={() => openModal(product)}>Edit</button>
                  <button onClick={() => deleteItem(product.id, 'product')}>Delete</button>
              
              </td>               
            </tr>
          ))}
        </tbody>
      </table>
    )}

{modalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeModal}>&times;</span>

            <h2>{edit ? 'Edit Product' : 'Add Product'}</h2>

            <form onSubmit={(e) => { e.preventDefault(); submitForm(); }}>
              
            <label>Product ID:</label>
              <input type="text" name="productId" 
              value={modalData.productId} 
              onChange={inputChange} required/>
              <br/>

              <label>Product Name:</label>
              <input type="text" name="productName" 
              value={modalData.productName} 
              onChange={inputChange} required/>
              <br/>

              <label>Category:</label>
              <input type="text" name="category" 
              value={modalData.category} 
              onChange={inputChange} required/>
              <br/>

              <label>Unit of Measure:</label>
              <input type="text" name="unitofMeasure" 
              value={modalData.unitofMeasure} 
              onChange={inputChange}required/>
              <br/>

              <label>Price:</label>
              <input type="number" name="price" value={modalData.price} onChange={inputChange} required /><br/>
              <label>Stock Quantity:</label>
              <input type="number" name="stockQuantity" value={modalData.stockQuantity} onChange={inputChange} required /><br/>
              <label>Reorder Level:</label>
              <input type="number" name="reorderLevel" value={modalData.reorderLevel} onChange={inputChange} required /><br/>
              <label>Product Status:</label>
              <input type="text" name="productStatus" value={modalData.productStatus} onChange={inputChange} required /><br/>
              <label>Supplier ID:</label>
              <input type="text" name="supplierId" value={modalData.supplierId} onChange={inputChange} required /><br/>
              <button type="submit">{edit ? 'Update' : 'Add'} Product</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory 