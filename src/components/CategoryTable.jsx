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
    descripcion: "",
  });
  const [modalVisible, setModalVisible] = useState(false); // Inicialmente el modal está cerrado
  const [search, setSearch] = useState("");

  const API = process.env.REACT_APP_API + "categorias.php?endpoint=categoria";

  useEffect(() => {
    loadCategories();
  }, [search]);

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

  const handleEdit = (category) => {
    setSelectedCategory({
      nombre: category.nombre || "",
      estado: category.estado || "",
      imagen: category.imagen || "",
      descripcion: category.descripcion || "",
      idcategoriaweb: category.idcategoriaweb,
    });
    setModalVisible(true);
  };

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

      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Buscar categorías..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

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
      <div
        className={`modal fade ${modalVisible ? "show d-block" : ""}`}
        tabIndex="-1"
        style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        aria-hidden={!modalVisible}
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Editar Categoría</h5>
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
                  ></textarea>
                </div>
              </div>
              <div className="modal-footer">
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
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryTable;
