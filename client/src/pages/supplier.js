import React, { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import '../css/supplier.css';

const Supplier = () => {
  const [suppliers, setSuppliers] = useState([
    { id: 1, supplierName: 'Supplier A', contact: '123-456-7890', address: '123 Main St, City A', deliverySchedule: 'Weekly', orderNumber: '001' },
    { id: 2, supplierName: 'Supplier B', contact: '987-654-3210', address: '456 Side Rd, City B', deliverySchedule: 'Monthly', orderNumber: '002' },
    { id: 3, supplierName: 'Supplier C', contact: '555-555-5555', address: '789 Hilltop Ln, City C', deliverySchedule: 'Bi-Weekly', orderNumber: '003' },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newSupplier, setNewSupplier] = useState({
    supplierName: '',
    contact: '',
    address: '',
    deliverySchedule: '',
    orderNumber: '',
  });
  const [searchQuery, setSearchQuery] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewSupplier({ ...newSupplier, [name]: value });
  };

  const handleAddSupplier = () => {
    if (
      newSupplier.supplierName &&
      newSupplier.contact &&
      newSupplier.address &&
      newSupplier.deliverySchedule &&
      newSupplier.orderNumber
    ) {
      const newId = suppliers.length + 1;
      const updatedSuppliers = [...suppliers, { id: newId, ...newSupplier }];
      setSuppliers(updatedSuppliers);
      setNewSupplier({ supplierName: '', contact: '', address: '', deliverySchedule: '', orderNumber: '' });
      setIsModalOpen(false);
    } else {
      alert('Please fill out all fields.');
    }
  };

  const filteredSuppliers = suppliers.filter((supplier) =>
    supplier.supplierName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns = [
    { field: 'id', headerName: 'ID', width: 100 },
    { field: 'supplierName', headerName: 'Supplier Name', width: 200 },
    { field: 'contact', headerName: 'Contact', width: 150 },
    { field: 'address', headerName: 'Address', width: 250 },
    { field: 'deliverySchedule', headerName: 'Delivery Schedule', width: 200 },
    { field: 'orderNumber', headerName: 'Order No.', width: 150 },
  ];

  return (
    <div className="supplier-container">
      <h1>Supplier Management</h1>

      <div className="button-container">
        <input
          type="text"
          className="search-input"
          placeholder="Search by supplier name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button className="add-supplier-btn" onClick={() => setIsModalOpen(true)}>
          Add Supplier
        </button>
      </div>

      {isModalOpen && (
        <div className="modal_overlay">
          <div className="modal_content">
            <div className="modal_header">
              <h2>Add New Supplier</h2>
              <button className="close_button" onClick={() => setIsModalOpen(false)}>
                &times;
              </button>
            </div>
            <input
              type="text"
              name="supplierName"
              placeholder="Supplier Name"
              value={newSupplier.supplierName}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="contact"
              placeholder="Contact"
              value={newSupplier.contact}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="address"
              placeholder="Address"
              value={newSupplier.address}
              onChange={handleInputChange}
            />
            <select
              name="deliverySchedule"
              value={newSupplier.deliverySchedule}
              onChange={handleInputChange}
            >
              <option value="">Select Delivery Schedule</option>
              <option value="Weekly">Weekly</option>
              <option value="Bi-Weekly">Bi-Weekly</option>
              <option value="Monthly">Monthly</option>
            </select>
            <input
              type="text"
              name="orderNumber"
              placeholder="Order Number"
              value={newSupplier.orderNumber}
              onChange={handleInputChange}
            />
            <div className="modal-buttons">
              <button className="save-btn" onClick={handleAddSupplier} style={{ width: '100%' }}>
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="data-grid">
        <DataGrid
          rows={filteredSuppliers}
          columns={columns}
          autoHeight
          pageSize={5}
          pagination
          disableSelectionOnClick
        />
      </div>
    </div>
  );
};

export default Supplier;
