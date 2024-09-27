import React from 'react'
import {
  BrowserRouter,
  Navigate,
  Routes,
  Route,
  Outlet
} from 'react-router-dom'
import Dashboard from './pages/dashboard'
import Admin from './pages/admin_d'
import Login from './pages/login'
import Register from'./pages/register'
import Dashboard from './pages/dashboard'
import Orders from './pages/orders'
import Inventory from './pages/inventory';
import Sales from './pages/sales';
import Reports from './pages/reports';
import Users from './pages/users';
import Settings from './pages/settings';
import { useSelector } from 'react-redux'
import Sidebar from './components/sidebar'
import Inventory_Dashboard from './pages/inventory_personel_dashboard'


const PrivateRoutes = () => {
  const { isAuth } = useSelector((state) => state.auth)
  return (
    <>
      {isAuth ? (
        <div className="app-layout">
          <Sidebar />
          <div className="main-content">
            <Outlet />
          </div>
        </div>
      ) : (
        <Navigate to='/login' />
      )}
    </>
  );
}

const RestrictedRoutes = () => {
  const { isAuth } = useSelector((state) => state.auth)
  return <>{!isAuth ? <Outlet /> : <Navigate to='/dashboard' />}</>
}

const App = () => {
  return (
    <BrowserRouter>
    <sidebar/>
      <Routes>
      <Route path='/' element={<Navigate to='/login' />} />

        <Route element={<PrivateRoutes />}>
          <Route path='/admin_d' element={<Admin />} />
        </Route>
        <Route element={<PrivateRoutes />}>
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/inventory_dashboard' element={<Inventory_Dashboard />} />

          <Route path='/orders' element={<Orders />} />
          <Route path='/inventory' element={<Inventory />} />
          <Route path='/sales' element={<Sales />} />
          <Route path='/reports' element={<Reports />} />
          <Route path='/users' element={<Users />} />
          <Route path='/settings' element={<Settings />} />
          
        </Route>
        <Route element={<RestrictedRoutes />}>
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        </Route>
      </Routes>
    </BrowserRouter>
    
  )
}

export default App