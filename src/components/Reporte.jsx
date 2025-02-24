import React, { useEffect, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  ArcElement,
  PointElement,
  Title,
  Tooltip,
  Legend
)

const APIP = process.env.REACT_APP_API + 'admProductos.php?endpoint=producto' // New API endpoint for products
const APIC = process.env.REACT_APP_API + 'categorias.php?endpoint=categoria'

const Reporte = () => {
  const [categoryData, setCategoryData] = useState({ labels: [], datasets: [] })

  // New function to fetch product data and categorize by category
  const fetchCategoryData = async () => {
    try {
      const response = await fetch(
        `${APIP}&search=${''}&page=${1}&limit=${3000}`
      )
      const data = await response.json()
      console.log('categoria', data)

      const categoryMap = await fetchCategoryNames()

      const categories = {}
      data.producto.forEach((product) => {
        const categoria = categoryMap[product.idcategoria] || 'Desconocido'
        if (!categories[categoria]) {
          categories[categoria] = 0
        }
        categories[categoria] += 1
      })

      const categoryLabels = Object.keys(categories)
      const categoryCounts = Object.values(categories)

      setCategoryData({
        labels: categoryLabels,
        datasets: [
          {
            label: 'Cantidad por Categoría',
            data: categoryCounts,
            backgroundColor: [
              '#007bff',
              '#17a2b8',
              '#28a745',
              '#ffc107',
              '#dc3545',
            ],
          },
        ],
      })
    } catch (error) {
      console.error(
        'Error al cargar la cantidad de productos por categoría:',
        error
      )
    }
  }

  // Function to fetch category data
  const fetchCategoryNames = async () => {
    try {
      const response = await fetch(`${APIC}&search=${''}&page=${1}&limit=${10}`)
      const data = await response.json()
      const categoryMap = {}
      data.categories.forEach((categoria) => {
        categoryMap[categoria.idcategoria] = categoria.nombre
      })
      return categoryMap
    } catch (error) {
      console.error('Error al cargar los nombres de las categorías:', error)
      return {}
    }
  }

  useEffect(() => {
    fetchCategoryData()
    fetchCategoryNames()
  }, [])

  return (
    <div className="container my-4">
      <div className="mt-4">
        <h2>Productos por Categoría</h2>
        <Bar data={categoryData} />
      </div>
    </div>
  )
}

export default Reporte
