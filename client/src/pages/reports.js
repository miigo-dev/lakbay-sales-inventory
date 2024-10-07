
import '../css/damage.css';
import { useState } from 'react';

const Reports = () => {


    const [activeTab, setActiveTab] = useState('Lakbay Kape');
    const [lakbay_Kape, setProductsKape] = useState([]);
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

    const openModal = (lakbayKape = null) => {
        if (lakbayKape) {
            setModalData(lakbayKape);
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
            setProductsKape((prevProducts) =>
                prevProducts.map((lakbayKape) =>
                    lakbayKape.id === modalData.id ? modalData : lakbayKape
                )
            );
        } else {
            setProductsKape([...lakbay_Kape, modalData]);
        }
        setModalOpen(false);
    };

    const deleteItem = (id, type) => {
        const confirmDelete = window.confirm('Delete this item?');
        if (confirmDelete) {
            if (type === 'Lakbay Kape') {
                setProductsKape(lakbay_Kape.filter((lakbayKape) => lakbayKape.id !== id));
            } else {
                console.log('Invalid');
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

                <button className="addReport" onClick={() => openModal()} disabled={activeTab === 'Lakbay Kain'}>
                Add Report
                </button>

            </div>

            {activeTab === 'Lakbay Kain' ? (
                <div>
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
                    </table>
                </div>
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
                        {lakbay_Kape.map((lakbayKape, index) => (
                            <tr key={index}>
                                <td>{lakbayKape.id}</td>
                                <td>{lakbayKape.productName}</td>
                                <td>{lakbayKape.category}</td>
                                <td>{lakbayKape.unitofMeasure}</td>
                                <td>{lakbayKape.stockQuantity}</td>
                                <td>{lakbayKape.dateAdded}</td>
                                <td>{lakbayKape.reason}</td>
                                <td>{lakbayKape.action}</td>
                                <td>
                                    <button onClick={() => openModal(lakbayKape)}>Edit</button>
                                    <button onClick={() => deleteItem(lakbayKape.id, 'Lakbay Kape')}>Delete</button>
                                </td>
                            </tr>
                        ))}

                        {lakbay_Kain.map((lakbayKain, index) => (
                            <tr key={index}>
                                <td>{lakbayKain.id}</td>
                                <td>{lakbayKain.productName}</td>
                                <td>{lakbayKain.category}</td>
                                <td>{lakbayKain.unitofMeasure}</td>
                                <td>{lakbayKain.stockQuantity}</td>
                                <td>{lakbayKain.dateAdded}</td>
                                <td>{lakbayKain.reason}</td>
                                <td>{lakbayKain.action}</td>
                                <td>
                                    <button onClick={() => openModal(lakbayKape)}>Edit</button>
                                    <button onClick={() => deleteItem(lakbayKape.id, 'Lakbay Kape')}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
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
                                <option value="raw">raw</option>
                                <option value="frozen">frozen</option>
                                <option value="equipment">equipment</option>
                            </select>
                            <br />

                            <label>Stock Quantity:</label>
                            <input type="number" name="stockQuantity" value={modalData.stockQuantity} onChange={inputChange} required /><br />

                            <label>Unit of Measure:</label>
                            <select name="unitofMeasure" value={modalData.unitofMeasure} onChange={inputChange} required>
                                <option value="pieces">pieces</option>
                                <option value="bulk">bulk</option>
                                <option value="dozen">dozen</option>
                            </select>
                            <br />

                            <label>Date Added:</label>
                            <input type="date" name="dateAdded" value={modalData.dateAdded} onChange={inputChange} required /><br />

                            <label>Reason:</label>
                            <select name="reason" value={modalData.reason} onChange={inputChange} required>
                                <option value="expired">expired</option>
                                <option value="wrong item">wrong item</option>
                                <option value="missing">missing</option>
                                <option value="damage">damage</option>
                            </select>
                            <br />

                            <label>Action:</label>
                            <select name="action" value={modalData.action} onChange={inputChange} required>
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
