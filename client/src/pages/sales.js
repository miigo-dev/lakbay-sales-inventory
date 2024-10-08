import '../css/sales.css';

import T1 from '../assets/icons/t1.svg'
import T2 from '../assets/icons/t2.svg'
import T3 from '../assets/icons/t3.svg'
import T4 from '../assets/icons/t4.svg'
import T5 from '../assets/icons/t5.svg'
import T6 from '../assets/icons/t6.svg'
import T7 from '../assets/icons/t7.svg'
import T8 from '../assets/icons/t8.svg'


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
    <h2 className='Top'>Lakbay's Best Seller</h2>
    <div className="top-sales-list">
        <div className="T1">
            <img src={T1} alt="T1"/>
            <p>Sakura Latte 1</p>
        </div>
        <div className="T2">
            <img src={T2} alt="T2"/>
        <p>Matcha Latte</p>
        </div>
        <div className="T3">
            <img src={T3} alt="T3"/>
            <p>Brewed Coffee</p>
        </div>
        <div className="T4">
            <img src={T4} alt="T4"/>
            <p>Beef Salpicao</p>
        </div>
        <div className="T5">
            <img src={T5} alt="T5"/>
            <p>Beef Bulgogi</p>
        </div>
        <div className="T6">
            <img src={T6} alt="T6"/>
            <p>Chicken Teriyaki</p>
        </div>
        <div className="T7">
            <img src={T7} alt="T7"/>
            <p>Beef Padkrapao</p>
        </div>
        <div className="T8">
            <img src={T8} alt="T8"/>
            <p>Chicken Buttered Garlic</p>
        </div>
        {/* Add more items as needed */}
    </div>
</div>


        </div>
    );
};

export default Sales;
