import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import  SkeletonTable from "./skeleton/SkeletonTable"
import { mensajeRespuesta, confirmAction } from "../utils/services";

const ClienteTable = () => {
  const [Cliente, setCliente] = useState([]);
  const [loading, setLoading] = useState(true);
   const [debouncedSearch, setDebouncedSearch] = useState(""); // Estado para el debounce
  const [error, setError] = useState(null);
  const [selectedClie, setSelectedClie] = useState({
    dnicuit: "",
    condicioniva: "",
    nombreapellido: "",
    cuil: "",
    direccion: "",
    localidad: "",
    provincia: "",
    nacionalidad: "",
    telefono: "",
    email: "",
    fechanacimiento: "",
    estadocivil: "",     
    cuentacorriente: "",
    limitecuentacorriente: "",
    calificacion: "",
    estado: "",     
    fechaalta: "",
    foto: "",

  });
  const [modalVisible, setModalVisible] = useState(false);
  const [search, setSearch] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [isEditing, setIsEditing] = useState(false); // Nueva bandera para distinguir entre alta y edición

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10; // Límite de elementos por página

  const API = process.env.REACT_APP_API + "cliente.php?endpoint=cliente";
  const APIB = process.env.REACT_APP_API + "bitacora.php?endpoint=bitacora";

  useEffect(() => {
    loadCliente();
  }, [debouncedSearch, currentPage]);


useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 800); // Retraso de 500ms

    return () => clearTimeout(handler); // Limpiar el temporizador al desmontar o cuando el search cambie
  }, [search]);






  const loadCliente = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API}&search=${search}&page=${currentPage}&limit=${limit}`);
      if (!response.ok) {
        throw new Error("Error al cargar las Cliente.");
      }
      const data = await response.json();
      setCliente(data.Cliente || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
console.log("cliente",Cliente)
  const handleEdit = (Clie) => {
    setSelectedClie({
      dnicuit:        Clie.dnicuit || "",
      condicioniva:   Clie.condicioniva || "",
      nombreapellido: Clie.nombreapellido || "",  
      cuil:           Clie.cuil || "",
      direccion:      Clie.direccion || "",
      localidad:      Clie.localidad || "",
      provincia:      Clie.provincia || "",
      nacionalidad:   Clie.nacionalidad || "",
      telefono:       Clie.telefono || "",
      email:          Clie.email || "",
      fechanacimiento: Clie.fechanacimiento || "",
      estadocivil:    Clie.estadocivil || "",
      cuentacorriente: Clie.cuentacorriente || "",
      limitecuentacorriente: Clie.limitecuentacorriente|| "",
      calificacion:    Clie.calificacion || "",
      estado:          Clie.estado || "",
      fechaalta:       Clie.fechaalta|| "",
      foto:            Clie.foto,
      idcliente:       Clie.idcliente,
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

        const uploadResponse = await fetch(`${process.env.REACT_APP_API}cliente.php?endpoint=upload`, {
          method: "POST",
          body: formData,
        });

        if (!uploadResponse.ok) {
          throw new Error("Error al subir la imagen.");
        }

        const uploadResult = await uploadResponse.json();
        selectedClie.imagen = uploadResult.filePath;
      }

      const method = isEditing ? "PUT" : "POST"; // Diferenciar entre edición y creación
      const endpoint = isEditing
        ? `${API}&id=${selectedClie.idcliente}`
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
          isEditing ? "Error al actualizar la Cliente." : "Error al crear la Cliente."
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
       modulo: "Cliente",
       mensaje:`dnicuit:  ${selectedClie.dnicuit}         
            -   condicioniva: ${selectedClie.condicioniva}
            -  nombreapellido:  ${selectedClie.nombreapellido} 
            -  cuil: ${selectedClie.cuil}
            -  direccion ${selectedClie.direccion}
            -  localidad: ${selectedClie.localidad}
            -  provincia: ${selectedClie.provincia}
            -  nacionalidad: ${selectedClie.nacionalidad} 
            -  telefono: ${selectedClie.telefono}
            -  email: ${selectedClie.email}
            -  fechanacimiento: ${selectedClie.fechanacimiento}
            -  estadocivil: ${selectedClie.estadocivil}
            -  cuentacorriente: ${selectedClie.cuentacorriente}
            -  limitecuentacorriente :${selectedClie.limitecuentacorriente}
            -  calificacion: ${selectedClie.calificacion}
            -  estado: ${selectedClie.estado}
            -  fechaalta: ${selectedClie.fechaalta}
            -  foto :${selectedClie.foto}
            -  Metodo: : ${method}
             IDCliente  ${selectedClie.idCliente}
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
  isEditing ? "Cliente actualizado exitosamente" : "Cliente creado exitosamente",
  "success"
);
setModalVisible(false);
loadCliente();
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
        throw new Error("Error al eliminar el Cliente.");
      }
      mensajeRespuesta("Cliente eliminado exitosamente", "success");
      loadCliente();
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
      dnicuit: "",
    condicioniva: "",
    nombreapellido: "",
    cuil: "",
    direccion: "",
    localidad: "",
    provincia: "",
    nacionalidad: "",
    telefono: "",
    email: "",
    fechanacimiento: "",
    estadocivil: "",     
    cuentacorriente: "",
    limitecuentacorriente: "",
    calificacion: "",
    estado: "",     
    fechaalta: "",
    foto: "",
     
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
      <h1 className="mb-4">Gestión de Cliente</h1>

      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Buscar Cliente..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="mb-3 text-end">
        <button className="btn btn-success" onClick={handleCreate}>
          Añadir Cliente
        </button>
      </div>

      <table className="table table-striped table-hover">
        <thead className="thead-dark">
          <tr>
            <th>ID</th>
            <th>Nombre Apellido</th>
            <th>Dni  o Cuit</th>
          
            <th>Telefono</th>
            <th>calificacion</th>
         
          
            <th>Estado</th>
            <th>Imagen</th>
          
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {Cliente.map((Clie) => (
            <tr key={Clie.idcliente}>
              <td>{Clie.idcliente}</td>
              <td>{Clie.nombreapellido}</td>
              <td>{Clie.dnicuit}</td>
           
              <td>{Clie.telefono}</td>
              <td>{Clie.calificacion}</td>
            
            
              <td>{Clie.estado}</td>
              <td>
                {Clie.foto && (
                  <img
                    src={process.env.REACT_APP_BASE_URL + Clie.foto}
                    alt={Clie.nombreapellido}
                    style={{ width: "50px" }}
                  />
                )}
              </td>
              <td>
                <button
                  className="btn btn-warning btn-sm me-2"
                  onClick={() => handleEdit(Clie)}
                >
                  Editar
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(Clie.idcliente)}
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
                {isEditing ? "Editar Cliente" : "Añadir Cliente"}
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
                  <label><strong>Cliente</strong></label>
                  <div className="mb-3" style={{ border: "2px solid black", borderRadius: "10px" }}>               
                
                  <input
                    type="text"
                    className="form-control"
                    value={selectedClie.nombreapellido}
                    onChange={(e) =>
                      setSelectedClie({ ...selectedClie, nombreapellido: e.target.value })
                    }
                  />
                
                  </div>
                  </div>
                  <div className="col-md-4">
                  <label><strong>Dni o Cuit</strong></label>
                  <div className="mb-3" style={{ border: "2px solid black", borderRadius: "10px" }}>               
                  <input
                    type="text"
                    className="form-control"
                    value={selectedClie.dnicuit}
                    onChange={(e) =>
                      setSelectedClie({ ...selectedClie, dnicuit: e.target.value })
                    }
                  />
                  </div>
                  </div>
                

                   </div>  

                   <div className="row">
                   <div className="col-md-4">
                  <label><strong>IVA</strong></label>
                  <div className="mb-3" style={{ border: "2px solid black", borderRadius: "10px" }}>               
                  <input
                    type="text"
                    className="form-control"
                    value={selectedClie.condicioniva}
                    onChange={(e) =>
                      setSelectedClie({ ...selectedClie, condicioniva: e.target.value })
                    }
                  />

                  </div>
                  </div>



                  <div className="col-md-4">
                  <label><strong>Cuil</strong></label>
                  <div className="mb-3" style={{ border: "2px solid black", borderRadius: "10px" }}>               
                  <input
                    type="text"
                    className="form-control"
                    value={selectedClie.cuil}
                    onChange={(e) =>
                      setSelectedClie({ ...selectedClie, cuil: e.target.value })
                    }
                  />


                  </div>
                  </div>
                  <div className="col-md-4">
                  <label><strong>Teléfono</strong></label>
                  <div className="mb-3" style={{ border: "2px solid black", borderRadius: "10px" }}>               
                  <input
                    type="text"
                    className="form-control"
                    value={selectedClie.telefono}
                    onChange={(e) =>
                      setSelectedClie({ ...selectedClie, telefono: e.target.value })
                    }
                  />


                  </div>
                  </div>
               

                   </div>  
                   <div className="row">
                  
                

                  <div className="col-md-12">
                  <label><strong>Dirección</strong></label>
                  <div className="mb-3" style={{ border: "2px solid black", borderRadius: "10px" }}>               
                  <input
                    type="text"
                    className="form-control"
                    value={selectedClie.direccion}
                    onChange={(e) =>
                      setSelectedClie({ ...selectedClie, direccion: e.target.value })
                    }
                  />
                  </div>
                  </div>
              
                   </div>  

                   <div className="row">
                  <div className="col-md-4">
                  <label><strong>Localidad</strong></label>
                  <div className="mb-3" style={{ border: "2px solid black", borderRadius: "10px" }}>               
                  <input
                    type="text"
                    className="form-control"
                    value={selectedClie.localidad}
                    onChange={(e) =>
                      setSelectedClie({ ...selectedClie, localidad: e.target.value })
                    }
                  />
                  </div>
                  </div>

                  <div className="col-md-4">
                  <label><strong>Provincia</strong></label>
                  <div className="mb-3" style={{ border: "2px solid black", borderRadius: "10px" }}>               
                  <input
                    type="text"
                    className="form-control"
                    value={selectedClie.provincia}
                    onChange={(e) =>
                      setSelectedClie({ ...selectedClie, provincia: e.target.value })
                    }
                  />
                  </div>
                  </div>
                  <div className="col-md-4">
                  <label><strong>Nacionalidad</strong></label>
                  <div className="mb-3" style={{ border: "2px solid black", borderRadius: "10px" }}>               
                  <input
                    type="text"
                    className="form-control"
                    value={selectedClie.nacionalidad}
                    onChange={(e) =>
                      setSelectedClie({ ...selectedClie, nacionalidad: e.target.value })
                    }
                  />
                  </div>
                  </div>
                  </div>

                  <div className="row">
                  <div className="col-md-4">
                  <label><strong>Fecha de Nacimiento</strong></label>
                  <div className="mb-3" style={{ border: "2px solid black", borderRadius: "10px" }}>               
                  <input
                    type="text"
                    className="form-control"
                    value={selectedClie.fechanacimiento}
                    onChange={(e) =>
                      setSelectedClie({ ...selectedClie, fechanacimiento: e.target.value })
                    }
                  />
                  </div>
                  </div>

                  
                 
                  
                  <div className="col-md-4">
                  <label><strong>Estado Civil</strong></label>
                  <div className="mb-3" style={{ border: "2px solid black", borderRadius: "10px" }}>               
                  <select
                        className="form-control"
                        id="estado"
                        value={selectedClie.estadocivil}
                        onChange={(e) =>
                          setSelectedClie({
                            ...selectedClie,
                            estadocivil: e.target.value,
                          })
                        }
                      >
                        <option value="">Seleccionar estado</option>
                        <option value="SOLTERO/A">SOLTERO/A</option>
                        <option value="CASADO/A">CASADO/A</option>
                      </select>
                  </div>
                  </div>
                  </div>  
                   <div className="row">
                  
                   <div className="col-md-8">
                  <label><strong>Mail</strong></label>
                  <div className="mb-3" style={{ border: "2px solid black", borderRadius: "10px" }}>               
                  <input
                    type="text"
                    className="form-control"
                    value={selectedClie.email}
                    onChange={(e) =>
                      setSelectedClie({ ...selectedClie, email: e.target.value })
                    }
                  />
                  </div>
                  </div>
                  </div>
                  <div className="row">
                  <div className="col-md-4">
                  <label><strong>Cuenta Corriente</strong></label>
                  <div className="mb-3" style={{ border: "2px solid black", borderRadius: "10px" }}>               
                  <input
                    type="text"
                    className="form-control"
                    value={selectedClie.cuentacorriente}
                    onChange={(e) =>
                      setSelectedClie({ ...selectedClie, cuentacorriente: e.target.value })
                    }
                  />
                  </div>
                  </div>

                  <div className="col-md-4">
                  <label><strong>Limite de la Cta Cte</strong></label>
                  <div className="mb-3" style={{ border: "2px solid black", borderRadius: "10px" }}>               
                  <input
                    type="text"
                    className="form-control"
                    value={selectedClie.limitecuentacorriente}
                    onChange={(e) =>
                      setSelectedClie({ ...selectedClie, limitecuentacorriente: e.target.value })
                    }
                  />
                  </div>
                  </div>
                  <div className="col-md-4">
                  <label><strong>Fecha de Alta</strong></label>
                  <div className="mb-3" style={{ border: "2px solid black", borderRadius: "10px" }}>               
                  <input
                    type="text"
                    className="form-control"
                    value={selectedClie.fechaalta}
                    onChange={(e) =>
                      setSelectedClie({ ...selectedClie, fechaalta: e.target.value })
                    }
                  />
                  </div>
                  </div>
                  </div>
                  <div className="row">
                  <div className="col-md-4">
                  <label><strong>Calificación</strong></label>
                  <div className="mb-3" style={{ border: "2px solid black", borderRadius: "10px" }}>               
                  <input
                    type="text"
                    className="form-control"
                    value={selectedClie.calificacion}
                    onChange={(e) =>
                      setSelectedClie({ ...selectedClie, calificacion: e.target.value })
                    }
                  />
                  </div>
                  </div>

                  
                 
                  
                  <div className="col-md-4">
                  <label><strong>Estado</strong></label>
                  <div className="mb-3" style={{ border: "2px solid black", borderRadius: "10px" }}>               
                  <select
                        className="form-control"
                        id="estado"
                        value={selectedClie.estado}
                        onChange={(e) =>
                          setSelectedClie({
                            ...selectedClie,
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
                  <div className="col-md-4">
                  <label><strong>Foto</strong></label>
                  <div className="mb-3" style={{ border: "2px solid black", borderRadius: "10px" }}>               
               
              
                  {selectedClie.foto && (
                    <div className="mb-2">
                      <img
                        src={process.env.REACT_APP_BASE_URL + selectedClie.foto}
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
                  {isEditing ? "Guardar Cambios" : "Crear Cliente"}
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

export default ClienteTable;
