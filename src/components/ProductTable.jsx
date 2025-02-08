/* eslint-disable */

import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import SkeletonTable from "./skeleton/SkeletonTable";

const ProductTable = () => {
  const [producto, setproducto] = useState([]);
  const [loading, setLoading] = useState(true);
  const [debouncedSearch, setDebouncedSearch] = useState(""); // Estado para el debounce

  const [error, setError] = useState(null);
  const usuario = localStorage.getItem('usuario')|| 'no hay detalle';

  const [selectedCategory, setSelectedCategory] = useState({
    idcategoria: "",
    idsubcategoria: "",
    idproveedor: "",
    descripcion: "",
    precioventa: "",
    preciocosto: "",
    deposito: "",
    ubicacion: "",
    stockmin: "",
    stock: "",
    stockmax: "",
    descripcioncompleta: "",
    codigoArticulo: "",
    estado: "",
    nivel: "",
    imagen: "",
    nombre:usuario
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [search, setSearch] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [isEditing, setIsEditing] = useState(false); // Nueva bandera para distinguir entre alta y edición

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10; // Límite de elementos por página
  const limitOthers = 100; // Límite de elementos por página

  const API = process.env.REACT_APP_API + "admProductos.php?endpoint=producto";
  const API_CATEGORIA = process.env.REACT_APP_API + "categorias.php?endpoint=categoria"; //agregue para buscar categoria
  const API_SUBCATEGORIA = process.env.REACT_APP_API + "subcategorias.php?endpoint=subcategoria";
  const API_PROVEEDOR = process.env.REACT_APP_API + "proveedor.php?endpoint=proveedor";
  const APIB = process.env.REACT_APP_API + "bitacora.php?endpoint=bitacora";

  const [filteredSubcategories, setFilteredSubcategories] = useState([]);
  const [categories, setCategories] = useState([]); //agregue para buscar categoria
  const [subcategoria, setsubcategoria] = useState([]);
  const [proveedor, setProveedor] = useState([]);
 

  useEffect(() => {
    loadproducto();
    loadCategoria();
    loadsubcategoria();  //agregue para buscar categoria
  
    loadProveedor();
  }, [debouncedSearch, currentPage]);





  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 800); // Retraso de 500ms

    return () => clearTimeout(handler); // Limpiar el temporizador al desmontar o cuando el search cambie
  }, [search]);

  const loadproducto = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${API}&search=${debouncedSearch}&page=${currentPage}&limit=${limit}`
      );
      if (!response.ok) {
        throw new Error("Error al cargar las Productos.");
      }
      const data = await response.json();
      setproducto(data.producto || []);
      console.log("producto", data);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      setError(err.message);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 300);
    }
  };

  const loadCategoria = async () => {
    try {
      const response = await fetch(
        `${API_CATEGORIA}&search=${search}&page=${1}&limit=${limitOthers}`
      );
      if (!response.ok) {
        throw new Error("Error al cargar los categoria.");
      }
      const data = await response.json();
      setCategories(data.categories || []);
    } catch (err) {
      setError(err.message);
    }
  };

  const loadsubcategoria = async () => {

    try {
      const response = await fetch(
        `${API_SUBCATEGORIA}&search=${search}&page=${1}&limit=${limitOthers}`
      );
      if (!response.ok) {
        throw new Error("Error al cargar los subcategoria.");
      }
      const data = await response.json();
      console.log("subcategoria", data);
      setsubcategoria(data.subcategoria || []);
      setFilteredSubcategories(data.subcategoria || []);
    } catch (err) {
      setError(err.message);
    }
  };
{/*  ******************FUNCION DE FILTRO***************    */}
const handleCategoryChange = (e) => {
  const idcat = e.target.value;

  setSelectedCategory({ ...selectedCategory, idcategoria: idcat });
  filtroSubcategoria(idcat);
  console.log("idcat", idcat);
};

const filtroSubcategoria = (idcat) => {
  const idcategoriaNum = Number(idcat); // Convertir idcat a número
  const subcategoriasFiltradas = subcategoria.filter(sub => sub.idcategoria === idcategoriaNum);
  console.log("filtro", subcategoriasFiltradas);
  setFilteredSubcategories(subcategoriasFiltradas);
};



  const loadProveedor = async () => {
    try {
      const response = await fetch(
        `${API_PROVEEDOR}&search=${search}&page=${1}&limit=${limitOthers}`
      );
      if (!response.ok) {
        throw new Error("Error al cargar los categoria.");
      }
      const data = await response.json();
      console.log("PROVEEDOR", data);
      setProveedor(data.proveedor || []);
    } catch (err) {
      setError(err.message);
    }
  };



{/*   ****************   Duplicado  *************************************
  buscar en producto el registro
  guardarlo como nuevo registro
  
  */}
 

  const handleDuplicar = async (id) => {
    {/*  buscar en producto el registro */}


    if (!window.confirm("¿Estás seguro Que Duplica el Producto? ")) return;

    const Registro = producto.find((pro) => pro.idproducto === id);
    console.log("Registro",Registro);
   

    // Crea un nuevo registro duplicado
    const newProduct = {

      idcategoria:    `${Registro.idcategoria}`,
      idsubcategoria: `${Registro.idsubcategoria}`,
      idproveedor:    `${Registro.idproveedor}`, 
      descripcion:    `${Registro.descripcion}`,
      precioventa:    `${Registro.precioventa}`,
      preciocosto:    `${Registro.preciocosto}`, 
      deposito:       `${Registro.deposito}`,
      ubicacion:      `${Registro.ubicacion}`,
      stockmin:       `${Registro.stockmin}`, 
      stock:          `${Registro.stock}`,
      stockmax:       `${Registro.stockmax}`,
      descripcioncompleta: `${Registro.descripcioncompleta}`, 
      estado:         `Duplicado`,// DUPLICADO
      nivel:          `${Registro.nivel}`,
      imagen:         `${Registro.imagen}`,
      codigoArticulo: `${Registro.codigoArticulo}-dup`,  // Agregar un sufijo para diferenciar el código de artículo duplicado
  
    };
           
   

   console.log("newProduct",newProduct);



   try {
    // Realiza la solicitud POST a la API para guardar el nuevo producto
    const uploadResponse = await fetch(API,
      {
        method: "POST",
        headers: {
          'Content-Type': 'application/json', // Añadir cabecera para indicar tipo de contenido
        },
        body: JSON.stringify(newProduct),
      }
    );
  
    if (!uploadResponse.ok) {
      throw new Error("Error api.");
    }
  
    // Aquí puedes manejar la respuesta
    const responseText = await uploadResponse.text();
    console.log("Respuesta de la API:", responseText);

    try {
      const result = JSON.parse(responseText);
      console.log("Producto guardado exitosamente:", result);
      alert("Registro Duplicado");
      loadproducto();
    } catch (jsonError) {
      throw new Error("La respuesta de la API no es un JSON válido.");
    }
    
  } catch (error) {
    console.error('Error:', error);
    alert("Error de Registro Duplicado");
  }
  

  };

  {/*    fin duplicado       */ }
  
  const handleEdit = (category) => {
    setSelectedCategory({
      idcategoria: category.idcategoria || "",
      idsubcategoria: category.idsubcategoria || "",
      idproveedor: category.idproveedor || "",
      descripcion: category.descripcion || "",
      precioventa: category.precioventa || "",
      preciocosto: category.preciocosto || "",
      deposito: category.deposito || "",
      ubicacion: category.ubicacion || "",
      stockmin: category.stockmin || "",
      stock: category.stock || "",
      stockmax: category.stockmax || "",
      descripcioncompleta: category.descripcioncompleta || "",
      codigoArticulo: category.codigoArticulo || "",
      estado: category.estado || "",
      nivel: category.nivel || "",
      imagen: category.imagen || "",
      idproducto: category.idproducto,
    });
    setImageFile(null);
    setIsEditing(true); // Activar modo edición
    setModalVisible(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (imageFile) {
        const formData = new FormData();
        formData.append("image", imageFile);

        const uploadResponse = await fetch(
          `${process.env.REACT_APP_API}admProductos.php?endpoint=upload`,
          {
            method: "POST",
            body: formData,
          }
        );

        if (!uploadResponse.ok) {
          throw new Error("Error al subir la imagen.");
        }

        const uploadResult = await uploadResponse.json();
        selectedCategory.imagen = uploadResult.filePath;
      }

      const method = isEditing ? "PUT" : "POST"; // Diferenciar entre edición y creación
      const endpoint = isEditing
        ? `${API}&id=${selectedCategory.idproducto}`
        : `${API}`;

      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(selectedCategory),
      });

      if (!response.ok) {
        throw new Error(
          isEditing ? "Error al actualizar la Producto." : "Error al crear la Producto."
        );
      }
      


// BITACORA 
const usuario = localStorage.getItem('usuario')|| 'no hay detalle';
console.log("user",usuario);
const bitacoraResponse =  await fetch(APIB, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({

    fechahora: new Date().toISOString(),
    modulo: "PRODUCTO",
    mensaje:`  ${selectedCategory.idcategoria}         
            -  ${selectedCategory.idsubcategoria}
            -  ${selectedCategory.idproveedor} 
            -  ${selectedCategory.descripcion}
            -  ${selectedCategory.precioventa}
            -  ${selectedCategory.preciocosto}
            -  ${selectedCategory.deposito} 
            -  ${selectedCategory.ubicacion}
            -  ${selectedCategory.stockmin}
            -  ${selectedCategory.stock}
            -  ${selectedCategory.stockmax}
            -  ${selectedCategory.descripcioncompleta}
            -  ${selectedCategory.deposito} 
            -  ${selectedCategory.ubicacion}
            -  ${selectedCategory.codigoArticulo}
            -  ${selectedCategory.estado}  
            -  ${selectedCategory.nivel}
            -  ${selectedCategory.imagen}
            ` ,
    usuario:usuario,
    imagen:"",
  }),
});
console.log("bitacora",bitacoraResponse);
if (!bitacoraResponse.ok) {
  throw new Error("Error al registrar en la bitácora.");
}

// FIN BITACORA

 alert(
        isEditing ? "Producto actualizada exitosamente" : "Producto creada exitosamente"
      );
      setModalVisible(false);
      loadproducto();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar esta Producto? ")) return;
    try {
      const response = await fetch(`${API}&id=${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Error al eliminar la Producto.");
      }
      alert("Producto eliminada exitosamente");
      loadproducto();
    } catch (err) {
      alert(err.message);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleCreate = () => {
    setSelectedCategory({
      idcategoria: "",
      idsubcategoria: "",
      idproveedor: "",
      descripcion: "",
      precioventa: "",
      preciocosto: "",
      deposito: "",
      ubicacion: "",
      stockmin: "",
      stock: "",
      stockmax: "",
      descripcioncompleta: "",
      codigoArticulo: "",
      estado: "",
      nivel: "",
      imagen: "",
    });
    setImageFile(null);
    setIsEditing(false); // Activar modo alta
    setModalVisible(true);
  };

  {/* busca categoria */}
  const getCategoryNameById = (id) => {
    const category = categories.find((cat) => cat.idcategoria === id);
    return category ? category.nombre : "Sin Categoria";
  };


  {/* busca subcategoria */}
  const getSubCategoryNameById = (id) => {
    const scategory = subcategoria.find((cat) => cat.idsubcategoria === id);
    return scategory ? scategory.nombre : "Sin SubCategoria";
  };




  if (loading) {
    return (
      <div className="container mt-4">
        <SkeletonTable rows={5} columns={5} />
      </div>
    );
  }

  if (error) {
    return <div className="alert alert-danger text-center">{error}</div>;
  }

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Gestión de Productos</h1>

      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Buscar Productos..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="mb-3 text-end">
        <button className="btn btn-success" onClick={handleCreate}>
          Añadir Producto
        </button>
      </div>

      <table className="table table-striped table-hover">
        <thead className="thead-dark">
          <tr>
          <th>Categoria</th>
          <th>Subcategoría</th>
            <th>Cód.Art</th>
            <th>Descripción</th>
            <th>Imagen</th>
            <th>Precio Venta</th>                
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {producto.map((category) => (
            <tr key={category.idproducto}>
                  <td>{getCategoryNameById(category.idcategoria)}</td> 
                 <td>{getSubCategoryNameById(category.idsubcategoria)}</td> 
  {/* <td>{category.idcategoria}</td>
 <td>{category.idsubcategoria}</td> */}

             <td>{category.codigoArticulo}</td>
              <td>{category.descripcion}</td>
              <td>
                {category.imagen && (
                 <img
                  src={`${process.env.REACT_APP_BASE_URL}${category.imagen}`}
                  alt={category.descripcion}
                  style={{ width: "50px"}}
                />
              )}
              </td>

              <td>{category.precioventa}</td>
             
              <td>{category.estado}</td>
              <td>
                <button
                  className="btn btn-warning btn-sm me-2"
                  onClick={() => handleEdit(category)}
                >
                  Editar
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(category.idproducto)}
                >
                  Eliminar
                </button>
                <button
                  className="btn btn-info btn-sm me-2"
                  onClick={() => handleDuplicar(category.idproducto)}
                >
                  Duplicar
                </button>


              </td>
            </tr>
          ))}
        </tbody>
      </table>

        {/* Paginación */}
