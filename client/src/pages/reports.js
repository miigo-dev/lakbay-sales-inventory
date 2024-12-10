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
    const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
    const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
    const [staticOrders, setStaticOrders] = useState([
        {
            order_date: '2024-12-01',
            order_id: 101,
            order_items: ['Burger', 'Fries', 'Coke'],
            status: 'Completed',
        },
        {
            order_date: '2024-12-02',
            order_id: 102,
            order_items: ['Pizza', 'Salad'],
            status: 'Completed',
        },
        {
            order_date: '2024-12-03',
            order_id: 103,
            order_items: ['Pasta', 'Garlic Bread', 'Wine'],
            status: 'Completed',
        },
    ]);
    const warehouseId = isLakbayKape ? 2 : 1;

    const toggleView = () => setIsLakbayKape((prev) => !prev);

    const fetchTransactionData = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:8080/api/transaction');
            console.log('API Response:', response.data); // Debug log
    
            const formattedOrders = response.data.map(order => ({
                ...order,
                id: order.order_id, // Required for DataGrid
                order_date: new Date(order.order_date).toLocaleDateString('en-CA'),
                order_items: order.order_items.map(item => ({
                    ...item,
                    id: item.product_id, // Required for DataGrid
                    order_total: `₱${item.order_total}`,
                })),
            }));
    
            setCompletedOrders(formattedOrders);
            setLoading(false);
        } catch (err) {
            console.error('Failed to load transaction data:', err);
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

    const filterDataByDateRange = (data) => {
        const start = new Date(startDate);
        const end = new Date(endDate);
        return data.filter((item) => {
            // Ensure `item.order_date` is valid and properly formatted
            const itemDate = new Date(item.order_date);
            if (isNaN(itemDate)) return false; // Skip invalid dates
            return itemDate >= start && itemDate <= end;
        });
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
        try {
            let exportData; 
            switch (activeTab) {
                case 'Transaction': {
                    const filteredData = filterDataByDateRange(completedOrders);
                    if (!filteredData.length) throw new Error('No data available for export.');
                
                    exportData = filteredData.flatMap((order) =>
                        order.order_items.map((item) => ({
                            'Order No.': order.order_id || 'N/A',
                            'Date': new Date(order.order_date).toLocaleDateString('en-CA'),
                            'Status': order.order_status || 'N/A',
                            'Product Name': item.product_name || 'N/A',
                            'Quantity': item.quantity || 0,
                            'Total': `₱${item.order_total || 0}`,
                        }))
                    );
                    break;
                }
                
                case 'Inventory': {
                    exportData = inventoryData.map((item) => ({
                        'ID': item.product_id || 'N/A',
                        'Name': item.product_name || 'N/A',
                        'Quantity': item.product_quantity || 0,
                        'Price': item.product_price || 0,
                        'Reorder Trigger': item.reorder_level || 0,
                    }));
                    break;
                }
                case 'Supplier': {
                    exportData = supplierData.map((supplier) => ({
                        'ID': supplier.supplier_id || 'N/A',
                        'Supplier Name': supplier.supplier_name || 'N/A',
                        'Email': supplier.email || 'N/A',
                        'Phone Number': supplier.phone_number || 'N/A',
                        'Address': supplier.address || 'N/A',
                    }));
                    break;
                }
                case 'Sales': {
                    exportData = salesData.labels.map((label, index) => ({
                        'Label': label || 'N/A',
                        'Amount': salesData.data[index] || 0,
                    }));
                    break;
                }
                case 'Orders': {
                    exportData = staticOrders.map((order) => ({
                        'Order ID': order.order_id || 'N/A',
                        'Items': order.order_items.join(', ') || 'N/A',
                        'Order Date': order.order_date || 'N/A',
                        'Status': order.status || 'N/A',
                    }));
                    break;
                }
                default:
                    throw new Error('Invalid active tab for export.');
            }
            const ws = utils.json_to_sheet(exportData);
            const wb = utils.book_new();
            utils.book_append_sheet(wb, ws, `${activeTab} Report`);
            writeFileXLSX(wb, `${activeTab}Report.xlsx`);
        } catch (error) {
            alert(error.message);
        }
    };

    const generatePDF = () => {
        const doc = new jsPDF();

    if (activeTab === 'Transaction') {
        const filteredData = filterDataByDateRange(completedOrders);

        if (!filteredData.length) {
            alert('No data available for the selected date range.');
            return;
        }

        // Define columns for the PDF
        const columns = ['ID', 'Date', 'Order No.', 'Status', 'Items', 'Total'];

        // Map data rows for the table
        const rows = filteredData.map((order, index) => [
            index + 1, // Sequential ID
            new Date(order.order_date).toLocaleDateString('en-CA'), // Format order date
            order.order_id || 'N/A', // Order ID
            order.order_status || 'N/A', // Order status
            order.order_items
                .map((item) => item.product_name || 'Unnamed Product') // Extract product names
                .join(', '), // Combine names into a single string
            `₱${order.order_items.reduce((sum, item) => sum + parseFloat(item.order_total.replace('₱', '') || 0), 0).toFixed(2)}`, // Parse and calculate order total
        ]);

        // Calculate the grand total
        const grandTotal = filteredData.reduce(
            (sum, order) =>
                sum +
                order.order_items.reduce((orderSum, item) => orderSum + parseFloat(item.order_total.replace('₱', '') || 0), 0),
            0
        );

        // Add title and table to the PDF
        doc.text('Transaction Report', 14, 15);
        doc.autoTable({
            head: [columns],
            body: rows,
            foot: [['', '', '', '', 'Grand Total:', `₱${grandTotal.toFixed(2)}`]], // Add grand total row
            startY: 30,
            theme: 'striped',
        });

        // Save the PDF with a descriptive name
        doc.save('TransactionReport.pdf');
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
        if (activeTab === 'Orders') {
            const title = 'Orders Report';
            doc.text(title, 14, 15);
    
            const columns = ['Order ID', 'Item', 'Order Date', 'Status'];
            const rows = staticOrders.map((order) => [
                order.order_id,
                order.order_items.join(', '),
                order.order_date,
                order.status,
                 
            ]);
    
            doc.autoTable({
                head: [columns],
                body: rows,
                startY: 30,
                theme: 'striped',
                columnStyles: { id: { cellWidth: 'auto' } },
            });
    
            doc.save('Ordersreports.pdf');
        }
       
    };

    const renderActiveTab = () => {
        switch (activeTab) {
            case 'Transaction':
                return (
                    <div className="transaction-container">
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
                    {loading ? (
                        <p>Loading...</p>
                    ) : error ? (
                        <p>{error}</p>
                    ) : (
                        <DataGrid
                            rows={completedOrders.flatMap((order) =>
                                order.order_items.map((item, index) => ({
                                    id: `${order.order_id}-${index}`, // Unique ID for each item
                                    order_id: order.order_id,
                                    order_date: order.order_date,
                                    order_status: order.order_status,
                                    product_name: item.product_name,
                                    quantity: item.quantity,
                                    order_total: item.order_total,
                                }))
                            )}
                            columns={[
                                { field: 'order_date', headerName: 'Date', width: 150 },
                                { field: 'order_id', headerName: 'Order No.', width: 100 },
                                { field: 'order_status', headerName: 'Status', width: 150 },
                                { field: 'product_name', headerName: 'Product Name', width: 200 },
                                { field: 'quantity', headerName: 'Quantity', width: 100 },
                                { field: 'order_total', headerName: 'Total', width: 120 },
                            ]}
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
                case 'Orders':
                    return (
                        <div className="static-orders-container">
                            <h3>Static Orders</h3>
                            {loading ? (
                                <p>Loading...</p>
                            ) : error ? (
                                <p>{error}</p>
                            ) : (
                                <DataGrid
                                    rows={staticOrders.map((order, index) => ({
                                        id: index,
                                        order_date: order.order_date,
                                        order_id: order.order_id,
                                        status: order.status,
                                    }))}
                                    columns={[
                                        { field: 'order_date', headerName: 'Order Date', width: 150 },
                                        { field: 'order_id', headerName: 'Order ID', width: 100 },
                                        { field: 'status', headerName: 'Status', width: 150 },
                                    ]}
                                    pageSize={5}
                                    rowsPerPageOptions={[5, 10]}
                                    autoHeight
                                    disableSelectionOnClick
                                />
                            )}
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
                    <option value="Orders">Orders (Static)</option>
                </select>
                <div className="container_button">
                    <button className="action-btn" onClick={generatePDF}>
                        <img src={Export} alt="Export Icon" style={{ width: '1.5em', height: '1.5em' }} />
                    </button>
                    <button className="action-btn" onClick={exportToExcel}>
                        <img src={Download} alt="Download Icon" style={{ width: '1.5em', height: '1.5em' }} />
                    </button>
                </div>
            </div>
            <div className="tab-content">{renderActiveTab()}</div>
        </div>
    );
};

export default Reports;
