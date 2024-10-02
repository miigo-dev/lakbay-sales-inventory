import React, { useState } from 'react';
import '../css/orders.css';

const menuItems = {
  all: [
    { name: 'Pizza', price: 300.00 },
    { name: 'Burger', price: 89.00 },
    { name: 'Pasta', price: 250.00 },
    { name: 'Royal', price: 25.00 },
    { name: 'Water', price: 15.00 },
    { name: 'Coke', price: 25.00 },
    { name: 'Cake', price: 175.00 },
    { name: 'Ice Cream', price: 70.00 },
    { name: 'Espresso', price: 120.00 },
    { name: 'Latte', price: 145.00 },
    { name: 'Cappuccino', price: 130.00 },
    { name: 'Macchiato', price: 135.00 },
    { name: 'Caramel', price: 110.00 },
    { name: 'Vanilla', price: 105.00 },
    { name: 'Hazelnut', price: 140.00 },
  ],
  meals: [
    { name: 'Tapsilog', price: 110.00 },
    { name: 'Burger', price: 89.00 },
    { name: 'Pasta', price: 250.00 },
    { name: 'Menudo', price: 115.00 },
    { name: 'Tocino', price: 109.00 },
    { name: 'Hotdog', price: 90.00 },
  ],
  drinks: [
    { name: 'Coke', price: 25.00 },
    { name: 'Water', price: 15.00 },
    { name: 'Royal', price: 25.00 },
    { name: 'Sprite', price: 25.00 },
    { name: 'Mountain Dew', price: 25.00 },
    { name: 'Nestea', price: 27.00 },
  ],
  sideorders: [
    { name: 'Fries', price: 80.00 },
    { name: 'Salad', price: 90.00 },
    { name: 'Rice', price: 30.00 },
    { name: 'Turon', price: 20.00 },
    { name: 'Shanghai', price: 25.00 },
  ],
  desserts: [
    { name: 'Cake', price: 175.00 },
    { name: 'Ice Cream', price: 70.00 },
    { name: 'Leche Flan', price: 100.00 },
    { name: 'Halo Halo', price: 69.00 },
    { name: 'Atsara', price: 55.00 },
    { name: 'Bagoong', price: 60.00 },
  ],
  coffee: [
    { name: 'Espresso', price: 130.00 },
    { name: 'Latte', price: 145.00 },
    { name: 'Cappuccino', price: 130.00 },
    { name: 'Macchiato', price: 135.00 },
    { name: 'Vanilla', price: 105.00 },
    { name: 'Hazelnut', price: 140.00 },
  ],
};

const Orders = () => {
  const [activeLink, setActiveLink] = useState('all');
  const [selectedItem, setSelectedItem] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [quantity, setQuantity] = useState(0);
  const [size, setSize] = useState('');
  const [orders, setOrders] = useState([]);
  const [customAmount, setCustomAmount] = useState('');
  const [change, setChange] = useState(0);

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
    setQuantity((prev) => (operation === 'increase' ? prev + 1 : prev > 0 ? prev - 1 : prev));
  };

  const handleSizeSelection = (selectedSize) => {
    setSize(selectedSize);
  };

  const addOrder = () => {
    if (quantity > 0) {
      if (getItemType(selectedItem.name) === 'drink' && !size) {
        alert("Please select a size for drinks.");
        return;
      }
      setOrders((prevOrders) => [
        ...prevOrders,
        {
          item: selectedItem.name,
          size: getItemType(selectedItem.name) === 'meal' ? '' : size,
          quantity,
          price: selectedItem.price,
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
  const getItemType = (itemName) => {
    for (const category in menuItems) {
      const item = menuItems[category].find((menuItem) => menuItem.name === itemName);
      if (item) {
        return category === 'drinks' ? 'drink' : 'meal';
      }
    }
    return null; 
  };
  const totalPrice = orders.reduce((total, order) => total + order.price * order.quantity, 0);

  const handleCharge = () => {
    const amount = parseFloat(customAmount);

    if (orders.length === 0) {
        alert("Please add items to your order before charging.");
        return; 
    }
    if (amount > totalPrice) {
      setChange(amount - totalPrice); 
      alert(`Charged $${amount.toFixed(2)} successfully!`);
      setCustomAmount(''); 
      setOrders([]);
    } 
    else {
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
          {Object.keys(menuItems).map((category) => (
            <li key={category}>
              <a
                href="#!"
                className={activeLink === category ? 'active' : ''}
                onClick={() => handleLinkClick(category)}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </a>
            </li>
          ))}
        </ul>
        </div>
      </div>
      <div className='order_container'>
        {menuItems[activeLink]?.map((item, index) => (
          <div key={index} className='order_item' onClick={() => handleItemClick(item)}>
            {item.name}
          </div>
        ))}
      </div>

      {isModalOpen && selectedItem && (
        <div className="modal">
          <div className="modal_content">
            <button className="close_button" onClick={closeModal}>
              &times;
            </button>
            <h2>{selectedItem.name}</h2>
            {activeLink === 'drinks' || activeLink === 'coffee' ? (
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
                  {getItemType(order.item) === 'drink' && order.size && ` - Size: ${order.size}`}
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
              min={totalPrice + 0.00}/>
            <button onClick={handleCharge}>Charge</button> 
            {change > 0 && <label className="change-label">Change: {change.toFixed(2)}</label>}  
          </div>
        </div>    
      </div>    
    </div>
  );
};

export default Orders;