<div className="d-flex justify-content-center align-items-center">
  <button
    className="btn btn-secondary me-2"
    onClick={() => handlePageChange(1)}
    disabled={currentPage === 1}
  >
    Inicio
  </button>
  <button
    className="btn btn-secondary me-2"
    onClick={() => handlePageChange(currentPage - 1)}
    disabled={currentPage === 1}
  >
    Anterior
  </button>

  {[...Array(5)].map((_, index) => {
    let page = currentPage - 2 + index;
    if (page < 1 || page > totalPages) return null; // No mostrar páginas fuera del rango

    return (
      <button
        key={page}
        className={`btn ${page === currentPage ? 'btn-primary' : 'btn-outline-secondary'} mx-1`}
        onClick={() => handlePageChange(page)}
      >
        {page}
      </button>
    );
  })}

  <button
    className="btn btn-secondary ms-2"
    onClick={() => handlePageChange(currentPage + 1)}
    disabled={currentPage === totalPages}
  >
    Siguiente
  </button>
  <button
    className="btn btn-secondary ms-2"
    onClick={() => handlePageChange(totalPages)}
    disabled={currentPage === totalPages}
  >
    Final
  </button>
</div>


      {/* Modal */}
      <div
        className={`modal fade ${modalVisible ? "show d-block" : ""}`}
        tabIndex="-1"
        style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        aria-hidden={!modalVisible}
      >

       <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                {isEditing ? "Editar Producto" : "Añadir Producto"}
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => setModalVisible(false)}
              ></button>
            </div>
            <form onSubmit={handleSave}>
            <div className="modal-body">
                <div className="row">
                  
                    <div className="col-md-4">
                    <label><strong>ID Categoria</strong></label>
             
                <div className="mb-3" style={{ border: "2px solid black", borderRadius: "10px" }}>  
                <select
                    className="form-control"
                    value={selectedCategory.idcategoria}
                    onChange={handleCategoryChange}
                
                  >
                     {categories.map((elemento) => {return (
                      <option key={elemento.idcategoria} value={elemento.idcategoria}>
                        {elemento.nombre}
                      </option>
                    )})}
                  </select>
                    </div>
                    </div>

                <div className="col-md-4">              
                <label><strong>ID subCategoria</strong></label>
                <div className="mb-3" style={{ border: "2px solid black", borderRadius: "10px" }}>  
                <select
                    className="form-control"
                    value={selectedCategory.idsubcategoria}
                    onChange={(e) =>
                      setSelectedCategory({ ...selectedCategory, idsubcategoria: e.target.value })
                    }
                  >
                     {filteredSubcategories.map((elemento) => {return (
                      <option key={elemento.idsubcategoria} value={elemento.idsubcategoria}>
                        {elemento.nombre}
                      </option>
                    )})}
                  </select>
                  </div>
                  </div>


                  <div className="col-md-4">
                  <label><strong>ID Proveedor</strong></label>
                <div className="mb-3" style={{ border: "2px solid black", borderRadius: "10px" }}>  
                <select
                    className="form-control"
                    value={selectedCategory.idproveedor}
                    onChange={(e) =>
                      setSelectedCategory({ ...selectedCategory, idproveedor: e.target.value })
                    }
                  >
                     {proveedor.map((elemento) => {return (
                      <option key={elemento.idproveedor} value={elemento.idproveedor}>
                        {elemento.nombre}
                      </option>
                    )})}
                  </select>
              
                </div>
                </div>
         </div>
         <div className="row">
                <div className="col-md-4">         
                      <label htmlFor="descripcion" className="form-label">                        
                      <strong> Descripción(30 caracteres)</strong>                      
                      </label>
                     <div className="mb-3" style={{ border: "2px solid black", borderRadius: "10px" }}>  

                      <input
                        type="text"
                        className="form-control"
                        id="descripcion"
                        value={selectedCategory.descripcion}
                        onChange={(e) =>
                          setSelectedCategory({
                            ...selectedCategory,
                            descripcion: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                   </div>
                    <div className="col-md-4">
                       <label htmlFor="precioventa" className="form-label">
                      <strong> Precio Venta</strong>
                      </label>
                <div className="mb-3" style={{ border: "2px solid black", borderRadius: "10px" }}>  

                      <input
                        type="number"
                        className="form-control"
                        id="precioventa"
                        value={selectedCategory.precioventa}
                        style={{ textAlign: "right" }}
                        onChange={(e) =>
                          setSelectedCategory({
                            ...selectedCategory,
                            precioventa: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    </div>
                    <div className="col-md-4">
                     <label htmlFor="preciocosto" className="form-label">
                      <strong> Precio Costo</strong>
                      </label>
                      <div className="mb-3" style={{ border: "2px solid black", borderRadius: "10px" }}>  

                      <input
                        type="number"
                        className="form-control"
                        id="preciocosto"
                        value={selectedCategory.preciocosto}
                        style={{ textAlign: "right" }}
                        onChange={(e) =>
                          setSelectedCategory({
                            ...selectedCategory,
                            preciocosto: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    </div>
                   
            </div>
         <div className="row">
               <div className="col-md-4">
          
                      <label htmlFor="stockmin" className="form-label">
                      <strong>Stock Mínimo</strong>
                      </label>
                <div className="mb-3" style={{ border: "2px solid black", borderRadius: "10px" }}>  

                      <input
                        type="number"
                        className="form-control"
                        id="stockmin"
                        value={selectedCategory.stockmin}
                        style={{ textAlign: "right" }}
                        onChange={(e) =>
                          setSelectedCategory({
                            ...selectedCategory,
                            stockmin: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    </div>
         <div className="col-md-4">
      
                      <label htmlFor="stock" className="form-label">
                      <strong>Stock</strong>
                      </label>
                <div className="mb-3" style={{ border: "2px solid black", borderRadius: "10px" }}>  

                      <input
                        type="number"
                        className="form-control"
                        id="stock"
                        value={selectedCategory.stock}
                        style={{ textAlign: "right" }}
                        onChange={(e) =>
                          setSelectedCategory({
                            ...selectedCategory,
                            stock: e.target.value,
                          })
                        }
                        required
                      />
            </div>
            </div>
            <div className="col-md-4">
       
                  <label><strong>Stock Max</strong></label>
                <div className="mb-3" style={{ border: "2px solid black", borderRadius: "10px" }}>  

                  <input
                    type="text"
                    className="form-control"
                    value={selectedCategory.stockmax}
                    style={{ textAlign: "right" }}
                    onChange={(e) =>
                      setSelectedCategory({ ...selectedCategory, stockmax: e.target.value })
                    }
                  />
         </div>
         </div>


                 
        <div className="row">
        <div className="col-md-4">      
                      <label htmlFor="deposito" className="form-label">
                      <strong>Depósito</strong>
                      </label>
                <div className="mb-3" style={{ border: "2px solid black", borderRadius: "10px" }}>  

                      <input
                        type="text"
                        className="form-control"
                        id="deposito"
                        value={selectedCategory.deposito}
                     
                        onChange={(e) =>
                          setSelectedCategory({
                            ...selectedCategory,
                            deposito: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    </div>
                    <div className="col-md-4">               
                      <label><strong>Ubicación</strong></label>
                <div className="mb-3" style={{ border: "2px solid black", borderRadius: "10px" }}>  

                      <input
                        type="text"
                        className="form-control"
                        value={selectedCategory.ubicacion}
                        onChange={(e) =>
                          setSelectedCategory({ ...selectedCategory, ubicacion: e.target.value })
                        }
                      />
                </div>
                 </div>
                 <div className="col-md-4">               
                      <label htmlFor="estado" className="form-label">
                      <strong>Estado</strong>
                      </label>
                <div className="mb-3" style={{ border: "2px solid black", borderRadius: "10px" }}>  

                      <select
                        className="form-control"
                        id="estado"
                        value={selectedCategory.estado}
                        onChange={(e) =>
                          setSelectedCategory({
                            ...selectedCategory,
                            estado: e.target.value,
                          })
                        }
                      >
                        <option value="">Seleccionar estado</option>
                        <option value="Activo">Activo</option>
                        <option value="Inactivo">Inactivo</option>
                      </select>
                    </div>
                    </div>
        </div>
        <div className="row">
        <div className="col-md-12">
        <label><strong>Descripción Completa</strong></label>
                <div className="mb-3" style={{ border: "2px solid black", borderRadius: "10px" }}>  

                <textarea
                  className="form-control"
                  value={selectedCategory.descripcioncompleta}
                  onChange={(e) =>
                    setSelectedCategory({ ...selectedCategory, descripcioncompleta: e.target.value })
                  }
                  rows="3" // Puedes ajustar el número de filas según necesites
                />
              </div>
              </div>
              </div>
              <div className="row">
              <div className="col-md-4">
           
                      <label htmlFor="codigoArticulo" className="form-label">
                      <strong> Código Artículo</strong>
                      </label>
                <div className="mb-3" style={{ border: "2px solid black", borderRadius: "10px" }}>  

                      <input
                        type="text"
                        className="form-control"
                        id="codigoArticulo"
                        value={selectedCategory.codigoArticulo}
                        onChange={(e) =>
                          setSelectedCategory({
                            ...selectedCategory,
                            codigoArticulo: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    </div>
                   
                    <div className="col-md-4">
                       <label htmlFor="Nivel" className="form-label">
                      <strong>Nivel</strong>
                      </label>
                     <div className="mb-3" style={{ border: "2px solid black", borderRadius: "10px" }}>  

                      <select
                        className="form-control"
                        id="nivel"
                        value={selectedCategory.nivel}
                        onChange={(e) =>
                          setSelectedCategory({
                            ...selectedCategory,
                            nivel: e.target.value,
                          })
                        }
                      >
                        <option value="">Seleccionar Nivel</option>
                        <option value="0">0</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                        
                      </select>
                    </div>
                    </div>
                   

        </div>

        <div className="row">
                {/* Imagen */}
                  <label htmlFor="imagen" className="form-label">
                  <strong>Imagen</strong>
                  </label>
                <div className="mb-3" style={{ border: "2px solid black", borderRadius: "10px" }}>  

                  {selectedCategory.imagen && (
                    <div className="mb-2">
                      <img
                        src={process.env.REACT_APP_BASE_URL + selectedCategory.imagen}
                        alt="Vista previa"
                        style={{ width: "100px", height: "auto", marginBottom: "10px" }}
                      />
                    </div>
                  )}
                  <input
                    type="file"
                    className="form-control"
                    id="imagen"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files[0])}
                  />
                </div>

       </div>

         </div>


                </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setModalVisible(false)}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  {isEditing ? "Guardar cambios" : "Crear Producto"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductTable;
