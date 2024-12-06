import '../css/sales.css';
import { useState, useEffect } from 'react';
import { LineChart } from '@mui/x-charts/LineChart';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';

const Sales = () => {
    const [timeFrame, setTimeFrame] = useState('daily'); // Matches API timeframe
    const [isLakbayKape, setIsLakbayKape] = useState(false); // Tracks toggle state for warehouse
    const [showAllData, setShowAllData] = useState(false);

    const [salesData, setSalesData] = useState({ labels: [], data: [] });
    const [salesTotals, setSalesTotals] = useState({});
    const [topSalesItems, setTopSalesItems] = useState([]);
    const [bestSellers, setBestSellers] = useState([]);
    const [loading, setLoading] = useState(false);

    const warehouseId = isLakbayKape ? 2 : 1; // Determine warehouse based on toggle state

    const toggleView = () => setIsLakbayKape((prev) => !prev);

    const fetchSalesData = async (period) => {
        try {
            const response = await axios.get('http://localhost:8080/api/sales', {
                params: { period, warehouseId },
            });

            if (!response.data || !response.data.labels || !response.data.data) {
                console.error('Invalid sales data response:', response.data);
                setSalesData({ labels: [], data: [] });
                return;
            }

            setSalesData({
                labels: response.data.labels,
                data: response.data.data,
            });

            const totalSales = response.data.data.reduce((sum, value) => sum + value, 0);
            setSalesTotals((prev) => ({ ...prev, [period]: totalSales }));
        } catch (error) {
            console.error('Error fetching sales data:', error);
            setSalesData({ labels: [], data: [] });
        }
    };

    const fetchTopSalesItems = async (period) => {
        try {
            const response = await axios.get('http://localhost:8080/api/top-sales', {
                params: { period, warehouseId },
            });
            setTopSalesItems(response.data || []);
        } catch (error) {
            console.error('Error fetching top sales items:', error);
            setTopSalesItems([]);
        }
    };

    const fetchBestSellers = async (period) => {
        try {
            const response = await axios.get('http://localhost:8080/api/top-sales', {
                params: { period, warehouseId },
            });
            setBestSellers(response.data || []);
        } catch (error) {
            console.error('Error fetching best sellers:', error);
            setBestSellers([]);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            await Promise.all([
                fetchSalesData(timeFrame),
                fetchTopSalesItems(timeFrame),
                fetchBestSellers(timeFrame),
            ]);
            setLoading(false);
        };

        fetchData();
    }, [timeFrame, warehouseId]);

    const salesGridData = [
        { id: 1, period: 'daily', amount: salesTotals.daily || 0 },
        { id: 2, period: 'weekly', amount: salesTotals.weekly || 0 },
        { id: 3, period: 'monthly', amount: salesTotals.monthly || 0 },
        { id: 4, period: 'yearly', amount: salesTotals.yearly || 0 },
    ];

    const displayedSalesGridData = showAllData
        ? salesGridData
        : salesGridData.filter((item) => item.period === timeFrame);

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

                    <div className="timeframe-options">
                        {['daily', 'weekly', 'monthly', 'yearly'].map((frame) => (
                            <button
                                key={frame}
                                onClick={() => setTimeFrame(frame)}
                                className={frame.toLowerCase()}
                            >
                                {`${frame.charAt(0).toUpperCase() + frame.slice(1)} - ₱${
                                    salesTotals[frame] || 0
                                }`}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="line-graph-container">
                    <h2>{timeFrame.charAt(0).toUpperCase() + timeFrame.slice(1)} Sales</h2>
                    <div className="line-graph">
                        {loading ? (
                            <p>Loading chart...</p>
                        ) : salesData.labels?.length > 0 && salesData.data?.length > 0 ? (
                            <LineChart
                                data={salesData}
                                xField="labels"
                                yField="data"
                                series={[{ name: 'Sales', data: salesData.data }]}
                                height={400}
                            />
                        ) : (
                            <p>No sales data available for this period.</p>
                        )}
                    </div>
                </div>
            </div>

            <div className="sales-table">
                <h2 className="Sales-Total">Sales Totals</h2>
                <button
                    onClick={() => setShowAllData((prev) => !prev)}
                    className="show-all"
                >
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
                <h2 className="Top">Lakbay's Best Seller</h2>
                <div className="top-sales-list">
                    {topSalesItems.length > 0 ? (
                        topSalesItems.map((item, index) => (
                            <div key={index} className={`T${index + 1}`}>
                                <img src={item.img} alt={`Top Item ${index + 1}`} />
                                <p className="txt">{item.name}</p>
                            </div>
                        ))
                    ) : (
                        <p>No top sales items available.</p>
                    )}
                </div>
            </div>

            <div className="best-seller-table">
                <h2>Top Best Sellers</h2>
                <DataGrid
                    rows={bestSellers.map((item, idx) => ({ id: idx + 1, ...item }))}
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