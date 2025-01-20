import React, { useEffect, useState } from "react";



const CategoryTable = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState({
    nombre: "",
    estado: "",
    imagen: "",
    descripcion: "",
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
  }, [search]);

  // Cargar categorías desde la API
  const loadCategories = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API}&search=${search}`);
      if (!response.ok) {
       
        throw new Error("Error al cargar las categorías.");
      }

      const data = await response.json();
      setCategories(data.categories || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Mostrar el modal para editar una categoría
  const handleEdit = (category) => {
    // Asegurarse de que no haya valores nulos
    setSelectedCategory({
      nombre: category.nombre || "",
      estado: category.estado || "",
      imagen: category.imagen || "",
      descripcion: category.descripcion || "",
      idcategoriaweb: category.idcategoriaweb,
    });
    setModalVisible(true);
  };

  // Guardar cambios en la categoría
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
      
      
      alert("Categoría actualizada exitosamente");
      setModalVisible(false);
      loadCategories();
    } catch (err) {
      alert(err.message);
    }
  };

  // Eliminar una categoría
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
      descripcion: "",
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

      {/* Campo de búsqueda */}
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Buscar categorías..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Tabla de categorías */}
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
            <tr key={category.idcategoria}>
              <td>{category.idcategoria}</td>
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
              </td>
              <td>{category.descripcion}
                <button
                  className="btn btn-warning btn-sm me-2"
                  onClick={() => handleEdit(category)}
                >
                  Editar
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(category.idcategoria)}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal de edición */}
      {modalVisible && (
        <div className="modal">
          <div className="modal-content">
            <h2>Editar Categoría</h2>
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
                <div className="mb-3">
                  <label>Descripción</label>
                  <textarea
                    className="form-control"
                    value={selectedCategory.descripcion}
                    onChange={(e) =>
                      setSelectedCategory({
                        ...selectedCategory,
                        descripcion: e.target.value,
                      })
                    }
                  ></textarea>
                </div>
              </div>
              <button type="submit" className="btn btn-primary">
                Guardar Cambios
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setModalVisible(false)}
              >
                Cancelar
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryTable;
