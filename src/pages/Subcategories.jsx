import React from 'react'
import { Footer, Navbar,Product } from '../components'
import SubcategoriesList from '../components/public/Subcategories'

const Subcategories = () => {
  return (
    <>
      <Navbar />
      <SubcategoriesList />
      <Product />
      <Footer />
    </>
  )
}

export default Subcategories
