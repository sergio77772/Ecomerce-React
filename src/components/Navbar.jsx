import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logoutUser } from '../redux/action/userActions' // Acción para cerrar sesión

const Navbar = () => {
  const state = useSelector((state) => state.handleCart)
  const token = localStorage.getItem('token')
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const comercio = useSelector((state) => state.comercio.comercio)
  const usuario = useSelector((state) => state.user.user)
  const orders = useSelector((state) => state.orders.orders) || []

  const baseURL = process.env.REACT_APP_BASE_URL

  const handleLogout = () => {
    dispatch(logoutUser()) // Eliminamos usuario del estado global y localStorage
    navigate('/')
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light py-3 sticky-top">
      <div className="container">
        <NavLink className="navbar-brand fw-bold fs-4 px-2" to="/">
          {comercio.Nombre}
        </NavLink>

        <button
          className="navbar-toggler mx-2"
          type="button"
          data-toggle="collapse"
          data-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav m-auto my-2 text-center">
            <li className="nav-item">
              <NavLink className="nav-link" to="/">
                Inicio
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/product">
                Novedades
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/about">
                Nosotros
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/contact">
                Contacto
              </NavLink>
            </li>
            {usuario?.idRol === 1 && (
              <li className="nav-item">
                <NavLink className="nav-link" to="/admin/dashboard">
                  Administración
                </NavLink>
              </li>
            )}
          </ul>

          <div className="buttons text-center d-flex align-items-center">
            {!token ? (
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
                <button
                  className="btn btn-outline-dark dropdown-toggle d-flex align-items-center"
                  type="button"
                  id="userDropdown"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <img
                    src={`${baseURL}${usuario.foto}`}
                    alt="Usuario"
                    className="rounded-circle me-2"
                    style={{ width: 35, height: 35, objectFit: 'cover' }}
                  />

                  {usuario?.nombre || 'Usuario'}
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
                        <span className="badge bg-danger ms-2">{orders.length}</span>
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

            <NavLink to="/cart" className="btn btn-outline-dark m-2">
              <i className="fa fa-cart-shopping mr-1"></i> Carro ({state.length})
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
