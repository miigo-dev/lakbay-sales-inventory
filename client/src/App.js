import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {
  BrowserRouter,
  Navigate,
  Routes,
  Route,
  Outlet,
} from 'react-router-dom';

import ForgotPassword from './pages/forgotpassword';


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

import Admin_user from './admin_js/admin_sidebar';
import Admin_dashboard from './admin_js/admin_dashboard';
import Admin_header from './admin_js/admin_header';
import Admin_orders from './admin_js/admin_orders';
import Admin_transaction from './admin_js/admin_transaction';
import Admin_inventory from './admin_js/admin_inventory';
import Admin_supplier from './admin_js/admin_supplier';
import Admin_reports from './admin_js/admin_reports';
import Admin_sales from './admin_js/admin_sales';
import Admin_settings from './admin_js/admin_settings';
import Admin_notification from './admin_js/admin_notification';

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

const AdminRoutes = () => {
  const { isAuth } = useSelector((state) => state.auth);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  if (!isAuth) {
    return <Navigate to='/login' />;
  }

  return (
    <div className={`inventory-container ${sidebarOpen ? 'sidebar-expanded' : 'sidebar-collapsed'}`}>
      <Admin_user onToggle={setSidebarOpen} />
      <div className="main-content">
        <Admin_header />
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
        <Route path="/forgotpassword" element={<ForgotPassword />} />

        <Route element={<PrivateRoutes />}>
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/orders' element={<Orders />} />
          <Route path='/orders/transaction' element={<Transaction />} />
          <Route path='/inventory' element={<Inventory />} />
          <Route path='/inventory/supplier' element={<Supplier />} />
          <Route path='/sales' element={<Sales />} />
          <Route path='/reports' element={<Reports />} />
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

        <Route element={<AdminRoutes />}>
          <Route path="/admin_sidebar" element={<Navigate to="/admin_dashboard" />} />
          <Route path="/admin_dashboard" element={<Admin_dashboard />} />
          <Route path="/admin_orders" element={<Admin_orders />} />
          <Route path="/admin_orders/admin_transaction" element={<Admin_transaction/>} />
          <Route path="/admin_inventory" element={<Admin_inventory />} />
          <Route path="/admin_inventory/admin_supplier" element={<Admin_supplier />} />
          <Route path="/admin_inventory/admin_reports" element={<Admin_reports/>} />
          <Route path="/admin_sales" element={<Admin_sales />} />
          <Route path="/admin_settings" element={<Admin_settings />} />
          <Route path="/admin_dashboard/admin_notification" element={<Admin_notification/>} />
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
