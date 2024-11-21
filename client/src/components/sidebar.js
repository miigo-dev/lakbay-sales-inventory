import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import '../css/sidebar.css';

import logo from '../assets/icons/lakbay_logo50px.png';
import logo_icon from '../assets/icons/LKK.svg';
import logout_icon from '../assets/icons/logout_icon_dark.png';

import dash_active from '../assets/icons/dashboard_active.png';
import order_active from '../assets/icons/orders_active.png';
import inventory_active from '../assets/icons/inventory_active.png';
// import sales_active from '../assets/sales_active.png';
import reports_active from '../assets/icons/reports_active.png';
import users_active from '../assets/icons/users_active.png';

import dash_inactive from '../assets/icons/dashboard_inactive.png';
import order_inactive from '../assets/icons/orders_inactive.png';
import inventory_inactive from '../assets/icons/inventory_inactive.png';
// import sales_inactive from '../assets/sales_inactive.png';
import reports_inactive from '../assets/icons/reports_inactive.png';
import users_inactive from '../assets/icons/users_inactive.png';
import settings_inactive from '../assets/icons/settings_inactive.png';

import transaction_history_active from '../assets/icons/receipt-cutoff active.svg';
import transaction_history_inactive from '../assets/icons/receipt-cutoff inactive.svg';


const Sidebar = ({ onToggle }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
    onToggle(!isOpen); // Inform parent component about toggle state
    setIsOrdersOpen(false);
  };
  const toggleOrdersDropdown = () => {
    setIsOrdersOpen(!isOrdersOpen);
  };
  const handleNavLinkClick = (link) => {
    if (link !== 'orders') {
      setIsOrdersOpen(false);
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

      <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'active' : ''} onClick={() => handleNavLinkClick('inventory')}>
        {({ isActive }) => (
          <>
            <img src={isActive ? dash_active : dash_inactive} alt="Dashboard icon" />
            {isOpen && "Dashboard"}
          </>
        )}
      </NavLink> 
      <div className="orders-section">
        <div onClick={toggleOrdersDropdown}>
          <NavLink to="/orders" className={({ isActive }) => isActive ? 'active' : ''} >
            {({ isActive }) => (
              <>
                <img src={isActive ? order_active : order_inactive} alt="Orders icon" />
                {isOpen && "Orders"}
              </>
            )}
          </NavLink>
        </div>
        <div className={`dropdown-child ${isOrdersOpen ? 'open' : ''}`}>
          <NavLink to="/orders/transaction" className={({ isActive }) => isActive ? 'active' : ''} >
            {({ isActive }) => (
              <>
                <img src={isActive ? transaction_history_active : transaction_history_inactive} alt="Transaction icon" />
                {isOpen && "Transaction"}
              </>
            )}
          </NavLink>
        </div>
      </div>
      <NavLink to="/inventory" className={({ isActive }) => isActive ? 'active' : ''} onClick={() => handleNavLinkClick('inventory')}>
        {({ isActive }) => (
          <>
            <img src={isActive ? inventory_active : inventory_inactive} alt="Inventory icon" />
            {isOpen && "Inventory"}
          </>
        )}
      </NavLink>
      <NavLink to="/sales" className={({ isActive }) => isActive ? 'active' : ''} onClick={() => handleNavLinkClick('inventory')}>
        {({ isActive }) => (
          <>
            <img src={settings_inactive} alt="Sales icon" />
            {isOpen && "Sales"}
          </>
        )}
      </NavLink>
      <NavLink to="/reports" className={({ isActive }) => isActive ? 'active' : ''} onClick={() => handleNavLinkClick('inventory')}>
        {({ isActive }) => (
          <>
            <img src={isActive ? reports_active : reports_inactive} alt="Reports icon" />
            {isOpen && "Reports"}
          </>
        )}
      </NavLink>
      <NavLink to="/users" className={({ isActive }) => isActive ? 'active' : ''} onClick={() => handleNavLinkClick('inventory')}>
        {({ isActive }) => (
          <>
            <img src={isActive ? users_active : users_inactive} alt="Users icon" />
            {isOpen && "Users"}
          </>
        )}
      </NavLink>

      <div className="bot_sidebar">
        <NavLink to="/settings" className={({ isActive }) => isActive ? 'active' : ''} onClick={() => handleNavLinkClick('inventory')}>
          {({ isActive }) => (
            <>
              <img src={settings_inactive} alt="Settings icon" />
              {isOpen && "Settings"}
            </>
          )}
        </NavLink>
        <NavLink to="/logout" className={({ isActive }) => isActive ? 'active' : ''} onClick={() => handleNavLinkClick('inventory')}>
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

export default Sidebar;