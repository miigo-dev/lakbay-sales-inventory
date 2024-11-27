import React, { useState } from 'react';
import '../css/header.css';
import notification from '../assets/icons/notif.svg';
import user from '../assets/icons/user.svg';
import logo_icon from '../assets/icons/LKK.svg';

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <header className="static-header">
      <div className="header-left">
        <h1>Lakbay Kain & Lakbay Kape</h1>
      </div>
      <div className="header-right">
        <img src={notification} alt="Notifications" className="icon" />
        <div
          className={`profile-dropdown ${isDropdownOpen ? 'active' : ''}`}
          onClick={toggleDropdown}
        >
          <img src={user} alt="User Profile" className="icon profile-icon" />
          <div className="dropdown-menu">
            <button className="dropdown-item">Profile</button>
            <button className="dropdown-item">Backup</button>
            <button className="dropdown-item">Logout</button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
