import React from 'react'
import ReactDOM from 'react-dom/client'
import '../node_modules/font-awesome/css/font-awesome.min.css'
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from './redux/store'

import {
  Home,
  Product,
  Products,
  AboutPage,
  ContactPage,
  Cart,
  Login,
  Register,
  Checkout,
  PageNotFound,
  Account,
  Orders,
} from "./pages";
import AdminProducts from "./pages/admin/AdminProducts"; // Ajusta la ruta según tu estructura
import AdminCategory  from "./pages/admin/AdminCategory"; // Ajusta la ruta según tu estructura
import AdminProveedor  from "./pages/admin/AdminProveedor"; 
import AdminSubCategory  from "./pages/admin/AdminSubCategory";
import  AdminDashboard from "./pages/admin/AdminDashboard" ;
import  AdminReportes from "./pages/admin/AdminReportes" ;//dashboard de administracion
import AdminBitacora from "./pages/admin/AdminBitacora";
import AdminMesa from "./pages/admin/AdminMesa";
import ScrollToTop from "./components/ScrollToTop";
import { Toaster } from "react-hot-toast";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminLogsDeSistema from "./pages/admin/AdminLogsDeSistema";
import AdminOdenes from "./pages/admin/AdminOrdenes";
import AdminComercio from "./pages/admin/AdminComercio";
import AdminVenta from "./pages/admin/AdminVenta";
import AdminCliente from "./pages/admin/AdminCliente";
import AdminLocalidades from "./pages/admin/AdminLocalidades";
const token = localStorage.getItem('token')
const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <BrowserRouter>
    <ScrollToTop>
      <Provider store={store}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/account" element={<Account />} />

          <Route path="/product" element={<Products />} />
          <Route path="/product/:id" element={<Product />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/orders" element={<Orders />} />

          <Route path="/admin/productos" element={token ? <AdminProducts /> : <Navigate to="/login" />} />
          <Route path="/admin/categorias"  element={token ? <AdminCategory /> : <Navigate to="/login" />} />
          <Route path="/admin/proveedores" element={token ? <AdminProveedor /> : <Navigate to="/login" />} />
          <Route path="/admin/subcategorias"  element={token ? <AdminSubCategory /> : <Navigate to="/login" />} />
          <Route path="/admin/dashboard" element={token ? <AdminDashboard /> : <Navigate to="/login" />} />
          <Route path="/admin/reportes" element={token ? <AdminReportes /> : <Navigate to="/login" />} />
          <Route path="/admin/users" element={token ? <AdminUsers /> : <Navigate to="/login" />} />
          <Route path="/admin/bitacora" element ={<AdminBitacora/>} />
          <Route path="/admin/mesa" element ={<AdminMesa/>} />
          <Route path="/admin/comercio" element ={<AdminComercio/>} />
          <Route path="/admin/venta" element ={<AdminVenta/>} />    
          <Route path="/admin/cliente" element ={<AdminCliente/>} />
          <Route path="/admin/logsDeSistema" element = {<AdminLogsDeSistema/>} />
          <Route path="/admin/ordenes" element = { <AdminOdenes/> } />
          <Route path="/product/*" element= {<PageNotFound />} />
        </Routes>
      </Provider>
    </ScrollToTop>
    <Toaster />
  </BrowserRouter>
)
