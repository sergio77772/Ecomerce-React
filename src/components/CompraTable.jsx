import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import  SkeletonTable from "./skeleton/SkeletonTable"
import { mensajeRespuesta, confirmAction } from "../utils/services";

const CompraTable = () => {
  const [Compra, setCompra] = useState([]);
  const [loading, setLoading] = useState(true);
   const [debouncedSearch, setDebouncedSearch] = useState(""); // Estado para el debounce
  const [error, setError] = useState(null);
  const [selectedClie, setSelectedClie] = useState({
    letra: "",
  nroFacturaRemito: "",
   fecha: "",
    recargo: "",
    fechahoraregistro: "",  
    descuento: "",
   formapago: "",
    subtotal: "",
    iva: "",
    neto: "",
    total: "",
    idproveedor: "",
    
  

  });
  const [modalVisible, setModalVisible] = useState(false);
  const [search, setSearch] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [isEditing, setIsEditing] = useState(false); // Nueva bandera para distinguir entre alta y edición

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10; // Límite de elementos por página

  const API = process.env.REACT_APP_API + "compra.php?endpoint=compra";
  const APIB = process.env.REACT_APP_API + "bitacora.php?endpoint=bitacora";

  useEffect(() => {
    loadCompra();
  }, [debouncedSearch, currentPage]);


useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 800); // Retraso de 500ms

    return () => clearTimeout(handler); // Limpiar el temporizador al desmontar o cuando el search cambie
  }, [search]);






  const loadCompra = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API}&search=${search}&page=${currentPage}&limit=${limit}`);
      if (!response.ok) {
        throw new Error("Error al cargar las Compra.");
      }
      const data = await response.json();
      setCompra(data.Compra || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
console.log("compra",Compra)
  const handleEdit = (Clie) => {
    setSelectedClie({
      letra:              Clie.letra || "",
      nroFacturaRemito:   Clie.nroFacturaRemito || "",
      fecha:               Clie.fecha || "",  
      recargo:            Clie.recargo || "",
      fechahoraregistro:    Clie.fechahoraregistro || "",  
      descuento:          Clie.descuento || "",
      formapago:            Clie.formapago || "",
      subtotal:            Clie.subtotal || "",
      iva:                Clie.iva || "",
      neto:              Clie.neto || "",
      total:          Clie.total || "",
      idproveedor: Clie.idproveedor || "",      
      idcompra:       Clie.idcompra,
    });
    setImageFile(null);
    setIsEditing(true); // Activar modo edición
    setModalVisible(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
    

      const method = isEditing ? "PUT" : "POST"; // Diferenciar entre edición y creación
      const endpoint = isEditing
        ? `${API}&id=${selectedClie.idcompra}`
        : `${API}`;

      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(selectedClie),
      });

      if (!response.ok) {
        throw new Error(
          isEditing ? "Error al actualizar la Compra." : "Error al crear la Compra."
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
       modulo: "Compra",
       mensaje:`letra:  ${selectedClie.letra}         
            - nrofacturaremito: ${selectedClie.nrofacturaremito}
            - fecha:  ${selectedClie.nombreapellido} 
            -  recargo: ${selectedClie.recargo}
            -  fechahoraregistro: ${selectedClie.fechahoraregistro}
            -  descuento ${selectedClie.descuento}
            - formapago: ${selectedClie.formapago}
            -  subtotal: ${selectedClie.subtotal}
            -  iva: ${selectedClie.iva} 
            -  neto: ${selectedClie.neto}
            -  total: ${selectedClie.total}
            -  idproveedor: ${selectedClie.idproveedor}
           
        
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
  isEditing ? "Compra actualizado exitosamente" : "Compra creado exitosamente",
  "success"
);
setModalVisible(false);
loadCompra();
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
        throw new Error("Error al eliminar el Compra.");
      }
      mensajeRespuesta("Compra eliminado exitosamente", "success");
      loadCompra();
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
    setSelectedClie({
     letra: "",
     nroFacturaRemito: "",
     fecha: "",
     recargo: "",
     fechahoraregistro: "",  
     descuento: "",
     formapago: "",
     subtotal: "",
     iva: "",
     neto: "",
     total: "",
     idproveedor: "",
      
   
     
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
      <h1 className="mb-4">Gestión de Compra</h1>

      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Buscar Compra..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="mb-3 text-end">
        <button className="btn btn-success" onClick={handleCreate}>
          Añadir Compra
        </button>
      </div>

      <table className="table table-striped table-hover">
        <thead className="thead-dark">
          <tr>
            <th>ID</th>
            <th>letra</th>
            <th>Nro Factura o Remito</th>          
            <th>Fecha</th>
            <th>Forma Pago</th>              
            <th>Total</th>
            
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {Compra.map((Clie) => (
            <tr key={Clie.idcompra}>
              <td>{Clie.idcompra}</td>
              <td>{Clie.letra}</td>
              <td>{Clie.nroFacturaRemito}</td>
              <td>{Clie.fecha}</td>
              <td>{Clie.formapago}</td>
              <td>{Clie.total}</td>
            
            
            
             
              <td>
                <button
                  className="btn btn-warning btn-sm me-2"
                  onClick={() => handleEdit(Clie)}
                >
                  Editar
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(Clie.idcompra)}
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
                {isEditing ? "Editar Compra" : "Añadir Compra"}
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
                  <label><strong>ID Proveedor</strong></label>
                  <div className="mb-3" style={{ border: "2px solid black", borderRadius: "10px" }}>               
                  <input
                    type="text"
                    className="form-control"
                    value={selectedClie.idproveedor}
                    onChange={(e) =>
                      setSelectedClie({ ...selectedClie, idproveedor: e.target.value })
                    }
                  />
                  </div>
                  </div>

                  
                 
                  
               
                  </div>  


              <div className="row">
                  
                 
                  <div className="col-md-4">
                  <label><strong>Letra</strong></label>
                  <div className="mb-3" style={{ border: "2px solid black", borderRadius: "10px" }}>               
                  <input
                    type="text"
                    className="form-control"
                    value={selectedClie.letra}
                    onChange={(e) =>
                      setSelectedClie({ ...selectedClie, letra: e.target.value })
                    }
                  />
                  </div>
                  </div>
                  <div className="col-md-4">
                  <label><strong>Nro de Factura o Remito</strong></label>
                  <div className="mb-3" style={{ border: "2px solid black", borderRadius: "10px" }}>               
                  <input
                    type="text"
                    className="form-control"
                    value={selectedClie.nroFacturaRemito}
                    onChange={(e) =>
                      setSelectedClie({ ...selectedClie,nroFacturaRemito: e.target.value })
                    }
                  />

                  </div>
                  </div>

                  <div className="col-md-4">
                  <label><strong>Fecha</strong></label>
                  <div className="mb-3" style={{ border: "2px solid black", borderRadius: "10px" }}>               
                  <input
                    type="text"
                    className="form-control"
                    value={selectedClie.fecha}
                    onChange={(e) =>
                      setSelectedClie({ ...selectedClie,fecha: e.target.value })
                    }
                  />

                  </div>
                  </div>
                   </div>  

                   <div className="row">
              



                 
                  <div className="col-md-4">
                  <label><strong>Neto</strong></label>
                  <div className="mb-3" style={{ border: "2px solid black", borderRadius: "10px" }}>               
                  <input
                    type="text"
                    className="form-control"
                    value={selectedClie.neto}
                    onChange={(e) =>
                      setSelectedClie({ ...selectedClie, neto: e.target.value })
                    }
                  />


                  </div>
                  </div>

                  <div className="col-md-4">
                  <label><strong>Iva</strong></label>
                  <div className="mb-3" style={{ border: "2px solid black", borderRadius: "10px" }}>               
                  <input
                    type="text"
                    className="form-control"
                    value={selectedClie.iva}
                    onChange={(e) =>
                      setSelectedClie({ ...selectedClie, iva: e.target.value })
                    }
                  />
                  </div>
                  </div>
                
                  <div className="col-md-4">
                  <label><strong>Subtotal</strong></label>
                  <div className="mb-3" style={{ border: "2px solid black", borderRadius: "10px" }}>               
                  <input
                    type="text"
                    className="form-control"
                    value={selectedClie.subtotal}
                    onChange={(e) =>
                      setSelectedClie({ ...selectedClie, subtotal: e.target.value })
                    }
                  />
                  </div>
                  </div>
                 

                   </div>  
                  

                   <div className="row">
                
                   <div className="col-md-4">
                  <label><strong>Descuento</strong></label>
                  <div className="mb-3" style={{ border: "2px solid black", borderRadius: "10px" }}>               
                  <input
                    type="text"
                    className="form-control"
                    value={selectedClie.descuento}
                    onChange={(e) =>
                      setSelectedClie({ ...selectedClie, descuento: e.target.value })
                    }
                  />
                  </div>
                  </div>
                 
                  <div className="col-md-4">
                  <label><strong>Recargo</strong></label>
                  <div className="mb-3" style={{ border: "2px solid black", borderRadius: "10px" }}>               
                  <input
                    type="text"
                    className="form-control"
                    value={selectedClie.recargo}
                    onChange={(e) =>
                      setSelectedClie({ ...selectedClie, recargo: e.target.value })
                    }
                  />


                  </div>
                  </div>

                  <div className="col-md-4">
                  <label><strong>Total</strong></label>
                  <div className="mb-3" style={{ border: "2px solid black", borderRadius: "10px" }}>               
                  <input
                    type="text"
                    className="form-control"
                    value={selectedClie.total}
                    onChange={(e) =>
                      setSelectedClie({ ...selectedClie, total: e.target.value })
                    }
                  />
                  </div>
                  </div>

                  </div>

                
                   <div className="row">
                  

                   <div className="col-md-4">
                  <label><strong>Forma de Pago</strong></label>
                  <div className="mb-3" style={{ border: "2px solid black", borderRadius: "10px" }}>               
                  <input
                    type="text"
                    className="form-control"
                    value={selectedClie.formapago}
                    onChange={(e) =>
                      setSelectedClie({ ...selectedClie,formapago: e.target.value })
                    }
                  />
                  </div>
                  </div>
               
                  </div>
                 
                  
                 
                 

               
                
                 




             
              </div>
              <div className="modal-footer">
                <button type="submit" className="btn btn-primary">
                  {isEditing ? "Guardar Cambios" : "Crear Compra"}
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

export default CompraTable;
