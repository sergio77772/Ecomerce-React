import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const MesaTable = () => {
  const [mesa, setmesa] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState({
    nombre: "",
    titulo: "",
    estados: "",
    dias: "",
    estado: "",
    solucion: "",
    imagen: "",
  
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [search, setSearch] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [isEditing, setIsEditing] = useState(false); // Nueva bandera para distinguir entre alta y edición

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10; // Límite de elementos por página

  const API = process.env.REACT_APP_API + "mesa.php?endpoint=mesa";
  const APIB = process.env.REACT_APP_API + "bitacora.php?endpoint=bitacora";

  useEffect(() => {
    loadmesa();
  }, [search, currentPage]);

  const loadmesa = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API}&search=${search}&page=${currentPage}&limit=${limit}`);
      if (!response.ok) {
        throw new Error("Error al cargar las mesa.");
      }
      const data = await response.json();
      setmesa(data.mesa || []);
      console.log("mesa", data);
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
      titulo: category.titulo || "",
      estados: category.estados || "",
      dias: category.dias || "",
      estado: category.estado || "",
      solucion: category.solucion || "",
      imagen: category.imagen || "",
     
    
      idmesa: category.idmesa,
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

        const uploadResponse = await fetch(`${process.env.REACT_APP_API}mesa.php?endpoint=upload`, {
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
        ? `${API}&id=${selectedCategory.idmesa}`
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
          isEditing ? "Error al actualizar la mesa." : "Error al crear la mesa."
        );
      }

// Aquí agregamos la llamada al API de bitácora
const usuario = localStorage.getItem('usuario')|| 'sin usuario';
const bitacoraResponse = await fetch(APIB, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    fechahora: new Date().toISOString(),
    modulo: "MESA DE AYUDA",
    mensaje:`  ${selectedCategory.estado}         
            -  ${selectedCategory.titulo}
            -  ${selectedCategory.nombre} 
            -  ${selectedCategory.estados}
            -  ${selectedCategory.dias}
            -  ${selectedCategory.solucion}`
             ,
    usuario:usuario,
    imagen:"",
  }),
});
console.log("bitacora",bitacoraResponse);
if (!bitacoraResponse.ok) {
  throw new Error("Error al registrar en la bitácora.");
}




      alert(
        isEditing
          ? "mesa actualizada exitosamente"
          : "mesa creada exitosamente"
      );
      setModalVisible(false);
      loadmesa();
    } catch (err) {
      alert(err.message);
    }
  };

  /*const handleDelete = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar esta mesa? ")) return;
    try {
      const response = await fetch(`${API}&id=${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Error al eliminar la mesa.");
      }
      alert("mesa eliminada exitosamente");
      loadmesa();
    } catch (err) {
      alert(err.message);
    }
  };
  */

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleCreate = () => {
    setSelectedCategory({
      nombre: "",
      titulo: "",
      estados: "",
      dias: "",
      estado: "",
      imagen: "",
      solucion: "",
     
    });
    setImageFile(null);
    setIsEditing(false); // Activar modo alta
    setModalVisible(true);
  };

  if (loading) {
    return <div className="text-center">Cargando mesa...</div>;
  }

  if (error) {
    return <div className="alert alert-danger text-center">{error}</div>;
  }

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Gestión de Mesa de Ayuda</h1>

      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Buscar mesa..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="mb-3 text-end">
        <button className="btn btn-success" onClick={handleCreate}>
          Añadir mesa
        </button>
      </div>

      <table className="table table-striped table-hover">
        <thead className="thead-dark">
          <tr>
            <th>ID</th>
            <th>Fecha Hora</th>
            <th>Módulo</th>
            <th>Titulo</th>
            <th>Estado</th>
            <th>Dias</th>
            <th>Imagen</th>
          
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {mesa.map((category) => (
            <tr key={category.idmesa}>
              <td>{category.idmesa}</td>
              <td>{category.fechahora}</td>
              <td>{category.estado}</td>
              <td>{category.titulo}</td>
              <td>{category.estados}</td>
              <td>{category.dias}</td>
             
           
             
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
             {/*   <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(category.idmesa)}
                >
                  Eliminar
                </button>  */}
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
       <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                {isEditing ? "Editar mesa" : "Añadir mesa"}
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => setModalVisible(false)}
              ></button>
            </div>
            <form onSubmit={handleSave}>
           
            <div className="modal-body">
            <div className="row">
                  
                  <div className="col-md-4">
                  <label><strong>Módulo</strong></label>
                  <div className="mb-3" style={{ border: "2px solid black", borderRadius: "10px" }}>               
                  <select
                        className="form-control"
                        id="estado"
                        value={selectedCategory.estado}
                        onChange={(e) =>
                          setSelectedCategory({
                            ...selectedCategory,
                            estado: e.target.value,
                          })
                        }
                      >
                        <option value="">Seleccionar Módulo</option>
                        <option value="Inicio">Inicio</option>
                        <option value="Novedad">Novedad</option>
                        <option value="Contacto">Contacto</option>
                        <option value="Admin/Productos">Admin/Productos</option>
                        <option value="Admin/Categorías">Admin/Categorías</option>
                        <option value="Admin/SubCategoría">Admin/SubCategoria</option>
                        <option value="Admin/Proveedor">Admin/Proveedor</option>
                        <option value="Admin/Usuarios">Admin/Usuarios</option>
                        <option value="Admin/Ordenes">Admin/Ordenes</option>
                        <option value="Admin/Reportes">Admin/Reportes</option>
                        <option value="Admin/Configuración">Admin/Configuración</option>
                        <option value="Admin/Bitácora">Admin/Bitácora</option>
                        <option value="Admin/Mi Comercio">Mi Comercio</option>

                      </select>

                  </div>
                  </div>  
                  <div className="col-md-8">
                  <label><strong>Título</strong></label>
                  <div className="mb-3" style={{ border: "2px solid black", borderRadius: "10px" }}>               
                  <input
                  className="form-control"
                  value={selectedCategory.titulo}
                  onChange={(e) =>
                    setSelectedCategory({ ...selectedCategory, titulo: e.target.value })
                  }
         
                />

                  </div>
                  </div>  

           </div>  
           <div className="row">
                  
                  <div className="col-md-12">
                  <label><strong>Problema</strong></label>
                  <div className="mb-3" style={{ border: "2px solid black", borderRadius: "10px" }}>               
                  <textarea
                  className="form-control"
                  value={selectedCategory.nombre}
                  onChange={(e) =>
                    setSelectedCategory({ ...selectedCategory, nombre: e.target.value })
                  }
                  rows="4" // Puedes ajustar el número de filas según necesites
                />

                  </div>
                  </div>  
                 

           </div>  
           <div className="row">
                  
                  <div className="col-md-12">
                  <label><strong>Ingrese una Imagen para detectar mas rápido el Problema</strong></label>
                  <div className="mb-3" style={{ border: "2px solid black", borderRadius: "10px" }}>               
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
                 

           </div>  



           <div className="row">
                  
                  <div className="col-md-4">
                  <label><strong>Estado(Desarrollador)</strong></label>
                  <div className="mb-3" style={{ border: "2px solid black", borderRadius: "10px" }}>               
                  <select
                        className="form-control"
                        id="estados"
                        value={selectedCategory.estados}
                        onChange={(e) =>
                          setSelectedCategory({
                            ...selectedCategory,
                            estados: e.target.value,
                          })
                        }
                      >
                        <option value="">Seleccionar Estado</option>
                        <option value="Análisis">Análisis</option>
                        <option value="Proceso">Proceso</option>
                        <option value="Nuevo">Nuevo</option>
                        <option value="Terminado">Terminado</option>
                        <option value="Cancelado">Cancelado</option>

                      </select>

                  </div>
                  </div>  
                  <div className="col-md-4">
                  <label><strong>Cant. Días (Desarrollador)</strong></label>
                  <div className="mb-3" style={{ border: "2px solid black", borderRadius: "10px" }}>               
                  <select
                        className="form-control"
                        id="dias"
                        value={selectedCategory.dias}
                        onChange={(e) =>
                          setSelectedCategory({
                            ...selectedCategory,
                            dias: e.target.value,
                          })
                        }
                      >
                        <option value="">Seleccionar Dias</option>
                        <option value="1 días">1 días</option>
                        <option value="2 días">2 días</option>
                        <option value="3 días">3 días</option>
                        <option value="4 días">4 días</option>
                        <option value="5 días">5 días</option>
                        <option value="6 días">6 días</option>
                        <option value="7 días">7 días</option>
                        <option value="8 días">8 días</option>
                        <option value="9 días">9 días</option>
                        <option value="10 días">10 días</option>    




                      </select>

                  </div>
                  </div>  

           </div>  
           <div className="row">
                  
                  <div className="col-md-12">
                  <label><strong>Solución(Desarrollador)</strong></label>
                  <div className="mb-3" style={{ border: "2px solid black", borderRadius: "10px" }}>               
                  <textarea
                  className="form-control"
                  value={selectedCategory.solucion}
                  onChange={(e) =>
                    setSelectedCategory({ ...selectedCategory, solucion: e.target.value })
                  }
                  rows="4" // Puedes ajustar el número de filas según necesites
                />

                  </div>
                  </div>  
                

           </div>  
         

              </div>

              <div className="modal-footer">
                <button type="submit" className="btn btn-primary">
                  {isEditing ? "Guardar Cambios" : "Crear mesa"}
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

export default MesaTable;
