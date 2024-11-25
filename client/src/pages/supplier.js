import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import '../css/supplier.css';

const Supplier = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newSupplier, setNewSupplier] = useState({
    supplierName: '',
    email: '',
    phoneNumber: '',
    address: '',
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSuppliers = async (query = '') => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:8080/api/suppliers?search=${encodeURIComponent(query)}`);
      if (!response.ok) throw new Error('Failed to fetch suppliers.');
      const data = await response.json();
      setSuppliers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers(searchQuery);
  }, [searchQuery]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewSupplier({ ...newSupplier, [name]: value });
  };

  // Add a new supplier
  const handleAddSupplier = async () => {
    if (newSupplier.supplierName && newSupplier.email && newSupplier.phoneNumber && newSupplier.address) {
      try {
        const response = await fetch('http://localhost:8080/api/suppliers', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: newSupplier.supplierName,
            email: newSupplier.email,
            phone_number: newSupplier.phoneNumber,
            address: newSupplier.address,
          }),
        });
  
        if (!response.ok) {
          throw new Error(`Failed to add supplier: ${response.statusText}`);
        }
  
        const addedSupplier = await response.json();
  
        setSuppliers((prevSuppliers) => [...prevSuppliers, addedSupplier]);
  
        setNewSupplier({ supplierName: '', email: '', phoneNumber: '', address: '' });
        setIsModalOpen(false);
      } catch (err) {
        alert(err.message);
      }
    } else {
      alert('Please fill out all fields.');
    }
  };

  const columns = [
    { field: 'supplier_id', headerName: 'ID', width: 100 },
    { field: 'supplier_name', headerName: 'Supplier Name', width: 200 },
    { field: 'email', headerName: 'Email', width: 200 },
    { field: 'phone_number', headerName: 'Phone Number', width: 150 },
    { field: 'address', headerName: 'Address', width: 250 },
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
              type="email"
              name="email"
              placeholder="Email"
              value={newSupplier.email}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="phoneNumber"
              placeholder="Phone Number"
              value={newSupplier.phoneNumber}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="address"
              placeholder="Address"
              value={newSupplier.address}
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
        {loading ? (
          <p>Loading suppliers...</p>
        ) : error ? (
          <p>Error: {error}</p>
        ) : (
          <DataGrid
            rows={suppliers}
            columns={columns}
            getRowId={(row) => row.supplier_id}
            autoHeight
            pageSize={5}
            pagination
            disableSelectionOnClick
          />
        )}
      </div>
    </div>
  );
};

export default Supplier;
