import React, { useEffect, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import { mensajeRespuesta } from '../utils/services'

const API_URL = 'https://distribuidoraassefperico.com.ar/apis-stg/roles.php'

const RolesTable = () => {
  const [roles, setRoles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedRole, setSelectedRole] = useState({ idRol: '', descripcion: '' })
  const [modalVisible, setModalVisible] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const limit = 10

  useEffect(() => {
    fetchRoles()
  }, [currentPage])

  const fetchRoles = async () => {
    try {
      const response = await fetch(
        `${API_URL}?page=${currentPage}&limit=${limit}`
      )
      if (!response.ok) throw new Error('Error al cargar roles')

      const data = await response.json()
      setRoles(data.data || [])
      setTotalPages(data.pages || 1)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = () => {
    setSelectedRole({ idRol: '', descripcion: '' })
    setModalVisible(true)
  }

  const handleEdit = (role) => {
    setSelectedRole(role)
    setModalVisible(true)
  }

  const handleDelete = async (idRol) => {
    if (!window.confirm('¿Seguro que quieres eliminar este rol?')) return;
  
    try {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
      const urlencoded = new URLSearchParams();
      urlencoded.append("idRol", idRol);
      const requestOptions = {
        method: "DELETE",
        headers: myHeaders,
        body: urlencoded,
        redirect: "follow"
      };
      const response = await fetch(`${API_URL}`, requestOptions);
  
      if (!response.ok) throw new Error('Error al eliminar');

      const result = await response.text(); 
  
      console.log('Respuesta de la API al eliminar:', result);
      mensajeRespuesta('Rol eliminado exitosamente', 'success');
      fetchRoles();
    } catch (err) {
      alert(err.message);
    }
  }
  

  const handleSave = async (e) => {
    e.preventDefault();
  
    const method = selectedRole.idRol ? 'PUT' : 'POST';
    const url = API_URL;
  
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
  
    const urlencoded = new URLSearchParams();
    urlencoded.append("idRol", selectedRole.idRol);
    urlencoded.append("descripcion", selectedRole.descripcion);
  
    const requestOptions = {
      method,
      headers: myHeaders,
      body: urlencoded,
      redirect: "follow",
    };
  
    try {
      const response = await fetch(url, requestOptions);
  
      if (!response.ok) throw new Error('Error al guardar los datos');
  
      mensajeRespuesta('Rol guardado exitosamente', 'success');
      setModalVisible(false);
      
      fetchRoles();
    } catch (err) {
      alert(err.message);
    }
  };
  

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Lista de Roles</h2>

      <button className="btn btn-success mb-3" onClick={handleAdd}>
        Agregar Rol
      </button>

      {loading ? (
        <p>Cargando...</p>
      ) : error ? (
        <p className="text-danger">{error}</p>
      ) : (
        <>
          <table className="table table-striped">
            <thead className="thead-dark">
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {roles.map((role, index) => (
                <tr key={role.idRol ? role.idRol : `role-${index}`}>
                  <td>{role.idRol}</td>
                  <td>{role.descripcion}</td>
                  <td>
                    <button
                      className="btn btn-warning btn-sm me-2"
                      onClick={() => handleEdit(role)}
                    >
                      Editar
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(role.idRol)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

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

      {modalVisible && (
        <div className="modal d-block">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {selectedRole.id ? 'Editar Rol' : 'Agregar Rol'}
                </h5>
                <button
                  className="btn-close"
                  onClick={() => setModalVisible(false)}
                ></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleSave}>
                  <div className="mb-3">
                    <label className="form-label">Nombre</label>
                    <input
                      type="text"
                      className="form-control"
                      value={selectedRole.descripcion}
                      onChange={(e) =>
                        setSelectedRole({
                          ...selectedRole,
                          descripcion: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-primary">
                    {selectedRole.idRol ? 'Actualizar' : 'Guardar'}
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary ms-2"
                    onClick={() => setModalVisible(false)}
                  >
                    Cancelar
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default RolesTable
