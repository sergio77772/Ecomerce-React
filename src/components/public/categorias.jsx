import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  const API_CATEGORIES = process.env.REACT_APP_API + "categorias.php?endpoint=categoria&search=&page=1&limit=100";

  useEffect(() => {
    fetch(API_CATEGORIES)
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

  const handleCategoryClick = (idcategoria) => {
    navigate(`/subcategorias/${idcategoria}`);
  };

  return (
    <div className="container-fluid py-5" style={{ backgroundColor: "#4a5568" }}>
      <div className="container">
        <div className="row g-4">
          {categories.length > 0 ? (
            categories.map((category) => (
              <div key={category.idcategoria} className="col-md-6 col-lg-4">
                <div
                  className="card border-0 rounded-4 overflow-hidden shadow-lg"
                  style={{ position: "relative", height: "180px", transition: "transform 0.3s ease-in-out", cursor: "pointer" }}
                  onClick={() => handleCategoryClick(category.idcategoria)}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                >
                  {category.imagen && (
                    <img
                      src={process.env.REACT_APP_BASE_URL + category.imagen}
                      className="card-img"
                      alt={category.nombre}
                      style={{ filter: "grayscale(80%)", objectFit: "cover", height: "100%", width: "100%" }}
                    />
                  )}
                  <div className="card-img-overlay d-flex align-items-center justify-content-center" style={{ background: "rgba(255, 255, 255, 0.5)" }}>
                    <h5 className="fw-bold text-dark text-center">{category.nombre}</h5>
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
