import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { fetchComercio } from '../redux/action/'
import { Navbar, Main, Product, Footer } from '../components'
import Categories from '../components/public/categorias'

function Home() {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchComercio()) 
  }, [dispatch])

  return (
    <>
      <Navbar />
      <Main />
      <Categories />
      <Product />
      <Footer />
    </>
  )
}

export default Home
