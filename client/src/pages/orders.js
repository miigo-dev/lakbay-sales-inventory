import React, { useState } from 'react';
import '../css/orders.css';

const menuItems = {
  all: ['Pizza', 'Burger', 'Pasta', 'Royal', 'Water', 'Coke', 'Cake', 'Ice Cream', 'Espresso', 'Latte', 'Cappuccino', 'Macchiato', 'Caramel', 'Vanilla', 'Hazelnut'],
  meals: ['Tapsilog', 'Burger', 'Pasta', 'Menudo', 'Tocino', 'Hotdog'],
  drinks: ['Coke', 'Water', 'Royal', 'Sprite', 'Mountain Dew', 'Nestea'],
  sideorders: ['Fries', 'Salad', 'Rice', 'Extras', 'Shanghai'],
  desserts: ['Cake', 'Ice Cream', 'Leche Flan', 'Halo Halo', 'Atsara', 'Bagoong'],
  coffee: ['Espresso', 'Latte', 'Cappuccino', 'Macchiato', 'Vanilla', 'Hazelnut']
};

const Orders = () => {
  const [activeLink, setActiveLink] = useState('all');
  const [selectedItem, setSelectedItem] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [quantity, setQuantity] = useState(0);
  const [size, setSize] = useState('');

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

  const getItemType = (item) => {
    return menuItems.drinks.includes(item) || menuItems.coffee.includes(item) ? 'drink' : 'meal';
  };

  return (
    <div className='dashboard'>
      <div className='header'>
        <div className="search-bar">
          <button className="search-icon-btn" onClick={() => alert('Search Ordered')}>
            <i className="fas fa-search search-icon"></i>
          </button>
          <input className="search-input" placeholder="Search your Orders" />
        <ul>
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
        {menuItems[activeLink].map((item) => (
          <div key={item} className='order_item' onClick={() => handleItemClick(item)}>
            {item}
          </div>
        ))}
      </div>
      {isModalOpen && (
        <div className="modal">
          <div className="modal_content">
            <button className="close_button" onClick={closeModal}>
              &times;
            </button>
            <h2>{selectedItem}</h2>
            <div className="size-options">
              <button onClick={() => handleSizeSelection('Small')} className={size === 'Small' ? 'active' : ''}>Small</button>
              <button onClick={() => handleSizeSelection('Medium')} className={size === 'Medium' ? 'active' : ''}>Medium</button>
              <button onClick={() => handleSizeSelection('Large')} className={size === 'Large' ? 'active' : ''}>Large</button>           
            <div className="quantity-control">
              <button onClick={() => handleQuantityChange('decrease')}>-</button>
              <span>{quantity}</span>
              <button onClick={() => handleQuantityChange('increase')}>+</button>
              </div>
            <button id="proceed-button" onClick={() => alert(`Proceeding with ${quantity} ${size} ${selectedItem}`)}>Proceed</button>
            </div>
          </div>
        </div>
         )}
    </div>   
  );
};

export default Orders;
