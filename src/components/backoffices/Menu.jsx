import React, { useEffect, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import { useSelector } from 'react-redux'

const Sidebar = () => {
  const usuario = useSelector((state) => state.user.user) || {}
  const rol = Number(usuario.idRol) || 0

  const [setRoles] = useState({})
  const [openDropdown, setOpenDropdown] = useState(null)

  const API_URL = process.env.REACT_APP_API + 'roles.php'

  useEffect(() => {
    fetchRoles()
  }, [])

  const fetchRoles = async () => {
    try {
      const response = await fetch(API_URL, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const data = await response.json()
      const rolesData = data.data || []
      const rolesMap = rolesData.reduce((acc, role) => {
        acc[role.id] = role.descripcion
        return acc
      }, {})
      setRoles(rolesMap)
    } catch (error) {
      console.error('Error fetching roles:', error)
    }
  }

  const toggleDropdown = (menu) => {
    setOpenDropdown(openDropdown === menu ? null : menu)
  }

  const menus = [
    { title: 'Inicio', icon: 'bi-house', link: '/admin/dashboard', roles: [1] },
    {
      title: 'Catálogo',
      icon: 'bi-box-seam',
      roles: [1, 2],
      submenus: [
        {
          title: 'Productos',
          icon: 'bi-box',
          roles: [1, 2],
          link: '/admin/productos',
        },
        {
          title: 'Categorías',
          icon: 'bi-tags',
          roles: [1],
          link: '/admin/categorias',
        },
        {
          title: 'Subcategorías',
          icon: 'bi-tags',
          roles: [1],
          link: '/admin/subcategorias',
        },
        {
          title: 'Proveedores',
          icon: 'bi-person-circle',
          roles: [1],
          link: '/admin/proveedores',
        },
        {
          title: 'Clientes',
          icon: 'bi-people',
          roles: [1],
          link: '/admin/cliente',
        },
        {
          title: 'Localidades',
          icon: 'bi-geo-alt-fill',
          roles: [1],
          link: '/admin/localidades',
        },
      ],
    },

    {
      title: 'Ventas',
      icon: 'bi-cart',
      roles: [1],
      submenus: [
        {
          title: 'Órdenes',
          icon: 'bi-cart-check',
          roles: [1],
          link: '/admin/ordenes',
        },
        {
          title: 'Facturas',
          icon: 'bi-house-gear',
          roles: [1],
          link: '/admin/venta',
        },
      ],
    },
    {
      title: 'Compras',
      icon: 'bi-bag',
      roles: [1],
      submenus: [
        { title: 'Pedido', icon: 'bi-cart-check', roles: [1], link: '/' },
        {
          title: 'Facturas',
          icon: 'bi-house-gear',
          roles: [1],
          link: '/admin/compra',
        },
      ],
    },

    {
      title: 'Configuración',
      icon: 'bi-graph-up',
      roles: [1],
      submenus: [
        {
          title: 'Mi Comercio',
          icon: 'bi-house-gear',
          roles: [1],
          link: '/admin/comercio',
        },
        {
          title: 'Diseño',
          icon: 'bi-palette',
          roles: [1],
          submenus: [
            { title: 'Colores', icon: 'bi bi-brush', link: '/admin/template' },
          ],
        },
      ],
    },
    {
      title: 'Seguridad',
      icon: 'bi-gear',
      roles: [1],
      submenus: [
        {
          title: 'Usuarios',
          icon: 'bi-person',
          roles: [1],
          link: '/admin/users',
        },
        {
          title: 'Bitácora',
          icon: 'bi-journal',
          roles: [1],
          link: '/admin/bitacora',
        },
        {
          title: 'Registro',
          icon: 'bi-file-earmark-text',
          roles: [1],
          link: '/admin/logsdesistema',
        },
      ],
    },
  ]

  return (
    <div className="bg-dark text-white vh-100 p-3">
      <h4 className="text-center">NAVEGACIÓN</h4>
      <ul className="nav flex-column">
        {menus
          .filter((menu) => menu.roles.includes(rol))
          .map((menu, index) => (
            <li key={index} className="nav-item">
              {menu.submenus ? (
                <div>
                  <button
                    className="nav-link text-white d-flex justify-content-between w-100"
                    onClick={() => toggleDropdown(menu.title)}
                  >
                    <span>
                      <i className={`bi ${menu.icon} me-2`}></i>
                      {menu.title}
                    </span>
                    <i
                      className={`bi ${openDropdown === menu.title ? 'bi-chevron-up' : 'bi-chevron-down'}`}
                    ></i>
                  </button>
                  {openDropdown === menu.title && (
                    <ul className="list-unstyled ms-3">
                      {menu.submenus
                        .filter((submenu) => submenu.roles.includes(rol))
                        .map((submenu, subIndex) => (
                          <li key={subIndex}>
                            <a
                              href={submenu.link}
                              className="nav-link text-white"
                            >
                              <i className={`bi ${submenu.icon} me-2`}></i>
                              {submenu.title}
                            </a>
                          </li>
                        ))}
                    </ul>
                  )}
                </div>
              ) : (
                <a href={menu.link} className="nav-link text-white">
                  <i className={`bi ${menu.icon} me-2`}></i>
                  {menu.title}
                </a>
              )}
            </li>
          ))}
      </ul>
    </div>
  )
}

export default Sidebar
