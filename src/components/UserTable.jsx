import React, { useState, useEffect, useRef } from "react";
import AvatarEditor from "react-avatar-editor";
import "bootstrap/dist/css/bootstrap.min.css";
import SkeletonTable from "./skeleton/SkeletonTable";

const UserTable = () => {
  const [users, setUsers] = useState([]);
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
  const [loading, setLoading] = useState(true);
  const [image, setImage] = useState(null);
  const [zoom, setZoom] = useState(1.2); // Control de zoom
  const editorRef = useRef(null);

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
    if (file) {
      setImage(file);
    }
  };

  const handleSaveImage = () => {
    if (editorRef.current) {
      const canvas = editorRef.current.getImageScaledToCanvas();
      canvas.toBlob((blob) => {
        setFormData((prev) => ({ ...prev, imagen: blob }));
        setImage(null);
      }, "image/png");
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
    setIsEditing(false);
    setFormData({ id: "", nombre: "", correo: "", password: "", direccion: "", imagen: null });
    setImage(null);
  };

  if (loading) {
    return <SkeletonTable rows={5} columns={5} />;
  }

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">User Management</h1>

      <button className="btn btn-primary mb-3" onClick={() => { 
        setIsEditing(false); 
        setModalVisible(true); 
      }}>
        Add User
      </button>

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
          {users.map((user) => (
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

      {modalVisible && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{isEditing ? "Edit User" : "Add User"}</h5>
                <button type="button" className="btn-close" onClick={closeModal}></button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="mb-3">
                    <label className="form-label">Nombre</label>
                    <input type="text" name="nombre" className="form-control" value={formData.nombre} onChange={handleChange} required />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Correo</label>
                    <input type="email" name="correo" className="form-control" value={formData.correo} onChange={handleChange} required />
                  </div>

                  {!isEditing && (
                    <div className="mb-3">
                      <label className="form-label">Contraseña</label>
                      <input type="password" name="password" className="form-control" value={formData.password} onChange={handleChange} required />
                    </div>
                  )}

                  <div className="mb-3">
                    <label className="form-label">Dirección</label>
                    <input type="text" name="direccion" className="form-control" value={formData.direccion} onChange={handleChange} />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Imagen de perfil</label>
                    <input type="file" className="form-control" onChange={handleFileChange} />
                  </div>

                  {image && (
                    <div className="text-center">
                      <AvatarEditor
                        ref={editorRef}
                        image={image}
                        width={150}
                        height={150}
                        border={50}
                        borderRadius={75}
                        scale={zoom}
                      />
                      <input type="range" min="1" max="3" step="0.1" value={zoom} onChange={(e) => setZoom(e.target.value)} />
                      <button className="btn btn-primary mt-2" onClick={handleSaveImage}>Recortar</button>
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default UserTable;
