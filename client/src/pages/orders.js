import React, { useState } from 'react';
import '../css/orders.css';

const Orders = () => {
  
  const [activeLink, setActiveLink] = useState('all');
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [recentOrder, setRecentOrder] = useState(null);
  const [quantity, setQuantity] = useState(0);
  const [size, setSize] = useState('');
  const [orders, setOrders] = useState([]);
  const [customAmount, setCustomAmount] = useState('');
  const [change, setChange] = useState(0);
  const [isLakbayKape, setIsLakbayKape] = useState(false);
  const [searchTerm, setSearchTerm] = useState(''); 
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);

  const lakbayKainMenuItems = [
    { productname: 'Royal', category: 'drinks', price: 4.0, stockquantity: 8 },
    { productname: 'Burger', category: 'meals', price: 6.0, stockquantity: 5 },
    { productname: 'Fries', category: 'side Orders', price: 2.5, stockquantity: 12 },
    { productname: 'Ice Cream', category: 'desserts', price: 2.0, stockquantity: 12 }
  ];

  const lakbayKapeMenuItems = [
    { productname: 'Espresso', category: 'coffee', price: 2.5, stockquantity: 15 },
    { productname: 'Sakura Latte', category: 'non-Coffee', price: 4.5, stockquantity: 10 },
    { productname: 'Matcha', category: 'frappes', price: 7.0, stockquantity: 6 },
    { productname: 'Classic Vanilla', category: 'affogato Series', price: 3.0, stockquantity: 8 },
  ];

  const handleLinkClick = (link) => {
    setActiveLink(link);
    setSearchTerm(''); 
  };

  const handleItemClick = (item) => {
    if (item.stockquantity > 0) {  
      setSelectedItem(item);
      setQuantity(0);
      setSize('');
      setIsModalOpen(true);
    }
  };
  const handleCloseRecentOrderModal = () => {
    setRecentOrder(null);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null); 
  };
  const handleQuantityChange = (operation) => {
    setQuantity((prev) => {
      if (operation === 'increase' && prev < selectedItem.stockquantity) {
        return prev + 1;
      } else if (operation === 'decrease' && prev > 0) {
        return prev - 1;
      }
      return prev;
    });
  };

  const handleSizeSelection = (selectedSize) => setSize(selectedSize);

  const addOrder = () => {
    if (quantity > 0) {
      if (selectedItem.category.toLowerCase() === 'drinks' && !size) {
        alert("Please select a size for drinks.");
        return;
      }
      setOrders((prevOrders) => [
        ...prevOrders,
        {
          item: selectedItem.productname,
          size: selectedItem.category.toLowerCase() === 'meals' ? '' : size,
          quantity,
          price: parseFloat(selectedItem.price),
          category: selectedItem.category,
          date: new Date().toLocaleString(),
        },
      ]);
      setIsModalOpen(false);
    } else {
      alert("Please select a quantity greater than 0.");
    }
  };

  const deleteOrder = (index) => {
    setOrders((prevOrders) => prevOrders.filter((_, i) => i !== index));
  };

  const totalPrice = orders.reduce((total, order) => total + order.price * order.quantity, 0);

  const handleCharge = () => {
    const amount = parseFloat(customAmount);
    if (orders.length === 0) {
      alert("Please add items to your order before charging.");
      return;
    }

    if (amount >= totalPrice) {
      setRecentOrder(orders[orders.length - 1]);
      setChange(amount - totalPrice);
      setCustomAmount('');
      setOrders([]);
    } else {
      alert(`Please enter an amount greater than the total price of ${totalPrice.toFixed(2)}.`);
      setChange(0);
    }
  };

  const toggleView = () => setIsLakbayKape((prev) => !prev);

  const filteredMenuItems = (isLakbayKape ? lakbayKapeMenuItems : lakbayKainMenuItems)
  .filter(item => 
    (activeLink === 'all' || item.category === activeLink) && 
    item.productname.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openTransactionModal = () => {
    setIsTransactionModalOpen(true); 
  };

  return (
    <div className='dashboard'>
     <div className="toggle_header">  
        <input type="checkbox" className='input_type' id="toggle" onChange={toggleView} />
        <div className="display">
          <label className='label_type' htmlFor="toggle">
            <div className="circle">
              <span className="material-symbols-outlined food">restaurant</span>
              <span className="material-symbols-outlined coffee">local_cafe</span>
            </div>
          </label>
          <span className="toggle-text">
            {isLakbayKape ? 'Lakbay Kape' : 'Lakbay Kain'}
          </span>
        </div>
        <button className="transaction-button" onClick={(openTransactionModal)}>
          <i className="material-symbols-outlined">receipt_long</i>
        </button>
      </div>
      <div className='search-container'>
        <input 
          className="search-input" 
          placeholder="Search your Orders" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)} 
        />
        <button className="search-icon-btn" onClick={() => alert('Search Ordered')}>
          <i className="fas fa-search search-icon"></i>
        </button>
      </div>
      <div id='order-content'>
        <div id={isLakbayKape ? "lakbay-kape" : "lakbay-kain"}>
          <ul className='navigation-bar'>
            {isLakbayKape 
              ? ['all', 'coffee', 'non-Coffee', 'frappes', 'affogato Series'].map((category) => (
                <li key={category}>
                  <a
                   href="#!"
                   className={activeLink === category ? 'active' : ''}
                   onClick={() => handleLinkClick(category)}
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                     </a>
                    </li>
                    ))
                    : ['all', 'meals', 'drinks', 'side Orders', 'desserts'].map((category) => (
                        <li key={category}>
                          <a
                            href="#!"
                            className={activeLink === category ? 'active' : ''}
                            onClick={() => handleLinkClick(category)}
                          >
                            {category.charAt(0).toUpperCase() + category.slice(1)}
                          </a>
                      </li>
                    ))
                  }
                </ul>
                <div className='order_container'>
                  {filteredMenuItems.map((item, index) => (
                      <div 
                        key={index} 
                        className={`order_item ${item.stockquantity === 0 ? 'out-of-stock' : ''}`} // Apply out-of-stock class if stock is 0
                        onClick={() => handleItemClick(item)} 
                      >
                        {item.productname}
                        {item.stockquantity === 0}
                      </div>
                    ))}
              </div>
            </div>
          </div>
          {isTransactionModalOpen && (
              <div className="full-screen-modal">
               <div className="modal-content">
                 <h3>Transaction History:</h3>
                 <table>
                   <thead>
                     <tr>
                       <th>Date</th>
                       <th>Order</th>
                       <th>Amount</th>
                       <th>Category</th>
                       <th>Quantity</th>
                     </tr>
                   </thead>
                 </table>
                 <button onClick={() => setIsTransactionModalOpen(false)}>Close</button>
               </div>
             </div>
          )}

      {isModalOpen && selectedItem && (
        <div className="modal">
          <div className="modal_content">
            <button className="close_button" onClick={closeModal}>&times;</button>
            <h2>{selectedItem.productname}</h2>
            {(selectedItem.category.toLowerCase() === 'drinks' || selectedItem.category.toLowerCase() === 'coffee') && (
              <div className="size-options">
                {['Small', 'Medium', 'Large'].map((sizeOption) => (
                  <button key={sizeOption} onClick={() => handleSizeSelection(sizeOption)} className={size === sizeOption ? 'active' : ''}>
                    {sizeOption}
                  </button>
                ))}
              </div>
            )}
            <div className="quantity-control">
              <button onClick={() => handleQuantityChange('decrease')}>-</button>
              <span>{quantity}</span>
              <button onClick={() => handleQuantityChange('increase')}>+</button>
            </div>
            <button onClick={addOrder} className="proceed-button">Proceed</button>
          </div>
        </div>
      )}
      
      {recentOrder && (
        <div className="recent-order-modal">
          <div className="recent-order-content">
            <h2>Order Summary</h2>
            <h2 className='total-price'>Change: {change.toFixed(2)}</h2>
            <p>Order: {recentOrder.item}</p>
            <p>{recentOrder.size && `Size: ${recentOrder.size}`}</p>
            <p>Quantity: {recentOrder.quantity}</p>
            <p>Amount: {(recentOrder.price * recentOrder.quantity).toFixed(2)}</p>
            <button className="close-button" onClick={handleCloseRecentOrderModal}>Complete</button>
          </div>
        </div>
      )}

      <div className="items-section">
        <h4>Items:</h4>
        {orders.length === 0 ? (
          <p>No items added yet.</p>
        ) : (
          <ul>
            {orders.map((order, index) => (
              <li key={index} className="order-item">
                <div className="order-content">
                  <span>
                    {order.item}
                    {order.size && ` - Size: ${order.size}`}
                    {` - Quantity: ${order.quantity} - Amount: ${(order.price * order.quantity).toFixed(2)}`}
                  </span>
                  <button className="delete-button" onClick={() => deleteOrder(index)}>
                    <i className="fa-solid fa-trash"></i>
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
        <div className="total-section">
          <h4>Total: {totalPrice.toFixed(2)}</h4>
          <div className="custom-amount-section">
            <input
              type="number"
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              placeholder="Enter amount"
              min={totalPrice + 0.00}
            />
            <button className='font-size' onClick={handleCharge}>Charge</button>
          </div>
        </div>
      </div>
    </div>
  );
};


export default Orders;
