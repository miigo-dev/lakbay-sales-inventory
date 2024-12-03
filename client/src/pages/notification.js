import React, { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Modal, Box, Typography, Button } from '@mui/material';
import '../css/notification.css';

const Notification = () => {
  const [notifications] = useState([
    {
      id: 1,
      time: 'November 15, 2024 12:00 PM',
      title: 'NEW FEATURE: Restrict cashier punching',
      message:
        "Have you experienced 'No Cashier' reports? This is when your cashiers are punching sales without them logging on to Hello button on the POS! Considered this resolved! With this new feature in your...",
    },
    {
      id: 2,
      time: 'November 15, 2024 12:00 PM',
      title: 'NEW FEATURE: Are you tired of linking ingredients?',
      message:
        'We got you, partner! With this new Copy Inventory Tool, pwede ka nang kumopya ng linking of ingredients from one item to another! Check out the instructions below.',
    },
  ]);

  const [open, setOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);

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

  return (
    <div className="notification-page">
      <h1>Notifications</h1>
      <div style={{ height: 400, width: '100%' }}>
        <DataGrid rows={notifications} columns={columns} pageSize={5} />
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
