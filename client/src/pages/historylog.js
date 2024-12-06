import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import "../css/historylog.css"; // Import custom styles
import { useNavigate } from 'react-router-dom';
import Back from '../assets/icons/back.svg'; // Back button icon

// Sample history log data
const sampleLogs = [
  { id: 1, user: "Alice", action: "Updated profile", timestamp: "2024-11-29 10:30 AM" },
  { id: 2, user: "Bob", action: "Deleted record", timestamp: "2024-11-28 09:15 AM" },
  { id: 3, user: "Charlie", action: "Added new entry", timestamp: "2024-11-27 05:45 PM" },
  { id: 4, user: "David", action: "Modified settings", timestamp: "2024-11-25 02:10 PM" },
  { id: 5, user: "Eve", action: "Created new user", timestamp: "2024-11-24 08:50 AM" },
  // Add more sample logs if needed
];

const Historylog = () => {
  const [logs, setLogs] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]); // Initialize with today's date
  const [searchQuery, setSearchQuery] = useState(''); // Initialize with empty search
  const navigate = useNavigate();

  // Filter logs based on search query and selected date
  const filteredLogs = logs.filter((log) => {
    const logDate = new Date(log.timestamp).toLocaleDateString(); // Get the log's date
    const selectedDateStr = new Date(selectedDate).toLocaleDateString(); // Get the selected date

    const isDateMatch = logDate === selectedDateStr; // Date match check
    const isSearchMatch =
      log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase()); // Search match check

    // Both filters should be true for the log to be included
    return isSearchMatch && isDateMatch;
  });

  // Columns configuration for DataGrid
  const columns = [
    { field: "user", headerName: "User", width: 150 },
    { field: "action", headerName: "Action", width: 300 },
    { field: "timestamp", headerName: "Timestamp", width: 200 },
  ];

  // Handle date change from the date picker
  const handleDateChange = (e) => {
    setSelectedDate(e.target.value); // Set the selected date
  };

  // Handle back button click
  const handleBack = () => {
    navigate('/settings'); // Navigate to settings page
  };

  // Simulate fetching data (you can replace this with an actual API call)
  useEffect(() => {
    setLogs(sampleLogs); // Set initial logs
  }, []);

  return (
    <div className="historylog-container">
      {/* Back Button */}
      <button className="back-button" onClick={handleBack}>
        <img src={Back} alt="Back" />
      </button>

      {/* Title */}
      <h1 className="label_header">History Log</h1>

      {/* Search Bar and Date Picker */}
      <div className="historylog-content">
        {/* Left section: Search Bar */}
        <div className="historylog-search-bar">
          <input
            type="text"
            placeholder="Search history logs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>

        {/* Right section: Date Picker */}
        <div className="historylog-date-picker">
          <label htmlFor="date-picker">Date: </label>
          <input
            type="date"
            id="date-picker"
            value={selectedDate}
            onChange={handleDateChange}
            className="date-input"
          />
        </div>
      </div>

      {/* Data Grid */}
      <div className="historylog-data-grid-container">
        <DataGrid
          rows={filteredLogs}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          autoHeight
          disableSelectionOnClick
          getRowId={(row) => row.id} // Ensure proper row selection
        />
      </div>
    </div>
  );
};

export default Historylog;
