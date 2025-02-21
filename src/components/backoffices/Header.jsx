import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import { logoutUser } from '../../redux/action/userActions'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const Header = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const usuario = useSelector((state) => state.user.user)

  const handleLogout = () => {
    dispatch(logoutUser()) // Eliminamos usuario del estado global y localStorage
    navigate('/')
  }

  const handleHelp = () => {
    navigate('/') // Redirige a la página de ayuda
  }

  const handleInicio = () => {
    navigate('/') 
  }



  return (
    <nav className="navbar navbar-light bg-light px-3">
      <div className="d-flex align-items-center">
        <img
          src="https://dcdn.mitiendanube.com/stores/463/388/themes/common/logo-1793349326-1632410271-f4dafc7dac68ee0fc9a856ef38b439851632410271-480-0.webp"
          alt="Logo"
          height="40"
          className="me-2"
        />
      </div>
      <div className="dropdown">
        <button
          className="btn btn-light dropdown-toggle"
          type="button"
          id="userDropdown"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          {usuario?.foto ? (
            <img
              src={process.env.REACT_APP_BASE_URL + usuario.foto}
              alt="Usuario"
              className="rounded-circle me-2"
              style={{ width: 35, height: 35, objectFit: 'cover' }}
            />
          ) : (
            <img
              src={process.env.REACT_APP_BASE_URL + '/img/user/profile.png'}
              alt="Usuario"
              className="rounded-circle me-2"
              style={{ width: 35, height: 35, objectFit: 'cover' }}
            />
          )}

          {usuario?.nombre}
        </button>
        <ul
          className="dropdown-menu dropdown-menu-end"
          aria-labelledby="userDropdown"
        >
          <li>
            <button className="dropdown-item" onClick={handleHelp}>
              <i className="fa fa-user"></i> Mis datos
            </button>
          </li>

          <li>
            <button className="dropdown-item" onClick={handleHelp}>
              <i className="fa fa-question-circle"></i> Ayuda
            </button>
          </li>

          <li>
            <button className="dropdown-item" onClick={handleInicio}>
              <i className="fa fa-home"></i> Inicio
            </button>
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
    </nav>
  )
}

export default Header
