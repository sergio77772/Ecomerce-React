import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import  SkeletonTable from "./skeleton/SkeletonTable"

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

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10; // Límite de elementos por página
  const limitOthers = 100; // Límite de elementos por página

  const API = process.env.REACT_APP_API + "subcategorias.php?endpoint=subcategoria";
  const API_CATEGORIA = process.env.REACT_APP_API + "categorias.php?endpoint=categoria";

   const [categories, setCategories] = useState([]);
  useEffect(() => {
    loadsubcategoria();
    loadCategoria();
  }, [search, currentPage]);

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

      alert(
        isEditing
          ? "Subcategoria actualizada exitosamente"
          : "Subcategoria creada exitosamente"
      );
      setModalVisible(false);
      loadsubcategoria();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar esta categoria? ")) return;
    try {
      const response = await fetch(`${API}&id=${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Error al eliminar la categoria.");
      }
      alert("SubCategoria eliminada exitosamente");
      loadsubcategoria();
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
      idcategoria: "",
      estado: "",
      imagen: "",
     
    });
    setImageFile(null);
    setIsEditing(false); // Activar modo alta
    setModalVisible(true);
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
              <td>{Category.idcategoria}</td>         
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
