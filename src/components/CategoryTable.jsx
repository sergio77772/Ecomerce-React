import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const CategoryTable = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState({
    nombre: "",
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

  const API = process.env.REACT_APP_API + "categorias.php?endpoint=categoria";

  useEffect(() => {
    loadCategories();
  }, [search, currentPage]);

  const loadCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API}&search=${search}&page=${currentPage}&limit=${limit}`);
      if (!response.ok) {
        throw new Error("Error al cargar las categorías.");
      }
      const data = await response.json();
      setCategories(data.categories || []);
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
      estado: category.estado || "",
      imagen: category.imagen || "",
    
      idcategoria: category.idcategoria,
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

        const uploadResponse = await fetch(`${process.env.REACT_APP_API}categorias.php?endpoint=upload`, {
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
        ? `${API}&id=${selectedCategory.idcategoriaweb}`
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
          isEditing ? "Error al actualizar la categoría." : "Error al crear la categoría."
        );
      }

      alert(
        isEditing
          ? "Categoría actualizada exitosamente"
          : "Categoría creada exitosamente"
      );
      setModalVisible(false);
      loadCategories();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar esta categoría?")) return;
    try {
      const response = await fetch(`${API}&id=${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Error al eliminar la categoría.");
      }
      alert("Categoría eliminada exitosamente");
      loadCategories();
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
      estado: "",
      imagen: "",
     
    });
    setImageFile(null);
    setIsEditing(false); // Activar modo alta
    setModalVisible(true);
  };

  if (loading) {
    return <div className="text-center">Cargando categorías...</div>;
  }

  if (error) {
    return <div className="alert alert-danger text-center">{error}</div>;
  }

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Gestión de Categorías</h1>

      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Buscar categorías..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="mb-3 text-end">
        <button className="btn btn-success" onClick={handleCreate}>
          Añadir Categoría
        </button>
      </div>

      <table className="table table-striped table-hover">
        <thead className="thead-dark">
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Estado</th>
            <th>Imagen</th>
          
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category.idcategoriaweb}>
              <td>{category.idcategoriaweb}</td>
              <td>{category.nombre}</td>
              <td>{category.estado}</td>
              <td>
                {category.imagen && (
                  <img
                    src={process.env.REACT_APP_BASE_URL + category.imagen}
                    alt={category.nombre}
                    style={{ width: "50px" }}
                  />
                )}
             
                <button
                  className="btn btn-warning btn-sm me-2"
                  onClick={() => handleEdit(category)}
                >
                  Editar
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(category.idcategoriaweb)}
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
                {isEditing ? "Editar Categoría" : "Añadir Categoría"}
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
                  {isEditing ? "Guardar Cambios" : "Crear Categoría"}
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
