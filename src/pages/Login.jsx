import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { loginUser,getUserByemail,SetUserGoogle } from '../redux/action/userActions'
import { Footer, Navbar } from '../components'
import { GoogleAuthProvider, signInWithPopup, getAuth } from 'firebase/auth'
import 'bootstrap/dist/css/bootstrap.min.css' // Estilos de Bootstrap
import 'bootstrap/dist/js/bootstrap.bundle.min.js' // JS de Bootstrap
import { mensajeRespuesta } from '../utils/services'
import { app } from "../firebase";

const Login = () => {
  const [correo, setCorreo] = useState('')
  const [password, setPassword] = useState('')
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading, error } = useSelector((state) => state.user) // Estado global del usuario
  const auth = getAuth(app) // Inicializa Firebase Auth

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

  // Login con Google
  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider()
    try {
      const result = await signInWithPopup(auth, provider)
      let correo  = result.user.email;
      let  nombre = result.user.displayName;
      const resultado2 = await dispatch(getUserByemail(correo)) 
      if (resultado2) {
        console.log(resultado2.id)
        let id = resultado2.id;
        let idRol = resultado2.idRol;
        let direccion = resultado2.direccion || "Sin dirección";
        let foto = resultado2.foto || null; // Imagen por defecto si no hay foto
        let fotoGoogle=result.user.photoURL
        let token ="+++"
        // Construcción del objeto con los datos del usuario
        const data = {
          correo,
          nombre,
          id,
          idRol,
          direccion,
          foto,
          fotoGoogle,
          token
        };
      
        // Despachar la acción con los datos
        await dispatch(SetUserGoogle(data));
      }


      navigate('/') // Redirigir al usuario después del login
    } catch (error) {
      console.error('Error en autenticación con Google:', error)
      mensajeRespuesta('Error al iniciar sesión con Google', 'error')
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
                  <Link to="/register" className="text-decoration-underline text-info">
                    Regístrate
                  </Link>
                </p>
              </div>
              <div className="text-center">
                <button className="my-2 mx-auto btn btn-dark" type="submit" disabled={loading}>
                  {loading ? 'Cargando...' : 'Entrar'}
                </button>
                <button
                  type="button"
                  className="my-2 mx-auto btn btn-outline-primary"
                  onClick={handleGoogleLogin}
                >
                  <i className="fab fa-google"></i> Iniciar sesión con Google
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
