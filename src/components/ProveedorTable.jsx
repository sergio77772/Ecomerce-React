import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const ProveedorTable = () => {
  const [proveedor, setproveedor] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState({
    nombre: "",
    cuit: "",
    iva: "",
    telefono: "",
    telefono1: "",
    fax: "",
    direccion: "",
    email: "",
    banco: "",
    tipocuenta: "",
    cbu: "",     
    provincia: "",
    estado: "",
    imagen: "",
  
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [search, setSearch] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [isEditing, setIsEditing] = useState(false); // Nueva bandera para distinguir entre alta y edición

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10; // Límite de elementos por página

  const API = process.env.REACT_APP_API + "proveedor.php?endpoint=proveedor";

  useEffect(() => {
    loadproveedor();
  }, [search, currentPage]);

  const loadproveedor = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API}&search=${search}&page=${currentPage}&limit=${limit}`);
      if (!response.ok) {
        throw new Error("Error al cargar las Proveedor.");
      }
      const data = await response.json();
      setproveedor(data.proveedor || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (category) => {
    setSelectedCategory({
      nombre: category.nombre || "",
      cuit: category.cuit || "",
      iva: category.iva || "",  
      telefono: category.telefono || "",
      telefono1: category.telefono1 || "",
      fax: category.fax || "",
      direccion: category.direccion || "",
      email: category.email || "",
      banco: category.banco || "",
      tipocuenta: category.tipocuenta || "",
      cbu: category.cbu || "",
      provincia: category.provincia || "",
      estado: category.estado || "",
      imagen: category.imagen || "",
    
      idproveedor: category.idproveedor,
    });
    setImageFile(null);
    setIsEditing(true); // Activar modo edición
    setModalVisible(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (imageFile) {
        const formData = new FormData();
        formData.append("image", imageFile);

        const uploadResponse = await fetch(`${process.env.REACT_APP_API}proveedor.php?endpoint=upload`, {
          method: "POST",
          body: formData,
        });

        if (!uploadResponse.ok) {
          throw new Error("Error al subir la imagen.");
        }

        const uploadResult = await uploadResponse.json();
        selectedCategory.imagen = uploadResult.filePath;
      }

      const method = isEditing ? "PUT" : "POST"; // Diferenciar entre edición y creación
      const endpoint = isEditing
        ? `${API}&id=${selectedCategory.idproveedor}`
        : `${API}`;

      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(selectedCategory),
      });

      if (!response.ok) {
        throw new Error(
          isEditing ? "Error al actualizar la Proveedor." : "Error al crear la Proveedor."
        );
      }

      alert(
        isEditing
          ? "Proveedor actualizada exitosamente"
          : "Proveedor creada exitosamente"
      );
      setModalVisible(false);
      loadproveedor();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar esta Proveedor? ")) return;
    try {
      const response = await fetch(`${API}&id=${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Error al eliminar la Proveedor.");
      }
      alert("Proveedor eliminada exitosamente");
      loadproveedor();
    } catch (err) {
      alert(err.message);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleCreate = () => {
    setSelectedCategory({
      nombre: "",
      cuit: "",
      iva: "",
      telefono: "",
      telefono1: "",
      fax: "",
      direccion: "",
      email: "",
      banco: "",
      tipocuenta: "",
      cbu: "",     
      provincia: "",
      estado: "",
      imagen: "",
     
    });
    setImageFile(null);
    setIsEditing(false); // Activar modo alta
    setModalVisible(true);
  };

  if (loading) {
    return <div className="text-center">Cargando Proveedor...</div>;
  }

  if (error) {
    return <div className="alert alert-danger text-center">{error}</div>;
  }

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Gestión de Proveedor</h1>

      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Buscar Proveedor..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="mb-3 text-end">
        <button className="btn btn-success" onClick={handleCreate}>
          Añadir Proveedor
        </button>
      </div>

      <table className="table table-striped table-hover">
        <thead className="thead-dark">
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Cuit</th>
            <th>Iva</th>
            <th>Telefono</th>
            <th>Telefono1</th>
            <th>Fax</th>
            <th>Direccion</th>
            <th>Email</th>
            <th>Banco</th>
            <th>Tipocuenta</th>
            <th>Cbu</th>
            <th>Provincia</th>
            <th>Estado</th>
            <th>Imagen</th>
          
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {proveedor.map((category) => (
            <tr key={category.idproveedor}>
              <td>{category.idproveedor}</td>
              <td>{category.nombre}</td>
              <td>{category.cuit}</td>
              <td>{category.iva}</td>
              <td>{category.telefono}</td>
              <td>{category.telefono1}</td>
              <td>{category.fax}</td>
              <td>{category.direccion}</td>
              <td>{category.email}</td>
              <td>{category.banco}</td>
              <td>{category.tipocuenta}</td>
              <td>{category.cbu}</td>
              <td>{category.provincia}</td>
              <td>{category.estado}</td>
              <td>
                {category.imagen && (
                  <img
                    src={process.env.REACT_APP_BASE_URL + category.imagen}
                    alt={category.nombre}
                    style={{ width: "50px" }}
                  />
                )}
              </td>
              <td>
                <button
                  className="btn btn-warning btn-sm me-2"
                  onClick={() => handleEdit(category)}
                >
                  Editar
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(category.idproveedor)}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Paginación */}
      <div className="d-flex justify-content-center">
        <button
          className="btn btn-secondary me-2"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Anterior
        </button>
        <span className="align-self-center">
          Página {currentPage} de {totalPages}
        </span>
        <button
          className="btn btn-secondary ms-2"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Siguiente
        </button>
      </div>

      {/* Modal */}
      <div
        className={`modal fade ${modalVisible ? "show d-block" : ""}`}
        tabIndex="-1"
        style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        aria-hidden={!modalVisible}
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                {isEditing ? "Editar Proveedor" : "Añadir Proveedor"}
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => setModalVisible(false)}
              ></button>
            </div>
            <form onSubmit={handleSave}>
              <div className="modal-body">
                <div className="mb-3">
                  <label>Nombre</label>
                  <input
                    type="text"
                    className="form-control"
                    value={selectedCategory.nombre}
                    onChange={(e) =>
                      setSelectedCategory({ ...selectedCategory, nombre: e.target.value })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label>Cuit</label>
                  <input
                    type="text"
                    className="form-control"
                    value={selectedCategory.cuit}
                    onChange={(e) =>
                      setSelectedCategory({ ...selectedCategory, cuit: e.target.value })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label>iva</label>
                  <input
                    type="text"
                    className="form-control"
                    value={selectedCategory.iva}
                    onChange={(e) =>
                      setSelectedCategory({ ...selectedCategory, iva: e.target.value })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label>telefono</label>
                  <input
                    type="text"
                    className="form-control"
                    value={selectedCategory.telefono}
                    onChange={(e) =>
                      setSelectedCategory({ ...selectedCategory, telefono: e.target.value })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label>telefono1</label>
                  <input
                    type="text"
                    className="form-control"
                    value={selectedCategory.telefono1}
                    onChange={(e) =>
                      setSelectedCategory({ ...selectedCategory, telefono1: e.target.value })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label>fax</label>
                  <input
                    type="text"
                    className="form-control"
                    value={selectedCategory.fax}
                    onChange={(e) =>
                      setSelectedCategory({ ...selectedCategory, fax: e.target.value })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label>direccion</label>
                  <input
                    type="text"
                    className="form-control"
                    value={selectedCategory.direccion}
                    onChange={(e) =>
                      setSelectedCategory({ ...selectedCategory, direccion: e.target.value })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label>email</label>
                  <input
                    type="text"
                    className="form-control"
                    value={selectedCategory.email}
                    onChange={(e) =>
                      setSelectedCategory({ ...selectedCategory, email: e.target.value })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label>banco</label>
                  <input
                    type="text"
                    className="form-control"
                    value={selectedCategory.banco}
                    onChange={(e) =>
                      setSelectedCategory({ ...selectedCategory, banco: e.target.value })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label>tipocuenta</label>
                  <input
                    type="text"
                    className="form-control"
                    value={selectedCategory.tipocuenta}
                    onChange={(e) =>
                      setSelectedCategory({ ...selectedCategory, tipocuenta: e.target.value })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label>cbu</label>
                  <input
                    type="text"
                    className="form-control"
                    value={selectedCategory.cbu}
                    onChange={(e) =>
                      setSelectedCategory({ ...selectedCategory, cbu: e.target.value })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label>provincia</label>
                  <input
                    type="text"
                    className="form-control"
                    value={selectedCategory.provincia}
                    onChange={(e) =>
                      setSelectedCategory({ ...selectedCategory, provincia: e.target.value })
                    }
                  />
                </div>

                <div className="mb-3">
                  <label>Estado</label>
                  <input
                    type="text"
                    className="form-control"
                    value={selectedCategory.estado}
                    onChange={(e) =>
                      setSelectedCategory({ ...selectedCategory, estado: e.target.value })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label>Imagen</label>
                  {selectedCategory.imagen && (
                    <div className="mb-2">
                      <img
                        src={process.env.REACT_APP_BASE_URL + selectedCategory.imagen}
                        alt="Vista previa"
                        style={{ width: "100px", height: "auto", marginBottom: "10px" }}
                      />
                    </div>
                  )}
                  <input
                    type="file"
                    className="form-control"
                    onChange={(e) => setImageFile(e.target.files[0])}
                  />
                </div>
             
              </div>
              <div className="modal-footer">
                <button type="submit" className="btn btn-primary">
                  {isEditing ? "Guardar Cambios" : "Crear Proveedor"}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setModalVisible(false)}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProveedorTable;
