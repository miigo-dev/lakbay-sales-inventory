import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // for navigating back to settings
import { DataGrid } from '@mui/x-data-grid'; // Import DataGrid
import '../css/backup.css'; // Import custom styles
import Back from '../assets/icons/back.svg'; // Back icon

const Backup = () => {
  const navigate = useNavigate();
  
  // State for automated backup frequency (example: every 24 hours)
  const [backupFrequency, setBackupFrequency] = useState(24);  // default to 24 hours
  const [isBackupInProgress, setIsBackupInProgress] = useState(false);
  
  // Sample backup history data
  const [backups, setBackups] = useState([
    { id: 1, description: 'Backup', date: '11/28/2024', time: '2:00 PM' },
    { id: 2, description: 'Backup', date: '11/27/2024', time: '1:45 PM' },
    { id: 3, description: 'Backup', date: '11/26/2024', time: '10:00 AM' },
  ]);
  
  // Columns for DataGrid
  const columns = [
    { field: 'description', headerName: 'Backup', width: 150 },
    { field: 'date', headerName: 'Date', width: 150 },
    { field: 'time', headerName: 'Time', width: 150 },
  ];
  
  // Function to handle manual backup
  const handleManualBackup = () => {
    setIsBackupInProgress(true);
    setTimeout(() => {
      setIsBackupInProgress(false);
      alert('Backup Completed!');
      // Optionally, add a new backup entry to the history
      setBackups([...backups, { id: backups.length + 1, description: 'Backup', date: new Date().toLocaleDateString(), time: new Date().toLocaleTimeString() }]);
    }, 2000); // Simulate a backup process
  };
  
  // Handle navigation back to settings
  const handleBack = () => {
    navigate('/settings');
  };

  return (
    <div className="settings-container">
      {/* Back Button */}
      <button className="back-button" onClick={handleBack}>
        <img src={Back} alt="Back" />
      </button>

      <h1 className="label_header">Manage Backup</h1>
      <hr className="settings-divider" />

      {/* Automated Backup Frequency */}
      <div className="settings-options">
        <h3>Automated Backup Frequency</h3>
        <p>Set the frequency (in hours) for the automated backups</p>
        <div className="input-container">
          <input
            type="number"
            value={backupFrequency}
            onChange={(e) => setBackupFrequency(e.target.value)}
            min="1"
            step="1"
            className="settings-input"
          />
          <span>hours</span>
        </div>
      </div>

      {/* Manual Backup Trigger */}
      <div className="settings-options">
        <h3>Manual Backup</h3>
        <p>Click the button below to trigger a manual backup.</p>
        <button
          onClick={handleManualBackup}
          className="settings_button"
          disabled={isBackupInProgress}
        >
          {isBackupInProgress ? 'Backup in Progress...' : 'Trigger Manual Backup'}
        </button>
      </div>

      {/* Backup History Log DataGrid */}
      <div className="settings-options">
        <h3>Backup History Log</h3>
        <p>View all recent backups that have been created for the system.</p>
        <div className="backup-data-grid">
          <DataGrid
            rows={backups}          // Data rows
            columns={columns}       // Column definitions
            pageSize={5}            // Number of rows per page
            rowsPerPageOptions={[5]} // Page size options
            autoHeight
            disableSelectionOnClick
          />
        </div>
      </div>
    </div>
  );
};

export default Backup;
