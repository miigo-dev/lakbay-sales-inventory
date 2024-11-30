import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import '../css/sidebar.css';

import logo_icon from '../assets/icons/LKK.svg';
import logout_icon from '../assets/icons/logout_icon_dark.png';

import inventory_active from '../assets/icons/inventory_active.png';
import reports_active from '../assets/icons/reports_active.png';

import inventory_inactive from '../assets/icons/inventory_inactive.png';
import reports_inactive from '../assets/icons/reports_inactive.png';

import supplier_active from '../assets/icons/person-check-fill active.svg';
import supplier_inactive from '../assets/icons/person-check-fill inactive.svg';

const Inventory_sidebar = ({ onToggle }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [isInventoryOpen, setIsInventoryOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
    setIsInventoryOpen(false);
  };

  const toggleInventoryDropdown = () => {
    if (isOpen) {
      setIsInventoryOpen(!isInventoryOpen);
      // Close orders dropdown if it's open

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

      <div className="inventory-section">
        <div onClick={toggleInventoryDropdown}>
          <NavLink to="/inventoryper_inventory" className={({ isActive }) => isActive ? 'active' : ''}>
            {({ isActive }) => (
              <>
                <img src={isActive ? inventory_active : inventory_inactive} alt="Inventory icon" />
                {isOpen && "Inventory"}
              </>
            )}
          </NavLink>
        </div>
        <div className={`dropdown-child ${isInventoryOpen ? 'open' : ''}`}>
          <NavLink to="/inventoryper_inventory/inventoryper_supplier" className={({ isActive }) => isActive ? 'active' : ''}>
            {({ isActive }) => (
              <>
                <img src={isActive ? supplier_active : supplier_inactive} alt="Supplier icon" />
                {isOpen && "Supplier"}
              </>
            )}
          </NavLink>
        </div>
        <div className={`dropdown-child ${isInventoryOpen ? 'open' : ''}`}>
          <NavLink to="/inventoryper_inventory/inventoryper_reports" className={({ isActive }) => isActive ? 'active' : ''}>
            {({ isActive }) => (
              <>
                <img src={isActive ? reports_active : reports_inactive} alt="Reports icon" />
                {isOpen && "Reports"}
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

export default Inventory_sidebar;
