import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../redux/action/userActions";
import { motion } from "framer-motion";
import { useCookies } from "react-cookie"; // 🔹 Importamos react-cookie

const Navbar = () => {
  const state = useSelector((state) => state.handleCart);
  const usuario = useSelector((state) => state.user.user);
  const orders = useSelector((state) => state.orders.orders) || [];
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const baseURL = process.env.REACT_APP_BASE_URL;

  const [cookies, setCookie] = useCookies(["shakeDismissed"]); // 🔹 Cookie para la animación
  const [isShaking, setIsShaking] = useState(false);

  useEffect(() => {
    if (!cookies.shakeDismissed) {
      setIsShaking(true);
    }
  }, [cookies.shakeDismissed]);

  const handleDropdownClick = () => {
    setIsShaking(false);
    setCookie("shakeDismissed", true, { path: "/", maxAge: 86400 }); // Guardar en cookie por 1 día
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white py-3 sticky-top">
      <div className="container">
        {/* 🔹 Logo */}
        <NavLink className="navbar-brand px-2" to="/">
          <img
            src="https://dcdn.mitiendanube.com/stores/463/388/themes/common/logo-1793349326-1632410271-f4dafc7dac68ee0fc9a856ef38b439851632410271-480-0.webp"
            alt="Logo"
            style={{ height: 50 }}
          />
        </NavLink>

        {/* 🔹 Menú */}
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav m-auto my-2 text-center">
            <li className="nav-item">
              <NavLink className="nav-link text-dark" to="/">Inicio</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link text-dark" to="/product">Novedades</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link text-dark" to="/about">Nosotros</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link text-dark" to="/contact">Contacto</NavLink>
            </li>
            {(usuario?.idRol === 1 || usuario?.idRol === 2) && (
              <li className="nav-item">
                <NavLink className="nav-link text-dark" to="/admin/dashboard">
                  Backoffices
                </NavLink>
              </li>
            )}
          </ul>

          {/* 🔹 Botones de Usuario */}
          <div className="buttons text-center d-flex align-items-center">
            {!usuario ? (
              <>
                <NavLink to="/login" className="btn btn-outline-dark m-2">
                  <i className="fa fa-sign-in-alt mr-1"></i> Ingreso
                </NavLink>
                <NavLink to="/register" className="btn btn-outline-dark m-2">
                  <i className="fa fa-user-plus mr-1"></i> Registrate
                </NavLink>
              </>
            ) : (
              <div className="dropdown">
                <motion.button
                  className="btn btn-outline-dark dropdown-toggle d-flex align-items-center"
                  type="button"
                  id="userDropdown"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  onClick={handleDropdownClick}
                  animate={isShaking ? { x: [-5, 5, -5, 5, 0] } : {}}
                  transition={{ duration: 0.8 }}
                >
                  <img
                    src={`${baseURL}${usuario.foto}`}
                    alt="Usuario"
                    className="rounded-circle me-2"
                    style={{ width: 35, height: 35, objectFit: "cover" }}
                  />
                  {usuario?.nombre || "Usuario"}
                </motion.button>

                <ul className="dropdown-menu dropdown-menu-end p-3 custom-dropdown" aria-labelledby="userDropdown">
                  <li>
                    <NavLink className="dropdown-item" to="/account">
                      <i className="fa fa-user"></i> Mis Datos
                    </NavLink>
                  </li>
                  <li>
                    <NavLink className="dropdown-item d-flex justify-content-between align-items-center" to="/orders">
                      <i className="fa fa-shopping-bag"></i> Mis Pedidos
                      {orders.length > 0 && (
                        <span className="badge bg-danger ms-2">{orders.length}</span>
                      )}
                    </NavLink>
                  </li>
                  {(usuario?.idRol === 1 || usuario?.idRol === 2) && (
                    <li>
                      <NavLink className="dropdown-item" to="/admin/dashboard">
                        <i className="fa fa-cog"></i> Backoffices
                      </NavLink>
                    </li>
                  )}

                  <li><hr className="dropdown-divider" /></li>

                  <li>
                    <button className="dropdown-item text-danger" onClick={handleLogout}>
                      <i className="fa fa-sign-out-alt"></i> Cerrar Sesión
                    </button>
                  </li>
                </ul>
              </div>
            )}

            {/* 🔹 Carrito */}
            <NavLink to="/cart" className="btn btn-outline-dark m-2">
              <i className="fa fa-shopping-cart mr-1"></i> Carro ({state.length})
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
