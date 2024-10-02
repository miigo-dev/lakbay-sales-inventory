import '../css/sales.css'
import { LineChart } from '@mui/x-charts/LineChart'
import sales_icon from '../assets/icons/sales_data.png'
import products_icon from '../assets/icons/products_data.svg'

const tSales = [4700, 2500, 800, 1020, 6500, 2390, 3490];
const tOrders = [4000, 1398, 1000, 3908, 6000, 3800, 4300];
const xLabels = [
  'Sept 26',
  'Sept 27',
  'Sept 28',
  'Sept 39',
  'Sept 30',
  'Oct 1',
  'Oct 2',
];

const Sales = () => {
  return (
    <div class='container'>
      <div class='card-sales'>
        <div class='card-icon'>
          <h1><span><img src={sales_icon} alt=''></img></span></h1>
        </div>
          <div class='sales-info-main'>
            <div class='info-row>'>
              <span>Sales</span>
              <h2>PHP 50,000</h2>
            </div>
          <div class='info-row>'>
            <span>Volume</span>
            <h2>450</h2>
          </div>
        </div>
      </div>

      <div class='card-products'>
          <div class='card-icon'>
          <h1><span><img src={products_icon} alt=''></img></span></h1>
          </div>
            <div class='products-info-main'>
              <div class='info-row>'>
                <span>All Orders</span>
                <h2>450</h2>
              </div>
              <div class='info-row>'>
                <span>Pending</span>
                <h2>5</h2>
              </div>
              <div class='info-row>'>
                <span>Completed</span>
                <h2>445</h2>
            </div>
        </div>
      </div>

      <div class='card-summary'>
        <div class='bar-head'>
          <h2>Summary</h2>
        </div>
        
        <LineChart
          width={1200}
          height={300}
          series={[
            { data: tSales, label: 'Sales', color: '#FFA800'},
            { data: tOrders, label: 'Orders', color : '#3699FF' },
          ]}
          xAxis={[{ scaleType: 'point', data: xLabels }]}
        />
      </div>
    </div>
  )
}

export default Sales