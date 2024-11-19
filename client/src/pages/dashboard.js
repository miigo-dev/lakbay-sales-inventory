import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { fetchProtectedInfo, onLogout } from '../api/auth';
import { unauthenticateUser } from '../redux/slices/authSlice';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { DataGrid } from '@mui/x-data-grid'; // Import DataGrid for the transaction table
import '../css/dashboard.css';
import '../css/styles.css'; // Make sure the styles are imported

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
  const [timeRange, setTimeRange] = useState('weekly');
  const [selectedCategory, setSelectedCategory] = useState('kain'); // Default category (kain)
  const [barChartData, setBarChartData] = useState({});
  const [pieChartData, setPieChartData] = useState({
    labels: ['Kain', 'Kape'],
    datasets: [
      {
        data: [300, 150], // Default values
        backgroundColor: ['rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)'],
        borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)'],
        borderWidth: 1,
      },
    ],
  });
  const [pieChartText, setPieChartText] = useState('');

  // Sample transaction data
  const completedOrders = [
    { id: 1, orderNumber: '001', date: '2024-11-08', amount: '$20' },
    { id: 2, orderNumber: '002', date: '2024-11-07', amount: '$40' },
    { id: 3, orderNumber: '003', date: '2024-11-06', amount: '$15' },
    { id: 4, orderNumber: '004', date: '2024-11-08', amount: '$30' },
    { id: 5, orderNumber: '005', date: '2024-11-08', amount: '$25' },
    { id: 6, orderNumber: '006', date: '2024-11-05', amount: '$50' },
    { id: 7, orderNumber: '007', date: '2024-11-09', amount: '$100' },
  ];

  // Sort and get the 7 most recent orders
  const sortedOrders = completedOrders.sort((a, b) => new Date(b.date) - new Date(a.date));
  const recentOrders = sortedOrders.slice(0, 7); // Get the top 7 most recent transactions

  const logout = async () => {
    try {
      await onLogout();
      dispatch(unauthenticateUser());
      localStorage.removeItem('isAuth');
    } catch (error) {
      console.error('Error logging out:', error.response || error.message);
    }
  };

  const protectedInfo = async () => {
    try {
      const { data } = await fetchProtectedInfo();
      setProtectedData(data.info);
      setLoading(false);
    } catch (error) {
      logout();
      console.error('Error fetching protected info:', error.response ? error.response.data : error.message);
    }
  };

  // Update Pie Chart Data and Text
  const updatePieChartData = (range, category) => {
    // Dynamic data for pie chart based on category and time range
    const salesData = {
      kain: {
        daily: [100, 200], // Example sales data for 'kain'
        weekly: [300, 500], 
        monthly: [1200, 1500], 
        yearly: [5000, 7000],
      },
      kape: {
        daily: [80, 150], // Example sales data for 'kape'
        weekly: [250, 400],
        monthly: [1000, 1200],
        yearly: [4000, 6000],
      },
    };

    const selectedSales = salesData[category][range];

    // Update pie chart data
    setPieChartData({
      labels: ['Kain', 'Kape'],
      datasets: [
        {
          data: selectedSales,
          backgroundColor: ['rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)'],
          borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)'],
          borderWidth: 1,
        },
      ],
    });

    // Update pie chart text
    setPieChartText(`
      Kain: ${selectedSales[0]} units
      
      Kape: ${selectedSales[1]} units
    `);
  };

  // Updated bar chart data function with rounded bars and no grid
  const updateBarChartData = (range, category) => {
    let chartData = {};

    const kainData = {
      weekly: [12, 19, 3, 5, 2, 8, 15],
      daily: [5, 7, 3, 4, 2, 6, 8, 7, 4, 3, 5, 9],
      monthly: [30, 50, 40, 60],
      yearly: [150, 200, 180, 250],
    };

    const kapeData = {
      weekly: [10, 14, 8, 11, 6, 7, 18],
      daily: [4, 6, 2, 7, 5, 9, 3, 4, 6, 2, 8, 10],
      monthly: [35, 45, 60, 70],
      yearly: [120, 190, 220, 240],
    };

    const data = category === 'kain' ? kainData : kapeData;

    switch (range) {
      case 'weekly':
        chartData = {
          labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7'],
          datasets: [
            {
              label: `${category === 'kain' ? 'Lakbay Kain' : 'Lakbay Kape'} - Weekly Sales`,
              data: data.weekly,
              backgroundColor: 'rgba(75, 192, 192, 0.6)', 
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
              borderRadius: 10, // Rounded corners for the bars
              barThickness: 30, // Optional: controls the thickness of the bars
            },
          ],
        };
        break;
      case 'daily':
        chartData = {
          labels: ['Hour 1', 'Hour 2', 'Hour 3', 'Hour 4', 'Hour 5', 'Hour 6', 'Hour 7', 'Hour 8', 'Hour 9', 'Hour 10', 'Hour 11', 'Hour 12'],
          datasets: [
            {
              label: `${category === 'kain' ? 'Lakbay Kain' : 'Lakbay Kape'} - Sales Today`,
              data: data.daily,
              backgroundColor: 'rgba(54, 162, 235, 0.6)',
              borderColor: 'rgba(54, 162, 235, 1)',
              borderWidth: 1,
              borderRadius: 10,
              barThickness: 30,
            },
          ],
        };
        break;
      case 'monthly':
        chartData = {
          labels: ['January', 'February', 'March', 'April'],
          datasets: [
            {
              label: `${category === 'kain' ? 'Lakbay Kain' : 'Lakbay Kape'} - Monthly Sales`,
              data: data.monthly,
              backgroundColor: 'rgba(255, 99, 132, 0.6)',
              borderColor: 'rgba(255, 99, 132, 1)',
              borderWidth: 1,
              borderRadius: 10,
              barThickness: 30,
            },
          ],
        };
        break;
      case 'yearly':
        chartData = {
          labels: ['2021', '2022', '2023', '2024'],
          datasets: [
            {
              label: `${category === 'kain' ? 'Lakbay Kain' : 'Lakbay Kape'} - Yearly Sales`,
              data: data.yearly,
              backgroundColor: 'rgba(255, 159, 64, 0.6)',
              borderColor: 'rgba(255, 159, 64, 1)',
              borderWidth: 1,
              borderRadius: 10,
              barThickness: 30,
            },
          ],
        };
        break;
      default:
        break;
    }

    setBarChartData({
      ...chartData,
      options: {
        responsive: true,
        scales: {
          y: {
            grid: {
              display: false, // Hides the grid lines behind the bars
            },
          },
          x: {
            grid: {
              display: false, // Also hides the grid for the x-axis
            },
          },
        },
      },
    });
  };

  useEffect(() => {
    protectedInfo();
    updateBarChartData(timeRange, selectedCategory);
    updatePieChartData(timeRange, selectedCategory); // Update Pie Chart when timeRange or category changes
  }, [timeRange, selectedCategory]);

  return loading ? (
    <div>Loading protected data...</div>
  ) : (
    <div>
      <div className="dashboard-container">
        {/* Bar Chart */}
        <div className="bar-graph-container">
          <div className="bar-graph">
            {/* Toggle Switch for Lakbay Kain and Kape */}
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
            {/* Time Range Selector */}
            <div className="time-range-selector">
              <label htmlFor="timeRange">Select Time Range:</label>
              <select
                className="time-range-selector"
                id="timeRange"
                value={timeRange}
                onChange={(e) => {
                  setTimeRange(e.target.value);
                  updatePieChartData(e.target.value, selectedCategory); // Update pie chart on time range change
                }}
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
          {/* Pie Chart */}
          <div style={{ width: '45%' }} className="pie-chart-container">
            <div className="pie-chart">
              <h3>Lakbay's Sales</h3>
              <Pie data={pieChartData} options={{ responsive: true }} />
              {/* Text Output for Pie Chart */}
              <p>{pieChartText}</p>
            </div>
          </div>
          {/* DataGrid for Transactions */}
          <div className="transaction-container">
            <h3 className="recent-trans-text">Recent Transactions</h3>
            <DataGrid
              rows={recentOrders}
              columns={[
                { field: 'date', headerName: 'Date', width: 150 },
                { field: 'orderNumber', headerName: 'Order No.', width: 150 },
                { field: 'amount', headerName: 'Amount', width: 150 },
              ]}
              autoHeight
              pageSize={7} // Show 7 rows per page
              disableSelectionOnClick
              checkboxSelection={false}
            />
          </div>
        </div>
      </div>
      <button onClick={logout} className="btn btn-primary">
        Logout
      </button>
    </div>
  );
};

export default Dashboard;
