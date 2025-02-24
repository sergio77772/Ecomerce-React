import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function SubcategoryDetail() {
  const { idsubcategoria } = useParams();
  const navigate = useNavigate();
  const [subcategory, setSubcategory] = useState(null);

  const API_SUBCATEGORY =
    process.env.REACT_APP_API + `subcategorias.php?endpoint=subcategoria&id=${idsubcategoria}`;

  useEffect(() => {
    fetch(API_SUBCATEGORY)
      .then((response) => response.json())
      .then((data) => {
        if (data.idsubcategoria) {
          setSubcategory(data);
        } else {
          console.error('Unexpected response structure:', data);
        }
      })
      .catch((error) => console.error('Error fetching subcategory:', error));
  }, [idsubcategoria]);

  if (!subcategory) {
    return <p className="text-center text-light">Cargando detalles de la subcategoría...</p>;
  }

  return (
    <div className="container-fluid py-5" style={{ backgroundColor: '#4a5568' }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div
              className="card border-0 rounded-4 overflow-hidden shadow-lg"
              style={{
                position: 'relative',
                height: '300px',
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
                className="card-img-overlay d-flex flex-column align-items-center justify-content-center"
                style={{ background: 'rgba(255, 255, 255, 0.6)' }}
              >
                <h2 className="fw-bold text-dark text-center">{subcategory.nombre}</h2>
         
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="text-center mt-4">
        <button className="btn btn-primary" onClick={() => navigate(-1)}>
          Volver
        </button>
      </div>
    </div>
  );
}
