import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { fetchProtectedInfo, onLogout } from '../api/auth'
import { unauthenticateUser } from '../redux/slices/authSlice'
import '../css/inventory_personel_dashboard.css'
import logo from '../assets/lakbaylogo50px.png'

const Inventory_Dashboard = () => {
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(true)
  const [protectedData, setProtectedData] = useState(null)

  const logout = async () => {
    try {
      await onLogout()

      dispatch(unauthenticateUser())
      localStorage.removeItem('isAuth')
    } catch (error) {
      console.log(error.response)
    }
  }

  const protectedInfo = async () => {
    try {
      const { data } = await fetchProtectedInfo()

      setProtectedData(data.info)

      setLoading(false)
    } catch (error) {
      logout()
    }
  }

  useEffect(() => {
    protectedInfo()
  }, [])

  return loading ? (
    <div>
      <h1>Loading...</h1>
    </div>
  ) : (
    <div>
      <h1>Dashboard</h1>
      <h2>{protectedData}</h2>

      <button onClick={logout} className='btn btn-primary'>
        Logout
      </button>

      <div className="header">

      <div className="sidebar">
        <a href="/dashboard">Dashboard
        <img src="envelope_icon.png"/>
        </a>
        <a href="#inventory">Inventory
        <img src="envelope_icon.png"/>
        </a>
        <a href="#damageProduct">Damage Product
        <img src="envelope_icon.png"/>
        </a>
        <div class="bot_sidebar">
          <a href="#settings">Settings
          <img src="envelope_icon.png"/>
          </a>
          <a href="#logout">Logout
          <img src="envelope_icon.png"/>
          </a>
          </div>
        </div>
      </div>
    </div>
  )

}

export default Inventory_Dashboard
