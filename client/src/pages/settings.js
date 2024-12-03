import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import '../css/settings.css';

const Settings = () => {
  return (
    <div className="settings-container">
      <h1 className="label_header">Settings</h1>
      <hr className="settings-divider" />

      {/* Sidebar Navigation for Settings */}
      <div className="settings_options">
        <NavLink
          to="/settings/backup"
          className={({ isActive }) => (isActive ? 'settings-button active' : 'settings-button')}
        >
          Backup Settings
        </NavLink>
        <NavLink
          to="/settings/historylog"
          className={({ isActive }) => (isActive ? 'settings-button active' : 'settings-button')}
        >
          History Log
        </NavLink>
        <NavLink
          to="/settings/about"
          className={({ isActive }) => (isActive ? 'settings-button active' : 'settings-button')}
        >
          About
        </NavLink>
      </div>

      {/* Dynamic Content */}
      <div className="settings-content">
        <Outlet /> {/* Renders the nested route components here */}
      </div>
    </div>
  );
};

export default Settings;
