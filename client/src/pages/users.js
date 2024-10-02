import '../css/users.css';
import user_img from '../assets/images/test.jpg';
import axios from 'axios';
import React, { useEffect, useState } from 'react';

const Users = () => {

  return (
    <div className="container">
      <div className="card">
        <div className="user-details">
          <div className="user-card">
            <img src={user_img} alt="User" />
            <h2>Isaac Mariano</h2>
          </div>
          <div className="user-info-main">
            <div className="info-row">
              <span>Email</span>
              <span>bossmalupiton@lakbaykk.live</span>
                </div>
                <div className="info-row">
                  <span>User ID</span>
                  <span>ds74nv-h438-d435-29fd-34hf8d38549</span>
                </div>
                <div className="info-row">
                  <span>Role</span>
                  <span>Owner</span>
                </div>
            </div>
          <div className="user-info-extra">
            <div className="info-row">
              <span>Mobile Phone</span>
              <span>+63 1234-567-890</span>
            </div>
            <div className="info-row">
              <span>Birthdate</span>
              <span>30.6.2002 (22)</span>
            </div>
            <div className="info-row">
              <span>Username</span>
              <span>tobimariano</span>
            </div>
            <div className="info-row">
              <span>Created</span>
              <span>9.24.2024 06:04</span>
            </div>
            <div className="info-row">
              <span>Last Login</span>
              <span>9.27.2024 12:29</span>
            </div>
          </div>
        </div>
      </div>

      <div className="user-management">
        <div className="header-search">
            <h2>User Management</h2>
            <div className="search-bar">
                <input type="text" placeholder="Search User" />
                <button>Search</button>
            </div>
        </div>

        <div className="table-responsive">
        <table>
          <thead>
            <tr>
              <th>Application</th>
              <th>Username</th>
              <th>Roles</th>
              <th>Created</th>
              <th>Last Updated</th>
              <th>Last Login</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Ronald Palabay</td>
              <td>PALABS</td>
              <td>Staff</td>
              <td>9.25.2024 16:54</td>
              <td>9.26.2024 17:50</td>
              <td>9.26.2024 17:50</td>
              <td>
                <button className="view-button">View</button>
                <button className="edit-button">Edit</button>
                <button className="delete-button">Delete</button>
              </td>
            </tr>
            <tr>
              <td>Krista Cruz</td>
              <td>kcruz</td>
              <td>Admin</td>
              <td>9.26.2024 02:25</td>
              <td>9.27.2024 20:32</td>
              <td>9.27.2024 13:00</td>
              <td>
                <button className="view-button">View</button>
                <button className="edit-button">Edit</button>
                <button className="delete-button">Delete</button>
              </td>
            </tr>
            <tr>
              <td>Miguel Luayon</td>
              <td>mluayon</td>
              <td>Inventory</td>
              <td>9.24.2024 01:48</td>
              <td>9.27.2024 12:50</td>
              <td>9.27.2024 08:12</td>
              <td>
                <button className="view-button">View</button>
                <button className="edit-button">Edit</button>
                <button className="delete-button">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
        <button className="register-button">Register User</button>
      </div>
    </div>
    </div>
  );
};

export default Users;
