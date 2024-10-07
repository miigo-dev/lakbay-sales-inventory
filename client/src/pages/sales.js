import '../css/sales.css';
import { useState } from 'react';
import { LineChart } from '@mui/x-charts/LineChart';

const Sales = () => {
    const [timeFrame, setTimeFrame] = useState('Today');

    const getSalesData = (frame) => {
        switch (frame) {
            case 'Today':
                return {
                    labels: ['9 AM', '10 AM', '11 AM', '12 PM', '1 PM'],
                    data: [12, 19, 3, 5, 2],
                };
            case 'Weekly':
                return {
                    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
                    data: [50, 100, 75, 125],
                };
            case 'Monthly':
                return {
                    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
                    data: [200, 300, 250, 400],
                };
            case 'Yearly':
                return {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                    data: [1200, 1500, 1300, 1600, 2000, 1800, 2200, 2400, 2600, 3000, 3200, 3500],
                };
            default:
                return { labels: [], data: [] };
        }
    };

    const calculateTotalSales = (data) => {
        return data.reduce((total, value) => total + value, 0);
    };

    const salesData = getSalesData(timeFrame);
    const totalSales = calculateTotalSales(salesData.data);

    // Pre-calculate totals for each time frame
    const totalSalesData = {
        Today: calculateTotalSales(getSalesData('Today').data),
        Weekly: calculateTotalSales(getSalesData('Weekly').data),
        Monthly: calculateTotalSales(getSalesData('Monthly').data),
        Yearly: calculateTotalSales(getSalesData('Yearly').data),
    };

    return (
        <div className='damage_container'>
            <div className="content-wrapper">
                <div className="sales-timeframes">

                    <h2 className='text'>Sales</h2>

                    <div className="timeframe-options">
                        {['Today', 'Weekly', 'Monthly', 'Yearly'].map((frame) => (
                            <button 
                                key={frame} 
                                onClick={() => setTimeFrame(frame)} 
                                className={frame.toLowerCase()} // Add class based on frame
                            >
                                {frame}- ₱{totalSalesData[frame]}
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

            <div className="top-sales">
                <h2>Top Sales</h2>
                <div className="top-sales-list">
                    <div className="top-sales-item">
                        <img src="path/to/image1.jpg" alt="Top Product 1" />
                        <p>Product 1</p>
                    </div>
                    <div className="top-sales-item">
                        <img src="path/to/image2.jpg" alt="Top Product 2" />
                        <p>Product 2</p>
                    </div>
                    <div className="top-sales-item">
                        <img src="path/to/image3.jpg" alt="Top Product 3" />
                        <p>Product 3</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sales;
