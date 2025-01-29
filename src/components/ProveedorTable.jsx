import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import  SkeletonTable from "./skeleton/SkeletonTable"

const ProveedorTable = () => {
  const [proveedor, setproveedor] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedprovee, setSelectedprovee] = useState({
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

  const handleEdit = (provee) => {
    setSelectedprovee({
      nombre: provee.nombre || "",
      cuit: provee.cuit || "",
      iva: provee.iva || "",  
      telefono: provee.telefono || "",
      telefono1: provee.telefono1 || "",
      fax: provee.fax || "",
      direccion: provee.direccion || "",
      email: provee.email || "",
      banco: provee.banco || "",
      tipocuenta: provee.tipocuenta || "",
      cbu: provee.cbu || "",
      provincia: provee.provincia || "",
      estado: provee.estado || "",
      imagen: provee.imagen || "",
    
      idproveedor: provee.idproveedor,
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
        selectedprovee.imagen = uploadResult.filePath;
      }

      const method = isEditing ? "PUT" : "POST"; // Diferenciar entre edición y creación
      const endpoint = isEditing
        ? `${API}&id=${selectedprovee.idproveedor}`
        : `${API}`;

      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(selectedprovee),
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
    setSelectedprovee({
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
    return <div className="text-center">
      <SkeletonTable rows={5} columns={5} />
    </div>;
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
          {proveedor.map((provee) => (
            <tr key={provee.idproveedor}>
              <td>{provee.idproveedor}</td>
              <td>{provee.nombre}</td>
              <td>{provee.cuit}</td>
              <td>{provee.iva}</td>
              <td>{provee.telefono}</td>
              <td>{provee.telefono1}</td>
              <td>{provee.fax}</td>
              <td>{provee.direccion}</td>
              <td>{provee.email}</td>
              <td>{provee.banco}</td>
              <td>{provee.tipocuenta}</td>
              <td>{provee.cbu}</td>
              <td>{provee.provincia}</td>
              <td>{provee.estado}</td>
              <td>
                {provee.imagen && (
                  <img
                    src={process.env.REACT_APP_BASE_URL + provee.imagen}
                    alt={provee.nombre}
                    style={{ width: "50px" }}
                  />
                )}
              </td>
              <td>
                <button
                  className="btn btn-warning btn-sm me-2"
                  onClick={() => handleEdit(provee)}
                >
                  Editar
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(provee.idproveedor)}
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
                    value={selectedprovee.nombre}
                    onChange={(e) =>
                      setSelectedprovee({ ...selectedprovee, nombre: e.target.value })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label>Cuit</label>
                  <input
                    type="text"
                    className="form-control"
                    value={selectedprovee.cuit}
                    onChange={(e) =>
                      setSelectedprovee({ ...selectedprovee, cuit: e.target.value })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label>iva</label>
                  <input
                    type="text"
                    className="form-control"
                    value={selectedprovee.iva}
                    onChange={(e) =>
                      setSelectedprovee({ ...selectedprovee, iva: e.target.value })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label>telefono</label>
                  <input
                    type="text"
                    className="form-control"
                    value={selectedprovee.telefono}
                    onChange={(e) =>
                      setSelectedprovee({ ...selectedprovee, telefono: e.target.value })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label>telefono1</label>
                  <input
                    type="text"
                    className="form-control"
                    value={selectedprovee.telefono1}
                    onChange={(e) =>
                      setSelectedprovee({ ...selectedprovee, telefono1: e.target.value })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label>fax</label>
                  <input
                    type="text"
                    className="form-control"
                    value={selectedprovee.fax}
                    onChange={(e) =>
                      setSelectedprovee({ ...selectedprovee, fax: e.target.value })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label>direccion</label>
                  <input
                    type="text"
                    className="form-control"
                    value={selectedprovee.direccion}
                    onChange={(e) =>
                      setSelectedprovee({ ...selectedprovee, direccion: e.target.value })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label>email</label>
                  <input
                    type="text"
                    className="form-control"
                    value={selectedprovee.email}
                    onChange={(e) =>
                      setSelectedprovee({ ...selectedprovee, email: e.target.value })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label>banco</label>
                  <input
                    type="text"
                    className="form-control"
                    value={selectedprovee.banco}
                    onChange={(e) =>
                      setSelectedprovee({ ...selectedprovee, banco: e.target.value })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label>tipocuenta</label>
                  <input
                    type="text"
                    className="form-control"
                    value={selectedprovee.tipocuenta}
                    onChange={(e) =>
                      setSelectedprovee({ ...selectedprovee, tipocuenta: e.target.value })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label>cbu</label>
                  <input
                    type="text"
                    className="form-control"
                    value={selectedprovee.cbu}
                    onChange={(e) =>
                      setSelectedprovee({ ...selectedprovee, cbu: e.target.value })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label>provincia</label>
                  <input
                    type="text"
                    className="form-control"
                    value={selectedprovee.provincia}
                    onChange={(e) =>
                      setSelectedprovee({ ...selectedprovee, provincia: e.target.value })
                    }
                  />
                </div>

                <div className="mb-3">
                  <label>Estado</label>
                  <input
                    type="text"
                    className="form-control"
                    value={selectedprovee.estado}
                    onChange={(e) =>
                      setSelectedprovee({ ...selectedprovee, estado: e.target.value })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label>Imagen</label>
                  {selectedprovee.imagen && (
                    <div className="mb-2">
                      <img
                        src={process.env.REACT_APP_BASE_URL + selectedprovee.imagen}
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
