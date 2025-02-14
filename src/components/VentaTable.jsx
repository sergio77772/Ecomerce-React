import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import  SkeletonTable from "./skeleton/SkeletonTable"
import { mensajeRespuesta, confirmAction } from "../utils/services";

const VentaTable = () => {
  const [venta, setventa] = useState([]);
  const [loading, setLoading] = useState(true);
   const [debouncedSearch, setDebouncedSearch] = useState(""); // Estado para el debounce
  const [error, setError] = useState(null);
  const [selectedVen, setselectedVen] = useState({

    preciocosto: "",
    precioventa: "",
    unidadmedida: "",
    cantidad: "",
    importe: "",
    descripcion: "",
    codigoArticulo: "",
    idfactura: "",
    imagen :"",
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [search, setSearch] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [isEditing, setIsEditing] = useState(false); // Nueva bandera para distinguir entre alta y edición

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10; // Límite de elementos por página

  const API = process.env.REACT_APP_API + "venta.php?endpoint=venta";
  const APIB = process.env.REACT_APP_API + "bitacora.php?endpoint=bitacora";

  useEffect(() => {
    loadventa();
  }, [debouncedSearch, currentPage]);


useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 800); // Retraso de 500ms

    return () => clearTimeout(handler); // Limpiar el temporizador al desmontar o cuando el search cambie
  }, [search]);






  const loadventa = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API}&search=${search}&page=${currentPage}&limit=${limit}`);
      if (!response.ok) {
        throw new Error("Error al cargar las venta.");
      }
      const data = await response.json();
      setventa(data.venta || []);
      setTotalPages(data.totalPages || 1);
      console.log("venta",venta);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (Ven) => {
    setselectedVen({
      preciocosto: Ven.preciocosto || "",
      precioventa: Ven.precioventa || "",
      unidadmedida: Ven.unidadmedida|| "",  
      cantidad: Ven.cantidad || "",
      importe: Ven.importe || "",
      descripcion: Ven.descripcion || "",
      codigoArticulo: Ven.codigoArticulo || "",
      idfactura: Ven.idfactura || "",
      imagen: Ven.imagen || "",
    
      idventa: Ven.idventa,
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

        const uploadResponse = await fetch(`${process.env.REACT_APP_API}venta.php?endpoint=upload`, {
          method: "POST",
          body: formData,
        });

        if (!uploadResponse.ok) {
          throw new Error("Error al subir la imagen.");
        }

        const uploadResult = await uploadResponse.json();
        selectedVen.imagen = uploadResult.filePath;
      }

      const method = isEditing ? "PUT" : "POST"; // Diferenciar entre edición y creación
      const endpoint = isEditing
        ? `${API}&id=${selectedVen.idventa}`
        : `${API}`;

      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(selectedVen),
      });

      if (!response.ok) {
        throw new Error(
          isEditing ? "Error al actualizar la venta." : "Error al crear la venta."
        );
      }
      
// Aquí agregamos la llamada al API de bitácora
const usuario = localStorage.getItem('user')|| 'sin usuario';
const bitacoraResponse =  await fetch(APIB, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
       fechahora: new Date().toISOString(),
       usuario:usuario,
       modulo: "ventaES",
       mensaje:`preciocosto:  ${selectedVen.preciocosto}         
       -   precioventa: ${selectedVen.precioventa}
       -   unidadmedida:  ${selectedVen.unidadmedida} 
       -   cantidad: ${selectedVen.cantidad}
       -  importe ${selectedVen.importe}
       -  descripcion: ${selectedVen.descripcion}
       -  codigoArticulo: ${selectedVen.codigoArticulo}
       -  idfactura: ${selectedVen.idfactura} 
     
       -  Metodo: : ${method}
        idventa  ${selectedVen.idventa}
     ` ,                      
       // Diferenciar entre edición y creación
       imagen: "",
  }),
});
console.log("bitacora",bitacoraResponse);
if (!bitacoraResponse.ok) {
  throw new Error("Error al registrar en la bitácora.");
}
mensajeRespuesta(
  isEditing ? "venta actualizado exitosamente" : "venta creado exitosamente",
  "success"
);
setModalVisible(false);
loadventa();
} catch (err) {
mensajeRespuesta(err.message, "error");
}
};

const handleDelete = async (id) => {
  const confirmed = await confirmAction(
    "¿Estás seguro?",
    "Esta acción no se puede deshacer.",
    "Sí, eliminar",
    "Cancelar"
  );

  if (confirmed) {
    try {
      const response = await fetch(`${API}&id=${id}`, { method: "DELETE" });
      if (!response.ok) {
        throw new Error("Error al eliminar el venta.");
      }
      mensajeRespuesta("venta eliminado exitosamente", "success");
      loadventa();
    } catch (err) {
      mensajeRespuesta(err.message, "error");
    }
  
  };
};

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleCreate = () => {
    setselectedVen({
      preciocosto: "",
      precioventa: "",
      unidadmedida: "",
      cantidad: "",
      importe: "",
      descripcion: "",
      codigoArticulo: "",
      idfactura: "",
      imagen :"",
    });
    setImageFile(null);
    setIsEditing(false); // Activar modo alta
    setModalVisible(true);
  };

  if (loading) {
    return <div className="text-center">
      <SkeletonTable rows={5} columns={5} />
    </div>;
  }

  if (error) {
    return <div className="alert alert-danger text-center">{error}</div>;
  }

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Gestión de venta</h1>

      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Buscar venta..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="mb-3 text-end">
        <button className="btn btn-success" onClick={handleCreate}>
          Añadir venta
        </button>
      </div>

      <table className="table table-striped table-hover">
        <thead className="thead-dark">
        <tr>
            <th>Cod Articulo</th>
            <th>Descripcion</th>
            <th>Precio Costo</th>
            <th>Precio Venta</th>
            <th>cantidad</th>
            <th>Importe</th>
            <th>Imagen</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {venta.map((Ven) => (
            <tr key={Ven.idventa}>
              <td>{Ven.codigoArticulo}</td>
              <td>{Ven.descripcion}</td>
              <td>{Ven.preciocosto}</td>
              <td>{Ven.precioventa}</td>
              <td>{Ven.cantidad}</td>
              <td>{Ven.importe}</td>
              <td>
                {Ven.imagen && (
                  <img
                    src={process.env.REACT_APP_BASE_URL + Ven.imagen}
                    alt={Ven.descripcion}
                    style={{ width: "50px" }}
                  />
                )}
              </td>
              <td>
                <button
                  className="btn btn-warning btn-sm me-2"
                  onClick={() => handleEdit(Ven)}
                >
                  Editar
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(Ven.idventa)}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Paginación */}
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
                {isEditing ? "Editar venta" : "Añadir venta"}
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
                  
                  <div className="col-md-8">
                  <label><strong>Descripción</strong></label>
                  <div className="mb-3" style={{ border: "2px solid black", borderRadius: "10px" }}>               
                
                  <input
                    type="text"
                    className="form-control"
                    value={selectedVen.descripcion}
                    onChange={(e) =>
                      setselectedVen({ ...selectedVen, descripcion: e.target.value })
                    }
                  />
                
                  </div>
                  </div>
                  <div className="col-md-4">
                  <label><strong>Unidad de Medida</strong></label>
                  <div className="mb-3" style={{ border: "2px solid black", borderRadius: "10px" }}>               
                  <input
                    type="text"
                    className="form-control"
                    value={selectedVen.unidadmedida}
                    onChange={(e) =>
                      setselectedVen({ ...selectedVen, unidadmedida: e.target.value })
                    }
                  />
                  </div>
                  </div>
                

                   </div>  

                   <div className="row">
                   <div className="col-md-4">
                  <label><strong>Cantidad</strong></label>
                  <div className="mb-3" style={{ border: "2px solid black", borderRadius: "10px" }}>               
                  <input
                    type="text"
                    className="form-control"
                    value={selectedVen.cantidad}
                    onChange={(e) =>
                      setselectedVen({ ...selectedVen, cantidad: e.target.value })
                    }
                  />

                  </div>
                  </div>



                  <div className="col-md-4">
                  <label><strong>Importe</strong></label>
                  <div className="mb-3" style={{ border: "2px solid black", borderRadius: "10px" }}>               
                  <input
                    type="text"
                    className="form-control"
                    value={selectedVen.importe}
                    onChange={(e) =>
                      setselectedVen({ ...selectedVen, importe: e.target.value })
                    }
                  />


                  </div>
                  </div>
                
               

                   </div>  
                 
                  <div className="row">
                  <div className="col-md-4">
                  <label><strong>Precio Costo </strong></label>
                  <div className="mb-3" style={{ border: "2px solid black", borderRadius: "10px" }}>               
                  <input
                    type="text"
                    className="form-control"
                    value={selectedVen.preciocosto}
                    onChange={(e) =>
                      setselectedVen({ ...selectedVen, preciocosto: e.target.value })
                    }
                  />
                  </div>
                  </div>

                  <div className="col-md-4">
                  <label><strong>Precio Venta</strong></label>
                  <div className="mb-3" style={{ border: "2px solid black", borderRadius: "10px" }}>               
                  <input
                    type="text"
                    className="form-control"
                    value={selectedVen.precioventa}
                    onChange={(e) =>
                      setselectedVen({ ...selectedVen, precioventa: e.target.value })
                    }
                  />
                  </div>
                  </div>
                 
                  </div>
                  <div className="row">
                  <div className="col-md-4">
                  <label><strong>Codigo Articulo</strong></label>
                  <div className="mb-3" style={{ border: "2px solid black", borderRadius: "10px" }}>               
                  <input
                    type="text"
                    className="form-control"
                    value={selectedVen.codigoArticulo}
                    onChange={(e) =>
                      setselectedVen({ ...selectedVen, codigoArticulo: e.target.value })
                    }
                  />
                  </div>
                  </div>

                  <div className="col-md-4">
                  <label><strong>ID Factura</strong></label>
                  <div className="mb-3" style={{ border: "2px solid black", borderRadius: "10px" }}>               
                  <input
                    type="text"
                    className="form-control"
                    value={selectedVen.idfactura}
                    onChange={(e) =>
                      setselectedVen({ ...selectedVen, idfactura: e.target.value })
                    }
                  />
                  </div>
                  </div>
                 
                  </div>





                  <div className="col-md-4">
                  <label><strong>Imagen</strong></label>
                  <div className="mb-3" style={{ border: "2px solid black", borderRadius: "10px" }}>               
               
              
                  {selectedVen.imagen && (
                    <div className="mb-2">
                      <img
                        src={process.env.REACT_APP_BASE_URL + selectedVen.imagen}
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
                 

               
                
                 




             
              </div>
              <div className="modal-footer">
                <button type="submit" className="btn btn-primary">
                  {isEditing ? "Guardar Cambios" : "Crear venta"}
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

export default VentaTable;
