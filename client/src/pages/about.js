import React from 'react';
import '../css/about.css'; 
import { useNavigate } from 'react-router-dom'; 
import Back from '../assets/icons/back.svg';
import { FaUserCircle, FaCode, FaPaintBrush, FaRegFileAlt } from 'react-icons/fa';

const About = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/settings');
  };

  return (
    <div className="about-container">
      <button className="back-button" onClick={handleBack}>
        <img src={Back} alt="Back" />
      </button>
      <h1>About the System</h1>
      <hr className="settings-divider" />
      <div className="about-title">
        <h1>Sales and Inventory Management System</h1>
      </div>
      <div className="about-description">
        <p>
          The Sales and Inventory Management System helps Lakbay Kape and Kain run more smoothly. It replaces old, manual methods with a modern, digital system that makes tracking sales and managing inventory much easier. The system allows staff to process orders quickly, keep track of stock accurately, and generate reports on sales. This helps the team make better decisions, reduce mistakes, and provide better service to customers. The system is an important step towards making the business more efficient and ready to grow in the future.
        </p>
      </div>

      <div className="about-developers-title">
        <h2>Developers:</h2>
      </div>

      <div className="about-developers-container">
        <div className="about-developer">
          <FaUserCircle size={50} />
          <p><strong>Miguel Christopher Luayon</strong></p>
          <p>Main Programmer</p>
        </div>
        <div className="about-developer">
          <FaCode size={50} />
          <p><strong>Ronald Angelo Palabay</strong></p>
          <p>Assistant Programmer</p>
        </div>
        <div className="about-developer">
          <FaPaintBrush size={50} />
          <p><strong>Isaac Errol Mariano</strong></p>
          <p>Designer</p>
        </div>
        <div className="about-developer">
          <FaRegFileAlt size={50} />
          <p><strong>Krista Noelle Cruz</strong></p>
          <p>Analyst</p>
        </div>
      </div>
    </div>
  );
};

export default About;
