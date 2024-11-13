import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { fetchProtectedInfo, onLogout } from '../api/auth'
import { unauthenticateUser } from '../redux/slices/authSlice'
import { Bar, Pie } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js'

import '../css/styles.css'

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
)

const Dashboard = () => {
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(true)
  const [protectedData, setProtectedData] = useState(null)
  const [timeRange, setTimeRange] = useState('weekly') // Default to 'weekly'
  const [barChartData, setBarChartData] = useState({})
  const [pieChartData, setPieChartData] = useState({
    labels: ['Red', 'Blue', 'Yellow'],
    datasets: [
      {
        data: [300, 50, 100],
        backgroundColor: ['rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(255, 206, 86, 0.2)'],
        borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)'],
        borderWidth: 1,
      },
    ],
  })

  const logout = async () => {
    try {
      await onLogout()
      dispatch(unauthenticateUser())
      localStorage.removeItem('isAuth')
    } catch (error) {
      console.error('Error logging out:', error.response || error.message)
    }
  }

  const protectedInfo = async () => {
    try {
      const { data } = await fetchProtectedInfo()
      setProtectedData(data.info)
      setLoading(false)
    } catch (error) {
      logout()
      console.error('Error fetching protected info:', error.response || error.message)
    }
  }

  // Function to update bar chart data based on the selected time range
  const updateBarChartData = (range) => {
    switch (range) {
      case 'weekly':
        setBarChartData({
          labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7'],
          datasets: [
            {
              label: 'Weekly Sales',
              data: [12, 19, 3, 5, 2, 8, 15],
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
            },
          ],
        })
        break
      case 'daily':
        setBarChartData({
          labels: ['Hour 1', 'Hour 2', 'Hour 3', 'Hour 4', 'Hour 5', 'Hour 6', 'Hour 7', 'Hour 8', 'Hour 9', 'Hour 10', 'Hour 11', 'Hour 12'],
          datasets: [
            {
              label: 'Sales Today',
              data: [5, 7, 3, 4, 2, 6, 8, 7, 4, 3, 5, 9],
              backgroundColor: 'rgba(54, 162, 235, 0.2)',
              borderColor: 'rgba(54, 162, 235, 1)',
              borderWidth: 1,
            },
          ],
        })
        break
      case 'monthly':
        setBarChartData({
          labels: ['January', 'February', 'March', 'April'],
          datasets: [
            {
              label: 'Monthly Sales',
              data: [30, 50, 40, 60],
              backgroundColor: 'rgba(255, 99, 132, 0.2)',
              borderColor: 'rgba(255, 99, 132, 1)',
              borderWidth: 1,
            },
          ],
        })
        break
      case 'yearly':
        setBarChartData({
          labels: ['2021', '2022', '2023', '2024'],
          datasets: [
            {
              label: 'Yearly Sales',
              data: [150, 200, 180, 250],
              backgroundColor: 'rgba(255, 159, 64, 0.2)',
              borderColor: 'rgba(255, 159, 64, 1)',
              borderWidth: 1,
            },
          ],
        })
        break
      default:
        break
    }
  }

  useEffect(() => {
    protectedInfo()
    updateBarChartData(timeRange) // Initialize with the default time range
  }, [timeRange]) // Re-run when timeRange changes

  return loading ? (
    <div>Loading protected data...</div>
  ) : (
    <div>
      <h1>Dashboard</h1>
      <h2>{protectedData}</h2>

      {/* Time Range Selector */}
      <div>
        <button onClick={() => setTimeRange('weekly')}>Weekly</button>
        <button onClick={() => setTimeRange('daily')}>Daily</button>
        <button onClick={() => setTimeRange('monthly')}>Monthly</button>
        <button onClick={() => setTimeRange('yearly')}>Yearly</button>
      </div>

      {/* Bar Chart */}
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ width: '45%' }}>
          <h3>Sales Data ({timeRange.charAt(0).toUpperCase() + timeRange.slice(1)})</h3>
          <Bar data={barChartData} options={{ responsive: true }} />
        </div>

        {/* Pie Chart */}
        <div style={{ width: '45%' }}>
          <h3>Color Distribution (Pie Chart)</h3>
          <Pie data={pieChartData} options={{ responsive: true }} />
        </div>
      </div>

      <button onClick={logout} className='btn btn-primary'>
        Logout
      </button>
    </div>
  )
}

export default Dashboard
