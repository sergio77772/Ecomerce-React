import React, { useEffect, useState } from "react";

const ProductTable = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1); // Página actual
  const [search, setSearch] = useState(""); // Término de búsqueda
  const [totalPages, setTotalPages] = useState(1); // Total de páginas disponibles

  const [form, setForm] = useState({ CODIGOARTICULO: "", DESCRIPCION: "", precio: "" }); // Estado del formulario
  const [editing, setEditing] = useState(false); // Estado de edición

  const API = process.env.REACT_APP_API || "https://distribuidoraassefperico.com.ar/apis/";

  const LIMIT = 20; // Productos por página

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);

      try {
        // Construir la URL con los parámetros de paginación y búsqueda
        const url = `${API}admProductos.php?endpoint=productos&page=${page}&limit=${LIMIT}&search=${search}`;
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error("Error al cargar los productos.");
        }

        const data = await response.json();
        setProducts(data.products || []); // Los productos
        setTotalPages(data.totalPages || 1); // Total de páginas
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [API, page, search]); // Volver a cargar los datos cuando cambien la página o el término de búsqueda

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1); // Reiniciar a la primera página al buscar
  };

  const handlePrevPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await fetch(`${API}admProductos.php?endpoint=productos/${form.CODIGOARTICULO}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        });
      } else {
        await fetch(`${API}admProductos.php?endpoint=productos`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        });
      }
      setForm({ CODIGOARTICULO: "", DESCRIPCION: "", precio: "" });
      setEditing(false);
      setProducts();
    } catch (error) {
      setError("Error al guardar el producto.");
    }
  };

  const handleEdit = (product) => {
    setForm(product);
    setEditing(true);
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`${API}admProductos.php?endpoint=productos/${id}`, {
        method: "DELETE",
      });
      setProducts();
    } catch (error) {
      setError("Error al eliminar el producto.");
    }
  };

  if (loading) {
    return <div className="text-center">Cargando productos...</div>;
  }

  if (error) {
    return <div className="alert alert-danger text-center">{error}</div>;
  }

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Gestión de Productos</h1>

      {/* Formulario ABM */}
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            name="CODIGOARTICULO"
            placeholder="Código del Artículo"
            value={form.CODIGOARTICULO}
            onChange={handleChange}
            disabled={editing}
            required
          />
        </div>
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            name="DESCRIPCION"
            placeholder="Descripción"
            value={form.DESCRIPCION}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <input
            type="number"
            className="form-control"
            name="precio"
            placeholder="Precio"
            value={form.precio}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          {editing ? "Actualizar" : "Agregar"} Producto
        </button>
      </form>

      {/* Campo de búsqueda */}
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Buscar productos..."
          value={search}
          onChange={handleSearchChange}
        />
      </div>

      {/* Tabla de productos */}
      <table className="table table-striped table-hover">
        <thead className="thead-dark">
          <tr>
            <th>Código</th>
            <th>Descripción</th>
            <th>Precio</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.CODIGOARTICULO}>
              <td>{product.CODIGOARTICULO}</td>
              <td>{product.DESCRIPCION}</td>
              <td>${product.precio || "N/A"}</td>
              <td>
                <button
                  className="btn btn-warning btn-sm me-2"
                  onClick={() => handleEdit(product)}
                >
                  Editar
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(product.CODIGOARTICULO)}
                >
                  Borrar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Controles de paginación */}
      <div className="d-flex justify-content-between align-items-center">
        <button
          className="btn btn-primary"
          onClick={handlePrevPage}
          disabled={page === 1}
        >
          Anterior
        </button>
        <span>
          Página {page} de {totalPages}
        </span>
        <button
          className="btn btn-primary"
          onClick={handleNextPage}
          disabled={page === totalPages}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default ProductTable;

