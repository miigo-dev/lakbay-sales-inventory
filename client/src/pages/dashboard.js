import React from "react";
import '../css/dashboard.css';

const dashboard = () => {

  return (
    <div class="header">
      <a href="#home">Lakbay
      <img src="envelope_icon.png"/>
      </a>
      <div class="sidebar">
        <a href="#dashboard">Dashboard
        <img src="envelope_icon.png"/>
        </a>
        <a href="#inventory">Inventory
        <img src="envelope_icon.png"/>
        </a>
        <a href="#sales">Sales
        <img src="envelope_icon.png"/>
        </a>
        <a href="#reports">Reports
        <img src="envelope_icon.png"/>
        </a>
        <a href="#users">Users
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
      

  )

}

export default dashboard