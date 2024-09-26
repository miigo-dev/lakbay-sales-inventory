import React from 'react'
import {
  BrowserRouter,
  Navigate,
  Routes,
  Route,
  Outlet
} from 'react-router-dom'
import Dashboard from './pages/dashboard'
import Login from './pages/login'
import Register from'./pages/register'
import { useSelector } from 'react-redux'

const PrivateRoutes = () => {
  const { isAuth } = useSelector((state) => state.auth)
  return <>{isAuth ? <Outlet /> : <Navigate to='/login' />}</>
}

const RestrictedRoutes = () => {
  const { isAuth } = useSelector((state) => state.auth)
  return <>{!isAuth ? <Outlet /> : <Navigate to='/dashboard' />}</>
}

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
      <Route path='/' element={<Navigate to='/login' />} />

        <Route element={<PrivateRoutes />}>
          <Route path='/dashboard' element={<Dashboard />} />
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