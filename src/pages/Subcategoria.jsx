import React from 'react'
import { Footer, Navbar,Product } from '../components'
import SubcategoryDetail from '../components/public/SubcategoryDetail'
import BreadcrumbNavigation from '../components/public/NavigationBar'; // Importa el componente

const Subcategoria = () => {
  const category = "Línea Vidrio"; 
  const subcategory = "Bisagras para Vidrio"; 
  return (
    <>
      <Navbar />
      <BreadcrumbNavigation category={category} subcategory={subcategory} /> 
      <SubcategoryDetail/>
      <Product />
      <Footer />
    </>
  )
}

export default Subcategoria
