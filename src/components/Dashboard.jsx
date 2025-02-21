import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const APIV = process.env.REACT_APP_API + "venta.php?endpoint=venta";
const API = process.env.REACT_APP_API + "cliente.php?endpoint=cliente";
const API_URL = process.env.REACT_APP_API + 'users.php';
const APIB = process.env.REACT_APP_API + 'bitacora.php?endpoint=bitacora'


const DashboardCard = ({ title, value, bgColor ,link}) => {
  return (
    <div className="col-md-3">
      <div className={`card text-white ${bgColor} shadow-sm`}>
        <div className="card-body text-center">
          <h5 className="card-title text-uppercase small">{title}</h5>
          <h2 className="fw-bold">{value}</h2>
          <a href={link} className="text-white-50 small">Ver más...</a>
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [totalPedidos, setTotalPedidos] = useState(1);
  const [totalVentas, setTotalVentas] = useState('0');

  const [totalCliente, setTotalClientes] = useState(0);
  const [personasOnline, setPersonasOnline] = useState(0);
 const [bitacora, setbitacora] = useState([])

  const fetchVentas = async () => {
    try {
      const response = await fetch(APIV);
      const data = await response.json();
   
      setTotalVentas(data.totalPages || 0);
     
    } catch (error) {
      console.error('Error al cargar la cantidad de Ventas:', error);
    }
  };
  const fetchClientes = async () => {
    try {
      const response = await fetch(API);
      const data = await response.json();
      setTotalPedidos(data.totalPages || 0);
     
      setTotalClientes(data.totalPages || 0);
     
    } catch (error) {
      console.error('Error al cargar la cantidad de clientes:', error);
    }
  };

  const fetchPersonasOnline = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
    
      setPersonasOnline(data.totalPages || 0);

      
    } catch (error) {
      console.error('Error al cargar la cantidad de personas en línea:', error);
    }
  };
  const fetchBitacoras = async () => {
    try {
      const response = await fetch(
        `${APIB}&search=${""}&page=${1}&limit=${10}`
      )
      const data = await response.json();
      setbitacora(data.bitacora || [])
      console.log("bitacora",bitacora);
     
    } catch (error) {
      console.error('Error al cargar la cantidad de clientes:', error);
    }
  };

  useEffect(() => {
    fetchVentas();
    fetchClientes();
    fetchPersonasOnline();
    fetchBitacoras();
  }, []);

  return (
    <div className="container my-4">
      <h1 className="mb-4">Inicio</h1>
      <div className="row g-4">
        <DashboardCard title="Total de Pedidos" value={totalPedidos} bgColor="bg-primary" link="Venta" />
        <DashboardCard title="Total de Ventas" value={totalVentas} bgColor="bg-info" link="Venta" />
        <DashboardCard title="Total de Clientes" value={totalCliente} bgColor="bg-success" link="Cliente"/>
        <DashboardCard title="Personas Online" value={personasOnline} bgColor="bg-secondary" link="Users"/>
      </div>

      <div className="row mt-4">
        <div className="col-md-4">
          <div className="card">
            <div className="card-header bg-light">
              <h5 className="mb-0">Actividad Reciente</h5>
            </div>
            <div className="card-body">
            <table className="table table-striped table-hover">
        <thead className="thead-dark">
          <tr>
          
            <th>Fecha_hora</th>
            <th>usuario</th>
                
          </tr>
        </thead>
        <tbody>
          {bitacora.map((Category) => (
            <tr key={Category.idbitacora}>
            
              <td>{Category.fechahora}</td>
              <td>{Category.usuario}</td>
             

            </tr>
          ))}
        </tbody>
      </table>
            </div>
          </div>
        </div>
        <div className="col-md-8">
          <div className="card">
            <div className="card-header bg-light">
              <h5 className="mb-0">Últimos Pedidos</h5>
            </div>
            <div className="card-body">
              <table className="table table-bordered table-striped">
                <thead>
                  <tr>
                    <th>Pedido</th>
                    <th>Cliente</th>
                    <th>Fecha</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>001</td>
                    <td>Juan Pérez</td>
                    <td>2025-02-18</td>
                    <td>$1000</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
