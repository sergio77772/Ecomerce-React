import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const UserTable = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [formData, setFormData] = useState({
    id: "",
    nombre: "",
    correo: "",
    password: "",
    direccion: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  const API_URL = process.env.REACT_APP_API + "users.php";

  // Fetch all users from the backend
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');  // Get the token from localStorage
      const response = await fetch(API_URL, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "token": `Bearer ${token}`, // Send the token in the Authorization header
        },
      });
      const data = await response.json();
      setUsers(data.data || []);
      setFilteredUsers(data.data || []);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle search
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = users.filter(
      (user) =>
        user.nombre.toLowerCase().includes(query) ||
        user.correo.toLowerCase().includes(query)
    );
    setFilteredUsers(filtered);
    setCurrentPage(1); // Reset to first page
  };

  // Add or update a user
  const handleSubmit = async () => {
    const method = isEditing ? "PUT" : "POST";
    const endpoint = isEditing
      ? `${API_URL}`
      : `${API_URL}?action=register`;

    const token = localStorage.getItem('token');  // Get the token from localStorage

    try {
      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
          "token": `Bearer ${token}`,  // Add token to the header
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (data.success) {
        fetchUsers();
        closeModal();
      } else {
        console.error(data.error || "Error saving user.");
      }
    } catch (error) {
      console.error("Error saving user:", error);
    }
  };

  // Delete a user
  const handleDeleteUser = async (id) => {
    const token = localStorage.getItem('token');  // Get the token from localStorage

    try {
      const response = await fetch(`${API_URL}?id=${id}`, {
        method: "DELETE",
        headers: {
          "token": `Bearer ${token}`,  // Add token to the header
        },
      });
      const data = await response.json();
      if (data.success) {
        fetchUsers();
      } else {
        console.error(data.error || "Error deleting user.");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  // Open modal for adding or editing
  const openModal = (user = null) => {
    if (user) {
      setFormData(user);
      setIsEditing(true);
    } else {
      setFormData({ id: "", nombre: "", correo: "", password: "", direccion: "" });
      setIsEditing(false);
    }
    setModalVisible(true);
  };

  // Close modal
  const closeModal = () => {
    setModalVisible(false);
    setFormData({ id: "", nombre: "", correo: "", password: "", direccion: "" });
    setIsEditing(false);
  };

  // Paginate filtered users
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">User Management</h1>
      <div className="d-flex justify-content-between mb-3">
        <input
          type="text"
          placeholder="Search by name or email"
          className="form-control w-50"
          value={searchQuery}
          onChange={handleSearch}
        />
        <button className="btn btn-primary" onClick={() => openModal()}>
          Add User
        </button>
      </div>
      <table className="table table-striped table-bordered">
        <thead className="table-dark">
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Address</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentUsers.map((user) => (
            <tr key={user.id}>
              <td>{user.nombre}</td>
              <td>{user.correo}</td>
              <td>{user.direccion || "N/A"}</td>
              <td>
                <button
                  className="btn btn-warning btn-sm me-2"
                  onClick={() => openModal(user)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDeleteUser(user.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <nav>
        <ul className="pagination justify-content-center">
          {Array.from({ length: totalPages }, (_, index) => index + 1).map(
            (page) => (
              <li
                key={page}
                className={`page-item ${page === currentPage ? "active" : ""}`}
              >
                <button className="page-link" onClick={() => paginate(page)}>
                  {page}
                </button>
              </li>
            )
          )}
        </ul>
      </nav>

      {/* Modal */}
      <div
        className={`modal fade ${modalVisible ? "show d-block" : ""}`}
        tabIndex="-1"
        style={{
          display: modalVisible ? "block" : "none",
          backgroundColor: "rgba(0,0,0,0.5)",
        }}
        aria-hidden={!modalVisible}
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{isEditing ? "Edit User" : "Add User"}</h5>
              <button type="button" className="btn-close" onClick={closeModal}></button>
            </div>
            <div className="modal-body">
              <form>
                <div className="mb-3">
                  <label className="form-label">Name</label>
                  <input
                    type="text"
                    name="nombre"
                    className="form-control"
                    value={formData.nombre}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    name="correo"
                    className="form-control"
                    value={formData.correo}
                    onChange={handleChange}
                    required
                  />
                </div>
                {!isEditing && (
                  <div className="mb-3">
                    <label className="form-label">Password</label>
                    <input
                      type="password"
                      name="password"
                      className="form-control"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                  </div>
                )}
                <div className="mb-3">
                  <label className="form-label">Address</label>
                  <input
                    type="text"
                    name="direccion"
                    className="form-control"
                    value={formData.direccion}
                    onChange={handleChange}
                  />
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={closeModal}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleSubmit}>
                {isEditing ? "Update" : "Add"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserTable;
