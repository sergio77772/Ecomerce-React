import { Navbar, Main, Product, Footer } from "../components";
import Categories from "../components/public/categorias";

function Home() {
  return (
    <>
      <Navbar />
      <Main />
      <Categories/>
      <Product />
      <Footer />
    </>
  )
}

export default Home