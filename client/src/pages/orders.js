import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/orders.css';

const Orders = () => {
  const [activeLink, setActiveLink] = useState('all');
  const [menuItems, setMenuItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [quantity, setQuantity] = useState(0);
  const [size, setSize] = useState('');
  const [orders, setOrders] = useState([]);
  const [customAmount, setCustomAmount] = useState('');
  const [change, setChange] = useState(0);

  useEffect(() => {
    fetchMenuItems();
  }, [activeLink]);

  const fetchMenuItems = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/get-inv');
      const items = response.data;

      if (activeLink === 'all') {
        setMenuItems(items);
      } else {
        const filteredItems = items.filter(item => item.category === activeLink);
        setMenuItems(filteredItems);
      }
    } catch (error) {
      console.error('Error fetching menu items:', error);
    }
  };

  const handleLinkClick = (link) => {
    setActiveLink(link);
  };

  const handleItemClick = (item) => {
    setSelectedItem(item);
    setQuantity(0);
    setSize('');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
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

  const handleSizeSelection = (selectedSize) => {
    setSize(selectedSize);
  };

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
      // Update stock quantity for each item ordered
      const updatedMenuItems = menuItems.map(item => {
        const order = orders.find(o => o.item === item.productname);
        if (order) {
          return {
            ...item,
            stockquantity: item.stockquantity - order.quantity, // Decrease stock based on the quantity ordered
            
          };
        }
        return item;
      });

      setMenuItems(updatedMenuItems); // Update the menu items with the new stock quantities

      setChange(amount - totalPrice);
      alert(`Charged $${amount.toFixed(2)} successfully!`);
      setCustomAmount('');
      setOrders([]);
    } else {
      alert(`Please enter an amount greater than the total price of $${totalPrice.toFixed(2)}.`);
      setChange(0);
    }
  };

  return (
    <div className='dashboard'>
      <div className='header_container'>
        <div className="search-bar">
          <button className="search-icon-btn" onClick={() => alert('Search Ordered')}>
            <i className="fas fa-search search-icon"></i>
          </button>
          <input className="search-input" placeholder="Search your Orders" />
          <ul className='navigation-bar'>
            {['all', 'meals', 'drinks', 'sideorders', 'desserts', 'coffee'].map((category) => (
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
        </div>
      </div>
      <div className='order_container'>
        {menuItems
          .filter(item => item.stockquantity > 0) // Only display items with stock > 0
          .map((item, index) => (
            <div key={index} className='order_item' onClick={() => handleItemClick(item)}>
              {item.productname}
            </div>
          ))}
      </div>

      {isModalOpen && selectedItem && (
        <div className="modal">
          <div className="modal_content">
            <button className="close_button" onClick={closeModal}>
              &times;
            </button>
            <h2>{selectedItem.productname}</h2>
            {selectedItem.category.toLowerCase() === 'drinks' || selectedItem.category.toLowerCase() === 'coffee' ? (
              <div className="size-options">
                <button onClick={() => handleSizeSelection('Small')} className={size === 'Small' ? 'active' : ''}>Small</button>
                <button onClick={() => handleSizeSelection('Medium')} className={size === 'Medium' ? 'active' : ''}>Medium</button>
                <button onClick={() => handleSizeSelection('Large')} className={size === 'Large' ? 'active' : ''}>Large</button>
              </div>
            ) : null}
            <div className="quantity-control">
              <button onClick={() => handleQuantityChange('decrease')}>-</button>
              <span>{quantity}</span>
              <button onClick={() => handleQuantityChange('increase')}>+</button>
            </div>
            <button
              onClick={addOrder}
              className="proceed-button"
            >
              Proceed
            </button>
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
            <button onClick={handleCharge}>Charge</button>
            {change > 0 && <label className="change-label">Change: {change.toFixed(2)}</label>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Orders;
