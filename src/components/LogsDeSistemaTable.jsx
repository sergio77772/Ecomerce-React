import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const LogsDeSistemaTable = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const apiUrl = process.env.REACT_APP_API + "read-errors.php"; // URL en el .env

  useEffect(() => {
    fetchLogs();
  }, [page]);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}?page=${page}`);
      const data = await response.json();
      setLogs(data.data);
      setTotalPages(data.total_pages);
    } catch (error) {
      console.error("Error al obtener logs:", error);
      setLogs([]);
    }
    setLoading(false);
  };

  // Generar paginación con solo 5 páginas visibles
  const renderPagination = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let start = Math.max(1, page - Math.floor(maxVisiblePages / 2));
    let end = Math.min(totalPages, start + maxVisiblePages - 1);

    if (end - start < maxVisiblePages - 1) {
      start = Math.max(1, end - maxVisiblePages + 1);
    }

    if (page > 1) {
      pages.push(
        <li key="first" className="page-item">
          <button className="page-link" onClick={() => setPage(1)}>Primero</button>
        </li>
      );
      pages.push(
        <li key="prev" className="page-item">
          <button className="page-link" onClick={() => setPage(page - 1)}>Anterior</button>
        </li>
      );
    }

    for (let i = start; i <= end; i++) {
      pages.push(
        <li key={i} className={`page-item ${page === i ? "active" : ""}`}>
          <button className="page-link" onClick={() => setPage(i)}>{i}</button>
        </li>
      );
    }

    if (page < totalPages) {
      pages.push(
        <li key="next" className="page-item">
          <button className="page-link" onClick={() => setPage(page + 1)}>Siguiente</button>
        </li>
      );
      pages.push(
        <li key="last" className="page-item">
          <button className="page-link" onClick={() => setPage(totalPages)}>Último</button>
        </li>
      );
    }

    return pages;
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Logs del Sistema</h2>

      {loading ? (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      ) : (
        <>
          <div className="table-responsive">
            <table className="table table-striped table-hover">
              <thead className="table-dark">
                <tr>
                  <th>Fecha</th>
                  <th>Nivel</th>
                  <th>Mensaje</th>
                </tr>
              </thead>
              <tbody>
                {logs.length > 0 ? (
                  logs.map((log, index) => (
                    <tr key={index}>
                      <td>{log.date || "N/A"}</td>
                      <td>{log.level}</td>
                      <td>{log.message}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="text-center">
                      No hay registros disponibles.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Paginación con Bootstrap */}
          <nav>
            <ul className="pagination justify-content-center">{renderPagination()}</ul>
          </nav>
        </>
      )}
    </div>
  );
};

export default LogsDeSistemaTable;
