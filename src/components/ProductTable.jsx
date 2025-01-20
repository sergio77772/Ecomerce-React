import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const CategoryTable = () => {
  const [producto, setproducto] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState({

    idcategoria: "",
    idmarca: "",
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
    imagen: "",
  
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [search, setSearch] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [isEditing, setIsEditing] = useState(false); // Nueva bandera para distinguir entre alta y edición

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10; // Límite de elementos por página
  const limitOthers = 100; // Límite de elementos por página


  const API = process.env.REACT_APP_API + "productos.php?endpoint=producto";
  const API_CATEGORIA = process.env.REACT_APP_API + "categorias.php?endpoint=categoria"; //agregue para buscar categoria
  const API_MARCA = process.env.REACT_APP_API + "marcas.php?endpoint=marcas";
  const API_PROVEEDOR = process.env.REACT_APP_API + "proveedor.php?endpoint=proveedor";


  const [categories, setCategories] = useState([]); //agregue para buscar categoria
  const [marca, setMarca] = useState([]); 
  const [proveedor, setProveedor] = useState([]); 

  useEffect(() => {
    loadproducto(); 
    loadCategoria(); 
    loadMarca();//agregue para buscar categoria
    loadProveedor();
    
  }, [search, currentPage]); //

  const loadproducto = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API}&search=${search}&page=${currentPage}&limit=${limit}`);
      if (!response.ok) {
        throw new Error("Error al cargar las Productos.");
      }
      const data = await response.json();
      setproducto(data.producto || []);
      console.log("producto",data)
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  const loadCategoria = async () => { 
    
    try { const response = await fetch(`${API_CATEGORIA}&search=${search}&page=${currentPage}&limit=${limitOthers}`);
       if (!response.ok) {
         throw new Error("Error al cargar los categoria.");
         }
          const data = await response.json();
          console.log("hola",data);
           setCategories(data.categories || []);
        //   console.log(setEstados);

           } catch (err) {
             setError(err.message); 
           }
    };
  
    const loadMarca = async () => { 
    
      try { const response = await fetch(`${API_MARCA}&search=${search}&page=${currentPage}&limit=${limitOthers}`);
         if (!response.ok) {
           throw new Error("Error al cargar los categoria.");
           }
            const data = await response.json();
            console.log("marca",data);
             setMarca(data.marca || []);
          //   console.log(setEstados);
  
             } catch (err) {
               setError(err.message); 
             }
      };
      const loadProveedor = async () => { 
    
        try { const response = await fetch(`${API_PROVEEDOR}&search=${search}&page=${currentPage}&limit=${limitOthers}`);
           if (!response.ok) {
             throw new Error("Error al cargar los categoria.");
             }
              const data = await response.json();
              console.log("PROVEEDOR",data);
               setProveedor(data.proveedor || []);
            //   console.log(setEstados);
    
               } catch (err) {
                 setError(err.message); 
               }
        };
  

    const handleEdit = (category) => {
    setSelectedCategory({
      idcategoria: category.idcategoria || "",
      idmarca:     category.idmarca|| "",
      idproveedor: category.idproveedor || "",
      descripcion: category.descripcion || "",
      precioventa: category.precioventa || "",
      preciocosto: category.preciocosto || "",
      deposito:    category.deposito || "",
      ubicacion:   category.ubicacion || "",
      stockmin:    category.stockmin || "",
      stock:       category.stock || "",
      stockmax:    category.stockmax || "",
      descripcioncompleta: category.descripcioncompleta || "",
      codigoArticulo: category.codigoArticulo || "",
      estado:         category.estado || "",
      imagen:         category.imagen || "",
    
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

        const uploadResponse = await fetch(`${process.env.REACT_APP_API}productos.php?endpoint=upload`, {
          method: "POST",
          body: formData,
        });

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

      alert(
        isEditing
          ? "Producto actualizada exitosamente"
          : "Producto creada exitosamente"
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
      idmarca: "",
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
      imagen: "",
     
    });
    setImageFile(null);
    setIsEditing(false); // Activar modo alta
    setModalVisible(true);
  };

  if (loading) {
    return <div className="text-center">Cargando Productos...</div>;
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
            <th>ID</th>
            <th>idcategoria</th>
            <th>idmarca</th>             
            <th>idproveedor</th>
            <th>descripcion</th>
            <th>preciocosto</th>
            <th>precioventa</th>
            <th>desposito</th>
            <th>ubicacion</th>
            <th>stockmin</th>
            <th>stock</th>
            <th>stockmax</th>
            <th>descripcioncompleta</th>
            <th>codigoArticulo</th>
            <th>Estado</th>
            <th>Imagen</th>
          
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {producto.map((category) => (
            <tr key={category.idproducto}>
              <td>{category.idproducto}</td>
              <td>{category.idcategoria}</td>
              <td>{category.idmarca}</td>
              <td>{category.idproveedor}</td>
              <td>{category.descripcion}</td>
              <td>{category.preciocosto}</td>
              <td>{category.precioventa}</td>
              <td>{category.deposito}</td>
              <td>{category.ubicacion}</td>
              <td>{category.stockmin}</td>
              <td>{category.stock}</td>
              <td>{category.stockmax}</td>
              <td>{category.descripcioncompleta}</td>
              <td>{category.codigoArticulo}</td>


              <td>{category.estado}</td>
              <td>
                {category.imagen && (
                  <img
                    src={process.env.REACT_APP_BASE_URL + category.imagen}
                    alt={category.descripcion}
                    style={{ width: "50px" }}
                  />
                )}
             
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
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Paginación */}
      <div className="d-flex justify-content-center">
        <button
          className="btn btn-secondary me-2"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Anterior
        </button>
        <span className="align-self-center">
          Página {currentPage} de {totalPages}
        </span>
        <button
          className="btn btn-secondary ms-2"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Siguiente
        </button>
      </div>

      {/* Modal */}
      <div
        className={`modal fade ${modalVisible ? "show d-block" : ""}`}
        tabIndex="-1"
        style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        aria-hidden={!modalVisible}
      >
        <div className="modal-dialog">
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

                <div className="mb-3">
                  
                  <label>idcategoria</label>
                  <select
                    className="form-control"
                    value={selectedCategory.idcategoria}
                    onChange={(e) =>
                      setSelectedCategory({ ...selectedCategory, idcategoria: e.target.value })
                    }
                  >
                     {categories.map((elemento) => {return (
                      <option key={elemento.idcategoria} value={elemento.idcategoria}>
                        {elemento.nombre}
                      </option>
                    )})}
                  </select>



                </div>
                <div className="mb-3">
                <label>idmarca</label>
                <select
                    className="form-control"
                    value={selectedCategory.idmarca}
                    onChange={(e) =>
                      setSelectedCategory({ ...selectedCategory, idmarca: e.target.value })
                    }
                  >
                     {marca.map((elemento) => {return (
                      <option key={elemento.idmarca} value={elemento.idmarca}>
                        {elemento.nombre}
                      </option>
                    )})}
                  </select>
                </div>
                <div className="mb-3">
                <label>idproveedor</label>
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
                <div className="mb-3">
                  <label>descripcion</label>
                  <input
                    type="text"
                    className="form-control"
                    value={selectedCategory.descripcion}
                    onChange={(e) =>
                      setSelectedCategory({ ...selectedCategory, descripcion: e.target.value })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label>precio venta</label>
                  <input
                    type="text"
                    className="form-control"
                    value={selectedCategory.precioventa}
                    onChange={(e) =>
                      setSelectedCategory({ ...selectedCategory, precioventa: e.target.value })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label>precio costo</label>
                  <input
                    type="text"
                    className="form-control"
                    value={selectedCategory.preciocosto}
                    onChange={(e) =>
                      setSelectedCategory({ ...selectedCategory, preciocosto: e.target.value })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label>deposito</label>
                  <input
                    type="text"
                    className="form-control"
                    value={selectedCategory.deposito}
                    onChange={(e) =>
                      setSelectedCategory({ ...selectedCategory, deposito: e.target.value })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label>ubicacion</label>
                  <input
                    type="text"
                    className="form-control"
                    value={selectedCategory.ubicacion}
                    onChange={(e) =>
                      setSelectedCategory({ ...selectedCategory, ubicacion: e.target.value })
                    }
                  />
                </div>

                <div className="mb-3">
                  <label>stockmin</label>
                  <input
                    type="text"
                    className="form-control"
                    value={selectedCategory.stockmin}
                    onChange={(e) =>
                      setSelectedCategory({ ...selectedCategory, stockmin: e.target.value })
                    }
                  />
                </div>

                <div className="mb-3">
                  <label>stock</label>
                  <input
                    type="text"
                    className="form-control"
                    value={selectedCategory.stock}
                    onChange={(e) =>
                      setSelectedCategory({ ...selectedCategory, stock: e.target.value })
                    }
                  />
                </div>

                <div className="mb-3">
                  <label>stockmax</label>
                  <input
                    type="text"
                    className="form-control"
                    value={selectedCategory.stockmax}
                    onChange={(e) =>
                      setSelectedCategory({ ...selectedCategory, stockmax: e.target.value })
                    }
                  />
                </div>

                <div className="mb-3">
                  <label>descripcioncompleta</label>
                  <input
                    type="text"
                    className="form-control"
                    value={selectedCategory.descripcioncompleta}
                    onChange={(e) =>
                      setSelectedCategory({ ...selectedCategory, descripcioncompleta: e.target.value })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label>codigoArticulo</label>
                  <input
                    type="text"
                    className="form-control"
                    value={selectedCategory.codigoArticulo}
                    onChange={(e) =>
                      setSelectedCategory({ ...selectedCategory, codigoArticulo: e.target.value })
                    }
                  />
                </div>

                <div className="mb-3">
                  <label>Estado</label>
                  <input
                    type="text"
                    className="form-control"
                    value={selectedCategory.estado}
                    onChange={(e) =>
                      setSelectedCategory({ ...selectedCategory, estado: e.target.value })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label>Imagen</label>
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
                    onChange={(e) => setImageFile(e.target.files[0])}
                  />
                </div>
             
              </div>
              <div className="modal-footer">
                <button type="submit" className="btn btn-primary">
                  {isEditing ? "Guardar Cambios" : "Crear Producto"}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setModalVisible(false)}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryTable;

