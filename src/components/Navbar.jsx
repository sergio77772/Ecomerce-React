import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../redux/action/userActions";

const Navbar = () => {
  const state = useSelector((state) => state.handleCart);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const usuario = useSelector((state) => state.user.user);
  const orders = useSelector((state) => state.orders.orders) || [];

  const baseURL = process.env.REACT_APP_BASE_URL;

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark py-3 sticky-top">
      <div className="container">
        {/* 🔹 Logo */}
        <NavLink className="navbar-brand px-2" to="/">
          <img
            src="https://dcdn.mitiendanube.com/stores/463/388/themes/common/logo-1793349326-1632410271-f4dafc7dac68ee0fc9a856ef38b439851632410271-480-0.webp"
            alt="Logo"
            style={{ height: 50 }}
          />
        </NavLink>

        {/* 🔹 Botón para móviles */}
        <button
          className="navbar-toggler mx-2"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* 🔹 Menú */}
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav m-auto my-2 text-center">
            <li className="nav-item">
              <NavLink className="nav-link text-white" to="/">
                Inicio
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link text-white" to="/product">
                Novedades
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link text-white" to="/about">
                Nosotros
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link text-white" to="/contact">
                Contacto
              </NavLink>
            </li>
            {(usuario?.idRol === 1 || usuario?.idRol === 2) && (
              <li className="nav-item">
                <NavLink className="nav-link text-white" to="/admin/dashboard">
                  Administración
                </NavLink>
              </li>
            )}
          </ul>

          {/* 🔹 Botones de Usuario */}
          <div className="buttons text-center d-flex align-items-center">
            {!token ? (
              <>
                <NavLink to="/login" className="btn btn-outline-light m-2">
                  <i className="fa fa-sign-in-alt mr-1"></i> Ingreso
                </NavLink>
                <NavLink to="/register" className="btn btn-outline-light m-2">
                  <i className="fa fa-user-plus mr-1"></i> Registrate
                </NavLink>
              </>
            ) : (
              <div className="dropdown">
                <button
                  className="btn btn-outline-light dropdown-toggle d-flex align-items-center"
                  type="button"
                  id="userDropdown"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <img
                    src={`${baseURL}${usuario.foto}`}
                    alt="Usuario"
                    className="rounded-circle me-2"
                    style={{ width: 35, height: 35, objectFit: "cover" }}
                  />
                  {usuario?.nombre || "Usuario"}
                </button>
                <ul
                  className="dropdown-menu dropdown-menu-end p-3 custom-dropdown"
                  aria-labelledby="userDropdown"
                >
                  <li>
                    <NavLink className="dropdown-item" to="/account">
                      <i className="fa fa-user"></i> Mis Datos
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      className="dropdown-item d-flex justify-content-between align-items-center"
                      to="/orders"
                    >
                      <i className="fa fa-shopping-bag"></i> Mis Pedidos
                      {orders.length > 0 && (
                        <span className="badge bg-danger ms-2">
                          {orders.length}
                        </span>
                      )}
                    </NavLink>
                  </li>
                  <li>
                    <NavLink className="dropdown-item" to="/settings">
                      <i className="fa fa-cog"></i> Configuración
                    </NavLink>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <button
                      className="dropdown-item text-danger"
                      onClick={handleLogout}
                    >
                      <i className="fa fa-sign-out-alt"></i> Cerrar Sesión
                    </button>
                  </li>
                </ul>
              </div>
            )}

            {/* 🔹 Carrito */}
            <NavLink to="/cart" className="btn btn-outline-light m-2">
              <i className="fa fa-shopping-cart mr-1"></i> Carro ({state.length})
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
