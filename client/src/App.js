import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import {
  BrowserRouter,
  Navigate,
  Routes,
  Route,
  Outlet
} from 'react-router-dom';

import Dashboard from './pages/dashboard';
import Login from './pages/login';
import Register from './pages/register';
import Orders from './pages/orders';
import Transaction from './pages/transaction';
import Inventory from './pages/inventory';
import Supplier from './pages/supplier';
import Sales from './pages/sales';
import Reports from './pages/reports';
import Users from './pages/users';
import Settings from './pages/settings';
import Sidebar from './components/sidebar';
import Header from './components/header';

const PrivateRoutes = () => {
  const { isAuth } = useSelector((state) => state .auth);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  if (!isAuth) {
    return <Navigate to='/login' />;
  }

  return (
    <div className={`app-container ${sidebarOpen ? 'sidebar-expanded' : 'sidebar-collapsed'}`}>
      <Sidebar onToggle={setSidebarOpen} />
      <div className="main-content">
        <Header /> {/* Static Header */}
        <div className="outlet-container">
          <Outlet /> {/* Dynamic Content */}
        </div>
      </div>
    </div>
  );
};

const RestrictedRoutes = () => {
  const { isAuth } = useSelector((state) => state.auth);
  return <>{!isAuth ? <Outlet /> : <Navigate to='/dashboard' />}</>;
};

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Navigate to='/login' />} />
        <Route element={<PrivateRoutes />}>
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/orders' element={<Orders />} />
          <Route path='/orders/transaction' element={<Transaction />} />
          <Route path='/inventory' element={<Inventory />} />
          <Route path='/inventory/supplier' element={<Supplier />} />
          <Route path='/sales' element={<Sales />} />
          <Route path='/inventory/reports' element={<Reports />} />
          <Route path='/users' element={<Users />} />
          <Route path='/settings' element={<Settings />} />
        </Route>
        <Route element={<RestrictedRoutes />}>
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
