import React from 'react'
import { Reporte, Footer } from '../../components'
import Sidebar from '../../components/backoffices/Menu'
import Header from '../../components/backoffices/Header'

const AdminReporte = () => {
  return (
    <>
      <Header />
      <div className="container-fluid">
        <div className="row">
          {/* Sidebar toma 2 columnas, el resto se lo lleva el Reporte */}
          <div className="col-md-2 p-0">
            <Sidebar />
          </div>
          <div className="col-md-10 p-4">
            <Reporte /> {/*componente */}
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default AdminReporte
