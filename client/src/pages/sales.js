import '../css/sales.css'
import { BarChart } from '@mui/x-charts/BarChart';
import sales_icon from '../assets/icons/sales_data.png'
import products_icon from '../assets/icons/products_data.svg'

const Sales = () => {
  return (
    <div class='container'>
        <div class='card-sales'>
          <div class='card-head'>
            <div class='card-icon'>
            <h1><span><img src={sales_icon} alt=''></img></span></h1>
            </div>
            <h2>Sales</h2>
          </div>
          <div class='card-info'>
            <h1>PHP 50,000</h1>
          </div>
        </div>

        <div class='card-sales'>
          <div class='card-head'>
            <div class='card-icon'>
            <h1><span><img src={products_icon} alt=''></img></span></h1>
            </div>
            <div class='sales-info-main'>
              <div class='info-row>'>
                <span>All Orders</span>
              </div>
              <div class='info-row>'>
                <span>Pending</span>
              </div>
              <div class='info-row>'>
                <span>Completed</span>
              </div>
            </div>
          </div>
          
          <div class='card-info'>
            <h1>PHP 50,000</h1>
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
            },
          ]}
          width={500}
          height={300}
        />
        </div>
    </div>
  )
}

export default Sales