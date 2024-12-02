import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid';
import '../css/transaction.css';

const Transaction = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]); 
  const [completedOrders, setCompletedOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:8080/api/transaction');
        console.log('API Response:', response.data);
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

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const formattedSelectedDate = new Date(selectedDate).toLocaleDateString('en-CA');

  const filteredOrders = completedOrders
    .map(order => ({
      ...order,
      id: order.order_id,
      order_date: new Date(order.order_date).toLocaleDateString('en-CA'), 
    }))
    .filter(order => order.order_date === formattedSelectedDate);

  console.log('Filtered Orders:', filteredOrders);

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
          { field: 'order_date', headerName: 'Date', width: 150 },
          { field: 'order_id', headerName: 'Order No.', width: 100 },
          { field: 'order_status', headerName: 'Status', width: 150 },
        ]}
        getRowId={(row) => row.order_id}
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
