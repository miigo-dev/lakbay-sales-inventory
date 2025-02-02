import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import "../css/users.css";
import user_img from "../assets/images/test.jpg";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    username: "",
    role: "",
    created: new Date().toLocaleString(),
    lastUpdated: new Date().toLocaleString(),
    lastLogin: "N/A",
  });

  useEffect(() => {
    const mockUsers = [
      { id: 1, name: "Ronald Palabay", email: "palabay@gmail.com", username: "ronald", role: "Staff", created: "9.25.2024 16:54", lastUpdated: "9.26.2024 17:50", lastLogin: "9.26.2024 17:50" },
      { id: 2, name: "Krista Cruz", email: "cruz@gmail.com", username: "krista", role: "Admin", created: "9.26.2024 02:25", lastUpdated: "9.27.2024 20:32", lastLogin: "9.27.2024 13:00" },
      { id: 3, name: "Miguel Luayon", email: "luayon@gmail.com", username: "miguel", role: "Inventory", created: "9.24.2024 01:48", lastUpdated: "9.27.2024 12:50", lastLogin: "9.27.2024 08:12" },
    ];
    setUsers(mockUsers);
  }, []);

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns = [
    { field: "name", headerName: "Name", width: 200 },
    { field: "email", headerName: "Email", width: 150 },
    { field: "username", headerName: "Username", width: 180 },
    { field: "role", headerName: "Role", width: 120 },
    { field: "created", headerName: "Created", width: 180 },
    { field: "lastUpdated", headerName: "Last Updated", width: 180 },
    { field: "lastLogin", headerName: "Last Login", width: 180 },
    {
      field: "action",
      headerName: "Action",
      width: 300,
      renderCell: (params) => (
        <div>
          <button className="btn view-button" onClick={() => handleView(params.row)}>View</button>
          <button className="btn edit-button" onClick={() => handleEdit(params.row)}>Edit</button>
          <button className="btn delete-button" onClick={() => handleDelete(params.row.id)}>Delete</button>
        </div>
      ),
    },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser({
      ...newUser,
      [name]: value,
    });
  };

  const handleRoleChange = (e) => {
    const { value } = e.target;
    setNewUser({
      ...newUser,
      role: value, 
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const currentDateTime = new Date().toLocaleString();

    if (selectedUser) {
      setUsers(users.map((user) =>
        user.id === selectedUser.id
          ? {
              ...user,
              name: selectedUser.name,
              email: selectedUser.email,
              username: selectedUser.username, 
              role: selectedUser.role,
              lastUpdated: currentDateTime,
              lastLogin: selectedUser.lastLogin, 
            }
          : user
      ));
      setEditModalOpen(false); 
    } else {
      setUsers([
        ...users,
        {
          id: users.length + 1,
          name: newUser.name,
          email: newUser.email,
          username: newUser.username, 
          role: newUser.role,
          created: currentDateTime,
          lastUpdated: currentDateTime,
          lastLogin: "N/A",
        },
      ]);
      setModalOpen(false);
    }

    setSelectedUser(null);
  };

  const handleView = (user) => {
    setSelectedUser(user);
    setViewModalOpen(true);
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setEditModalOpen(true);
  };

  const handleDelete = (user_id) => {
    setUsers(users.filter(user => user.id !== user_id));
  };

  const handleRegisterClick = () => {
    setNewUser({
      name: "",
      email: "",
      username: "",
      role: "",
      created: new Date().toLocaleString(),
      lastUpdated: new Date().toLocaleString(),
      lastLogin: "N/A",
    });
    setModalOpen(true);
  };

  return (
    <div className="user-management">
      <h2>User Management</h2>
      <div className="search_bar">
        <input
          type="text"
          placeholder="Search User"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div className="orders_table" style={{ height: "100%", width: "100%", backgroundColor: "white" }}>
        <DataGrid rows={filteredUsers} columns={columns} pageSize={5} pagination={true} />
      </div>
      <button className="register-button" onClick={handleRegisterClick}>Register User</button>

      {modalOpen && (
        <div className="modal">
          <div className="modal_content">
            <h2>Register New User</h2>
            <form onSubmit={handleSubmit}>
              <div className="modal_input_group">
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={newUser.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="modal_input_group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={newUser.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="modal_input_group">
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={newUser.username}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="modal_input_group">
                <label htmlFor="role">Role</label>
                <select
                  id="role"
                  name="role"
                  value={newUser.role}
                  onChange={handleRoleChange}
                  required
                >
                  <option value="">Select Role</option>
                  <option value="admin">Admin</option>
                  <option value="inventory">Inventory</option>
                  <option value="cashier">Cashier</option>
                </select>
              </div>
              <div className="modal_buttons">
                <button type="button" className="cancel_button" onClick={() => setModalOpen(false)}>Cancel</button>
                <button type="submit" className="submit_button">Submit</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {viewModalOpen && selectedUser && (
        <div className="modal">
          <div className="modal_content">
            <h2>View User</h2>
            <div className="user-info">
              <p><strong>Name:</strong> {selectedUser.name}</p>
              <p><strong>Email:</strong> {selectedUser.email}</p>
              <p><strong>Username:</strong> {selectedUser.username}</p>
              <p><strong>Role:</strong> {selectedUser.role}</p>
              <p><strong>Created:</strong> {selectedUser.created}</p>
              <p><strong>Last Updated:</strong> {selectedUser.lastUpdated}</p>
              <p><strong>Last Login:</strong> {selectedUser.lastLogin}</p>
            </div>
            <button onClick={() => setViewModalOpen(false)} className="cancel_button">Close</button>
          </div>
        </div>
     

      )}

      {editModalOpen && selectedUser && (
        <div className="modal">
          <div className="modal_content">
            <h2>Edit User</h2>
            <form onSubmit={handleSubmit}>
              <div className="modal_input_group">
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={selectedUser.name}
                  onChange={(e) => setSelectedUser({ ...selectedUser, name: e.target.value })}
                  required
                />
              </div>
              <div className="modal_input_group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={selectedUser.email}
                  onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })}
                  required
                />
              </div>

              <div className="modal_input_group">
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={selectedUser.username}
                  onChange={(e) => setSelectedUser({ ...selectedUser, username: e.target.value })}
                  required
                />
              </div>

              <div className="modal_input_group">
                <label htmlFor="role">Role</label>
                <select
                  id="role"
                  name="role"
                  value={selectedUser.role}
                  onChange={(e) => setSelectedUser({ ...selectedUser, role: e.target.value })}
                  required
                >
                  <option value="admin">Admin</option>
                  <option value="inventory">Inventory</option>
                  <option value="cashier">Cashier</option>
                </select>
              </div>

              <div className="modal_buttons">
                <button type="button" className="cancel_button" onClick={() => setEditModalOpen(false)}>Cancel</button>
                <button type="submit" className="submit_button">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
