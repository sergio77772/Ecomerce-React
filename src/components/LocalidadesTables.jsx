import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { mensajeRespuesta } from "../utils/services";

const API_URL = "https://distribuidoraassefperico.com.ar/apis-stg/localidades.php";

const LocalidadesTable = () => {
  const [localidades, setLocalidades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedLocalidad, setSelectedLocalidad] = useState({ id: "", nombre: "", precio_envio: "" });
  const [modalVisible, setModalVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1)
  const limit = 10

  useEffect(() => {
    fetchLocalidades();
  }, [currentPage]);

  const fetchLocalidades = async () => {
    try {
      const response = await fetch(API_URL+ `?page=${currentPage}&limit=${limit}`);
      if (!response.ok) throw new Error("Error al cargar localidades");

      const data = await response.json();
      setLocalidades(data.data || []); // Extraer la lista de localidades
      setTotalPages(data.pages || 1); // Extraer el total de páginas desde la API
    } catch (err) {
     setError(err.message);
    } finally {
     setLoading(false);
    }
  };


  const handleAdd = () => {
    setSelectedLocalidad({ id: "", nombre: "", precio_envio: "" });
    setModalVisible(true);
  };

  const handleEdit = (localidad) => {
    setSelectedLocalidad(localidad);
    setModalVisible(true);
  };

  const handleDelete = async (id) => {
    console.log(handleDelete)
    if (!window.confirm("¿Seguro que quieres eliminar esta localidad?")) return;
    try {
      const response = await fetch(`${API_URL}?id=${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Error al eliminar");
      mensajeRespuesta('localidad eliminada exitosamente', 'success')
      fetchLocalidades();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const method = selectedLocalidad.id ? "PUT" : "POST";
    const url = selectedLocalidad.id ? `${API_URL}?id=${selectedLocalidad.id}` : API_URL;

    try {
        const response = await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(selectedLocalidad),
        });

        if (!response.ok) throw new Error("Error al guardar los datos");

        const result = await response.json();
        console.log("Respuesta API:", result);

        setModalVisible(false);
        fetchLocalidades(); // Recargar datos de la API
    } catch (err) {
        alert(err.message);
    }
};

  
const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page)
    }
  }; 

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Lista de Localidades</h2>

      <button className="btn btn-success mb-3" onClick={handleAdd}>
        Agregar Localidad
      </button>

      {loading ? <p>Cargando...</p> : error ? <p className="text-danger">{error}</p> : (
        <>
          <table className="table table-striped">
            <thead className="thead-dark">
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Precio Envío</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
  {localidades.map((localidad, index) => (
    <tr key={localidad.id ? localidad.id : `localidad-${index}`}>
      <td>{localidad.id}</td>
      <td>{localidad.nombre}</td>
      <td>${localidad.precio_envio}</td>
      <td>
        <button className="btn btn-warning btn-sm me-2" onClick={() => handleEdit(localidad)}>
          Editar
        </button>
        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(localidad.id)}>
          Eliminar
        </button>
      </td>
    </tr>
  ))}
</tbody>
          </table>
          

          {/* Paginación */}
          <div className="d-flex justify-content-center align-items-center">
        <button
          className="btn btn-secondary me-2"
          onClick={() => handlePageChange(1)}
          disabled={currentPage === 1}
        >
          Inicio
        </button>
        <button
          className="btn btn-secondary me-2"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Anterior
        </button>

        {[...Array(5)].map((_, index) => {
         let page = currentPage - 2 + index
         if (page < 1 || page > totalPages) return null
        
         return (
            <button
            key={page}
            className={`btn ${page === currentPage ? 'btn-primary' : 'btn-outline-secondary'} mx-1`}
            onClick={() => handlePageChange(page)}
         >
            {page}
         </button>
        )
        })}

        <button
          className="btn btn-secondary ms-2"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Siguiente
        </button>
        <button
          className="btn btn-secondary ms-2"
          onClick={() => handlePageChange(totalPages)}
          disabled={currentPage === totalPages}
        >
          Final
        </button>
      </div>
      </>
      )}

      {/* Modal para agregar/editar localidad */}
      {modalVisible && (
        <div className="modal d-block">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{selectedLocalidad.id ? "Editar Localidad" : "Agregar Localidad"}</h5>
                <button className="btn-close" onClick={() => setModalVisible(false)}></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleSave}>
                  <div className="mb-3">
                    <label className="form-label">Nombre</label>
                    <input type="text" className="form-control" value={selectedLocalidad.nombre} onChange={(e) => setSelectedLocalidad({ ...selectedLocalidad, nombre: e.target.value })} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Precio Envío</label>
                    <input type="number" className="form-control" value={selectedLocalidad.precio_envio} onChange={(e) => setSelectedLocalidad({ ...selectedLocalidad, precio_envio: e.target.value })} required />
                  </div>
                  <button type="submit" className="btn btn-primary">{selectedLocalidad.id ? "Actualizar" : "Guardar"}</button>
                  <button type="button" className="btn btn-secondary ms-2" onClick={() => setModalVisible(false)}>Cancelar</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )}

export default LocalidadesTable;
