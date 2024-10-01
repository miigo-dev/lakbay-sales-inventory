import '../css/sales.css'
import { BarChart } from '@mui/x-charts/BarChart';
import sales_icon from '../assets/icons/sales_data.png'
import products_icon from '../assets/icons/products_data.svg'

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
        <BarChart
          xAxis={[
            {
              id: 'barCategories',
              data: ['Sept 10', 'Sept 11', 'Sept 12', 'Sept 13', 'Sept 14', 'Sept 15', 'Sept 16'],
              scaleType: 'band',
            },
          ]}
          series={[
            {
              data: [2, 5, 3, 11, 4, 5, 9],
              color: '#C2A790'
            },
          ]}
          borderRadius={100}
          width={500}
          height={300}
          />
      </div>
    </div>
  )
}

export default Sales