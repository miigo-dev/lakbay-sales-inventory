import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import '../css/sidebar.css';

import logo_icon from '../assets/icons/LKK.svg';
import logout_icon from '../assets/icons/logout_icon_dark.png';

import order_active from '../assets/icons/orders_active.png';
import order_inactive from '../assets/icons/orders_inactive.png';
import transaction_history_active from '../assets/icons/receipt-cutoff active.svg';
import transaction_history_inactive from '../assets/icons/receipt-cutoff inactive.svg';


const Cashier_sidebar = ({ onToggle }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
    setIsOrdersOpen(false);
  };

  const toggleOrdersDropdown = () => {
    if (isOpen) {
      setIsOrdersOpen(!isOrdersOpen);
      // Close inventory dropdown if it's open

    }
  };

  return (
    <div className={`sidebar ${isOpen ? '' : 'collapsed'}`}>
      <button onClick={toggleSidebar} className="toggle-btn">
        {isOpen ? '←' : '→'}
      </button>
      <div className="header_sidebar">
        <img src={logo_icon} alt="Logo" className={`logo ${isOpen ? '' : 'collapsed-logo'}`} />
        {isOpen && <h2>Lakbay Kape</h2>}
      </div>


      <div className="orders-section">
        <div onClick={toggleOrdersDropdown}>
            <NavLink to="/cashier_orders" className={({ isActive }) => (isActive ? 'active' : '')}>
                {({ isActive }) => (
                    <>
                    <img src={isActive ? order_active : order_inactive} alt="Orders icon" />
                    {isOpen && "Orders"}
                    </>
                )}
            </NavLink>
        </div>
        <div className={`dropdown-child ${isOrdersOpen ? 'open' : ''}`}>
          <NavLink to="/cashier_orders/cashier_transaction" className={({ isActive }) => isActive ? 'active' : ''}>
            {({ isActive }) => (
              <>
                <img src={isActive ? transaction_history_active : transaction_history_inactive} alt="Transaction icon" />
                {isOpen && "Transaction"}
              </>
            )}
          </NavLink>
        </div>
      </div>
        <div className="bot_sidebar">
            <NavLink to="/logout" className={({ isActive }) => isActive ? 'active' : ''}>
                {({ isActive }) => (
                    <>
                    <img src={logout_icon} alt="Logout icon" />
                    {isOpen && "Logout"}
                    </>
                )}
            </NavLink>
        </div>
    </div>
  );
};

export default Cashier_sidebar;
