import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { fetchProtectedInfo, onLogout } from '../api/auth';
import { unauthenticateUser } from '../redux/slices/authSlice';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { DataGrid } from '@mui/x-data-grid';
import '../css/dashboard.css';
import '../css/styles.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Dashboard = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [protectedData, setProtectedData] = useState(null);
  const [orders, setOrders] = useState([]); // Orders array for filtering
  const [selectedTimeFrameKain, setSelectedTimeFrameKain] = useState('today'); // Default time frame for Kain
  const [selectedTimeFrameKape, setSelectedTimeFrameKape] = useState('today'); // Default time frame for Kape
  const [allOrdersCountKain, setAllOrdersCountKain] = useState(0);
  const [pendingOrdersCountKain, setPendingOrdersCountKain] = useState(0);
  const [completedOrdersCountKain, setCompletedOrdersCountKain] = useState(0);
  const [allOrdersCountKape, setAllOrdersCountKape] = useState(0);
  const [pendingOrdersCountKape, setPendingOrdersCountKape] = useState(0);
  const [completedOrdersCountKape, setCompletedOrdersCountKape] = useState(0);
  const [timeRange, setTimeRange] = useState('weekly');
  const [selectedCategory, setSelectedCategory] = useState('kain');
  const [barChartData, setBarChartData] = useState({});
  const [pieChartData, setPieChartData] = useState({
    labels: ['Kain', 'Kape'],
    datasets: [{ data: [300, 150], backgroundColor: ['#C2A790', '#7B6B5D'], borderWidth: 1 }]
  });
  const [pieChartText, setPieChartText] = useState('');

  const orderData = [
    { id: 1, orderNumber: '001', category: 'kain', status: 'completed', date: '2024-11-08' },
    { id: 2, orderNumber: '002', category: 'kain', status: 'pending', date: '2024-11-07' },
    { id: 3, orderNumber: '003', category: 'kain', status: 'completed', date: '2024-11-06' },
    { id: 4, orderNumber: '004', category: 'kape', status: 'pending', date: '2024-11-08' },
    { id: 5, orderNumber: '005', category: 'kape', status: 'completed', date: '2024-11-08' },
    { id: 6, orderNumber: '006', category: 'kape', status: 'completed', date: '2024-11-05' },
    { id: 7, orderNumber: '007', category: 'kape', status: 'pending', date: '2024-11-09' },
  ];

  const salesData = {
    kain: {
      daily: [100, 200],
      weekly: [300, 500],
      monthly: [1200, 1500],
      yearly: [5000, 7000]
    },
    kape: {
      daily: [80, 150],
      weekly: [250, 400],
      monthly: [1000, 1200],
      yearly: [4000, 6000]
    }
  };

  const getOrdersForTimeFrame = (timeFrame, category) => {
    const now = new Date();
    return orderData.filter(order => {
      const orderDate = new Date(order.date);
      if (order.category !== category) return false;

      switch (timeFrame) {
        case 'today':
          return orderDate.toDateString() === now.toDateString();
        case 'weekly':
          const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
          return orderDate >= weekStart;
        case 'monthly':
          return orderDate.getMonth() === now.getMonth() && orderDate.getFullYear() === now.getFullYear();
        case 'yearly':
          return orderDate.getFullYear() === now.getFullYear();
        default:
          return false;
      }
    });
  };

  useEffect(() => {
    const updateOrderCounts = (category) => {
      const ordersForCategory = getOrdersForTimeFrame(selectedTimeFrameKain, category);

      const allOrders = ordersForCategory.length;
      const pendingOrders = ordersForCategory.filter(order => order.status === 'pending').length;
      const completedOrders = ordersForCategory.filter(order => order.status === 'completed').length;

      if (category === 'kain') {
        setAllOrdersCountKain(allOrders);
        setPendingOrdersCountKain(pendingOrders);
        setCompletedOrdersCountKain(completedOrders);
      } else {
        setAllOrdersCountKape(allOrders);
        setPendingOrdersCountKape(pendingOrders);
        setCompletedOrdersCountKape(completedOrders);
      }
    };

    updateOrderCounts('kain');
    updateOrderCounts('kape');
  }, [selectedTimeFrameKain, selectedTimeFrameKape]);

  const updateCharts = (range, category) => {
    const selectedSales = salesData[category][range];
    setPieChartData({
      labels: ['Kain', 'Kape'],
      datasets: [{ data: selectedSales, backgroundColor: ['#C2A790', '#7B6B5D'], borderWidth: 1 }]
    });
    setPieChartText(`Kape: ${selectedSales[1]} php  Kain: ${selectedSales[0]} php`);
  
    const barData = {
      kain: {
        daily: Array.from({ length: 24 }, (_, index) => Math.floor(Math.random() * 100)),
        weekly: [12, 19, 3, 5, 2, 8, 15],
        monthly: [30, 50, 40, 60],
        yearly: [150, 200, 180]
      },
      kape: {
        daily: Array.from({ length: 24 }, (_, index) => Math.floor(Math.random() * 80)),
        weekly: [10, 14, 8, 5, 2, 3, 10],
        monthly: [100, 120, 80, 150],
        yearly: [500, 600, 700]
      }
    };
  
    const currentData = barData[category][range];
    let labels = [];
    switch (range) {
      case 'daily':
        labels = Array.from({ length: 24 }, (_, index) => `${index + 1}h`);
        break;
      case 'weekly':
        labels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        break;
      case 'monthly':
        labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
        break;
      case 'yearly':
        labels = ['Q1', 'Q2', 'Q3'];
        break;
      default:
        labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];
    }
  
    // New color palette provided by the user
    const colorPalette = [
      '#F8AE54', '#F5921B', '#CA6C0F', '#9E4A06', '#732E00'
    ];
  
    // Generate a color for each bar based on the palette, cycling through if necessary
    const barChartColors = currentData.map((_, index) => {
      return colorPalette[index % colorPalette.length]; // Use modulo to cycle through the colors
    });
  
    setBarChartData({
      labels: labels,
      datasets: [{
        label: 'Sales',
        data: currentData,
        backgroundColor: barChartColors, // Apply distributed colors from the new palette
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
        borderRadius: 10,
      }],
      options: {
        responsive: true,
        scales: {
          y: {
            grid: { display: false },
          },
          x: {
            grid: { display: false },
          }
        },
      }
    });
  };
  
  
  

  const protectedInfo = async () => {
    try {
      const data = await fetchProtectedInfo();
      setProtectedData(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching protected info:', error);
    }
  };

  const logout = async () => {
    try {
      await onLogout();
      dispatch(unauthenticateUser());
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  useEffect(() => {
    protectedInfo();
    updateCharts(timeRange, selectedCategory);
  }, [timeRange, selectedCategory]);

  return loading ? (
<div>lodidbnas</div>
   ) : (

    <div>
    <div className='order-summaries'>
      <div className='order-kain-sum'>
        <div className="summary-order-kain">
          <div className="time-frame-dropdown">
            <label htmlFor="timeFrameKain">Select Time Frame for Kain: </label>
            <select
              id="timeFrameKain"
              value={selectedTimeFrameKain}
              onChange={(e) => setSelectedTimeFrameKain(e.target.value)}
            >
              <option value="today">Today</option>
              <option value="weekly">This Week</option>
              <option value="monthly">This Month</option>
              <option value="yearly">This Year</option>
            </select>
          </div>

          <div className="order-summary-container">
            <div className="order-summary">
              <div className="order-summary-item">
                <h4>All Orders (Kain)</h4>
                <p>{allOrdersCountKain}</p>
              </div>
              <div className="order-summary-item">
                <h4>Pending Orders (Kain)</h4>
                <p>{pendingOrdersCountKain}</p>
              </div>
              <div className="order-summary-item">
                <h4>Completed Orders (Kain)</h4>
                <p>{completedOrdersCountKain}</p>
              </div>
            </div>
          </div>
        </div>
        
<div className="bar-graph-container">
<div className="bar-graph">
<div className="toggle-container">
  <label className="switch">
    <input
      type="checkbox"
      checked={selectedCategory === 'kape'}
      onChange={(e) => setSelectedCategory(e.target.checked ? 'kape' : 'kain')}
    />
    <span className="slider"></span>
  </label>
  <span>{selectedCategory === 'kain' ? 'Lakbay Kain' : 'Lakbay Kape'}</span>
</div>

<div className="time-range-selector">
  <label htmlFor="timeRange">Select Time Range:</label>
  <select
    className="time-range-selector"
    id="timeRange"
    value={timeRange}
    onChange={(e) => setTimeRange(e.target.value)}
  >
    <option value="daily">Daily</option>
    <option value="weekly">Weekly</option>
    <option value="monthly">Monthly</option>
    <option value="yearly">Yearly</option>
  </select>
</div>
<h3>{`${selectedCategory === 'kain' ? 'Lakbay Kain' : 'Lakbay Kape'} Sales Data (${timeRange.charAt(0).toUpperCase() + timeRange.slice(1)})`}</h3>
<Bar data={barChartData} options={barChartData.options} />

    </div>
      </div>
      </div>

<div className="order-kape-sum">
  <div className="summary-order-kape">
    {/* Time Frame Dropdown for Kape */}
    <div className="time-frame-dropdown">
      <label htmlFor="timeFrameKape">Select Time Frame for Kape: </label>
      <select
        id="timeFrameKape"
        value={selectedTimeFrameKape}
        onChange={(e) => setSelectedTimeFrameKape(e.target.value)}
      >
        <option value="today">Today</option>
        <option value="weekly">This Week</option>
        <option value="monthly">This Month</option>
        <option value="yearly">This Year</option>
      </select>
    </div>

    {/* Order Summary for Kape */}
    <div className="order-summary-container">
      <div className="order-summary">
        <div className="order-summary-item">
          <h4>All Orders (Kape)</h4>
          <p>{allOrdersCountKape}</p>
        </div>
        <div className="order-summary-item">
          <h4>Pending Orders (Kape)</h4>
          <p>{pendingOrdersCountKape}</p>
        </div>
        <div className="order-summary-item">
          <h4>Completed Orders (Kape)</h4>
          <p>{completedOrdersCountKape}</p>
        </div>
      </div>

      {/* Pie chart and Transaction Table (Side by Side) */}
      <div className="pie-transaction-container">
        {/* Pie Chart */}
        <div className="pie-chart-container">
          <h3>Lakbay's Sales</h3>
          <Pie data={pieChartData} options={{ responsive: true }} />
          <p className="pie-txtData">{pieChartText}</p>
        </div>

        {/* Recent Transactions Table */}
  
          <h3 className="recent-trans-text">Recent Transactions 
          <DataGrid className='transaction-container'
            rows={orders}
            columns={[
              { field: 'date', headerName: 'Date', width: 150 },
              { field: 'orderNumber', headerName: 'Order No.', width: 150 },
              { field: 'amount', headerName: 'Amount', width: 150 }
            ]}
            autoHeight
            pageSize={7}
            disableSelectionOnClick
            checkboxSelection={false}
          />
          </h3>
   
      </div>
    </div>
  </div>
</div>
</div>
</div>

  );
};

export default Dashboard;
