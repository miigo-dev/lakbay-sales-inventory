import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/orders.css';

const Orders = () => {
  const [activeLink, setActiveLink] = useState('all');
  const [menuItems, setMenuItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [recentOrder, setRecentOrder] = useState(null);
  const [quantity, setQuantity] = useState(0);
  const [size, setSize] = useState('');
  const [orders, setOrders] = useState([]);
  const [customAmount, setCustomAmount] = useState('');
  const [change, setChange] = useState(0);
  const [isLakbayKape, setIsLakbayKape] = useState(false);

  useEffect(() => {
    fetchMenuItems();
  }, [activeLink, isLakbayKape]);

  const fetchMenuItems = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/get-inv');
      const items = response.data;
      let filteredItems = items.filter(item => 
        activeLink === 'all' || item.category === activeLink
      );

      if (isLakbayKape) {
        filteredItems = items.filter(item => item.category === 'coffee');
      }

      setMenuItems(filteredItems);
    } catch (error) {
      console.error('Error fetching menu items:', error);
    }
  };

  const handleLinkClick = (link) => setActiveLink(link);
  
  const handleItemClick = (item) => {
    setSelectedItem(item);
    setQuantity(0);
    setSize('');
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

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
      const updatedMenuItems = menuItems.map(item => {
        const order = orders.find(o => o.item === item.productname);
        return order 
          ? { ...item, stockquantity: item.stockquantity - order.quantity } 
          : item;
      });

      setMenuItems(updatedMenuItems);
      setRecentOrder(orders[orders.length - 1]);
      setChange(amount - totalPrice);
      setCustomAmount('');
      setOrders([]);
    } else {
      alert(`Please enter an amount greater than the total price of ${totalPrice.toFixed(2)}.`);
      setChange(0);
    }
  };

  const handleCloseRecentOrderModal = () => {
    setRecentOrder(null); 
  };

  const toggleView = () => setIsLakbayKape((prev) => !prev);

  return (
    <div className='dashboard'>
      <div className="toggle_header">
        <button onClick={toggleView} className="toggle-button">
          {isLakbayKape ? 'Show Lakbay Kain' : 'Show Lakbay Kape'}
        </button>
      </div>
      <div className='search-container'>
        <input className="search-input" placeholder="Search your Orders"/>
        <button className="search-icon-btn" onClick={() => alert('Search Ordered')}>
          <i className="fas fa-search search-icon"></i>
          </button>
      </div>
            <ul className='navigation-bar'>
              {['all', 'meals', 'drinks', 'side Orders', 'desserts'].map((category) => (
                <li key={category}>
                  <a
                    href="#!"
                    className={activeLink === category ? 'active' : ''}
                    onClick={() => handleLinkClick(category)}
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </a>
              </li>
          ))}
        </ul>
   

      <div className='order_container'>
        {menuItems
          .filter(item => item.stockquantity > 0)
          .map((item, index) => (
            <div key={index} className='order_item' onClick={() => handleItemClick(item)}>
              {item.productname}
            </div>
          ))}
      </div>

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
            <h2 className='font-size'>Order Successful</h2>
            <h5>_</h5>
            <h2 className='total-price'>Change: {change.toFixed(2)}</h2>
            <p>Order: {recentOrder.item}</p>
            <p>{recentOrder.size && `Size: ${recentOrder.size}`}</p>
            <p>Quantity: {recentOrder.quantity}</p>
            <p>Price: {(recentOrder.price * recentOrder.quantity).toFixed(2)}</p>
            <h1>"</h1>
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
                      {` - Quantity: ${order.quantity} - Price: ${(order.price * order.quantity).toFixed(2)}`}
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
              <button className='charge-button' onClick={handleCharge}>Charge
              </button>
            </div>
          </div>
      </div> 
    </div>
  );
};

export default Orders;
