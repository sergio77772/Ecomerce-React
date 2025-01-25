/* eslint-disable */

import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const BitacoraTable = () => {
  const [bitacora, setbitacora] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState({
    fecha_hora: "",
    usuario: "",
    modulo: "",
    mensaje: "",
    imagen: "",
  
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [search, setSearch] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [isEditing, setIsEditing] = useState(false); // Nueva bandera para distinguir entre alta y edición

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10; // Límite de elementos por página

  const API = process.env.REACT_APP_API + "bitacora.php?endpoint=bitacora";

  useEffect(() => {
    loadbitacora();
  }, [search, currentPage]);

  const loadbitacora = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API}&search=${search}&page=${currentPage}&limit=${limit}`);
      if (!response.ok) {
        throw new Error("Error al cargar las bitacoras.");
      }
      const data = await response.json();
      setbitacora(data.bitacora || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (Bitacora) => {
    setSelectedCategory({
      nombre:Bitacora.fecha_hora || "",
      estado:Bitacora.usuario || "",
      imagen:Bitacora.modulo || "",
      imagen:Bitacora.mensaje || "",
      imagen:Bitacora.imagen || "",

      idbitacora:Bitacora.idbitacora,
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

        const uploadResponse = await fetch(`${process.env.REACT_APP_API}bitacora.php?endpoint=upload`, {
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
        ? `${API}&id=${selectedCategory.idbitacora}`
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
          isEditing ? "Error al actualizar la bitacora." : "Error al crear la bitacora."
        );
      }

      alert(
        isEditing
          ? "bitacora actualizada exitosamente"
          : "bitacora creada exitosamente"
      );
      setModalVisible(false);
      loadbitacora();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar esta bitacora? ")) return;
    try {
      const response = await fetch(`${API}&id=${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Error al eliminar la bitacora.");
      }
      alert("bitacora eliminada exitosamente");
      loadbitacora();
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
      fecha_hora: "",
      usuario: "",
      modulo: "",
      mensaje: "",
      imagen: "",
     
    });
    setImageFile(null);
    setIsEditing(false); // Activar modo alta
    setModalVisible(true);
  };

  if (loading) {
    return <div className="text-center">Cargando bitacora...</div>;
  }

  if (error) {
    return <div className="alert alert-danger text-center">{error}</div>;
  }

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Gestión de bitacoras</h1>

      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Buscar bitacora..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

 {/*     <div className="mb-3 text-end">
        <button className="btn btn-success" onClick={handleCreate}>
          Añadir bitacora
        </button>
      </div>
*/}
      <table className="table table-striped table-hover">
        <thead className="thead-dark">
          <tr>
            <th>ID</th>
            <th>Fecha_hora</th>
            <th>usuario</th>
            <th>modulo</th>
            <th>mensaje</th>
{/*}
      
          
            <th>Acciones</th>
            */}
          </tr>
        </thead>
        <tbody>
          {bitacora.map((Category) => (
            <tr key={Category.idbitacora}>
              <td>{Category.idbitacora}</td>
              <td>{Category.fechahora}</td>             
              <td>{Category.usuario}</td>
              <td>{Category.modulo}</td>
              <td>{Category.mensaje}</td>
          



              <td>
                {Category.imagen && (
                  <img
                    src={process.env.REACT_APP_BASE_URL +Category.imagen}
                    alt={Category.nombre}
                    style={{ width: "50px" }}
                  />
                )}
              </td>
              <td>
                {/*}
                <button
                  className="btn btn-warning btn-sm me-2"
                  onClick={() => handleEdit(Category)}
                >
                  Editar
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(Category.idbitacora)}
                >
                  Eliminar
                </button>
                */}
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
                {isEditing ? "Editar bitacora" : "Añadir bitacora"}
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
                  <label>Fecha_hora</label>
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
                  {isEditing ? "Guardar Cambios" : "Crear bitacora"}
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

export default BitacoraTable;
