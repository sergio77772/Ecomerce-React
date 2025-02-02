import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Categories() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch("https://distribuidoraassefperico.com.ar/apis/categorias.php?endpoint=categoria&search=&page=1&limit=100")
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data.categories)) {
          setCategories(data.categories);
        } else {
          console.error("Unexpected response structure:", data);
        }
      })
      .catch((error) => console.error("Error fetching categories:", error));
  }, []);

  return (
    <div className="container-fluid py-5" style={{ backgroundColor: "#4a5568" }}>
      <div className="container">
        <div className="row g-4">
          {Array.isArray(categories) && categories.length > 0 ? (
            categories.map((category) => (
              <div key={category.idcategoria} className="col-md-6 col-lg-4">
                <div
                  className="card border-0 rounded-4 overflow-hidden shadow-lg"
                  style={{ position: "relative", height: "180px", transition: "transform 0.3s ease-in-out" }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
                  onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
                >
                  {category.imagen && (
                    <img
                      src={'https://distribuidoraassefperico.com.ar/'+category.imagen}
                      className="card-img"
                      alt={category.nombre}
                      style={{ filter: "grayscale(80%)", objectFit: "cover", height: "100%", width: "100%" }}
                    />
                  )}
                  <div
                    className="card-img-overlay d-flex align-items-center justify-content-center"
                    style={{ background: "rgba(255, 255, 255, 0.5)" }}
                  >
                    <h5 className="fw-bold text-dark text-center">
                       <br /> {category.nombre}
                    </h5>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-light">Cargando categorías...</p>
          )}
        </div>
      </div>
    </div>
  );
}
