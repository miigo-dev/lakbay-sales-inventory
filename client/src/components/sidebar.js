import { useSelector } from 'react-redux'
import { NavLink } from 'react-router-dom'
import '../css/sidebar.css'

import logo from '../assets/lakbaylogo50px.png'
import dash_icon from '../assets/dash_icon_dark.png'
import order_icon from '../assets/order_icon_dark.png'
import inventory_icon from '../assets/folder_icon_dark.png'

import reports_icon from '../assets/report_icon_dark.png'
import users_icon from '../assets/users_icon_dark.png'
import settings_icon from '../assets/settings_icon_dark.png'

const Sidebar = () => {
  const { isAuth } = useSelector((state) => state.auth);

  if (!isAuth) {
    return null;
  }

  return (
    <>
    <div className="sidebar">

      <div className="header_sidebar">
        <img src={logo} alt="Logo" className="logo" />
        <h2>Lakbay Kape</h2>
      </div>

      <NavLink to="/dashboard" activeClassName="active">
      <img src={dash_icon} alt="Dashboard icon" />
        Dashboard    
      </NavLink>

      <NavLink to="/orders" activeClassName="active">
      <img src={order_icon} alt="Orders icon" />
        Orders
      </NavLink>

      <NavLink to="/inventory" activeClassName="active">
      <img src={inventory_icon} alt="Inventory icon" />
        Inventory
      </NavLink>

      <NavLink to="/sales" activeClassName="active">
      <img src='{sales_icon}' alt="Sales icon" />
        Sales      
      </NavLink>

      <NavLink to="/reports" activeClassName="active">
      <img src={reports_icon} alt="Reports icon" />
        Reports    
      </NavLink>

      <NavLink to="/users" activeClassName="active">
      <img src={users_icon} alt="Users icon" />
        Users   
      </NavLink>

      <div className="bot_sidebar">
        <NavLink to="/settings" activeClassName="active">
        <img src={settings_icon} alt="Settings icon" />
          Settings
        </NavLink>

        <NavLink to="/logout" activeClassName="active">
        <img src='' alt="Logout icon" />
          Logout
        </NavLink>
      </div>

    </div>
    </>
  )
}

export default Sidebar