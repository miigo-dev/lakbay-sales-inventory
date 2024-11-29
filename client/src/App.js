import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {
  BrowserRouter,
  Navigate,
  Routes,
  Route,
  Outlet,
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
import Backup from './pages/backup';
import Historylog from './pages/historylog';
import About from './pages/about';
import Sidebar from './components/sidebar';
import Header from './components/header';
import Notification from './pages/notification';

import Cashier from './cashier_js/cashier_sidebar';
import Cashier_orders from './cashier_js/cashier_orders';
import Cashier_transaction from './cashier_js/cashier_transaction';
import Cashier_header from './cashier_js/cashier_header';
import Cashier_notification from './cashier_js/cashier_notification';

import InventoryPersonnel from './inventoryper_js/inventoryper_sidebar';
import Inventoryper_inventory from './inventoryper_js/inventoryper_inventory';
import Inventoryper_supplier from './inventoryper_js/inventoryper_supplier';
import Inventoryper_reports from './inventoryper_js/inventoryper_reports';
import Inventoryper_header from './inventoryper_js/inventoryper_header';
import Inventoryper_notification from './inventoryper_js/inventoryper_notification';

const PrivateRoutes = () => {
  const { isAuth } = useSelector((state) => state.auth);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  if (!isAuth) {
    return <Navigate to='/login' />;
  }

  return (
    <div className={`app-container ${sidebarOpen ? 'sidebar-expanded' : 'sidebar-collapsed'}`}>
      <Sidebar onToggle={setSidebarOpen} />
      <div className="main-content">
        <Header />
        <div className="outlet-container">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

const CashierRoutes = () => {
  const { isAuth } = useSelector((state) => state.auth);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  if (!isAuth) {
    return <Navigate to='/login' />;
  }

  return (
    <div className={`cashier-container ${sidebarOpen ? 'sidebar-expanded' : 'sidebar-collapsed'}`}>
      <Cashier onToggle={setSidebarOpen} />
      <div className="main-content">
        <Cashier_header />
        <div className="outlet-container">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

const InventoryRoutes = () => {
  const { isAuth } = useSelector((state) => state.auth);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  if (!isAuth) {
    return <Navigate to='/login' />;
  }

  return (
    <div className={`inventory-container ${sidebarOpen ? 'sidebar-expanded' : 'sidebar-collapsed'}`}>
      <InventoryPersonnel onToggle={setSidebarOpen} />
      <div className="main-content">
        <Inventoryper_header />
        <div className="outlet-container">
          <Outlet />
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
          <Route path='/settings/backup' element={<Backup />} />
          <Route path='/settings/historylog' element={<Historylog />} />
          <Route path='/settings/about' element={<About />} />
          <Route path="/notifications" element={<Notification />} />
        </Route>

        <Route element={<CashierRoutes />}>
          <Route path="/cashier_sidebar" element={<Navigate to="/cashier_orders" />} />
          <Route path="/cashier_orders" element={<Cashier_orders />} />
          <Route path="/cashier_orders/cashier_transaction" element={<Cashier_transaction />} />
          <Route path="/cashier_orders/cashier_notification" element={<Cashier_notification />} />
        </Route>

        <Route element={<InventoryRoutes />}>
          <Route path="/inventoryper_sidebar" element={<Navigate to="/inventoryper_inventory" />} />
          <Route path="/inventoryper_inventory" element={<Inventoryper_inventory />} />
          <Route path="/inventoryper_inventory/inventoryper_supplier" element={<Inventoryper_supplier />} />
          <Route path="/inventoryper_inventory/inventoryper_reports" element={<Inventoryper_reports />} />
          <Route path="/inventoryper_inventory/inventoryper_notification" element={<Inventoryper_notification />} />
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
