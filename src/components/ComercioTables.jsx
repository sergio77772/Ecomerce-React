import React, { useEffect, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'

const Comercio = () => {
  const [comercios, setComercios] = useState([])
  const [modalOpen, setModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    id: '',
    Nombre: '',
    telefono: '',
    direccion: '',
    email: '',
    imagenes: [],
  })
  const [selectedFiles, setSelectedFiles] = useState(null)

  const API = process.env.REACT_APP_API + 'comercio.php'
  const base = process.env.REACT_APP_BASE_URL

  useEffect(() => {
    fetchComercios()
  }, [])

  const fetchComercios = async () => {
    const response = await fetch(API)
    const data = await response.json()
    setComercios(data)
  }

  const handleEdit = (comercio) => {
    setFormData({
      ...comercio,
      imagenes: JSON.parse(comercio.imagenes || '[]'),
    })
    setModalOpen(true)
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleFileChange = (e) => {
    setSelectedFiles(e.target.files)
  }

  const handleSubmit = async () => {
    const form = new FormData()
    form.append('id', formData.id)
    form.append('Nombre', formData.Nombre)
    form.append('telefono', formData.telefono)
    form.append('direccion', formData.direccion)
    form.append('email', formData.email)

    if (selectedFiles) {
      for (let i = 0; i < selectedFiles.length; i++) {
        form.append('imagenes[]', selectedFiles[i])
      }
    }

    await fetch(API, {
      method: 'POST', // Enviar las imágenes al backend con POST
      body: form,
    })

    await fetch(API, {
      method: 'PUT', // Enviar los demás datos con PUT
      body: new URLSearchParams(formData),
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    })

    setModalOpen(false)
    fetchComercios()
  }

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Administrar Comercios</h1>
      <table className="table table-striped table-bordered table-hover">
        <thead className="thead-dark">
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Teléfono</th>
            <th>Dirección</th>
            <th>Email</th>
            <th>Imágenes</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {comercios.map((comercio) => (
            <tr key={comercio.id}>
              <td>{comercio.id}</td>
              <td>{comercio.Nombre}</td>
              <td>{comercio.telefono}</td>
              <td>{comercio.direccion}</td>
              <td>{comercio.email}</td>
              <td>
                {JSON.parse(comercio.imagenes || '[]').map((img, index) => (
                  <img
                    key={index}
                    src={base + img}
                    alt="Comercio"
                    className="img-thumbnail"
                    style={{ width: '50px' }}
                  />
                ))}
              </td>
              <td>
                <button
                  className="btn btn-primary"
                  onClick={() => handleEdit(comercio)}
                >
                  Editar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {modalOpen && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Editar Comercio</h5>
                <button
                  type="button"
                  className="close"
                  onClick={() => setModalOpen(false)}
                >
                  <span>&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="form-group">
                    <label>Nombre</label>
                    <input
                      className="form-control"
                      name="Nombre"
                      value={formData.Nombre}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Teléfono</label>
                    <input
                      className="form-control"
                      name="telefono"
                      value={formData.telefono}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Dirección</label>
                    <input
                      className="form-control"
                      name="direccion"
                      value={formData.direccion}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input
                      className="form-control"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Imágenes</label>
                    <input
                      className="form-control-file"
                      type="file"
                      multiple
                      onChange={handleFileChange}
                    />
                    <div className="mt-2">
                      {formData.imagenes.map((img, index) => (
                        <img
                          key={index}
                          src={base + img}
                          alt="Comercio"
                          className="img-thumbnail"
                          style={{ width: '50px' }}
                        />
                      ))}
                    </div>
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setModalOpen(false)}
                >
                  Cancelar
                </button>
                <button className="btn btn-primary" onClick={handleSubmit}>
                  Guardar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Comercio
