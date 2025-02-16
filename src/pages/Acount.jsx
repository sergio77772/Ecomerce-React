import { Navbar, Footer } from '../components';
import { useSelector, useDispatch } from 'react-redux';
import { useState } from 'react';
import { editUser } from '../redux/action/userActions';

function Account() {
  const baseURL = process.env.REACT_APP_BASE_URL;
  const usuario = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  
  const [nombre, setNombre] = useState(usuario?.nombre || '');
  const [email, setEmail] = useState(usuario?.correo || '');
  const [foto, setFoto] = useState(`${baseURL}${usuario.foto}` || baseURL+'/img/user/profile.png');
  const [direccion, setDireccion] = useState(usuario?.direccion || '');
  const [telefono, setTelefono] = useState(usuario?.telefono || '');
  const [fileFoto, setFileFoto] = useState(null);
  const [editing, setEditing] = useState(false);

  const handleNombreChange = (e) => setNombre(e.target.value);
  const handleEmailChange = (e) => setEmail(e.target.value);
  const handleDireccionChange = (e) => setDireccion(e.target.value);
  const handleTelefonoChange = (e) => setTelefono(e.target.value);

  const handleFotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileFoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFoto(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    const formData = new FormData();
    formData.append('id', usuario.id);
    formData.append('nombre', nombre); // Ahora toma el nombre actualizado
    formData.append('correo', email);
    formData.append('direccion', direccion);
    formData.append('telefono', telefono);
    formData.append('method', 'PUT');

    if (fileFoto) {
      formData.append('foto', fileFoto);
    }

    console.log([...formData]); // 🔍 Verifica en la consola que los datos están correctamente agregados

    dispatch(editUser(formData));
    setEditing(false);
  };

  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <h2 className="mb-4 text-center">Perfil de Usuario</h2>
        {usuario ? (
          <div className="card p-4 shadow-lg border-0 rounded text-center">
            <div className="position-relative">
              <img 
                src={foto} 
                alt="Foto de perfil" 
                className="rounded-circle img-thumbnail mb-3" 
                style={{ width: '150px', height: '150px', objectFit: 'cover' }}
              />
              {editing && (
                <div className="mt-2">
                  <input type="file" accept="image/*" onChange={handleFotoChange} className="form-control" />
                </div>
              )}
            </div>
            <div className="mt-3 text-start">
              {editing ? (
                <div>
                  <label className="form-label"><strong>Nombre:</strong></label>
                  <input type="text" className="form-control" value={nombre} onChange={handleNombreChange} />
                  <label className="form-label mt-2"><strong>Email:</strong></label>
                  <input type="email" className="form-control" value={email} onChange={handleEmailChange} />
                  <label className="form-label mt-2"><strong>Dirección:</strong></label>
                  <input type="text" className="form-control" value={direccion} onChange={handleDireccionChange} />
                  <label className="form-label mt-2"><strong>Teléfono:</strong></label>
                  <input type="text" className="form-control" value={telefono} onChange={handleTelefonoChange} />
                </div>
              ) : (
                <>
                  <p><strong>Nombre:</strong> {nombre}</p>
                  <p><strong>Email:</strong> {email}</p>
                  <p><strong>Dirección:</strong> {direccion}</p>
                  <p><strong>Teléfono:</strong> {telefono}</p>
                </>
              )}
            </div>
            <div className="mt-3">
              {editing ? (
                <>
                  <button className="btn btn-success me-2" onClick={handleSave}>Guardar cambios</button>
                  <button className="btn btn-secondary" onClick={() => setEditing(false)}>Cancelar</button>
                </>
              ) : (
                <button className="btn btn-primary" onClick={() => setEditing(true)}>Editar perfil</button>
              )}
            </div>
          </div>
        ) : (
          <p className="text-center">No hay información disponible.</p>
        )}
      </div>
      <Footer />
    </>
  );
}

export default Account;
