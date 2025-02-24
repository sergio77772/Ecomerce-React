import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function BreadcrumbNavigation({ category, subcategory }) {
  const navigate = useNavigate();

  return (
    <div className="container my-3">
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
        <li className="breadcrumb-item">
  <button
    onClick={() => navigate('/')}
    className="text-dark fw-bold text-uppercase bg-transparent border-0 p-0"
    style={{ textDecoration: "none", cursor: "pointer" }}
  >
    {category}
  </button>
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
