import React, { useEffect, useState } from "react";

const ProductTable = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1); // Página actual
  const [search, setSearch] = useState(""); // Término de búsqueda
  const [totalPages, setTotalPages] = useState(1); // Total de páginas disponibles

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
         console.log(data)
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

  if (loading) {
    return <div className="text-center">Cargando productos...</div>;
  }

  if (error) {
    return <div className="alert alert-danger text-center">{error}</div>;
  }

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Gestión de Productos</h1>

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
            <th>Nombre</th>
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
                  onClick={() => alert(`Editar producto: ${product.CODIGOARTICULO}`)}
                >
                  Editar
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => alert(`Borrar producto: ${product.CODIGOARTICULO}`)}
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
