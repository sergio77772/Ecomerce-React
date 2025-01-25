import Swal from "sweetalert2";

export const mensajeRespuesta = (mensaje, icono ) =>{
     Swal.fire({
    icon: icono,
    title: mensaje,
    showConfirmButton: false,
    timer: 1500
   });
};


