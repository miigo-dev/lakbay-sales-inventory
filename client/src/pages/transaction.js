import React, { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import '../css/transaction.css';

const Transaction = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const completedOrders = [
    { id: 1, orderNumber: '001', item: 'Item A', date: '2024-11-08', amount: '$20' },
    { id: 2, orderNumber: '002', item: 'Item B', date: '2024-11-07', amount: '$40' },
    { id: 3, orderNumber: '003', item: 'Item C', date: '2024-11-06', amount: '$15' },
  ];

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const filteredOrders = completedOrders.filter(order => order.date === selectedDate);

  return (
    <div className="dashboard">
      <div className="transaction-container">
        <div className="header">
          <h3>Transaction</h3>
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
            { field: 'amount', headerName: 'Amount', width: 100 },
          ]}
          autoHeight
          pageSize={5}
          disableSelectionOnClick
        />
      </div>
    </div>
  );
};

export default Transaction;
