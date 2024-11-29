import React, { useState } from 'react';
import '../css/notification.css';

const Notification = () => {
  // Sample data for notifications
  const [notifications] = useState([
    {
      time: 'November 15, 2024 12:00 PM',
      title: 'NEW FEATURE: Restrict cashier punching',
      message:
        "Have you experienced 'No Cashier' reports? This is when your cashiers are punching sales without them logging on to Hello button on the POS! Considered this resolved! With this new feature in your...",
    },
    {
      time: 'November 15, 2024 12:00 PM',
      title: 'NEW FEATURE: Are you tired of linking ingredients?',
      message:
        'We got you, partner! With this new Copy Inventory Tool, pwede ka nang kumopya ng linking of ingredients from one item to another! Check out the instructions below.',
    },
  ]);

  return (
    <div className="notification-page">
      <h1>Notifications</h1>
      <table className="notification-table">
        <thead>
          <tr>
            <th>Time</th>
            <th>Title</th>
            <th>Message</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {notifications.map((notification, index) => (
            <tr key={index}>
              <td>{notification.time}</td>
              <td>{notification.title}</td>
              <td>
                {notification.message}
                <br />
                <span className="attached-image">{notification.attachedImage}</span>
              </td>
              <td>
                <button className="read-more-btn">Read More</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Notification;
