import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import  SkeletonTable from "./skeleton/SkeletonTable"
import { mensajeRespuesta, confirmAction } from "../utils/services";


const SubCategoryTable = () => {
  const [subcategoria, setsubcategoria] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState({

    nombre: "",
    idcategoria:"",
    estado: "",
    imagen: "",
  
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [search, setSearch] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [isEditing, setIsEditing] = useState(false); // Nueva bandera para distinguir entre alta y edición
 const [debouncedSearch, setDebouncedSearch] = useState(""); // Estado para el debounce
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10; // Límite de elementos por página
  const limitOthers = 100; // Límite de elementos por página

  const API = process.env.REACT_APP_API + "subcategorias.php?endpoint=subcategoria";
  const API_CATEGORIA = process.env.REACT_APP_API + "categorias.php?endpoint=categoria";
  const APIB = process.env.REACT_APP_API + "bitacora.php?endpoint=bitacora";

   const [categories, setCategories] = useState([]);
  useEffect(() => {
    loadsubcategoria();
    loadCategoria();
  }, [debouncedSearch, currentPage]);

 useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 800); // Retraso de 500ms

    return () => clearTimeout(handler); // Limpiar el temporizador al desmontar o cuando el search cambie
  }, [search]);




  const loadsubcategoria = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API}&search=${search}&page=${currentPage}&limit=${limit}`);
      if (!response.ok) {
        throw new Error("Error al cargar las SubCategorias.");
      }
      const data = await response.json();
      setsubcategoria(data.subcategoria || []);
      console.log("subcategoria", data);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  const loadCategoria = async () => {
    try {
      const response = await fetch(
        `${API_CATEGORIA}&search=${search}&page=${1}&limit=${limitOthers}`
      );
      if (!response.ok) {
        throw new Error("Error al cargar los categoria.");
      }
      const data = await response.json();
      setCategories(data.categories || []);
    } catch (err) {
      setError(err.message);
    }
  };



  const handleEdit = (Category) => {
    setSelectedCategory({
      nombre: Category.nombre || "",
      idcategoria: Category.idcategoria || "",
      estado: Category.estado || "",
      imagen: Category.imagen || "",
    
      idsubcategoria: Category.idsubcategoria,
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

        const uploadResponse = await fetch(`${process.env.REACT_APP_API}subcategorias.php?endpoint=upload`, {
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
        ? `${API}&id=${selectedCategory.idsubcategoria}`
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
          isEditing ? "Error al actualizar la categoria." : "Error al crear la subcategoria."
        );
      }
// Aquí agregamos la llamada al API de bitácora
const usuario = localStorage.getItem('user')|| 'sin usuario';

const bitacoraResponse =  await fetch(APIB, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    fechahora: new Date().toISOString(),
    usuario:usuario,
    modulo: "SUBCATEGORIA",
    mensaje:`Nombre:  ${selectedCategory.nombre}
            - Estado: ${selectedCategory.estado}  
            - Imagen:  ${selectedCategory.imagen}  
           -  Metodo: : ${method}   ` ,   
    imagen:"",
  }),
});
console.log("bitacora",bitacoraResponse);
if (!bitacoraResponse.ok) {
  throw new Error("Error al registrar en la bitácora.");
}

mensajeRespuesta(
  isEditing ? "Subcategoría actualizada exitosamente" : "Subcategoría creada exitosamente",
  "success"
);
      setModalVisible(false);
      loadsubcategoria();
    } catch (err) {
      mensajeRespuesta(err.message, "error");
    }
  };

  const handleDelete = async (id) => {
    const confirmed = await confirmAction(
      "¿Estás seguro?",
      "Esta acción no se puede deshacer.",
      "Sí, eliminar",
      "Cancelar"
    );
    if (confirmed) {
   
    try {
      const response = await fetch(`${API}&id=${id}`, { method: "DELETE" });
      if (!response.ok) {
        throw new Error("Error al eliminar la categoria.");
    }
      mensajeRespuesta("Producto eliminado exitosamente", "success");
      loadsubcategoria();
    } catch (err) {
      mensajeRespuesta(err.message, "error");
    }
   };
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleCreate = () => {
    setSelectedCategory({
      nombre: "",
      idcategoria: "",
      estado: "",
      imagen: "",
     
    });
    setImageFile(null);
    setIsEditing(false); // Activar modo alta
    setModalVisible(true);
  };

  const getCategoryNameById = (id) => {
    const category = categories.find((cat) => cat.idcategoria === id);
    return category ? category.nombre : "Desconocido";
  };
  const handleToggleEstado = async (Category) => {
    try {
      const nuevoEstado = Category.estado === "Activo" ? "Inactivo" : "Activo";
      setsubcategoria((prevSubcategoria) =>
        prevSubcategoria.map((item) =>
          item.idsubcategoria === Category.idsubcategoria
            ? { ...item, estado: nuevoEstado }
            : item
        )
      );
      const response = await fetch(`${API}&id=${Category.idsubcategoria}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...Category, estado: nuevoEstado }),
      });
  
      if (!response.ok) {
        throw new Error("Error al actualizar el estado de la subcategoría.");
      }
     } catch (error) {
        console.error(error);
      }
    };

  if (loading) { 
    return <SkeletonTable rows={10} columns={5} />;
  }

  if (error) {
    return <div className="alert alert-danger text-center">{error}</div>;
  }

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Gestión de SubCategorias</h1>

      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Buscar SubCategoria..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="mb-3 text-end">
        <button className="btn btn-success" onClick={handleCreate}>
          Añadir SubCategoria
        </button>
      </div>




      <table className="table table-striped table-hover">
        <thead className="thead-dark">
          <tr>
            <th>ID</th>
            <th>Descripción</th>
            <th>Categoria</th>
            <th>Estado</th>
            <th>Imagen</th>
          
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {subcategoria.map((Category) => (
            <tr key={Category.idsubcategoria}>
              <td>{Category.idsubcategoria}</td>
              <td>{Category.nombre}</td>   
              <td>{getCategoryNameById(Category.idcategoria)}</td> 
               
              <td>
              <div
    className="d-inline-block"
    onClick={() => handleToggleEstado(Category)} // Llamar a la función de toggle
    style={{
      width: "50px",
      height: "25px",
      borderRadius: "25px",
      backgroundColor: Category.estado === "Activo" ? "#4CAF50" : "#ccc",
      display: "flex",
      alignItems: "center",
      justifyContent: Category.estado === "Activo" ? "flex-end" : "flex-start",
      padding: "3px",
      cursor: "pointer",
      transition: "all 0.3s ease",
      position: "relative",
      userSelect: "none",
    }}
  >
    <div
      style={{
        width: "20px",
        height: "20px",
        backgroundColor: "#fff",
        borderRadius: "50%",
        boxShadow: "0 0 2px rgba(0, 0, 0, 0.2)",
        transition: "all 0.3s ease",
        position: "absolute",
        left: Category.estado === "Activo" ? "25px" : "3px",
      }}
    ></div>
  </div>
              </td>
              <td>
                {Category.imagen && (
                  <img
                    src={process.env.REACT_APP_BASE_URL + Category.imagen}
                    alt={Category.nombre}
                    style={{ width: "50px" }}
                  />
                )}
              </td>
              <td>
                <button
                  className="btn btn-warning btn-sm me-2"
                  onClick={() => handleEdit(Category)}
                >
                  Editar
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(Category.idsubcategoria)}
                >
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
    let page = currentPage - 2 + index;
    if (page < 1 || page > totalPages) return null; // No mostrar páginas fuera del rango

    return (
      <button
        key={page}
        className={`btn ${page === currentPage ? 'btn-primary' : 'btn-outline-secondary'} mx-1`}
        onClick={() => handlePageChange(page)}
      >
        {page}
      </button>
    );
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
                {isEditing ? "Editar SubCategoria" : "Añadir SubCategoria"}
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => setModalVisible(false)}
              ></button>
            </div>
            <form onSubmit={handleSave}>
              <div className="modal-body">
              <label><strong>Descripción</strong></label>
               
                  <div className="mb-3" style={{ border: "2px solid black", borderRadius: "10px" }}> 
                  <input
                    type="text"
                    className="form-control"
                    value={selectedCategory.nombre}
                    onChange={(e) =>
                      setSelectedCategory({ ...selectedCategory, nombre: e.target.value })
                    }
                  />
                </div>
                <label><strong>ID Categoria</strong></label>
                <div className="mb-3" style={{ border: "2px solid black", borderRadius: "10px" }}> 
               
                <select
                        className="form-control"
                        value={selectedCategory.idcategoria}
                        onChange={(e) =>
                          setSelectedCategory({ ...selectedCategory, idcategoria: e.target.value })
                        }
                      >
                        {categories.map((elemento) => {return (
                          <option key={elemento.idcategoria} value={elemento.idcategoria}>
                            {elemento.nombre}
                          </option>
                        )})}
                      </select>
                </div>



                <label><strong>Estado</strong></label>               
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
                        <option value="">Seleccionar estado</option>
                        <option value="Activo">Activo</option>
                        <option value="Inactivo">Inactivo</option>
                      </select>
                </div>
                <label><strong>Imagen</strong></label>  
               
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
              <div className="modal-footer">
                <button type="submit" className="btn btn-primary">
                  {isEditing ? "Guardar Cambios" : "Crear SubCategoria"}
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

export default SubCategoryTable;
