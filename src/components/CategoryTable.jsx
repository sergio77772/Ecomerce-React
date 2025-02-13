import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import  SkeletonTable from "./skeleton/SkeletonTable"
import { mensajeRespuesta, confirmAction } from "../utils/services";


const CategoryTable = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState({
    nombre: "",
    estado: "",
    imagen: "",
    idcategoria:""
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(""); // Estado para el debounce
  const [imageFile, setImageFile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  const API = process.env.REACT_APP_API + "categorias.php?endpoint=categoria";
  const APIB = process.env.REACT_APP_API + "bitacora.php?endpoint=bitacora";

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 800); // Retraso de 500ms

    return () => clearTimeout(handler); // Limpiar el temporizador al desmontar o cuando el search cambie
  }, [search]);

  useEffect(() => {
    loadcategories();
  }, [debouncedSearch, currentPage]);

  const loadcategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${API}&search=${debouncedSearch}&page=${currentPage}&limit=${limit}`
      );
      if (!response.ok) {
        throw new Error("Error al cargar las categorias.");
      }
      const data = await response.json();
      setCategories(data.categories || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      setError(err.message);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 300);
      
    }
  };

  const handleEdit = (Category) => {
    setSelectedCategory({
      nombre: Category.nombre || "",
      estado: Category.estado || "",
      imagen: Category.imagen || "",
      idcategoria: Category.idcategoria,
    });
    setImageFile(null);
    setIsEditing(true);
    setModalVisible(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (imageFile) {
        const formData = new FormData();
        formData.append("image", imageFile);

        const uploadResponse = await fetch(
          `${process.env.REACT_APP_API}categorias.php?endpoint=upload`,
          {
            method: "POST",
            body: formData,
          }
        );

        if (!uploadResponse.ok) {
          throw new Error("Error al subir la imagen.");
        }

        const uploadResult = await uploadResponse.json();
        selectedCategory.imagen = uploadResult.filePath;
      }

      const method = isEditing ? "PUT" : "POST";
      const endpoint = isEditing
        ? `${API}&id=${selectedCategory.idcategoria}`
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
          isEditing
            ? "Error al actualizar la categoria."
            : "Error al crear la categories."

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
    modulo: "CATEGORIA",
    mensaje:`Nombre:  ${selectedCategory.nombre}
            -Estado:  ${selectedCategory.estado}  
            -Imagen:  ${selectedCategory.imagen}  
             -  Metodo: : ${method} 
               ` ,
    imagen:"",
  }),
});
console.log("bitacora",bitacoraResponse);
if (!bitacoraResponse.ok) {
  throw new Error("Error al registrar en la bitácora.");
}



      mensajeRespuesta(
        isEditing
          ? "categoria actualizada exitosamente"
          : "categoria creada exitosamente","success"
      );
      setModalVisible(false);
      loadcategories();
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
      const response = await fetch(`${API}&id=${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Error al eliminar la categoria.");
      }
      mensajeRespuesta("categoria eliminada exitosamente", "success");
      loadcategories();
    } catch (err) {
      mensajeRespuesta(err.message, "error");
    }
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
      estado: "",
      imagen: "",
    });
    setImageFile(null);
    setIsEditing(false);
    setModalVisible(true);
  };
  
    if (loading) {
      return <div className="container mt-4">
      <SkeletonTable rows={5} columns={5} />
      </div>
  
  }

  if (error) {
    return <div className="alert alert-danger text-center">{error}</div>;
  }

  return (
    
    <div className="container mt-4">
      <h1 className="mb-4">Gestión de Categorias</h1>

      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Buscar categoria..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="mb-3 text-end">
        <button className="btn btn-success" onClick={handleCreate}>
          Añadir categoria
        </button>
      </div>

      <table className="table table-striped table-hover">
        <thead className="thead-dark">
          <tr>
            <th>ID</th>
            <th>Descripción</th>
            <th>Estado</th>
            <th>Imagen</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((Category) => (
            <tr key={Category.idcategoria}>
              <td>{Category.idcategoria}</td>
              <td>{Category.nombre}</td>
              <td>{Category.estado}</td>
              <td>
                {Category.imagen && (
                  <img
                    src={process.env.REACT_APP_BASE_URL + Category.imagen}
                    alt={Category.nombre}
                    style={{ width: "50px" }}
                  />
                )}
              </td>
              <td>{Category.acciones}
                <button
                  className="btn btn-warning btn-sm me-2"
                  onClick={() => handleEdit(Category)}
                >
                  Editar
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(Category.idcategoria)}
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
                {isEditing ? "Editar categoria" : "Añadir categoria"}
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
                  {isEditing ? "Guardar Cambios" : "Crear categoria"}
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

export default CategoryTable;
