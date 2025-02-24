import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function BreadcrumbNavigation({ category, subcategory }) {
  const navigate = useNavigate();

  return (
    <div className="container my-3">
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <a
             
              onClick={(e) => {
                e.preventDefault();
                navigate('/');
              }}
              className="text-dark fw-bold text-uppercase"
            >
              {category}
            </a>
          </li>
          {subcategory && (
            <li className="breadcrumb-item active text-dark" aria-current="page">
              {subcategory}
            </li>
          )}
        </ol>
      </nav>
      <hr className="border-warning" />
    
    </div>
  );
}
