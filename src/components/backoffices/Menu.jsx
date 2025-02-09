import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const Sidebar = () => {
  const [openDropdown, setOpenDropdown] = useState(null);

  const toggleDropdown = (menu) => {
    setOpenDropdown(openDropdown === menu ? null : menu);
  };

  const menus = [
    { title: "Inicio", icon: "bi-house", link: "/admin/dashboard" },
    {
      title: "Catálogo",
      icon: "bi-box-seam",
      submenus: [
        { title: "Productos", icon: "bi-box", link: "/admin/productos" },
        { title: "Categorías", icon: "bi-tags", link: "/admin/categorias" },
        { title: "Subcategorías", icon: "bi-tags", link: "/admin/subcategorias" },
        { title: "Proveedores", icon: "bi-person-circle", link: "/admin/proveedores" },
      ],
    },
    { title: "Diseño", icon: "bi-palette", link: "/admin/diseno" },
    { title: "Ventas", icon: "bi-cart", link: "/admin/ventas" },
    { title: "Clientes", icon: "bi-people", link: "/admin/clientes" },
    { title: "Marketing", icon: "bi-megaphone", link: "/admin/marketing" },
    {
      title: "Sistema",
      icon: "bi-gear",
      submenus: [
        { title: "Usuarios", icon: "bi-person", link: "/admin/users" },
        { title: "Órdenes", icon: "bi-cart-check", link: "/admin/ordenes" },
        { title: "Bitácora", icon: "bi-journal", link: "/admin/bitacora" },
        { title: "Registro", icon: "bi-file-earmark-text", link: "/admin/logsdesistema" },
        { title: "Mi Comercio", icon: "bi-house-gear", link: "/admin/comercio" },
        { title: "Mesa de Ayuda", icon: "bi-info-circle-fill", link: "/admin/mesa" },
      ],
    },
    { title: "Reportes", icon: "bi-graph-up", link: "/admin/reportes" },
  ];

  return (
    <div className="bg-dark text-white vh-100 p-3">
      <h4 className="text-center">NAVEGACIÓN</h4>
      <ul className="nav flex-column">
        {menus.map((menu, index) => (
          <li key={index} className="nav-item">
            {menu.submenus ? (
              <div>
                <button
                  className="nav-link text-white d-flex justify-content-between w-100"
                  onClick={() => toggleDropdown(menu.title)}
                >
                  <span>
                    <i className={`bi ${menu.icon} me-2`}></i>
                    {menu.title}
                  </span>
                  <i className={`bi ${openDropdown === menu.title ? "bi-chevron-up" : "bi-chevron-down"}`}></i>
                </button>
                {openDropdown === menu.title && (
                  <ul className="list-unstyled ms-3">
                    {menu.submenus.map((submenu, subIndex) => (
                      <li key={subIndex}>
                        <a href={submenu.link} className="nav-link text-white">
                          <i className={`bi ${submenu.icon} me-2`}></i>
                          {submenu.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ) : (
              <a href={menu.link} className="nav-link text-white">
                <i className={`bi ${menu.icon} me-2`}></i>
                {menu.title}
              </a>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;