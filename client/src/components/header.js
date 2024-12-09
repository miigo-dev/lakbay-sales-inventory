import React, { useState, useEffect } from 'react';
import '../css/header.css';
import { useNavigate } from 'react-router-dom';
import notificationIcon from '../assets/icons/notif.svg';
import userIcon from '../assets/icons/user.svg';
import { unauthenticateUser } from '../redux/slices/authSlice';
import { useDispatch } from 'react-redux';
import { onLogout } from '../api/auth';
import axios from 'axios';

const Header = () => {
  const dispatch = useDispatch();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [hasNewNotifications, setHasNewNotifications] = useState(false); // Tracks if there are new notifications
  const navigate = useNavigate();

  // Fetch unread notifications
  const fetchUnreadNotifications = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/notifications/unread');
      setNotifications(response.data);
      setHasNewNotifications(response.data.length > 0); // Highlight icon if there are new notifications
    } catch (error) {
      console.error('Error fetching unread notifications:', error);
    }
  };

  // Poll notifications periodically
  useEffect(() => {
    fetchUnreadNotifications(); // Initial fetch

    const interval = setInterval(() => {
      fetchUnreadNotifications();
    }, 500); // Poll every 5 seconds

    return () => clearInterval(interval); // Clean up on component unmount
  }, []);

  // Handle "View All" button click
  const handleViewAllClick = () => {
    setNotifications([]); // Clear all notifications in the modal
    setHasNewNotifications(false); // Remove red highlight from the icon
    setIsModalOpen(false); // Close the modal
    navigate('/notifications'); // Navigate to the main notifications page
  };

  // Toggle profile dropdown
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Toggle notifications modal
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);

    // Fetch unread notifications when opening the modal
    if (!isModalOpen) {
      fetchUnreadNotifications();
    }
  };

  // Navigate to dropdown options
  const handleDropdownClick = (path) => {
    navigate(path);
    setIsDropdownOpen(false); // Close the dropdown after navigation
  };

  // Handle logout
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
        <div className="notification-icon-wrapper">
          <img
            src={notificationIcon}
            alt="Notifications"
            className={`icon ${hasNewNotifications ? 'highlight' : ''}`}
            onClick={toggleModal}
          />
          {hasNewNotifications && <span className="notification-badge"></span>}
        </div>
        <div
          className={`profile-dropdown ${isDropdownOpen ? 'active' : ''}`}
          onClick={toggleDropdown}
        >
          <img src={userIcon} alt="User Profile" className="icon profile-icon" />
          <div className="dropdown-menu">
            <button
              className="dropdown-item"
              onClick={() => handleDropdownClick('/settings/backup')}
            >
              Backup
            </button>
            <button
              className="dropdown-item"
              onClick={() => handleDropdownClick('/settings/about')}
            >
              About
            </button>
            <button className="dropdown-item" onClick={logout}>
              Logout
            </button>
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
              {notifications.length > 0 ? (
                <ul className="notification-list">
                  {notifications.map((notification) => (
                    <li key={notification.id} className="notification-item">
                      <div className="notification-text">
                        <strong>{notification.title}</strong>
                        <p>{notification.message}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="no-notifications">
                  <img
                    src={notificationIcon}
                    alt="No Notifications"
                    className="no-notifications-icon"
                  />
                  <h3>No Notifications</h3>
                  <p>We'll let you know when there will be something new for you.</p>
                </div>
              )}
              <button className="view-all-btn" onClick={handleViewAllClick}>
                View All
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;