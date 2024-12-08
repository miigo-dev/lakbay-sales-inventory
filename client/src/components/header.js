import React, { useState } from 'react';
import '../css/header.css';
import { useNavigate } from 'react-router-dom';
import notification from '../assets/icons/notif.svg';
import user from '../assets/icons/user.svg';
import { unauthenticateUser } from '../redux/slices/authSlice';
import { useDispatch } from 'react-redux';
import { onLogout } from '../api/auth';


const Header = () => {
  const dispatch = useDispatch();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleViewAllClick = () => {
    navigate('/notifications');
    setIsModalOpen(false); 
  };

  const handleDropdownClick = (path) => {
    navigate(path);
    setIsDropdownOpen(false); // Close the dropdown after navigation
  };

  const logout = async () => {
    try {
      await onLogout();
      dispatch(unauthenticateUser());
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <header className="static-header">
      <div className="header-left"></div>
      <div className="header-right">
        <img
          src={notification}
          alt="Notifications"
          className="icon"
          onClick={toggleModal} 
        />
        <div
          className={`profile-dropdown ${isDropdownOpen ? 'active' : ''}`}
          onClick={toggleDropdown}
        >
          <img src={user} alt="User Profile" className="icon profile-icon" />
          <div className="dropdown-menu">
            <button
              className="dropdown-item"
              onClick={() => handleDropdownClick("/settings/backup")}
            >
              Backup
            </button>
            <button
              className="dropdown-item"
              onClick={() => handleDropdownClick("/settings/about")}
            >
              About
            </button>
            <button className="dropdown-item" onClick={logout}>Logout</button>
          </div>
        </div>
      </div>

      {/* Notification Modal */}
      {isModalOpen && (
        <div className="notification-modal">
          <div className="modal-content">
            <button className="close_button" onClick={toggleModal}>
              &times;
            </button>
            <h2>Notifications</h2>
            <div className="modal-body">
              <img
                src={notification}
                alt="No Notifications"
                className="no-notifications-icon"
              />
              <h3>No Notifications</h3>
              <p>We'll let you know when there will be something new for you.</p>
              <button className='view-all-btn'onClick={handleViewAllClick}>View All</button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;