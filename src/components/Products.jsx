import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { addCart } from "../redux/action";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const Products = () => {
  const [products, setProducts] = useState([]); // Productos obtenidos de la API
  const [loading, setLoading] = useState(false); // Estado de carga
  const [search, setSearch] = useState(""); // Estado para la búsqueda
  const [page, setPage] = useState(1); // Página actual
  const [totalPages, setTotalPages] = useState(1); // Total de páginas para la paginación

  const dispatch = useDispatch();

  const addProduct = (product) => {
    if (product?.descripcion) {
      dispatch(addCart(product));
      toast.success(`${product.descripcion} añadido al carrito!`);
    } else {
      toast.error("Error al añadir el producto.");
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API}productos.php?endpoint=producto&search=${search}&page=${page}&limit=20` // Cambiar el límite a 40
        );
        const data = await response.json();

        console.log("Respuesta de la API:", data); // Verificar estructura en consola

        if (Array.isArray(data.producto)) {
          setProducts(data.producto);
          // Asumir que la respuesta incluye el número total de páginas
          setTotalPages(data.totalPages || 1); // Cambiar según lo que devuelva la API
        } else {
          console.error("La API no devolvió un array en 'producto'.");
          setProducts([]);
        }
      } catch (error) {
        console.error("Error al cargar los productos:", error);
        toast.error("No se pudieron cargar los productos.");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [search, page]); // Ejecutar la búsqueda y paginación cuando cambie alguno de estos valores

  const handleSearchChange = (e) => {
    setSearch(e.target.value); // Actualiza el estado de búsqueda
    setPage(1); // Resetea la página a la 1 cuando se realiza una búsqueda
  };

  const Loading = () => (
    <>
      <div className="col-12 py-5 text-center">
        <Skeleton height={40} width={560} />
      </div>
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="col-md-4 col-sm-6 col-12 mb-4">
          <Skeleton height={400} />
        </div>
      ))}
    </>
  );

  const ShowProducts = () => (
    <>
      {products.length === 0 ? (
        <div className="col-12 text-center">
          <p>No se encontraron productos.</p>
        </div>
      ) : (
        products.map((product) => (
          <div key={product.idproducto} className="col-md-4 col-sm-6 col-xs-12 mb-4">
            <div className="card text-center h-100">
              <img
                className="card-img-top p-3"
                src={`${process.env.REACT_APP_BASE_URL}`+product.imagen}
                alt={product.descripcion}
                height={300}
              />
              <div className="card-body">
                <h5 className="card-title">{product.descripcion}</h5>
                <p className="card-text">${parseFloat(product.precioventa).toFixed(2)}</p>
                <button
                  className="btn btn-outline-dark btn-sm"
                  onClick={() => addProduct(product)}
                >
                  Añadir al carrito
                </button>
                <Link
                  to={`/products/${product.idproducto}`}
                  className="btn btn-dark btn-sm ml-2"
                >
                  Ver detalles
                </Link>
              </div>
            </div>
          </div>
        ))
      )}
    </>
  );

  // Función para cambiar de página
  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  return (
    <div className="container my-4">
      {/* Barra de búsqueda */}
      <div className="row mb-4">
        <div className="col-12">
          <input
            type="text"
            className="form-control"
            placeholder="Buscar productos..."
            value={search}
            onChange={handleSearchChange}
          />
        </div>
      </div>

      {/* Mostrar productos o carga */}
      <div className="row">{loading ? <Loading /> : <ShowProducts />}</div>

      {/* Paginación */}
      <div className="row mt-4">
        <div className="col-12 text-center">
          <button
            className="btn btn-outline-dark"
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
          >
            Anterior
          </button>
          <span className="mx-3">
            Página {page} de {totalPages}
          </span>
          <button
            className="btn btn-outline-dark"
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages}
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
};

export default Products;
