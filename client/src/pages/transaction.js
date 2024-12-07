import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid';
import '../css/transaction.css';
import Export from '../assets/icons/export.svg';

const Transaction = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [completedOrders, setCompletedOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [pageSize, setPageSize] = useState(5);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:8080/api/transaction');
        // Sort the orders by order_id in descending order
        const sortedOrders = response.data.sort((a, b) => b.order_id - a.order_id);
        setCompletedOrders(sortedOrders);
        setLoading(false);
      } catch (err) {
        setError('Failed to load transaction data');
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const handleViewClick = async (order) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/transaction/${order.order_id}`);
      setSelectedOrder(response.data);
      setModalOpen(true);
    } catch {
      alert('Failed to fetch order details.');
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedOrder(null);
  };

  const formattedSelectedDate = new Date(selectedDate).toLocaleDateString('en-CA');

  const filteredOrders = completedOrders
  .map((order) => ({
    ...order,
    id: order.order_id,
    order_date: new Date(order.order_date).toLocaleDateString('en-CA'),
  }))
  .filter((order) => {
    const orderDate = new Date(order.order_date);
    const start = new Date(startDate);
    const end = new Date(endDate);
    return orderDate >= start && orderDate <= end;
  });

  if (loading) return <div>Loading...</div>;

  if (error) return <div>Error: {error}</div>;

  return (
    <div className="dashboard">
      <div className="transaction-container">
        <div className="header">
        <h3>Transaction History</h3>
          <div className="date-filter">
           
              <label htmlFor="start-date">From:</label>
            <input
              type="date"
              id="start-date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <label htmlFor="end-date">To:</label>
            <input
              type="date"
              id="end-date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>
        <DataGrid
          rows={filteredOrders}
          className="grid_container"
          columns={[
            { field: 'order_date', headerName: 'Date', width: 150 },
            { field: 'order_id', headerName: 'Order No.', width: 100 },
            { field: 'order_status', headerName: 'Status', width: 150 },
            {
              field: 'action',
              headerName: 'Action',
              width: 150,
              renderCell: (params) => (
                <button
                  className="btn view_btn"
                  onClick={() => handleViewClick(params.row)}
                >
                  View
                </button>
              ),
            },
          ]}
          getRowId={(row) => row.order_id}
           autoHeight={false}
          style={{
            maxHeight: 700, 
          }}
          pageSize={10}
          rowsPerPageOptions={[5, 10, 20]}
          pagination
          disableSelectionOnClick
        />
      </div>
      {modalOpen && (
        <div className="modal">
          <div className="modal_content">
            <h2>Order ID: {selectedOrder.order_id}</h2>
            <DataGrid
              rows={selectedOrder.items.map((item, index) => ({
                id: index,
                product_name: item.product_name,
                quantity: item.quantity,
                total_amount: item.order_total,
              }))}
              columns={[
                { field: 'product_name', headerName: 'Order Items', width: 200 },
                { field: 'quantity', headerName: 'Quantity', width: 150 },
                { field: 'total_amount', headerName: 'Amount', width: 150 },
              ]}
              autoHeight
              pageSize={5}
              disableSelectionOnClick
            />
            <button className="cancel_button" onClick={handleCloseModal}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Transaction;
