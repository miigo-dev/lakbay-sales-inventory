import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid';
import '../css/transaction.css';

const Transaction = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [completedOrders, setCompletedOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch orders from API endpoint
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:8080/api/orders/'); // Replace with your endpoint
        setCompletedOrders(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('Failed to load transaction data');
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Filter orders based on selected date
  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const filteredOrders = completedOrders.filter(order => order.date === selectedDate);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="dashboard">
      <div className="transaction-container">
        <div className="header">
          <h3>Transaction History</h3>
          <div className="date-filter">
            <label htmlFor="date-picker">Date: </label>
            <input
              type="date"
              id="date-picker"
              value={selectedDate}
              onChange={handleDateChange}
            />
          </div>
        </div>
        <DataGrid
          rows={filteredOrders}
          columns={[
            { field: 'date', headerName: 'Date', width: 150 },
            { field: 'orderNumber', headerName: 'Order No.', width: 100 },
            { field: 'item', headerName: 'Item', width: 150 },
            { field: 'amount', headerName: 'Amount', width: 100 },
          ]}
          autoHeight
          pageSize={5}
          pagination
          disableSelectionOnClick
        />
      </div>
    </div>
  );
};

export default Transaction;
