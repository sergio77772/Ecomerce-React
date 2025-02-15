import React from 'react'
import { Navigate } from 'react-router-dom'

// Componente que verifica si hay un token en el localStorage
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token') // Obtener el token del localStorage

  // Si no hay token, redirigir al login
  if (!token) {
    return <Navigate to="/login" replace />
  }

  return children // Si hay token, renderizar las rutas hijas (la ruta protegida)
}

export default PrivateRoute
