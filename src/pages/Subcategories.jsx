import React from 'react'
import { Footer, Navbar,Product } from '../components'
import SubcategoriesList from '../components/public/Subcategories'
import BreadcrumbNavigation from '../components/public/NavigationBar'; // Importa el componente

const Subcategories = () => {
  const category = "Línea Vidrio"; 
  return (
    <>
      <Navbar />
      <BreadcrumbNavigation category={category} /> 
      <SubcategoriesList />
      <Product />
      <Footer />
    </>
  )
}

export default Subcategories
