import { useSelector } from 'react-redux'
import { NavLink } from 'react-router-dom'

const Sidebar = () => {
  const { isAuth } = useSelector((state) => state.auth);

  if (!isAuth) {
    return null;
  }

  return (
    <div className="sidebar">
      <NavLink to="/dashboard" activeClassName="active">
        Dashboard
        <img src="" alt="Dashboard icon" />
      </NavLink>
      <NavLink to="/orders" activeClassName="active">
        Orders
        <img src=".png" alt="Orders icon" />
      </NavLink>
      <NavLink to="/inventory" activeClassName="active">
        Inventory
        <img src="" alt="Inventory icon" />
      </NavLink>
      <NavLink to="/sales" activeClassName="active">
        Sales
        <img src="" alt="Sales icon" />
      </NavLink>
      <NavLink to="/reports" activeClassName="active">
        Reports
        <img src="" alt="Reports icon" />
      </NavLink>
      <NavLink to="/users" activeClassName="active">
        Users
        <img src="" alt="Users icon" />
      </NavLink>

      <div className="bot_sidebar">
        <NavLink to="/settings" activeClassName="active">
          Settings
          <img src="" alt="Settings icon" />
        </NavLink>
        <NavLink to="/logout" activeClassName="active">
          Logout
          <img src="" alt="Logout icon" />
        </NavLink>
      </div>
    </div>
  )
}

export default Sidebar