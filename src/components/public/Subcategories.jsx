import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

export default function SubcategoriesList() {
  const { idcategoria } = useParams();
  const navigate = useNavigate();
  const [subcategories, setSubcategories] = useState([]);

  const API_SUBCATEGORIES = process.env.REACT_APP_API + `subcategorias.php?endpoint=subcategoria&idcategoria=${idcategoria}`;

  useEffect(() => {
    fetch(API_SUBCATEGORIES)
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data.subcategoria)) {
          setSubcategories(data.subcategoria);
        } else {
          console.error("Unexpected response structure:", data);
        }
      })
      .catch((error) => console.error("Error fetching subcategories:", error));
  }, [idcategoria]);

  return (
    <div className="container py-5">
      <h2 className="text-center">Subcategorías</h2>
      <div className="row g-4">
        {subcategories.length > 0 ? (
          subcategories.map((subcategory) => (
            <div key={subcategory.idsubcategoria} className="col-md-6 col-lg-4">
              <div className="card border-0 rounded-4 shadow-lg">
                {subcategory.imagen && (
                  <img
                    src={process.env.REACT_APP_BASE_URL + subcategory.imagen}
                    className="card-img-top"
                    alt={subcategory.nombre}
                    style={{ objectFit: "cover", height: "150px" }}
                  />
                )}
                <div className="card-body text-center">
                  <h5 className="card-title">{subcategory.nombre}</h5>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center">Cargando subcategorías...</p>
        )}
      </div>
      <button className="btn btn-primary my-3" onClick={() => navigate(-1)}>
        Volver
      </button>
    </div>
  );
}
