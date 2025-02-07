import React, { useEffect } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchComercio } from "../redux/action";

const Home = () => {
  const dispatch = useDispatch();
  const comercio = useSelector((state) => state.comercio.comercio);
  const base = process.env.REACT_APP_BASE_URL;

  useEffect(() => {
    if (!comercio || Object.keys(comercio).length === 0) {
      dispatch(fetchComercio()); // Llamar solo si no hay datos
    }
  }, [dispatch, comercio]); 

  // Si no hay imágenes, mostrar mensaje de carga
  if (!comercio || !comercio.imagenes) {
    return <p className="text-center">Cargando imágenes...</p>;
  }

  let imagenes = [];
  try {
    // Convertir la cadena JSON en un array real
    imagenes = JSON.parse(comercio.imagenes).map((img) =>
      img.replace(/^\/img\//, `${base}/img/`)
    );
  } catch (error) {
    console.error("Error al parsear las imágenes:", error);
  }

  // Configuración del carrusel
  const responsive = {
    superLargeDesktop: { breakpoint: { max: 4000, min: 1024 }, items: 1 },
    desktop: { breakpoint: { max: 1024, min: 768 }, items: 1 },
    tablet: { breakpoint: { max: 768, min: 464 }, items: 1 },
    mobile: { breakpoint: { max: 464, min: 0 }, items: 1 },
  };

  return (
    <div className="container mt-4">
      <Carousel responsive={responsive} infinite autoPlay autoPlaySpeed={3000}>
        {imagenes.map((img, index) => (
          <div key={index} className="p-2">
            <img
              src={img}
              alt={`Imagen ${index + 1}`}
              className="img-fluid rounded"
              style={{ maxHeight: "400px", objectFit: "cover", width: "100%" }}
            />
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default Home;
