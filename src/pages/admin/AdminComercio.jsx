import React from 'react'
import { Footer, ComercioTables } from '../../components'
import Sidebar from '../../components/backoffices/Menu'
import Header from '../../components/backoffices/Header'

const AdminComercio = () => {
  return (
    <>
      <Header />
      <div className="container-fluid">
        <div className="row">
          {/* Sidebar toma 2 columnas, el resto se lo lleva el Dashboard */}
          <div className="col-md-2 p-0">
            <Sidebar />
          </div>
          <div className="col-md-10 p-4">
            <ComercioTables /> {/*componente */}
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default AdminComercio
