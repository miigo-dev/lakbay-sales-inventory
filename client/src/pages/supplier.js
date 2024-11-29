import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import '../css/supplier.css';

const Supplier = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false); // For edit modal
  const [newSupplier, setNewSupplier] = useState({
    supplierName: '',
    email: '',
    phoneNumber: '',
    address: '',
  });
  const [selectedSupplier, setSelectedSupplier] = useState(null); // For the supplier being edited
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

  const handleDeleteSupplier = (supplierId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this supplier?");
    if (confirmDelete) {
      setSuppliers((prevSuppliers) => prevSuppliers.filter(supplier => supplier.supplier_id !== supplierId));
      alert("Supplier deleted successfully.");
    }
  };

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

  const handleEditSupplier = async () => {
    if (selectedSupplier) {
      try {
        const response = await fetch(`http://localhost:8080/api/suppliers/${selectedSupplier.supplier_id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: selectedSupplier.supplier_name,
            email: selectedSupplier.email,
            phone_number: selectedSupplier.phone_number,
            address: selectedSupplier.address,
          }),
        });

        if (!response.ok) {
          throw new Error(`Failed to update supplier: ${response.statusText}`);
        }

        const updatedSupplier = await response.json();
        setSuppliers((prevSuppliers) =>
          prevSuppliers.map((supplier) =>
            supplier.supplier_id === updatedSupplier.supplier_id ? updatedSupplier : supplier
          )
        );

        setEditModalOpen(false);
        setSelectedSupplier(null);
      } catch (err) {
        alert(err.message);
      }
    }
  };
  const columns = [
    { field: 'supplier_id', headerName: 'ID', width: 100 },
    { field: 'supplier_name', headerName: 'Supplier Name', width: 200 },
    { field: 'email', headerName: 'Email', width: 200 },
    { field: 'phone_number', headerName: 'Phone Number', width: 150 },
    { field: 'address', headerName: 'Address', width: 250 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 200,
      renderCell: (params) => (
        <div className="action-buttons">
          <button
            className="btn edit-button"
            onClick={() => {
              setSelectedSupplier(params.row);
              setEditModalOpen(true);
            }}
          >
            Edit
          </button>
          <button
            className="btn delete-button"
            onClick={() => handleDeleteSupplier(params.row.supplier_id)}
          >
            Delete
          </button>
        </div>
      ),
    },
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
        <button className="add_btn" onClick={() => setIsModalOpen(true)}>
          Add Supplier
        </button>
      </div>

      {isModalOpen && (
        <div className="modal_overlay">
          <div className="modal_content">
            <h2>Add New Supplier</h2>
            <button className="close_button" onClick={() => setIsModalOpen(false)}>
              &times;
            </button>
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
            <button className="save-btn" onClick={handleAddSupplier}>
              Add
            </button>
          </div>
        </div>
      )}

      {editModalOpen && selectedSupplier && (
        <div className="modal_overlay">
          <div className="modal_content">
            <h2>Edit Supplier</h2>
            <button className="close_button" onClick={() => setEditModalOpen(false)}>
              &times;
            </button>
            <input
              type="text"
              name="supplier_name"
              placeholder="Supplier Name"
              value={selectedSupplier.supplier_name}
              onChange={(e) => setSelectedSupplier({ ...selectedSupplier, supplier_name: e.target.value })}
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={selectedSupplier.email}
              onChange={(e) => setSelectedSupplier({ ...selectedSupplier, email: e.target.value })}
            />
            <input
              type="text"
              name="phone_number"
              placeholder="Phone Number"
              value={selectedSupplier.phone_number}
              onChange={(e) => setSelectedSupplier({ ...selectedSupplier, phone_number: e.target.value })}
            />
            <input
              type="text"
              name="address"
              placeholder="Address"
              value={selectedSupplier.address}
              onChange={(e) => setSelectedSupplier({ ...selectedSupplier, address: e.target.value })}
            />
            <button className="save-btn" onClick={handleEditSupplier}>
              Save Changes
            </button>
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