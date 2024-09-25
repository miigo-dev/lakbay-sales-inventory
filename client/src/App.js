import React from 'react'
import {
  BrowserRouter,
  Navigate,
  Routes,
  Route,
  Outlet
} from 'react-router-dom'
import Home from './pages/home'
import Dashboard from './pages/dashboard'
import Login from './pages/login'
import { useSelector } from 'react-redux'

const PrivateRoutes = () => {
  const authState = useSelector((state) => state.auth)
  console.log(authState)
  return <>{authState ? <Outlet /> : <Navigate to='/login' />}</>
}

const RestrictedRoutes = () => {
  const authState = useSelector((state) => state.auth)
  console.log(authState)
  return <>{!authState ? <Outlet /> : <Navigate to='/dashboard' />}</>
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />

        <Route element={<PrivateRoutes />}>
        <Route path='/dashboard' element={<Dashboard />} />
        </Route>

        <Route element={<RestrictedRoutes />}>
        <Route path='/login' element={<Login />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App