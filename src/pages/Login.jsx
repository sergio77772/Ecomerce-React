import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { loginUser } from '../redux/action/userActions'
import { Footer, Navbar } from '../components'
import 'bootstrap/dist/css/bootstrap.min.css' // Estilos de Bootstrap
import 'bootstrap/dist/js/bootstrap.bundle.min.js' // JS de Bootstrap
import { mensajeRespuesta } from '../utils/services'

const Login = () => {
  const [correo, setCorreo] = useState('')
  const [password, setPassword] = useState('')
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { loading, error } = useSelector((state) => state.user) // Estado global del usuario

  // Manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault()
    const resultado = await dispatch(loginUser({ correo, password })) // Llamar a la acción de Redux
    if (resultado.success) {
      navigate('/')
    } else {
      mensajeRespuesta('Los datos ingresados son incorrectos', 'error')
      console.error(resultado.message)
    }
  }

  return (
    <>
      <Navbar />
      <div className="container my-3 py-3">
        <h1 className="text-center">Ingreso</h1>
        <hr />
        <div className="row my-4 h-100">
          <div className="col-md-4 col-lg-4 col-sm-8 mx-auto">
            <form onSubmit={handleSubmit}>
              {error && (
                <div className="alert alert-danger text-center" role="alert">
                  {error}
                </div>
              )}
              <div className="my-3">
                <label htmlFor="email">Correo electrónico</label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  placeholder="name@example.com"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  required
                />
              </div>
              <div className="my-3">
                <label htmlFor="password">Contraseña</label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  placeholder="Contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="my-3">
                <p>
                  ¿Nuevo aquí?{' '}
                  <Link
                    to="/register"
                    className="text-decoration-underline text-info"
                  >
                    Regístrate
                  </Link>
                </p>
              </div>
              <div className="text-center">
                <button
                  className="my-2 mx-auto btn btn-dark"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? 'Cargando...' : 'Entrar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default Login
