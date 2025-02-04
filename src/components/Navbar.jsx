import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

const Navbar = () => {
    const state = useSelector(state => state.handleCart)
    const token = localStorage.getItem('token') // Obtener el token del localStorage
    const navigate = useNavigate() // Usamos useNavigate para redirigir al usuario
    const comercio = useSelector((state) => state.comercio.comercio);
    const cartItems = useSelector(state => state.handleCart);
    const totalItems = cartItems.reduce((total, item) => total + item.qty, 0);
    const handleLogout = () => {
        // Eliminar el token del localStorage
        localStorage.removeItem('token')
        // Redirigir al usuario a la página de inicio (o cualquier otra página)
        navigate('/');
    }

    

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light py-3 sticky-top">
            <div className="container">
                <NavLink className="navbar-brand fw-bold fs-4 px-2" to="/">{comercio.Nombre}</NavLink>

                <button className="navbar-toggler mx-2" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav m-auto my-2 text-center">
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/">Inicio </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/product">Novedades</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/about">Nosostros</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/contact">Contacto</NavLink>
                        </li>

                        {/* Mostrar solo si hay token */}
                        {token && (
                            <li className="nav-item">
                                <NavLink className="nav-link" to="/admin/dashboard">Administración</NavLink>
                            </li>
                        )}
                    </ul>
                    <div className="buttons text-center">
                    {!token && (
                        <>
                        <NavLink to="/login" className="btn btn-outline-dark m-2"><i className="fa fa-sign-in-alt mr-1"></i> Ingreso</NavLink>
                        <NavLink to="/register" className="btn btn-outline-dark m-2"><i className="fa fa-user-plus mr-1"></i> Registrate</NavLink></>
                    )}
                      {token && (
                        <>
                        <button onClick={handleLogout} className="btn btn-outline-dark m-2"><i className="fa fa-sign-in-alt mr-1"></i> Cerrar Sesión</button>
                        <NavLink to="/register" className="btn btn-outline-dark m-2"><i className="fa fa-user-plus mr-1"></i> Mi Cuenta</NavLink></>
                    )}

                            <NavLink to="/cart" className="btn btn-outline-dark m-2"><i className="fa fa-shopping-cart mr-1"></i> Carro ({totalItems})
                        </NavLink>
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar
