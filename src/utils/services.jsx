import Swal from 'sweetalert2'

export const mensajeRespuesta = (mensaje, icono) => {
  Swal.fire({
    icon: icono,
    title: mensaje,
    showConfirmButton: false,
    timer: 1500,
  })
}

export const confirmAction = async (
  title,
  text,
  confirmButtonText,
  cancelButtonText
) => {
  const result = await Swal.fire({
    title: title,
    text: text,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: confirmButtonText,
    cancelButtonText: cancelButtonText,
  })

  return result.isConfirmed // Devuelve si se confirmó o no
}
