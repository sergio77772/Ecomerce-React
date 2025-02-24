import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function SubcategoriesList() {
  const { idcategoria } = useParams();
  const navigate = useNavigate();
  const [subcategories, setSubcategories] = useState([]);

  const API_SUBCATEGORIES =
    process.env.REACT_APP_API +
    `subcategorias.php?endpoint=subcategoria&idcategoria=${idcategoria}`;

  useEffect(() => {
    fetch(API_SUBCATEGORIES)
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data.subcategoria)) {
          setSubcategories(data.subcategoria);
        } else {
          console.error('Unexpected response structure:', data);
        }
      })
      .catch((error) => console.error('Error fetching subcategories:', error));
  }, [idcategoria]);

  return (
    <div className="container-fluid py-5" style={{ backgroundColor: '#4a5568' }}>
      <div className="container">
        <div className="row g-4">
          {subcategories.length > 0 ? (
            subcategories.map((subcategory) => (
              <div key={subcategory.idsubcategoria} className="col-md-6 col-lg-4">
                <div
                  className="card border-0 rounded-4 overflow-hidden shadow-lg"
                  style={{
                    position: 'relative',
                    height: '180px',
                    transition: 'transform 0.3s ease-in-out',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                >
                  {subcategory.imagen && (
                    <img
                      src={process.env.REACT_APP_BASE_URL + subcategory.imagen}
                      className="card-img"
                      alt={subcategory.nombre}
                      style={{
                        filter: 'grayscale(80%)',
                        objectFit: 'cover',
                        height: '100%',
                        width: '100%',
                      }}
                    />
                  )}
                  <div
                    className="card-img-overlay d-flex align-items-center justify-content-center"
                    style={{ background: 'rgba(255, 255, 255, 0.5)' }}
                  >
                    <h5 className="fw-bold text-dark text-center">{subcategory.nombre}</h5>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-light">Cargando subcategorías...</p>
          )}
        </div>
      </div>
      <button className="btn btn-primary my-3" onClick={() => navigate(-1)}>
        Volver
      </button>
    </div>
  );
}
