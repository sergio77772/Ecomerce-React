import React, { useEffect, useState } from "react";


const ProductTable = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API =process.env.REACT_APP_API+"productos.php?endpoint=productos&page=1&limit=10";
 console.log(API)
  useEffect(() => {
    // Función para obtener productos de la API
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${API}`);
        if (!response.ok) {
          throw new Error("Error al cargar los productos.");
        }
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [API]);

  if (loading) {
    return <div className="text-center">Cargando productos...</div>;
  }

  if (error) {
    return <div className="alert alert-danger text-center">{error}</div>;
  }

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Gestión de Productos</h1>
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
            <tr key={product.id}>
              <td>{product.CODIGOARTICULO}</td>
              <td>{product.DESCRIPCION}</td>
              <td>${product.precio}</td>
              <td>
                <button
                  className="btn btn-warning btn-sm me-2"
                  onClick={() => alert(`Editar producto: ${product.id}`)}
                >
                  Editar
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => alert(`Borrar producto: ${product.id}`)}
                >
                  Borrar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;
