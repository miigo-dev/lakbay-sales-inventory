import { useSelector } from 'react-redux'
import { NavLink } from 'react-router-dom'
import '../css/sidebar.css'

const Sidebar = () => {
  const { isAuth } = useSelector((state) => state.auth);

  if (!isAuth) {
    return null;
  }

  return (
    <div className="sidebar">

      <div className="header_sidebar">
        <img src="path/to/logo.png" alt="Logo" className="logo" />
        <h2>Lakbay Kape</h2>
      </div>

      <NavLink to="/dashboard" activeClassName="active">
      <img src="" alt="Dashboard icon" />
        Dashboard    
      </NavLink>

      <NavLink to="/orders" activeClassName="active">
      <img src="../assets/order_basketicon24px.png" alt="Orders icon" />
        Orders
      </NavLink>

      <NavLink to="/inventory" activeClassName="active">
      <img src="" alt="Inventory icon" />
        Inventory
      </NavLink>

      <NavLink to="/sales" activeClassName="active">
      <img src="" alt="Sales icon" />
        Sales      
      </NavLink>

      <NavLink to="/reports" activeClassName="active">
      <img src="" alt="Reports icon" />
        Reports    
      </NavLink>

      <NavLink to="/users" activeClassName="active">
      <img src="" alt="Users icon" />
        Users   
      </NavLink>

      <div className="bot_sidebar">
        <NavLink to="/settings" activeClassName="active">
        <img src="" alt="Settings icon" />
          Settings
        </NavLink>

        <NavLink to="/logout" activeClassName="active">
        <img src="" alt="Logout icon" />
          Logout
        </NavLink>
      </div>

    </div>
  )
}

export default Sidebar