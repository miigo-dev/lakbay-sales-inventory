
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { fetchProtectedInfo, onLogout } from '../api/auth';
import { unauthenticateUser } from '../redux/slices/authSlice';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { DataGrid } from '@mui/x-data-grid';
import '../css/dashboard.css';
import '../css/styles.css';
import axios from 'axios';

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
  const [error, setError] = useState(null);
  const [protectedData, setProtectedData] = useState(null);
  const [orders, setOrders] = useState([]);
  const [selectedTimeFrameKain, setSelectedTimeFrameKain] = useState('today'); 
  const [selectedTimeFrameKape, setSelectedTimeFrameKape] = useState('today');
  const [allOrdersCountKain, setAllOrdersCountKain] = useState(0);
  const [pendingOrdersCountKain, setPendingOrdersCountKain] = useState(0);
  const [completedOrdersCountKain, setCompletedOrdersCountKain] = useState(0);
  const [allOrdersCountKape, setAllOrdersCountKape] = useState(0);
  const [pendingOrdersCountKape, setPendingOrdersCountKape] = useState(0);
  const [completedOrdersCountKape, setCompletedOrdersCountKape] = useState(0);
  const [timeRange, setTimeRange] = useState('weekly');
  const [selectedCategory, setSelectedCategory] = useState('kain');
  const [barChartData, setBarChartData] = useState({});
  const [todaysOrdersCount, setTodaysOrdersCount] = useState(0);
  const [pendingOrdersCount, setPendingOrdersCount] = useState(0);
  const [completedOrdersCount, setCompletedOrdersCount] = useState(0);
  const [pieChartData, setPieChartData] = useState({
    labels: ['Kain', 'Kape'],
    datasets: [{ data: [300, 150], backgroundColor: ['#C2A790', '#7B6B5D'], borderWidth: 1 }]
  });
  const stockInfoKape = { coffee: 50, milk: 30, cups: 100 };
  const stockInfoKain = { chicken: 40, pork: 30, beef: 20, rice: 100 };

    const handleCategoryChange = () => {
      setSelectedCategory(prevCategory => (prevCategory === 'kape' ? 'kain' : 'kape'));
    };
  
    const getStockInfo = () => {
      return selectedCategory === 'kape' ? stockInfoKape : stockInfoKain;
    };
  
    useEffect(() => {
    }, [selectedCategory]);

    useEffect(() => {
      const fetchOrderData = async () => {
        try {
          const today = new Date().toISOString().split('T')[0];
          const transactionResponse = await axios.get('http://localhost:8080/api/transaction');
          const ordersResponse = await axios.get('http://localhost:8080/api/orders');
  
          // Filter today's orders
          const todayOrders = transactionResponse.data.filter(
            (order) => new Date(order.order_date).toISOString().split('T')[0] === today
          );
  
          // Filter pending and completed orders
          const pendingOrders = ordersResponse.data.filter((order) => order.order_status === 'Pending');
          const completedOrders = transactionResponse.data.filter((order) => order.order_status === 'Completed');
  
          setTodaysOrdersCount(todayOrders.length);
          setPendingOrdersCount(pendingOrders.length);
          setCompletedOrdersCount(completedOrders.length);
          setLoading(false);
        } catch (err) {
          console.error("Error fetching order data:", err);
          setError("Failed to load order data.");
          setLoading(false);
        }
      };
  
      fetchOrderData();
    }, []);
  
  const [pieChartText, setPieChartText] = useState('');

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
  const updateCharts = (range) => {
    const selectedSalesKain = salesData['kain'][range];
    const selectedSalesKape = salesData['kape'][range];
  
    setPieChartData({
      labels: ['Kain', 'Kape'],
      datasets: [
        {
          data: [selectedSalesKain[0], selectedSalesKape[0]],
          backgroundColor: ['#C2A790', '#7B6B5D'],
          borderWidth: 1
        }
      ]
    });
    
    setPieChartText(`Kape: ${selectedSalesKape[0]} php  Kain: ${selectedSalesKain[0]} php`);
  
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
  
    const currentData = barData['kain'][range]; 
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
  
    const colorPalette = [
      '#F8AE54', '#F5921B', '#CA6C0F', '#9E4A06', '#732E00'
    ];
  
    const barChartColors = currentData.map((_, index) => {
      return colorPalette[index % colorPalette.length];
    });
  
    setBarChartData({
      labels: labels,
      datasets: [{
        label: 'Sales',
        data: currentData,
        backgroundColor: barChartColors,
        borderColor: '#7b7b7b',
        borderWidth: 1,
        borderRadius: 12, 
      }],
      options: {
        responsive: true,
        scales: {
          x: {
            grid: {
              display: false, 
            }
          },
          y: {
            grid: {
              display: false, 
            }
          }
        }
      }
    });
  };
  
  const [isKainActive, setIsKainActive] = useState(true); 

    const orderData = [
      { id: 1, orderNumber: '001', category: 'kain', status: 'completed', date: '2024-11-08', amount: 100 },
      { id: 2, orderNumber: '002', category: 'kain', status: 'pending', date: '2024-11-07', amount: 150 },
      { id: 3, orderNumber: '003', category: 'kain', status: 'completed', date: '2024-11-06', amount: 200 },
      { id: 4, orderNumber: '004', category: 'kape', status: 'pending', date: '2024-11-08', amount: 120 },
      { id: 5, orderNumber: '005', category: 'kape', status: 'completed', date: '2024-11-08', amount: 180 },
      { id: 6, orderNumber: '006', category: 'kape', status: 'completed', date: '2024-11-05', amount: 200 },
      { id: 7, orderNumber: '007', category: 'kape', status: 'pending', date: '2024-11-09', amount: 150 },
    ];
  
    const getOrdersForTimeFrame = (timeFrame, category) => {
      const today = new Date().toISOString().split('T')[0]; 
      return orderData.filter(order => {
        if (category && order.category !== category) return false;
  
        if (timeFrame === 'today') {
          return order.date === today;
        } else if (timeFrame === 'weekly') {
          return order.date >= '2024-11-01'; 
        } else if (timeFrame === 'monthly') {
          return order.date.slice(0, 7) === '2024-11'; 
        } else if (timeFrame === 'yearly') {
          return order.date.slice(0, 4) === '2024'; 
        }
        return false;
      });
    };
  
    useEffect(() => {
      const filteredOrders = getOrdersForTimeFrame(timeRange, selectedCategory);

      const sortedOrders = filteredOrders.sort((a, b) => new Date(b.date) - new Date(a.date));

      const recentOrders = sortedOrders.slice(0, 3);
    
      setOrders(recentOrders); 
      
      const updateOrderCounts = (category, timeFrame) => {
        const ordersForCategory = getOrdersForTimeFrame(timeFrame, category);
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
    
      updateOrderCounts(selectedCategory, selectedCategory === 'kain' ? selectedTimeFrameKain : selectedTimeFrameKape);
    }, [timeRange, selectedCategory]); 


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
    const fetchData = async () => {
      try {
        const result = await fetchProtectedInfo();
        setProtectedData(result.data);
      } catch (error) {
        console.error('Error fetching protected data', error);
        dispatch(unauthenticateUser());
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [dispatch]);

  useEffect(() => {
    protectedInfo();
    updateCharts(timeRange, selectedCategory);
  }, [timeRange, selectedCategory]);

  const getTodayOrders = async (category) => {
    try {
      // Fetch all orders from the backend
      const response = await axios.get('http://localhost:8080/api/orders');
      const allOrders = response.data;
  
      // Filter orders based on today's date and category
      const today = new Date().toISOString().split('T')[0];
      const filteredOrders = allOrders.filter(
        (order) => order.date === today && order.category === category
      );
  
      return filteredOrders;
    } catch (error) {
      console.error('Error fetching today\'s orders:', error);
      return [];
    }
  };
  
  useEffect(() => {
    const fetchTodayOrders = async () => {
      const todayOrdersKain = await getTodayOrders('kain');
      const todayOrdersKape = await getTodayOrders('kape');
  
      if (selectedCategory === 'kain') {
        setAllOrdersCountKain(todayOrdersKain.length);
        setPendingOrdersCountKain(
          todayOrdersKain.filter((order) => order.status === 'pending').length
        );
        setCompletedOrdersCountKain(
          todayOrdersKain.filter((order) => order.status === 'completed').length
        );
      } else {
        setAllOrdersCountKape(todayOrdersKape.length);
        setPendingOrdersCountKape(
          todayOrdersKape.filter((order) => order.status === 'pending').length
        );
        setCompletedOrdersCountKape(
          todayOrdersKape.filter((order) => order.status === 'completed').length
        );
      }
    };
  
    fetchTodayOrders();
  }, [selectedCategory]); 

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  return loading ? (
<div>lodidbnas</div>
   ) : (

    <div className='dash-board-contain'>
<div className="order-summaries">
  <div className="order-kain-kape-sum">
  <div className='toggle_container'>
      <input type="checkbox" className='input_type'id="toggle" onChange={handleCategoryChange} />
          <div className="display">
            <label className='label_type' htmlFor="toggle">
              <div className="circle">
                <span className="material-symbols-outlined food">restaurant</span>
                <span className="material-symbols-outlined coffee">local_cafe</span>
              </div>
            </label>
            <span className="categ-txt">
              {selectedCategory === 'kape' ?'Kape' : 'Kain'}
            </span>
          </div>
    </div>
    <div className="summary-order-kain">
      <h3>Today's Order Counts:</h3>
      <div>
        <h1></h1>
        <p>Today's Orders: {todaysOrdersCount}</p>
        <p>Pending Orders: {pendingOrdersCount}</p>
        <p>Completed Orders: {completedOrdersCount}</p>
      </div>
    </div>

    <div className="bar-graph-container">
      <div className="bar-graph">
        <div className="time-range-selector">
          <label htmlFor="timeRange" className='timeRangeTxt'>Select Time Range: </label>
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
        <h3 className='lakbay-categ-txt'>{`${selectedCategory === 'kain' ? 'Lakbay Kain' : 'Lakbay Kape'} Sales Data (${timeRange.charAt(0).toUpperCase() + timeRange.slice(1)})`}</h3>
        <Bar data={barChartData} options={barChartData.options} />
      </div>
    </div>
  </div>

  <div className="order-kape-sum">
    <div>
      <h3 className="recent-trans-text">Recent Transactions
        <DataGrid className='transaction-container'
          rows={orders}
          columns={[
            { field: 'date', headerName: 'Date', width: 150 },
            { field: 'orderNumber', headerName: 'Order No.', width: 150 },
            { field: 'amount', headerName: 'Amount', width: 150 }
          ]}
          autoHeight
          pageSize={3}
          disableSelectionOnClick
          checkboxSelection={false}
        />
      </h3>
    </div>

    <div className="pie-transaction-container">
      <div className="pie-chart-container">
        <h3>Lakbay's Sales</h3>
        <Pie data={pieChartData} options={{ responsive: true }} />
        <p className="pie-txtData">{pieChartText}</p>
      </div>

      <div className='stock-info-wrapper'>
        <h4>Lakbay's Stocks</h4>
        <div className='stock-info'>
          {Object.entries(getStockInfo()).map(([item, quantity]) => (
            <div key={item} className="stock-item">
              <strong>{item}:</strong> {quantity}
            </div>
          ))}
        </div>
      </div>
  </div>  
  </div>
  </div>

<button onClick={logout} className="btn btn-primary">Logout</button>
</div>

  );
};

export default Dashboard;