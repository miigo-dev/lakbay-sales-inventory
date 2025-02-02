import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid';
import '../css/orders.css';
import order_status from '../assets/icons/orders.svg';

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
  const [orderNumber, setOrderNumber] = useState(1);
  const [completedOrders, setCompletedOrders] = useState([]);
  const [orderHistory, setOrderHistory] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [menuItems, setMenuItems] = useState([]);
  const [filteredMenuItems, setFilteredMenuItems] = useState([]);
  const [discount, setDiscount] = useState(0); 
  const [snrActive, setSNRActive] = useState(false);
  const [pwdActive, setPWDActive] = useState(false);
  const [stuActive, setSTUActive] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [todaysOrdersCount, setTodaysOrdersCount] = useState(0); 
  const [totalPendingOrders, setTotalPendingOrders] = useState(0);
  const [totalCompletedOrders, setTotalCompletedOrders] = useState(0);

  const categoryMap = {
    1: 'meals',
    2: 'drinks',
    3: 'side Orders',
    4: 'desserts',
    5: 'coffee',
    6: 'non-Coffee',
    7: 'frappes',
    8: 'affogato Series'
  };

  useEffect(() => {
    const fetchTodaysOrders = async () => {
      try {
        const today = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
        const response = await axios.get('http://localhost:8080/api/transaction');
        const todayOrders = response.data.filter((order) =>
          new Date(order.order_date).toISOString().split('T')[0] === today
        );
        setTodaysOrdersCount(todayOrders.length); // Set the count of today's orders
      } catch (err) {
        console.error('Error fetching today\'s orders:', err);
      }
    };

    fetchTodaysOrders();
  }, []);

  useEffect(() => {
    const fetchPendingOrders = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/orders');
        const pendingOrders = response.data.filter(order => order.order_status === 'Pending');
  
        setCompletedOrders(
          response.data.map(order => ({
            orderNumber: order.order_id,
            amount: parseFloat(order.total_amount).toFixed(2),
            status: order.order_status,
          }))
        );
  
        // Update the total pending orders count
        setTotalPendingOrders(pendingOrders.length);
      } catch (error) {
        console.error('Error fetching pending orders:', error);
      }
    };
  
    fetchPendingOrders();
  }, []);
  
  useEffect(() => {
    const fetchCompletedOrders = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/transaction');
        const completedOrders = response.data.filter(order => order.order_status === 'Completed');
        setTotalCompletedOrders(completedOrders.length); // Set the total count of completed orders
      } catch (err) {
        console.error('Error fetching completed orders:', err);
      }
    };
  
    fetchCompletedOrders();
  }, []);  

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const productResponse = await axios.get('http://localhost:8080/api/products/');
        const fetchedItems = productResponse.data.map(item => ({
          product_id: item.product_id,
          productname: item.product_name,
          category: categoryMap[item.category_id] || 'unknown',
          price: parseFloat(item.product_price),
          stockquantity: item.product_quantity,
          warehouse_id: item.warehouse_id 
        }));

        setMenuItems(fetchedItems);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load products or warehouses");
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, []);

  const [activeDiscountType, setActiveDiscountType] = useState(null); 

  const applyDiscount = (type) => {
    let discountLabel = null;
    let discountValue = 0;
  
    if (type === 'SNR') {
      if (snrActive) {
        setSNRActive(false);
        discountLabel = null;
        discountValue = 0;
      } else {
        setSNRActive(true);
        setPWDActive(false);
        setSTUActive(false);
        discountLabel = 'Senior Discounted';
        discountValue = 20;
      }
    } else if (type === 'PWD') {
      if (pwdActive) {
        setPWDActive(false);
        discountLabel = null;
        discountValue = 0;
      } else {
        setPWDActive(true);
        setSNRActive(false);
        setSTUActive(false);
        discountLabel = 'PWD Discounted';
        discountValue = 20;
      }
    } else if (type === 'STU') {
      if (stuActive) {
        setSTUActive(false);
        discountLabel = null;
        discountValue = 0;
      } else {
        setSTUActive(true);
        setSNRActive(false);
        setPWDActive(false);
        discountLabel = 'Student Discounted';
        discountValue = 20;
      }
    }
  
    setActiveDiscountType(discountLabel);
    setDiscount(discountValue);
  
  };

  const addOrder = () => {
    if (quantity > 0) {
      if (selectedItem.category === 'drinks' && !size) {
        alert("Please select a size for drinks.");
        return;
      }
  
      const newOrder = {
        product_id: selectedItem.product_id,
        item: selectedItem.productname,
        size: selectedItem.category === 'meals' ? '' : size,
        quantity,
        price: parseFloat(selectedItem.price),
        category: selectedItem.category,
        discountType: activeDiscountType || null, // Include discount type if active
        date: new Date().toLocaleString(),
      };
  
      setOrders((prevOrders) => [...prevOrders, newOrder]);
      console.log("Added Order:", newOrder); // Debugging log
      setIsModalOpen(false);
    } else {
      alert("Please select a quantity greater than 0.");
    }
  };

  const deleteOrder = (index) => {
    setOrders((prevOrders) => prevOrders.filter((_, i) => i !== index));
  };

  const handleCharge = async () => {
    const amount = parseFloat(customAmount);
    if (orders.length === 0) {
      alert("Please add items to your order before charging.");
      return;
    }
  
    const totalOrderAmount = calculateTotalPrice();
    if (amount >= totalOrderAmount) {
      try {
        const newOrder = {
          order_status: 'Pending',
          order_date: new Date(),
          order_items: orders.map(order => ({
            product_id: order.product_id,
            quantity: order.quantity,
            order_total: order.price * order.quantity,
          })),
        };
  
        const response = await axios.post('http://localhost:8080/api/orders', newOrder);
        const backendOrderId = response.data.order_id; // Use the backend-provided order ID
  
        const newOrderObject = {
          orderNumber: backendOrderId,
          amount: totalOrderAmount.toFixed(2),
          status: 'Pending',
        };
  
        // Update completedOrders and totalPendingOrders in real-time
        setCompletedOrders(prev => [...prev, newOrderObject]);
        setTotalPendingOrders(prev => prev + 1);
  
        setRecentOrder({
          orderNumber: backendOrderId, // Use backend ID here
          amount: totalOrderAmount,
          items: orders.map(order => ({
            item: order.item,
            quantity: order.quantity,
            size: order.size,
          })),
        });
  
        setChange(amount - totalOrderAmount);
        setCustomAmount('');
        setOrders([]);
      } catch (error) {
        console.error('Error creating order:', error);
        alert('Failed to create order');
      }
    } else {
      alert(`Please enter an amount greater than the total price of ${totalOrderAmount.toFixed(2)}.`);
      setChange(0);
    }
  };
  

  const fetchUpdatedStock = async () => {
    try {
        const productResponse = await axios.get('http://localhost:8080/api/products/');
        const updatedItems = productResponse.data.map(item => ({
            product_id: item.product_id,
            productname: item.product_name,
            category: categoryMap[item.category_id] || 'unknown',
            price: parseFloat(item.product_price),
            stockquantity: item.product_quantity,
            warehouse_id: item.warehouse_id 
        }));
        setMenuItems(updatedItems);
        setFilteredMenuItems(updatedItems.filter(item => item.warehouse_id === (isLakbayKape ? 2 : 1)));
    } catch (err) {
        console.error("Error fetching updated stock:", err);
        setError("Failed to refresh stock data");
    }
  };
  
  const completeOrder = async (index) => {
    const completedOrder = completedOrders[index];
  
    try {
      // Update order status on the backend
      await axios.put(`http://localhost:8080/api/orders/${completedOrder.orderNumber}/complete`, { order_status: 'Completed' });
  
      // Remove from pending orders
      setCompletedOrders(prevOrders => prevOrders.filter((_, i) => i !== index));
      setTotalPendingOrders(prev => prev - 1);
  
      // Increment the count of completed orders
      setTotalCompletedOrders(prevCount => prevCount + 1);
  
      // Update today's order count
      setTodaysOrdersCount(prevCount => prevCount + 1);
  
      // Add to order history with status updated
      setOrderHistory(prevHistory =>
        [...prevHistory, { ...completedOrder, status: 'Completed' }]
      );
  
      // Optionally refresh stock
      await fetchUpdatedStock();
  
    } catch (error) {
      console.error('Error completing order:', error);
      alert('Failed to complete order');
    }
  };
  
  
  const calculateTotalPrice = () => {
    const total = orders.reduce((total, order) => total + order.price * order.quantity, 0);
    return total - (total * discount / 100); 
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

  const handleQuantityInput = (e) => {
    const inputValue = e.target.value;
    const parsedValue = parseInt(inputValue, 10);
  
    if (isNaN(parsedValue) || parsedValue < 0) {
      setQuantity(0);
    } else if (parsedValue > selectedItem.stockquantity) {
      setQuantity(selectedItem.stockquantity); 
    } else {
      setQuantity(parsedValue); 
    }
  };
  
  const handleSizeSelection = (selectedSize) => setSize(selectedSize);

  const displayedItems = filteredMenuItems.filter(item =>
    (activeLink === 'all' || item.category === activeLink) &&
    item.productname.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const filtered = menuItems.filter((item) => {
      const matchesWarehouse = item.warehouse_id === (isLakbayKape ? 2 : 1); // Filter by warehouse
      const matchesCategory = activeLink === 'all' || item.category === activeLink;
      const matchesSearch = item.productname.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesWarehouse && matchesCategory && matchesSearch; // Ensure all conditions match
    });
    setFilteredMenuItems(filtered);
  }, [searchTerm, activeLink, menuItems, isLakbayKape]);

  useEffect(() => {
    setSearchTerm(''); 
  }, [isLakbayKape]);  

  const handleSearchClick = () => {
    if (filteredMenuItems.length === 0) {
      alert("No items match your search.");
    }
  };

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

  const toggleExpandCollapse = () => {
    setIsExpanded((prev) => !prev);
  };

  const toggleView = () => setIsLakbayKape((prev) => !prev);

  useEffect(() => {
    const warehouseId = isLakbayKape ? 2 : 1;
    setFilteredMenuItems(menuItems.filter(item => item.warehouse_id === warehouseId));
  }, [menuItems, isLakbayKape]);

  useEffect(() => {
    const fetchPendingOrders = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/orders');
            setCompletedOrders(response.data.map(order => ({
                orderNumber: order.order_id,
                amount: parseFloat(order.total_amount).toFixed(2),
                status: order.order_status,
            })));
        } catch (error) {
            console.error('Error fetching pending orders:', error);
        }
    };

    fetchPendingOrders();
  }, []);

  useEffect(() => {
    if (completedOrders.length > 0) {
        const maxOrderNumber = Math.max(...completedOrders.map(order => order.orderNumber));
        setOrderNumber(maxOrderNumber + 1);
    }
  }, [completedOrders]);

  useEffect(() => {
    const savedPendingOrders = JSON.parse(localStorage.getItem('pendingOrders'));
    if (savedPendingOrders) {
        setCompletedOrders(savedPendingOrders);
    }
  }, []);

  useEffect(() => {
      localStorage.setItem('pendingOrders', JSON.stringify(completedOrders));
  }, [completedOrders]);

  useEffect(() => {
    const fetchMaxOrderNumber = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/orders/maxOrderNumber');
            setOrderNumber(response.data.maxOrderNumber + 1); // Set to the next order number
        } catch (error) {
            console.error('Error fetching max order number:', error);
        }
    };

    fetchMaxOrderNumber();
  }, []);

  useEffect(() => {
    localStorage.setItem('completedOrders', JSON.stringify(completedOrders));
    localStorage.setItem('orderHistory', JSON.stringify(orderHistory));
  }, [completedOrders, orderHistory]);

  useEffect(() => {
    const savedCompletedOrders = JSON.parse(localStorage.getItem('completedOrders')) || [];
    const savedOrderHistory = JSON.parse(localStorage.getItem('orderHistory')) || [];

    setCompletedOrders(savedCompletedOrders);
    setOrderHistory(savedOrderHistory);
  }, []);

  return (
    <div className="main-container">
      <div className='order_dashboard'>
        <div className="toggle_header">
          <input type="checkbox" className='input_type' id="toggle" onChange={toggleView} />
          <div className="display">
            <label className='label_type' htmlFor="toggle">
              <div className="circle">
                <span className="material-symbols-outlined food">restaurant</span>
                <span className="material-symbols-outlined coffee">local_cafe</span>
              </div>
            </label>
            <span className="categ-txt">
              {isLakbayKape ? 'Lakbay Kape' : 'Lakbay Kain'}
            </span>
          </div>
        </div>

        <div className="search_container">
          <input
            className="search_input"
            placeholder="Search your Orders"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="search-icon-btn" onClick={handleSearchClick}>
            <i className="fas fa-search search-icon"></i>
          </button>
        </div>

        <div id='order-content'>
          <div id={isLakbayKape ? "lakbay-kape" : "lakbay-kain"}>
            <div className="navigation-container">
              <ul className="navigation-bar">
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
                  ))}
              </ul>
            </div>

            <div className="order_container">
              {displayedItems.map((item, index) => (
                  <div
                      key={index}
                      className={`order_item ${item.stockquantity === 0 ? 'out-of-stock' : ''}`}
                      onClick={() => handleItemClick(item)}
                  >
                      <div>{item.productname}</div>
                      <div className="quantity-label">
                          Qty: {item.stockquantity}
                      </div>
                  </div>
              ))}
            </div>
          </div>
        </div>
  
        <div className="items-section">
          <h4>Items:</h4>
          <div className="scrollable-container">
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
          </div>
          <div className="overall-discount-container">
            {activeDiscountType ? (
              <p className="overall-discount-label">
              {activeDiscountType}
              </p>
            ) : (
              <p className="overall-discount-label"></p>
            )}
          </div>      

          <div className="discount-buttons">
            <button
              className={`discount-button1 ${snrActive ? 'active' : ''}`} 
              onClick={() => applyDiscount('SNR')}
            >
              SNR
            </button>
            <button
              className={`discount-button2 ${pwdActive ? 'active' : ''}`} 
              onClick={() => applyDiscount('PWD')}
            >
              PWD
            </button>
            <button
              className={`discount-button3 ${stuActive ? 'active' : ''}`} 
              onClick={() => applyDiscount('STU')}
            >
              STU
            </button>
          </div>

          <div className="total-section">
            <h4>Total: {calculateTotalPrice().toFixed(2)}</h4>
            <div className="custom-amount-section">
              <input
                type="number"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                placeholder="Enter amount"
                min={calculateTotalPrice()}
              />
              <button className="font-size" onClick={handleCharge}>Charge</button>
            </div>
          </div>
        </div>
      </div>
  
      <div className={`right-container ${isExpanded ? 'expanded' : ''}`}>
        <div className="order-status">
          <h4 onClick={toggleExpandCollapse} style={{ cursor: 'pointer' }}>
            {isExpanded ? (
              <img src={order_status} alt="Expanded Icon" style={{ width: '1.25em', height: '1.25em' }}  />
            ) : (
              <img src={order_status} alt="Collapsed Icon" style={{ width: '1.25em', height: '1.25em' }} />
            )}
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
                autoHeight
              />

            </div>
          )}
        </div>
      </div>
  
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
              <input
                type="number"
                value={quantity}
                onChange={(e) => handleQuantityInput(e)}
                min="0"
                className="quantity-input"
              />
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
            <p>Order Number: {recentOrder.orderNumber}</p> {/* Use the correct order number */}
            <p>Items: {recentOrder.items.map((orderItem) => orderItem.item).join(', ')}</p>
            <p>Amount: {recentOrder.amount.toFixed(2)}</p>
            <button className="close-button" onClick={handleCloseRecentOrderModal}>Close</button>
          </div>
        </div>
      )}
      
    </div>
  );
};

export default Orders;