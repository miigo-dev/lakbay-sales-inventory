import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Modal, Box, Typography, Button } from '@mui/material';
import '../css/notification.css';

const Notification = () => {
  const [movements, setMovements] = useState([]);
  const [priceChanges, setPriceChanges] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);

  const fetchMovements = async () => {
    try {
      const response = await fetch('/alerts/movements');
      const data = await response.json();
      setMovements(data);
    } catch (error) {
      console.error('Error fetching movements:', error);
    }
  };

  const fetchPriceChanges = async () => {
    try {
      const response = await fetch('/alerts/price-changes');
      const data = await response.json();
      setPriceChanges(data);
    } catch (error) {
      console.error('Error fetching price changes:', error);
    }
  };

  useEffect(() => {
    fetchMovements();
    fetchPriceChanges();
  }, []);

  const handleOpen = (notification) => {
    setSelectedNotification(notification);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedNotification(null);
  };

  const columns = [
    { field: 'time', headerName: 'Time', flex: 1 },
    { field: 'title', headerName: 'Title', flex: 1 },
    { field: 'message', headerName: 'Message', flex: 2 },
    {
      field: 'action',
      headerName: 'Action',
      flex: 0.5,
      renderCell: (params) => (
        <button className="btn view_btn" onClick={() => handleOpen(params.row)}>
          Read More...
        </button>
      ),
    },
  ];

  const rows = [
    ...movements.map((m, index) => ({
      id: `M-${index}`,
      time: new Date(m.movement_date).toLocaleString(),
      title: `${m.item_type} Movement`,
      message: `${m.item_name} was moved ${m.movement_quantity} (${m.movement_type}).`,
    })),
    ...priceChanges.map((p, index) => ({
      id: `P-${index}`,
      time: new Date(p.updated_at).toLocaleString(),
      title: 'Price Change',
      message: `${p.product_name} price changed to $${p.product_price}.`,
    })),
  ];

  return (
    <div className="notification-page">
      <h1>Notifications</h1>
      <div style={{ height: 400, width: '100%' }}>
        <DataGrid rows={rows} columns={columns} pageSize={5} />
      </div>

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
