import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable'; 
import { writeFileXLSX, utils } from 'xlsx';  
import '../css/damage.css';
import '../css/sales.css';
import Export from '../assets/icons/export.svg';
import Download from '../assets/icons/download.svg';

const Reports = () => {
    const [activeTab, setActiveTab] = useState('Transaction');
    const [completedOrders, setCompletedOrders] = useState([]);
    const [inventoryData, setInventoryData] = useState([]);
    const [supplierData, setSupplierData] = useState([]);
    const [salesData, setSalesData] = useState({ labels: [], data: [] });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [salesTotals, setSalesTotals] = useState({});
    const [selectedSection, setSelectedSection] = useState('lakbayKain');
    const [selectedType, setSelectedType] = useState('products');
    const [timeFrame, setTimeFrame] = useState('daily');
    const [showAllData, setShowAllData] = useState(false);
    const [isLakbayKape, setIsLakbayKape] = useState(false);

    const warehouseId = isLakbayKape ? 2 : 1;

    const toggleView = () => setIsLakbayKape((prev) => !prev);

    const fetchTransactionData = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:8080/api/transaction');
            const sortedOrders = response.data.sort((a, b) => b.order_id - a.order_id);
            setCompletedOrders(sortedOrders);
            setLoading(false);
        } catch (err) {
            setError('Failed to load transaction data');
            setLoading(false);
        }
    };

    const fetchInventoryData = async () => {
        try {
            setLoading(true);
            const warehouseId = selectedSection === 'lakbayKape' ? 2 : 1;
            const url = `http://localhost:8080/api/${selectedType}/warehouses/${warehouseId}`;
            const response = await axios.get(url);
            setInventoryData(
                response.data.map((item) => ({
                    ...item,
                    id: selectedType === 'products' ? item.product_id : item.ingredient_id,
                }))
            );
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch inventory data');
            setLoading(false);
        }
    };

    const fetchSupplierData = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:8080/api/suppliers');
            setSupplierData(response.data.map((supplier) => ({ ...supplier, id: supplier.supplier_id })));
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch supplier data');
            setLoading(false);
        }
    };

    const fetchSalesData = async (period) => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:8080/api/sales', {
                params: { period, warehouseId },
            });

            setSalesData({
                labels: response.data.labels || [],
                data: response.data.data || [],
            });

            const totalSales = response.data.data.reduce((sum, value) => sum + value, 0);
            setSalesTotals((prev) => ({ ...prev, [period]: totalSales }));
            setLoading(false);
        } catch (error) {
            setError('Error fetching sales data');
            setSalesData({ labels: [], data: [] });
            setLoading(false);
        }
    };

    useEffect(() => {
        setError(null);
        setLoading(true);
        if (activeTab === 'Inventory') fetchInventoryData();
        else if (activeTab === 'Transaction') fetchTransactionData();
        else if (activeTab === 'Supplier') fetchSupplierData();
        else if (activeTab === 'Sales') fetchSalesData(timeFrame);
        setLoading(false);
    }, [activeTab, selectedSection, selectedType, timeFrame, warehouseId]);

    const exportToExcel = () => {
        let exportData = [];

        switch (activeTab) {
            case 'Transaction':
                exportData = completedOrders.map((order) => ({
                    'Order No.': order.order_id,
                    'Date': new Date(order.order_date).toLocaleDateString('en-CA'),
                    'Status': order.order_status,
                }));
                break;
            case 'Inventory':
                exportData = inventoryData.map((item) => ({
                    'ID': item.product_id,
                    'Name': item.product_name,
                    'Quantity': item.product_quantity,
                    'Price': item.product_price,
                    'Reorder Trigger': item.reorder_level,
                }));
                break;
            case 'Supplier':
                exportData = supplierData.map((supplier) => ({
                    'ID': supplier.supplier_id,
                    'Supplier Name': supplier.supplier_name,
                    'Email': supplier.email,
                    'Phone Number': supplier.phone_number,
                    'Address': supplier.address,
                }));
                break;
            case 'Sales':
                exportData = [
                    { 'Period': 'Daily', 'Sales Amount': salesTotals.daily || 0 },
                    { 'Period': 'Weekly', 'Sales Amount': salesTotals.weekly || 0 },
                    { 'Period': 'Monthly', 'Sales Amount': salesTotals.monthly || 0 },
                    { 'Period': 'Yearly', 'Sales Amount': salesTotals.yearly || 0 },
                ];
                break;
            default:
                return;
        }
        const ws = utils.json_to_sheet(exportData);
        const wb = utils.book_new();
        utils.book_append_sheet(wb, ws, 'Report');
        writeFileXLSX(wb, 'reports.xlsx');
    };

    const generatePDF = () => {
        const doc = new jsPDF();

        if (activeTab === 'Transaction') {
            const columns = ['ID', 'Date', 'Order No.', 'Status'];
            const rows = completedOrders.map((order, index) => [
                index + 1, 
                new Date(order.order_date).toLocaleDateString('en-CA'),
                order.order_id,
                order.order_status,
            ]);

            doc.autoTable({
                head: [columns],
                body: rows,
                startY: 20, 
                theme: 'striped',
                columnStyles: { id: { cellWidth: 'auto' } },
            });
            doc.save('Transactionreports.pdf');
        }

        if (activeTab === 'Inventory') {
            const title = `Inventory List: ${selectedSection} - ${selectedType === 'products' ? 'Products' : 'Ingredients'}`;
            const columns = ['ID', 'Name', 'Quantity', 'Price', 'Reorder Level'];
            const rows = inventoryData.map((item, index) => [
                item.product_id,
                item.product_name,
                item.product_quantity,
                item.product_price,
                item.reorder_level,
            ]);

            doc.text(title, 14, 15);
            doc.autoTable({
                head: [columns],
                body: rows,
                startY: 30,
                theme: 'striped',
                columnStyles: { id: { cellWidth: 'auto' } },
            });
            doc.save('Inventoryreports.pdf');
        }

        if (activeTab === 'Supplier') {
            const columns = ['ID', 'Supplier Name', 'Email', 'Phone Number', 'Address'];
            const rows = supplierData.map((supplier, index) => [
                supplier.supplier_id, 
                supplier.supplier_name,
                supplier.email,
                supplier.phone_number,
                supplier.address,
            ]);

            doc.autoTable({
                head: [columns],
                body: rows,
                startY: 20,
                theme: 'striped',
                columnStyles: { id: { cellWidth: 'auto' } },
            });
            doc.save('Supplierreports.pdf');
        }

        if (activeTab === 'Sales') {
            const title = `Sales Data: ${isLakbayKape ? 'Lakbay Kape' : 'Lakbay Kain'}`;
            const salesGridData = [
                { id: 1, period: 'daily', amount: salesTotals.daily || 0 },
                { id: 2, period: 'weekly', amount: salesTotals.weekly || 0 },
                { id: 3, period: 'monthly', amount: salesTotals.monthly || 0 },
                { id: 4, period: 'yearly', amount: salesTotals.yearly || 0 },
            ];

            const columns = ['ID', 'Period', 'Sales Amount'];
            const rows = salesGridData.map((item) => [
                item.id, 
                item.period,
                item.amount,
            ]);

            doc.text(title, 14, 15);
            doc.autoTable({
                head: [columns],
                body: rows,
                startY: 30,
                theme: 'striped',
                columnStyles: { id: { cellWidth: 'auto' } },
            });
            doc.save('Salesreport.pdf');
        }

       
    };

    const renderActiveTab = () => {
        switch (activeTab) {
            case 'Transaction':
                return (
                    <div className="transaction-container">
                        <h3>Transaction History</h3>
                        {loading ? (
                            <p>Loading...</p>
                        ) : error ? (
                            <p>{error}</p>
                        ) : (
                            <DataGrid
                                rows={completedOrders.map((order) => ({
                                    ...order,
                                    id: order.order_id,
                                    order_date: new Date(order.order_date).toLocaleDateString('en-CA'),
                                }))}
                                columns={[
                                    { field: 'order_date', headerName: 'Date', width: 150 },
                                    { field: 'order_id', headerName: 'Order No.', width: 100 },
                                    { field: 'order_status', headerName: 'Status', width: 150 },
                                ]}
                                getRowId={(row) => row.order_id}
                                pageSize={10}
                                rowsPerPageOptions={[10, 20, 50]}
                                autoHeight
                                disableSelectionOnClick
                            />
                        )}
                    </div>
                );
            case 'Inventory':
                return (
                    <div className="inventory-list">
                        <h3>Inventory List</h3>
                        <div className="filter-container">
                            <select
                                className="inventory_section_dropdown"
                                value={selectedSection}
                                onChange={(e) => setSelectedSection(e.target.value)}
                            >
                                <option value="lakbayKain">Lakbay Kain</option>
                                <option value="lakbayKape">Lakbay Kape</option>
                            </select>
                            <select
                                className="inventory_section_dropdown"
                                value={selectedType}
                                onChange={(e) => setSelectedType(e.target.value)}
                            >
                                <option value="products">Products</option>
                                <option value="ingredients">Ingredients</option>
                            </select>
                        </div>
                        {loading ? (
                            <p>Loading...</p>
                        ) : error ? (
                            <p>{error}</p>
                        ) : (
                            <DataGrid
                                rows={inventoryData}
                                columns={[
                                    { field: 'product_id', headerName: 'ID', width: 120 },
                                    { field: 'product_name', headerName: 'Name', width: 200 },
                                    { field: 'product_quantity', headerName: 'Quantity', width: 120 },
                                    { field: 'product_price', headerName: 'Price', width: 120 },
                                    { field: 'reorder_level', headerName: 'Reorder Trigger', width: 150 },
                                ]}
                                pageSize={10}
                                rowsPerPageOptions={[10, 20, 50]}
                                autoHeight
                                disableSelectionOnClick
                            />
                        )}
                    </div>
                );
            case 'Supplier':
                return (
                    <div className="supplier-list">
                        <h3>Supplier List</h3>
                        {loading ? (
                            <p>Loading...</p>
                        ) : error ? (
                            <p>{error}</p>
                        ) : (
                            <DataGrid
                                rows={supplierData}
                                columns={[
                                    { field: 'supplier_id', headerName: 'ID', width: 100 },
                                    { field: 'supplier_name', headerName: 'Supplier Name', width: 200 },
                                    { field: 'email', headerName: 'Email', width: 200 },
                                    { field: 'phone_number', headerName: 'Phone Number', width: 150 },
                                    { field: 'address', headerName: 'Address', width: 250 },
                                ]}
                                getRowId={(row) => row.supplier_id}
                                pageSize={10}
                                rowsPerPageOptions={[10, 20, 50]}
                                autoHeight
                                disableSelectionOnClick
                            />
                        )}
                    </div>
                );
            case 'Sales':
                const salesGridData = [
                    { id: 1, period: 'daily', amount: salesTotals.daily || 0 },
                    { id: 2, period: 'weekly', amount: salesTotals.weekly || 0 },
                    { id: 3, period: 'monthly', amount: salesTotals.monthly || 0 },
                    { id: 4, period: 'yearly', amount: salesTotals.yearly || 0 },
                ];

                const displayedSalesGridData = showAllData
                    ? salesGridData
                    : salesGridData.filter((item) => item.period === timeFrame);

                return (
                    <div className="sales-table">
                        <div className="toggle_header">
                            <input
                                type="checkbox"
                                className="input_type"
                                id="toggle"
                                onChange={toggleView}
                            />
                            <div className="display">
                                <label className="label_type" htmlFor="toggle">
                                    <div className="circle">
                                        <span className="material-symbols-outlined food">restaurant</span>
                                        <span className="material-symbols-outlined coffee">local_cafe</span>
                                    </div>
                                </label>
                                <span className="categ-txt">
                                    {isLakbayKape ? 'Lakbay Kape' : 'Lakbay Kain'}
                                </span>
                            </div>
                        </div>
                        <h3>Sales Data</h3>
                        <button
                            onClick={() => setShowAllData((prev) => !prev)}
                            className="show-all"
                        >
                            {showAllData ? 'Show Current Period Data' : 'Show All Data'}
                        </button>
                        <DataGrid
                            rows={displayedSalesGridData}
                            columns={[
                                { field: 'id', headerName: 'ID', width: 90 },
                                { field: 'period', headerName: 'Period', width: 150 },
                                { field: 'amount', headerName: 'Sales Amount (₱)', width: 180 },
                            ]}
                            pageSize={4}
                            rowsPerPageOptions={[4]}
                            autoHeight
                            disableSelectionOnClick
                        />
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="reports-container">
            <h1>Generate Report</h1>
            <div className="header-controls">
                <select
                    className="dropdown-btn"
                    value={activeTab}
                    onChange={(e) => setActiveTab(e.target.value)}
                >
                    <option value="Transaction">Transaction</option>
                    <option value="Inventory">Inventory</option>
                    <option value="Supplier">Supplier</option>
                    <option value="Sales">Sales</option>
                </select>
                <div className="container_button">
                    <button className="action-btn" onClick={generatePDF}>
                        <img src={Export} alt="Export Icon" style={{ width: '1.5em', height: '1.5em' }} />
                    </button>
                    <button className="action-btn" onClick={exportToExcel}>
                        <img src={Download} alt="Dwonload Icon" style={{ width: '1.5em', height: '1.5em' }} />
                    </button>
                </div>
            </div>
            <div className="tab-content">{renderActiveTab()}</div>
        </div>
    );
};

export default Reports;
