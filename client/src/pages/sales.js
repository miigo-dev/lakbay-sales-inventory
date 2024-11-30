import '../css/sales.css';
import T1 from '../assets/icons/t1.svg';
import T2 from '../assets/icons/t2.svg';
import T3 from '../assets/icons/t3.svg';
import T4 from '../assets/icons/t4.svg';
import T5 from '../assets/icons/t5.svg';
import T6 from '../assets/icons/t6.svg';
import T7 from '../assets/icons/t7.svg';
import T8 from '../assets/icons/t8.svg';
import { useState, useEffect } from 'react';
import { LineChart } from '@mui/x-charts/LineChart';
import { DataGrid } from '@mui/x-data-grid';

const fetchSalesData = async (timeFrame, isKape) => {
    const periodMap = {
        'Today': 'daily',
        'Weekly': 'weekly',
        'Monthly': 'monthly',
        'Yearly': 'yearly',
    };

    const inventoryType = isKape ? '2' : '1';
    const response = await fetch(`http://localhost:8080/api/sales?period=${periodMap[timeFrame]}&type=${inventoryType}`);
    if (!response.ok) throw new Error('Failed to fetch sales data');
    return response.json(); 
};

const fetchTopSalesItems = async (timeFrame, isKape) => {
    const periodMap = {
        'Today': 'daily',
        'Weekly': 'weekly',
        'Monthly': 'monthly',
        'Yearly': 'yearly',
    };

    const inventoryType = isKape ? 'kape' : 'kain';
    const response = await fetch(`http://localhost:8080/api/sales?period=${periodMap[timeFrame]}&type=${inventoryType}`);
    if (!response.ok) throw new Error('Failed to fetch top sales items');
    const data = await response.json();

    if (Array.isArray(data)) {
        return data;
    } else {
        console.error('Fetched top sales data is not an array:', data);
        return [];
    }
};

const Sales = () => {
    const [timeFrame, setTimeFrame] = useState('Today');
    const [isLakbayKape, setIsLakbayKape] = useState(false);
    const [showAllData, setShowAllData] = useState(false);
    const [salesData, setSalesData] = useState({ labels: [], data: [] });
    const [salesTotals, setSalesTotals] = useState({ Today: 0, Weekly: 0, Monthly: 0, Yearly: 0 });
    const [bestSellers, setBestSellers] = useState([]);

    const toggleView = () => {
        setIsLakbayKape(prev => !prev);
    };

    const calculateTotalSales = (data) => data.reduce((total, value) => total + value, 0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetchSalesData(timeFrame, isLakbayKape);
                setSalesData(data);
                setSalesTotals(prev => ({
                    ...prev,
                    [timeFrame]: calculateTotalSales(data.data),
                }));
            } catch (error) {
                console.error('Error fetching sales data:', error);
            }
        };

        const fetchTopSales = async () => {
            try {
                const items = await fetchTopSalesItems(timeFrame, isLakbayKape);
                setBestSellers(items);
            } catch (error) {
                console.error('Error fetching top sales items:', error);
            }
        };

        fetchData();
        fetchTopSales();
    }, [timeFrame, isLakbayKape]);

    const salesGridData = [
        { id: 1, period: 'Today', amount: salesTotals.Today },
        { id: 2, period: 'Weekly', amount: salesTotals.Weekly },
        { id: 3, period: 'Monthly', amount: salesTotals.Monthly },
        { id: 4, period: 'Yearly', amount: salesTotals.Yearly },
    ];

    const displayedSalesGridData = showAllData ? salesGridData : salesGridData.filter(item => item.period === timeFrame);

    const columns = [
        { field: 'id', headerName: 'ID', width: 90 },
        { field: 'period', headerName: 'Period', width: 150 },
        { field: 'amount', headerName: 'Sales Amount (₱)', width: 180 },
    ];

    const bestSellerColumns = [
        { field: 'name', headerName: 'Product', width: 150 },
        { field: 'sales', headerName: 'Sales', width: 100 },
    ];

    return (
        <div className='damage_container'>
            <div className="content-wrapper">
                <div className="sales-timeframes">
                    <div className="toggle_header">   
                        <input type="checkbox" className='input_type' id="toggle" onChange={toggleView} />
                        <div className="display">
                            <label className='label_type' htmlFor="toggle">
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

                    <div className="timeframe-options">
                        {['Today', 'Weekly', 'Monthly', 'Yearly'].map((frame) => (
                            <button 
                                key={frame} 
                                onClick={() => setTimeFrame(frame)} 
                                className={frame.toLowerCase()}
                            >
                                {`${frame} - ₱${salesTotals[frame]}`}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="line-graph-container">
                    <h2>{timeFrame} Sales</h2>
                    <div className="line-graph">
                        <LineChart
                            data={salesData}
                            xField="labels"
                            yField="data"
                            series={[{ name: 'Sales', data: salesData.data, color: '#C2A790' }]}
                            height={400}
                        />
                    </div>
                </div>
            </div>

            <div className="sales-table">
                <h2 className='Sales-Total'>Sales Totals</h2>
                <button onClick={() => setShowAllData(prev => !prev)} className='show-all'>
                    {showAllData ? 'Show Current Period Data' : 'Show All Data'}
                </button>
                <DataGrid
                    rows={displayedSalesGridData}
                    columns={columns}
                    pageSize={4}
                    rowsPerPageOptions={[4]}
                    disableSelectionOnClick
                />
            </div>
                
            <div className="top-sales">
                <h2 className='Top'>Lakbay's Best Seller</h2>
                <div className="top-sales-list">
                </div>
            </div>

            <div className="best-seller-table">
                <h2>Top Best Sellers</h2>
                <DataGrid
                    rows={Array.isArray(bestSellers) ? bestSellers.map((item, idx) => ({ id: idx + 1, ...item })) : []}
                    columns={bestSellerColumns}
                    pageSize={3}
                    rowsPerPageOptions={[3, 5, 10]}
                    pagination
                    disableSelectionOnClick
                />
            </div>
        </div>
    );
};

export default Sales;
