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
  }); // Valores iniciales seguros para evitar `null`
  const [modalVisible, setModalVisible] = useState(false); // Controlar el modal de edición
  const [search, setSearch] = useState(""); // Término de búsqueda

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
      idcategoriaweb: category.idcategoriaweb, // Asegurarse de pasar el ID
    });
    setModalVisible(true);
  };

  // Guardar cambios en la categoría
  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API}&id=${selectedCategory.idcategoriaweb}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(selectedCategory),
      });
      if (!response.ok) {
        throw new Error("Error al actualizar la categoría.");
      }
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
            <th>Descripción</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category.idcategoriaweb}>
              <td>{category.idcategoriaweb}</td>
              <td>{category.nombre}</td>
              <td>{category.estado}</td>
              <td>{category.imagen}</td>
              <td>{category.descripcion}</td>
              <td>
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

      {/* Modal de edición */}
      {modalVisible && (
        <div className="modal">
          <div className="modal-content">
            <h2>Editar Categoría</h2>
            <form onSubmit={handleSave}>
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
                <input
                  type="text"
                  className="form-control"
                  value={selectedCategory.imagen}
                  onChange={(e) =>
                    setSelectedCategory({ ...selectedCategory, imagen: e.target.value })
                  }
                />
              </div>
              <div className="mb-3">
                <label>Descripción</label>
                <textarea
                  className="form-control"
                  value={selectedCategory.descripcion}
                  onChange={(e) =>
                    setSelectedCategory({ ...selectedCategory, descripcion: e.target.value })
                  }
                />
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
