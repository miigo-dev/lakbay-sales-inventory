import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import '../css/damage.css';

const Reports = () => {
    const [activeTab, setActiveTab] = useState('All');
    const [lakbayKape, setProductsKape] = useState([]);
    const [lakbayKain, setProductsKain] = useState([]); // New state for Lakbay Kain
    const [modalOpen, setModalOpen] = useState(false);
    const [modalData, setModalData] = useState({
        id: '',
        productName: '',
        category: '',
        unitofMeasure: '',
        stockQuantity: '',
        dateAdded: '',
        reason: '',
        action: ''
    });
    const [edit, setEdit] = useState(false);

    const handleTabClick = (tabName) => {
        setActiveTab(tabName);
    };

    const openModal = (product = null) => {
        if (product) {
            setModalData(product);
            setEdit(true);
        } else {
            setModalData({
                id: '',
                productName: '',
                category: '',
                unitofMeasure: '',
                stockQuantity: '',
                dateAdded: '',
                reason: '',
                action: ''
            });
            setEdit(false);
        }
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
    };

    const inputChange = (e) => {
        const { name, value } = e.target;
        setModalData((prevData) => ({ ...prevData, [name]: value }));
    };

    const submitForm = () => {
        if (edit) {
            if (activeTab === 'Lakbay Kape' || activeTab === 'All') {
                setProductsKape((prevProducts) =>
                    prevProducts.map((product) =>
                        product.id === modalData.id ? modalData : product
                    )
                );
            } else {
                setProductsKain((prevProducts) =>
                    prevProducts.map((product) =>
                        product.id === modalData.id ? modalData : product
                    )
                );
            }
        } else {
            if (activeTab === 'Lakbay Kape' || activeTab === 'All') {
                setProductsKape([...lakbayKape, modalData]);
            } else {
                setProductsKain([...lakbayKain, modalData]);
            }
        }
        setModalOpen(false);
    };

    const deleteItem = (id) => {
        const confirmDelete = window.confirm('Delete this item?');
        if (confirmDelete) {
            if (activeTab === 'Lakbay Kape' || activeTab === 'All') {
                setProductsKape(lakbayKape.filter((product) => product.id !== id));
            } else {
                setProductsKain(lakbayKain.filter((product) => product.id !== id));
            }
        }
    };

    const columns = [
        { field: 'id', headerName: 'Product ID', width: 150 },
        { field: 'productName', headerName: 'Product Name', width: 180 },
        { field: 'category', headerName: 'Category', width: 150 },
        { field: 'unitofMeasure', headerName: 'Unit of Measure', width: 180 },
        { field: 'stockQuantity', headerName: 'Quantity', width: 120 },
        { field: 'dateAdded', headerName: 'Date Added', width: 180 },
        { field: 'reason', headerName: 'Reason', width: 180 },
        { field: 'action', headerName: 'Action', width: 180, renderCell: (params) => (
            <div>
                <button className="btn view_btn" onClick={() => openModal(params.row)}>Edit</button>
                <button className="btn out_btn" onClick={() => deleteItem(params.row.id)}>Delete</button>
            </div>
        )}
    ];

    // Combine both data sets when "All" is selected
    const dataToDisplay = activeTab === 'All' 
        ? [...lakbayKape, ...lakbayKain] 
        : activeTab === 'Lakbay Kape' 
        ? lakbayKape 
        : lakbayKain;

    return (
        <div className='damage_container'>
           
            <div className='header_container'>
            <h2>Reports</h2>
                <select 
                    className="dropdown_btn" 
                    value={activeTab} 
                    onChange={(e) => setActiveTab(e.target.value)}>
                    <option value="All">All</option>
                    <option value="Lakbay Kape">Lakbay Kape</option>
                    <option value="Lakbay Kain">Lakbay Kain</option>
                </select>
                
            </div>
            <button className="addReport" onClick={() => openModal()}>
                    Add Report
                </button> 
            <div className="tabs">
                {/* Dropdown Button */}
                <div className="searchbar">
                <input type="text" placeholder="Search a product" className="searchbar_input" />
            </div>
            </div>

            {dataToDisplay && (
                <div>
                    <DataGrid
                        rows={dataToDisplay}
                        columns={columns}
                        pageSize={10}
                        rowsPerPageOptions={[10, 20, 50]}
                        disableSelectionOnClick
                        hideFooterSelectedRowCount
                    />
                </div>
            )}

            {modalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={closeModal}>&times;</span>
                        <h2>{edit ? 'Edit Report' : 'Add Report'}</h2>
                        <form onSubmit={(e) => { e.preventDefault(); submitForm(); }} className='input_report'>
                            <label>Product ID:</label>
                            <input type="text" name="id" value={modalData.id} onChange={inputChange} required />
                            <br />
                            <label>Product Name:</label>
                            <input type="text" name="productName" value={modalData.productName} onChange={inputChange} required />
                            <br />
                            <label>Category:</label>
                            <select name="category" value={modalData.category} onChange={inputChange} required>
                                <option value="categ">Select a category</option>
                                <option value="raw">raw</option>
                                <option value="frozen">frozen</option>
                                <option value="equipment">equipment</option>
                            </select>
                            <br />
                            <label>Stock Quantity:</label>
                            <input type="number" name="stockQuantity" value={modalData.stockQuantity} onChange={inputChange} required /><br />
                            <label>Unit of Measure:</label>
                            <select name="unitofMeasure" value={modalData.unitofMeasure} onChange={inputChange} required>
                                <option value="categ">Select a unit</option>		
                                <option value="pieces">pieces</option>
                                <option value="bulk">bulk</option>
                                <option value="dozen">dozen</option>
                            </select>
                            <br />
                            <label>Date Added:</label>
                            <input type="date" name="dateAdded" value={modalData.dateAdded} onChange={inputChange} required /><br />
                            <label>Reason:</label>
                            <select name="reason" value={modalData.reason} onChange={inputChange} required>
                                <option value="categ">Select a reason</option>
                                <option value="expired">expired</option>
                                <option value="wrong item">wrong item</option>
                                <option value="missing">missing</option>
                                <option value="damage">damage</option>
                            </select>
                            <br />
                            <label>Action:</label>
                            <select name="action" value={modalData.action} onChange={inputChange} required>
                                <option value="categ">Select an action</option>
                                <option value="disposed">disposed</option>
                                <option value="replacement">replacement</option>
                                <option value="refund">refund</option>
                                <option value="compensation">compensation</option>
                            </select>
                            <br />
                            <button type="submit">{edit ? 'Update' : 'Add'} Report</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Reports;
