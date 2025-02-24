import React from 'react'
import { LocalidadesTables, Footer } from '../../components'
import Sidebar from '../../components/backoffices/Menu'
import Header from '../../components/backoffices/Header'

const AdminLocalidades = () => {
  return (
    <>
      <Header />
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-2 p-0">
            <Sidebar />
          </div>
          <div className="col-md-10 p-4">
            <LocalidadesTables />
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default AdminLocalidades
