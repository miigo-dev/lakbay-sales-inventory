import '../css/damage.css';
import { useState } from 'react';

const Reports = () => {
    const [activeTab, setActiveTab] = useState('Lakbay Kape');
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
            if (activeTab === 'Lakbay Kape') {
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
            if (activeTab === 'Lakbay Kape') {
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
            if (activeTab === 'Lakbay Kape') {
                setProductsKape(lakbayKape.filter((product) => product.id !== id));
            } else {
                setProductsKain(lakbayKain.filter((product) => product.id !== id));
            }
        }
    };

    return (
        <div className='damage_container'>
            <div className="searchbar">
                <input type="text" placeholder="Search a product" className="searchbar_input" />
                <button className="search_btn">Search</button>
                <button className="filter_btn">Filter</button>
            </div>

            <div className="tabs">
                <button
                    className={`tab ${activeTab === 'Lakbay Kape' ? 'active' : ''}`}
                    onClick={() => handleTabClick('Lakbay Kape')}>
                    Lakbay Kape
                </button>

                <button
                    className={`tab ${activeTab === 'Lakbay Kain' ? 'active' : ''}`}
                    onClick={() => handleTabClick('Lakbay Kain')}>
                    Lakbay Kain
                </button>

                <button className="addReport" onClick={() => openModal()}>
                    Add Report
                </button>
            </div>

            {activeTab === 'Lakbay Kain' ? (
                <div>
                    {lakbayKain.length === 0 ? (
                        <p>No Damage Report Added Yet</p>
                    ) : (
                        <table className="kain_table">
                            <thead>
                                <tr>
                                    <th>Product ID</th>
                                    <th>Product</th>
                                    <th>Category</th>
                                    <th>Unit</th>
                                    <th>Quantity</th>
                                    <th>Date Added</th>
                                    <th>Reason</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {lakbayKain.map((product, index) => (
                                    <tr key={index}>
                                        <td>{product.id}</td>
                                        <td>{product.productName}</td>
                                        <td>{product.category}</td>
                                        <td>{product.unitofMeasure}</td>
                                        <td>{product.stockQuantity}</td>
                                        <td>{product.dateAdded}</td>
                                        <td>{product.reason}</td>
                                        <td>
                                            <button onClick={() => openModal(product)}>Edit</button>
                                            <button onClick={() => deleteItem(product.id)}>Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            ) : (
                <div>
                    {lakbayKape.length === 0 ? (
                        <p>No Damage Report Added Yet</p>
                    ) : (
                        <table className="kape_table">
                            <thead>
                                <tr>
                                    <th>Product ID</th>
                                    <th>Product</th>
                                    <th>Category</th>
                                    <th>Unit</th>
                                    <th>Quantity</th>
                                    <th>Date Added</th>
                                    <th>Reason</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {lakbayKape.map((product, index) => (
                                    <tr key={index}>
                                        <td>{product.id}</td>
                                        <td>{product.productName}</td>
                                        <td>{product.category}</td>
                                        <td>{product.unitofMeasure}</td>
                                        <td>{product.stockQuantity}</td>
                                        <td>{product.dateAdded}</td>
                                        <td>{product.reason}</td>
                                        <td>
                                            <button onClick={() => openModal(product)}>Edit</button>
                                            <button onClick={() => deleteItem(product.id)}>Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
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

                                <option value="categ">Select a action</option>
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
