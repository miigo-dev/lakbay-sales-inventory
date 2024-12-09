import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Modal, Box, Typography, Button, ToggleButton, ToggleButtonGroup } from '@mui/material';
import '../css/notification.css';

const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const [filteredNotifications, setFilteredNotifications] = useState([]);
  const [filter, setFilter] = useState('unread'); // 'unread' or 'all'
  const [open, setOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);

  // Fetch notifications from the backend
  const fetchNotifications = async (type = 'all') => {
    const url =
      type === 'unread'
        ? 'http://localhost:8080/api/notifications/unread'
        : 'http://localhost:8080/api/notifications';

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch notifications');
      const data = await response.json();
      console.log('Fetched Notifications:', data); // Debugging log
      setNotifications(data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  // Mark a notification as read
  const markAsRead = async (id) => {
    try {
      const response = await fetch('http://localhost:8080/api/notifications/mark-read', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) throw new Error('Failed to mark notification as read');
      console.log(`Notification ${id} marked as read`);

      // Update local state
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) =>
          notification.notification_id === id
            ? { ...notification, is_read: true }
            : notification
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  // Handle modal open
  const handleOpen = (notification) => {
    setSelectedNotification(notification);
    setOpen(true);

    if (!notification.is_read) {
      markAsRead(notification.id);
    }
  };

  // Handle modal close
  const handleClose = () => {
    setOpen(false);
    setSelectedNotification(null);
    fetchNotifications(filter); // Re-fetch notifications when closing the modal
  };

  // Handle filter change
  const handleFilterChange = (event, newFilter) => {
    if (newFilter) {
      setFilter(newFilter);
      fetchNotifications(newFilter === 'unread' ? 'unread' : 'all');
    }
  };

  // Update filtered notifications whenever `notifications` or `filter` changes
  useEffect(() => {
    console.log('Applying Filter:', filter); // Debugging log
    if (filter === 'unread') {
      setFilteredNotifications(notifications.filter((n) => !n.is_read));
    } else {
      setFilteredNotifications(notifications);
    }
  }, [notifications, filter]);

  // Initial data fetch
  useEffect(() => {
    fetchNotifications(filter);
  }, [filter]);

  // Map notifications to rows for DataGrid
  const rows = filteredNotifications.map((notification) => ({
    id: notification.notification_id, // Ensure this maps to the unique key
    time: notification.created_at ? new Date(notification.created_at).toLocaleString() : 'N/A',
    title: notification.notification_type === 'product' ? 'Product Alert' : 'Ingredient Alert',
    message: notification.message || 'No message available',
    is_read: notification.is_read,
  }));

  const columns = [
    { field: 'time', headerName: 'Time', flex: 1 },
    { field: 'title', headerName: 'Title', flex: 1 },
    { field: 'message', headerName: 'Message', flex: 2 },
    {
      field: 'action',
      headerName: 'Action',
      flex: 0.5,
      renderCell: (params) => (
        <button
          className="btn view_btn"
          onClick={() => handleOpen(params.row)}
        >
          Read More...
        </button>
      ),
    },
  ];

  return (
    <div className="notification-page">
      <h1>Notifications</h1>

      {/* Filter Toggle */}
      <ToggleButtonGroup
        value={filter}
        exclusive
        onChange={handleFilterChange}
        sx={{ marginBottom: 2 }}
      >
        <ToggleButton value="unread">Unread Notifications</ToggleButton>
        <ToggleButton value="all">All Notifications</ToggleButton>
      </ToggleButtonGroup>

      {/* Data Grid */}
      <div style={{ height: 400, width: '100%' }}>
        <DataGrid rows={rows} columns={columns} pageSize={5} />
      </div>

      {/* Modal */}
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 500,
            bgcolor: 'background.paper',
            border: '1px solid #ddd',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          {selectedNotification && (
            <>
              <Typography variant="h5" component="h2" gutterBottom>
                {selectedNotification.title}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                {selectedNotification.time}
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {selectedNotification.message}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={handleClose}
                sx={{ mt: 2 }}
              >
                Close
              </Button>
            </>
          )}
        </Box>
      </Modal>
    </div>
  );
};

export default Notification;