import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid';
import '../css/orders.css';

const Orders = () => {
  const [activeLink, setActiveLink] = useState('all');
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [recentOrder, setRecentOrder] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [size, setSize] = useState('');
  const [orders, setOrders] = useState([]);
  const [customAmount, setCustomAmount] = useState('');
  const [change, setChange] = useState(0);
  const [isLakbayKape, setIsLakbayKape] = useState(false);
  const [searchTerm, setSearchTerm] = useState(''); 
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [orderNumber, setOrderNumber] = useState(1);
  const [completedOrders, setCompletedOrders] = useState([]);
  const [orderHistory, setOrderHistory] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/products/');
        // Assuming response data has a structure matching the columns in the database
        const fetchedItems = response.data.map(item => ({
          productname: item.product_name,
          category: item.category_id, // Adjust mapping if category is a string or join logic is needed
          price: parseFloat(item.product_price),
          stockquantity: item.product_quantity
        }));
        setMenuItems(fetchedItems);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products");
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, []);

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

  const openTransactionModal = () => {
    setIsTransactionModalOpen(true); 
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
      if (selectedItem.category === 'drinks' && !size) {
        alert("Please select a size for drinks.");
        return;
      }
      setOrders((prevOrders) => [
        ...prevOrders,
        {
          item: selectedItem.productname,
          size: selectedItem.category === 'meals' ? '' : size,
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
      const totalOrderAmount = orders.reduce((total, order) => total + order.price * order.quantity, 0);
      const newOrder = {
        orderNumber,
        amount: totalOrderAmount.toFixed(2),
        status: 'Pending',
      };
      setCompletedOrders([...completedOrders, newOrder]);
      setOrderHistory([...orderHistory, newOrder]); 
      setRecentOrder({
        orderNumber,
        amount: totalOrderAmount,
        items: orders.map(order => ({
          item: order.item,
          quantity: order.quantity,
          size: order.size,
        })),
      });
      setChange(amount - totalPrice);
      setCustomAmount('');
      setOrders([]);
      setOrderNumber(prev => (prev < 100 ? prev + 1 : 1));
    } else {
      alert(`Please enter an amount greater than the total price of ${totalPrice.toFixed(2)}.`);
      setChange(0);
    }
  };

  const completeOrder = (index) => {
    const completedOrder = completedOrders[index];
    setCompletedOrders((prevOrders) => prevOrders.filter((_, i) => i !== index));
    setOrderHistory((prevHistory) =>
      prevHistory.map((order) =>
        order.orderNumber === completedOrder.orderNumber
          ? { ...order, status: 'Completed' }
          : order
      )
    );
  };

  const toggleExpandCollapse = () => {
    setIsExpanded((prev) => !prev); 
  };

  const toggleView = () => setIsLakbayKape((prev) => !prev);

  const filteredMenuItems = menuItems.filter(item => 
    (activeLink === 'all' || item.category === activeLink) &&
    item.productname.includes(searchTerm)
  );

  return (
    <div className="main-container">
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
                  className={`order_item ${item.stockquantity === 0 ? 'out-of-stock' : ''}`}
                  onClick={() => handleItemClick(item)} 
                >
                  {item.productname}
                </div>
              ))}
            </div>
          </div>
        </div>
  
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
  
      <div className={`right-container ${isExpanded ? 'expanded' : ''}`}>
        <div className="order-status">
          <h4 onClick={toggleExpandCollapse} style={{ cursor: 'pointer' }}>
            {isExpanded ? <i class="fa-brands fa-jedi-order"></i> : <i class="fa-brands fa-jedi-order"></i>}
          </h4>
          {isExpanded && (
            <div className="orders-table">
              <DataGrid
                rows={completedOrders.map((order, index) => ({
                  id: index,
                  orderNumber: order.orderNumber,
                  amount: order.amount,
                  status: order.status,
                }))}
                columns={[
                  { field: 'orderNumber', headerName: 'Order No.', width: 100 },
                  { field: 'amount', headerName: 'Amount', width: 100 },
                  { field: 'status', headerName: 'Status', width: 100 },
                  {
                    field: 'action',
                    headerName: 'Action',
                    width: 100,
                    renderCell: (params) => (
                      <div>
                        {params.row.status === 'Pending' && (
                          <button
                            className="btn complete-button"
                            onClick={() => completeOrder(params.id)}
                          >
                            Complete
                          </button>
                        )}
                      </div>
                    ),
                  },
                ]}
              />
            </div>
          )}
        </div>
      </div>
      {isTransactionModalOpen && (
        <div className="full-screen-modal">
          <div className="modal-content">
            <h3>Recent History:</h3>
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Order</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {orderHistory.map((order, index) => (
                  <tr key={index}>
                    <td>{new Date().toLocaleDateString()}</td>    
                    <td>{order.orderNumber}</td>
                    <td>{order.amount}</td>
                    <td>{order.status}</td>
                  </tr>
                ))}
              </tbody>
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
            {(selectedItem.category === 'drinks' || selectedItem.category === 'coffee') && (
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
            <button onClick={addOrder} className="proceed-button">Add Order</button>
          </div>
        </div>
      )}
  
      {recentOrder && (
        <div className="recent-order-modal">
          <div className="recent-order-content">
            <h2 className='total-price'>Change: {change.toFixed(2)}</h2>
            <p>Order Number: {orderNumber}</p>
            <p>Order: {recentOrder.item}</p>
            <p>{recentOrder.size && `Size: ${recentOrder.size}`}</p>
            <p>Quantity: {recentOrder.quantity}</p>
            <p>Amount: {(recentOrder.price * recentOrder.quantity).toFixed(2)}</p>
            <button className="close-button" onClick={handleCloseRecentOrderModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
  
};
export default Orders;
