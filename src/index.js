import React from "react";
import ReactDOM from "react-dom/client";
import "../node_modules/font-awesome/css/font-awesome.min.css";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./redux/store";

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
} from "./pages";
import AdminProducts from "./pages/admin/AdminProducts"; // Ajusta la ruta según tu estructura
import AdminCategory  from "./pages/admin/AdminCategory"; // Ajusta la ruta según tu estructura
import AdminProveedor  from "./pages/admin/AdminProveedor"; // Ajusta la ruta según tu estructura
import AdminSubCategory  from "./pages/admin/AdminSubCategory";
import  AdminDashboard from "./pages/admin/AdminDashboard" ;//dashboard de administracion
import AdminBitacora from "./pages/admin/AdminBitacora";
import ScrollToTop from "./components/ScrollToTop";
import { Toaster } from "react-hot-toast";
import AdminUsers from "./pages/admin/AdminUsers";
const token = localStorage.getItem('token');
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <ScrollToTop>
      <Provider store={store}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product" element={<Products />} />
          <Route path="/product/:id" element={<Product />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="*" element={<PageNotFound />} />
<<<<<<< HEAD
          <Route path="/admin/productos" element={<AdminProducts />} /> {/* Nueva ruta */}
          <Route path="/admin/categorias" element={<AdminCategory />} />
          <Route path="/admin/proveedor" element={<AdminProveedor />} /> {/* Nueva ruta */}
          <Route path="/admin/subcategorias" element={<AdminSubCategory />} /> 
          <Route path="{/admin/bitacora" element ={<AdminBitacora/>} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} /> {/* Nueva ruta */}
=======
          <Route path="/admin/productos" element={token ? <AdminProducts /> : <Navigate to="/login" />} />
          <Route path="/admin/categorias"  element={token ? <AdminCategory /> : <Navigate to="/login" />} />
          <Route path="/admin/proveedor" element={token ? <AdminProveedor /> : <Navigate to="/login" />} />
          <Route path="/admin/subcategorias"  element={token ? <AdminSubCategory /> : <Navigate to="/login" />} />
          <Route path="/admin/dashboard" element={token ? <AdminDashboard /> : <Navigate to="/login" />} />
          <Route path="/admin/users" element={token ? <AdminUsers /> : <Navigate to="/login" />} />
>>>>>>> 450d07e6eee0c3f5fface9c293126acd114d9ac3
          <Route path="/product/*" element={<PageNotFound />} />
        </Routes>
      </Provider>
    </ScrollToTop>
    <Toaster />
  </BrowserRouter>
);
