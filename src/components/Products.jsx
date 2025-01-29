import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { addCart } from "../redux/action";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const Products = () => {
  const [products, setProducts] = useState([]); // Estado inicial vacío
  const [loading, setLoading] = useState(false);

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
          `${process.env.REACT_APP_API}productos.php?endpoint=producto&search=&page=1&limit=30`
        );
        const data = await response.json();

        console.log("Respuesta de la API:", data); // Verificar estructura en consola

        // Asegurar que data.producto sea un array antes de asignarlo
        if (Array.isArray(data.producto)) {
          setProducts(data.producto);
        } else {
          console.error("La API no devolvió un array en 'producto'.");
          setProducts([]); // Evita errores en el .map()
        }
      } catch (error) {
        console.error("Error al cargar los productos:", error);
        toast.error("No se pudieron cargar los productos.");
        setProducts([]); // Evitar .map() sobre datos inválidos
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

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
                src={ `${process.env.REACT_APP_BASE_URL}`+product.imagen}
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

  return (
    <div className="container my-4">
      <div className="row">{loading ? <Loading /> : <ShowProducts />}</div>
    </div>
  );
};

export default Products;
