import React,{useState}from 'react'
import '../css/orders.css'
const menuItems = {
  all: ['Pizza', 'Burger', 'Pasta', 'Royal', 'Water', 'Coke', 'Cake','Ice Cream','Espresso','Latte','Cappucino','Macchiato','Caramel','Vanilla','Hazelnut'],
  meals: ['Tapsilog', 'Burger', 'Pasta','Menudo','Tocino','Hotdog'],
  drinks: ['Coke', 'Water', 'Royal', 'Sprite','Mountain Dew','Nestea'],
  sideorders: ['Fries', 'Salad', 'Rice','Extras','Shanghai',],
  desserts: ['Cake', 'Ice Cream', 'Leche flan', 'Halo Halo', 'Atsara', 'Bagoong'],
  coffee: ['Espresso', 'Latte', 'Cappuccino', 'Macchiato', 'Vanilla','Hazelnut']
};


const Orders = () => {

  const [activeLink, setActiveLink] = useState('all');
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLinkClick = (link) => {
    setActiveLink(link);
  };
  const handleItemClick = (item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  return (   
    <div className='dashboard'>
      <header className='header'>
        <div className="search-bar">
          <i className="fas fa-search search-icon"></i>
          <input type="text" className="search-input" placeholder="Search" />
          <ul>
            <li>
              <a 
                href="#all" 
                className={activeLink === 'all' ? 'active' : ''}
                onClick={() => handleLinkClick('all')}>
                All
              </a>
            </li>
            <li>
              <a 
                href="#meals" 
                className={activeLink === 'meals' ? 'active' : ''}
                onClick={() => handleLinkClick('meals')}>
                Meals
              </a>
            </li>
            <li>
              <a 
                href="#drinks" 
                className={activeLink === 'drinks' ? 'active' : ''}
                onClick={() => handleLinkClick('drinks')}>
                Drinks
              </a>
            </li>
            <li>
              <a 
                href="#sideorders" 
                className={activeLink === 'sideorders' ? 'active' : ''}
                onClick={() => handleLinkClick('sideorders')}>
                Side Orders
              </a>
            </li>
            <li>
              <a 
                href="#desserts" 
                className={activeLink === 'desserts' ? 'active' : ''}
                onClick={() => handleLinkClick('desserts')}>
                Desserts
              </a>
            </li>
            <li>
              <a 
                href="#coffee" 
                className={activeLink === 'coffee' ? 'active' : ''}
                onClick={() => handleLinkClick('coffee')}>
                Coffee
              </a>
            </li>
          </ul>
        </div>
      </header>
      <div className='order_container'>
        {menuItems[activeLink].map((item, index) => (
          <div className='order_item' key={index} onClick={() => handleItemClick(item)}>
            {item}
          </div>
        ))}
      </div>
      {isModalOpen && (
        <div className='modal'>
          <div className='modal_content'>
            <span className='close_button' onClick={closeModal}>&times;</span>
            <p>Sizes</p>{}
            <button class='button button1 btn'>Small</button>
            <button class='button button1 btn'>Medium</button>
            <button class='button button1 btn'>Large</button>
          </div>
        </div>
      )}
    </div>
  )
}
export default Orders;