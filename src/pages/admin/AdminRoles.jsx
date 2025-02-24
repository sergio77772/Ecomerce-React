import React from 'react'
import { RolesTable, Footer } from '../../components'
import Sidebar from '../../components/backoffices/Menu'
import Header from '../../components/backoffices/Header'

const AdminRoles = () => {
  return (
    <>
      <Header />
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-2 p-0">
            <Sidebar />
          </div>

          <div className="col-md-10 p-4">
            <RolesTable />
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
export default AdminRoles
