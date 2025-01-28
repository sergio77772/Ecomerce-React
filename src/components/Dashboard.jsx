import React from "react";

const Dashboard = () => {
  const adminMenus = [
    { title: "Productos", icon: "bi-box", link: "/admin/productos" },
    { title: "Categorías", icon: "bi-tags", link: "/admin/categorias" },
    { title: "SubCategorias", icon: "bi-tags", link: "/admin/subcategorias" },
    { title: "provedores", icon: "bi-tags", link: "/admin/proveedor" },
   

    { title: "Usuarios", icon: "bi-people", link: "/admin/users" },
    { title: "Órdenes", icon: "bi-cart", link: "/admin/Ordenes" },
    { title: "Reportes", icon: "bi-graph-up", link: "/reports" },
    { title: "Configuración", icon: "bi-gear", link: "/settings" },
    { title: "Bitácora", icon: "bi-journal", link: "/admin/bitacora" },
    { title: "Registro  ", icon: "bi-file-earmark-text", link: "/admin/logsdesistema" }
  ];

  return (
    <>
      <div className="container my-4">
        <h1 className="text-center mb-4">Panel de Administración</h1>
        <div className="row g-4">
          {adminMenus.map((menu, index) => (
            <div className="col-md-4 col-sm-6" key={index}>
              <a href={menu.link} className="text-decoration-none">
                <div className="card text-center shadow-sm h-100">
                  <div className="card-body">
                    <i className={`bi ${menu.icon} display-4 text-primary mb-3`}></i>
                    <h5 className="card-title">{menu.title}</h5>
                  </div>
                </div>
              </a>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
