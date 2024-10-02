import React from 'react';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import '../css/sidebar.css';

import logo from '../assets/icons/lakbay_logo50px.png';
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

const Sidebar = () => {

  return (
    <div className="sidebar">
      <div className="header_sidebar">
        <img src={logo} alt="Logo" className="logo" />
        <h2>Lakbay Kape</h2>
      </div>

      <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'active' : ''}>
        {({ isActive }) => (
          <>
            <img src={isActive ? dash_active : dash_inactive} alt="Dashboard icon" />
            Dashboard
          </>
        )}
      </NavLink>
      <NavLink to="/orders" className={({ isActive }) => isActive ? 'active' : ''}>
        {({ isActive }) => (
          <>
            <img src={isActive ? order_active : order_inactive} alt="Orders icon" />
            Orders
          </>
        )}
      </NavLink>
      <NavLink to="/inventory" className={({ isActive }) => isActive ? 'active' : ''}>
        {({ isActive }) => (
          <>
            <img src={isActive ? inventory_active : inventory_inactive} alt="Inventory icon" />
            Inventory
          </>
        )}
      </NavLink>
      <NavLink to="/sales" className={({ isActive }) => isActive ? 'active' : ''}>
        {({ isActive }) => (
          <>
            <img src={isActive ? settings_inactive : settings_inactive} alt="Sales icon" />
            Sales
          </>
        )}
      </NavLink>
      <NavLink to="/reports" className={({ isActive }) => isActive ? 'active' : ''}>
        {({ isActive }) => (
          <>
            <img src={isActive ? reports_active : reports_inactive} alt="Reports icon" />
            Reports
          </>
        )}
      </NavLink>
      <NavLink to="/users" className={({ isActive }) => isActive ? 'active' : ''}>
        {({ isActive }) => (
          <>
            <img src={isActive ? users_active : users_inactive} alt="Users icon" />
            Users
          </>
        )}
      </NavLink>

      <div className="bot_sidebar">
        <NavLink to="/settings" className={({ isActive }) => isActive ? 'active' : ''}>
          {({ isActive }) => (
            <>
              <img src={isActive ? settings_inactive : settings_inactive} alt="Settings icon" />
              Settings
            </>
          )}
        </NavLink>
        <NavLink to="/logout" className={({ isActive }) => isActive ? 'active' : ''}>
          {({ isActive }) => (
            <>
              <img src={isActive ? logout_icon : logout_icon} alt="Logout icon" />
              Logout
            </>
          )}
        </NavLink>
        </div>
      </div>
  );
};

export default Sidebar;