import { useState } from 'react';
import '../css/inventory.css';

const Inventory = () => {
  const [activeTab, setActiveTab] = useState('Order Status');
  
  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };

  const [items, setItems] = useState([]);
  const [products, setProducts] = useState([]);
  

  const handleAddItem = () => {
    const newItem = {
      id: `#${Math.floor(Math.random() * 10000)}`, 
      product: 'New Product',
      category: 'raw',
      store: 'Store name',
      instruction: 'Stock adjustment',
      items: '80/100',
      status: 'Pending',
    };

    setItems([...items, newItem]); 
  };

  const handleAddProduct = () => {
    const newProduct = {
      id: `#${Math.floor(Math.random() * 10000)}`,
      category: 'Category A', 
      quantity: 100, 
      dateAdded: new Date().toLocaleDateString(), 
      expiration: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
      status: 'In Stock',
    };

    setProducts([...products, newProduct]); 
  };

  
  const deleteItem = (id, type) => {

    const confirmDelete = window.confirm('Delete this item?');
    
    if (confirmDelete) {
      if (type === 'item') {
        setItems(items.filter((item) => item.id !== id));
      } else if (type === 'product') {
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

          <button className="add_product_btn" onClick={handleAddItem} disabled={activeTab === 'Product Status'}>Add Item</button>

          <button className="add_product_btn2" onClick={handleAddProduct} disabled={activeTab === 'Order Status'}>
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

              <tbody>
                {items.map((item, index) => (
                  <tr key={index}>
                    <td>
                      <input type="checkbox" />
                    </td>
                    <td>{item.id}</td>
                    <td>{item.product}</td>
                    <td>{item.category}</td>
                    <td>{item.store}</td>
                    <td>{item.instruction}</td>
                    <td>{item.items}</td>
                    <td>
                      <span className={`status ${item.status === 'Completed' ? 'completed' : 'pending'}`}>
                        {item.status}
                      </span>
                    </td>

                    <td className='item_action_btns'>
                      <button onClick={() => (item.id)}>View</button>
                      <button onClick={() => (item.id)}>Edit</button>
                      <button onClick={() => deleteItem(item.id, 'item')}>Delete</button>
              </td>
                  </tr>
                ))}
              </tbody>
            </table>

        </div>
      ) : (

        <table className="order_table">
        <thead>
          <tr>
            <th>Product ID</th>
            <th>Category</th>
            <th>Quantity</th>
            <th>Date Added</th>
            <th>Expiration</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => (
            <tr key={index}>
              <td>{product.id}</td>
              <td>{product.category}</td>
              <td>{product.quantity}</td>
              <td>{product.dateAdded}</td>
              <td>{product.expiration}</td>
              <td>
                <span className={`status ${product.status === 'In Stock' ? 'completed' : 'pending'}`}>
                  {product.status}
                </span>
              </td>

              <td className='products_action_btns'>
              <button onClick={() => (product.id)}>View</button>
                    <button onClick={() => (product.id)}>Edit</button>
                    <button onClick={() => deleteItem(product.id, 'product')}>Delete</button>

              </td>
                
            </tr>
          ))}
        </tbody>
      </table>
    )}
    </div>
  );
};

export default Inventory 