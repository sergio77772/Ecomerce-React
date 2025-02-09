import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";



const Dashboard = () => {
  return (
    <div className="container my-4">

        <div className="row g-4">
          <h1 className="mb-4">Inicio</h1>
          <div className="row text-white">
            <div className="col-md-3 p-3 bg-primary text-center">
              <h5>Total de Pedidos</h5>
              <h2>88</h2>
            </div>
            <div className="col-md-3 p-3 bg-info text-center">
              <h5>Total de Ventas</h5>
              <h2>1M</h2>
            </div>
            <div className="col-md-3 p-3 bg-success text-center">
              <h5>Total de Clientes</h5>
              <h2>2K</h2>
            </div>
            <div className="col-md-3 p-3 bg-secondary text-center">
              <h5>Personas Online</h5>
              <h2>0</h2>
            </div>
          </div>
          <div className="mt-4">
            <h5>Mapa Mundial</h5>
            <div className="bg-light p-5 text-center">[Mapa aquí]</div>
          </div>
          <div className="mt-4">
            <h5>Analítica de Ventas</h5>
            <div className="bg-light p-5 text-center">[Gráfico aquí]</div>
          </div>
        </div>
      </div>
    
  );
};

const AdminDashboard = () => {
  return <Dashboard />;
};

export default AdminDashboard;
