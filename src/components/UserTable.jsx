import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import SkeletonTable from "./skeleton/SkeletonTable";

const UserTable = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [formData, setFormData] = useState({
    id: "",
    nombre: "",
    correo: "",
    password: "",
    direccion: "",
    imagen: null,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.REACT_APP_API + "users.php";
  const URL = process.env.REACT_APP_BASE_URL;

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(API_URL, {
        method: "GET",
        headers: { "Content-Type": "application/json", token: `Bearer ${token}` },
      });
      const data = await response.json();
      setUsers(data.data || []);
      setFilteredUsers(data.data || []);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({ ...prev, imagen: file }));
  };

  const handleSubmit = async () => {
    const method = "POST";
    const endpoint = isEditing ? API_URL : `${API_URL}?action=register`;
    const token = localStorage.getItem("token");

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("id", formData.id);
      formDataToSend.append("nombre", formData.nombre);
      formDataToSend.append("correo", formData.correo);
      if (!isEditing) {
        formDataToSend.append("password", formData.password);
      }
      formDataToSend.append("direccion", formData.direccion);
      if (formData.imagen) {
        formDataToSend.append("imagen", formData.imagen);
      }
      if (isEditing) {
        formDataToSend.append("method", "PUT");
      }

      const response = await fetch(endpoint, {
        method,
        headers: { token: `Bearer ${token}` },
        body: formDataToSend,
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

  const handleEditUser = (user) => {
    setFormData({
      id: user.id,
      nombre: user.nombre,
      correo: user.correo,
      password: "",
      direccion: user.direccion || "",
      imagen: null,
    });
    setIsEditing(true);
    setModalVisible(true);
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}?id=${id}`, {
        method: "DELETE",
        headers: { token: `Bearer ${token}` },
      });

      const data = await response.json();
      if (data.success) {
        fetchUsers();
      } else {
        console.error("Error deleting user:", data.error);
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const closeModal = () => {
    setModalVisible(false);
    setFormData({ id: "", nombre: "", correo: "", password: "", direccion: "", imagen: null });
    setIsEditing(false);
  };

  if (loading) {
    return <SkeletonTable rows={5} columns={5} />;
  }

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">User Management</h1>
      <div className="d-flex justify-content-between mb-3">
        <input
          type="text"
          placeholder="Search by name or email"
          className="form-control w-50"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button className="btn btn-primary" onClick={() => setModalVisible(true)}>Add User</button>
      </div>
      <table className="table table-striped table-bordered">
        <thead className="table-dark">
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Email</th>
            <th>Address</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user.id}>
              <td>
                {user.foto ? (
                  <img src={URL + user.foto} alt="User" style={{ width: 50, height: 50, borderRadius: "50%" }} />
                ) : (
                  "No Image"
                )}
              </td>
              <td>{user.nombre}</td>
              <td>{user.correo}</td>
              <td>{user.direccion || "N/A"}</td>
              <td>
                <button className="btn btn-warning btn-sm me-2" onClick={() => handleEditUser(user)}>Edit</button>
                <button className="btn btn-danger btn-sm" onClick={() => handleDeleteUser(user.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className={`modal fade ${modalVisible ? "show d-block" : ""}`} tabIndex="-1">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{isEditing ? "Edit User" : "Add User"}</h5>
              <button type="button" className="btn-close" onClick={closeModal}></button>
            </div>
            <div className="modal-body">
              <form>
                <label>Name</label>
                <input type="text" name="nombre" className="form-control" value={formData.nombre} onChange={handleChange} required />

                <label>Email</label>
                <input type="email" name="correo" className="form-control" value={formData.correo} onChange={handleChange} required />

                {!isEditing && (
                  <>
                    <label>Password</label>
                    <input type="password" name="password" className="form-control" value={formData.password} onChange={handleChange} required />
                  </>
                )}

                <label>Address</label>
                <input type="text" name="direccion" className="form-control" value={formData.direccion} onChange={handleChange} />

                <label>Image</label>
                <input type="file" className="form-control" onChange={handleFileChange} />
              </form>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={closeModal}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSubmit}>{isEditing ? "Update" : "Add"}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserTable;
