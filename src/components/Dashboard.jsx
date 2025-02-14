import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'

const DashboardCard = ({ title, value, bgColor }) => {
  return (
    <div className="col-md-3">
      <div className={`card text-white ${bgColor} shadow-sm`}>
        <div className="card-body text-center">
          <h5 className="card-title text-uppercase small">{title}</h5>
          <h2 className="fw-bold">{value}</h2>
          <a href="/admin/dashboard" className="text-white-50 small">
            Ver más...
          </a>
        </div>
      </div>
    </div>
  )
}

const Dashboard = () => {
  return (
    <div className="container my-4">
      <h1 className="mb-4">Inicio</h1>
      <div className="row g-4">
        <DashboardCard
          title="Total de Pedidos"
          value="88"
          bgColor="bg-primary"
        />
        <DashboardCard title="Total de Ventas" value="1M" bgColor="bg-info" />
        <DashboardCard
          title="Total de Clientes"
          value="2K"
          bgColor="bg-success"
        />
        <DashboardCard
          title="Personas Online"
          value="0"
          bgColor="bg-secondary"
        />
      </div>

      <div className="row mt-4">
        <div className="col-md-4">
          <div className="card">
            <div className="card-header bg-light">
              <h5 className="mb-0">Actividad Reciente</h5>
            </div>
            <div className="card-body">
              <p className="text-muted">Sin Resultados.</p>
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
                    <th>Pedido ID</th>
                    <th>Cliente</th>
                    <th>Estado</th>
                    <th>Fecha Alta</th>
                    <th>Total</th>
                    <th>Destino</th>
                    <th>Local</th>
                    <th>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>1555</td>
                    <td>Paola -----</td>
                    <td>Pendiente</td>
                    <td>20/11/2023</td>
                    <td>$11,400.00</td>
                    <td>Casa de Fernando baca</td>
                    <td></td>
                    <td>
                      <button className="btn btn-primary btn-sm">🔍</button>
                    </td>
                  </tr>
                  <tr>
                    <td>1556</td>
                    <td>Pao -----</td>
                    <td>Pendiente</td>
                    <td>26/11/2023</td>
                    <td>$11,450.00</td>
                    <td>Casa de Fernando baca</td>
                    <td></td>
                    <td>
                      <button className="btn btn-primary btn-sm">🔍</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const AdminDashboard = () => {
  return <Dashboard />
}

export default AdminDashboard
