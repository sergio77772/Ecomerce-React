import React, { useState } from "react";
import { Footer, Navbar } from "../components";
import { Link, useNavigate } from "react-router-dom";
import { mensajeRespuesta } from "../utils/services";
import { getAuth, signInWithPopup } from "firebase/auth";
import { app, provider } from "../firebase";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: "",
    correo: "",
    password: "",
    confirmPassword: "",
    direccion: "",
  });

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [message, setMessage] = useState("");

  const API = process.env.REACT_APP_API + "publicUser.php?action=register";

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    const auth = getAuth(app);
    try {
      const result = await signInWithPopup(auth, provider);
      const { displayName, email } = result.user;
  
      const googleUserData = {
        nombre: displayName,
        correo: email,
        password: "default1234",
        confirmPassword: "default1234",
        direccion: "N/A", // Puedes modificar esto si tienes otro dato por defecto
      };
  
      const response = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(googleUserData),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        mensajeRespuesta("Registro exitoso con Google", "success");
        navigate("/");
      } else {
        setMessage(data.error || "Error en el registro con Google");
      }
    } catch (error) {
      console.error("Error en la autenticación con Google:", error);
      mensajeRespuesta("Error en el registro con Google", "error");
    }
    setGoogleLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (formData.password.length < 6) {
      setMessage("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setMessage("Las contraseñas no coinciden");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(API, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new URLSearchParams(formData),
      });

      const data = await response.json();

      if (response.ok) {
        mensajeRespuesta("Registro exitoso", "success");
        navigate("/login");
      } else {
        setMessage(data.error || "Error en el registro");
      }
    } catch (error) {
      setMessage("Error en la solicitud: " + error.message);
    }
    setLoading(false);
  };

  return (
    <>
      <Navbar />
      <div className="container my-3 py-3">
        <h1 className="text-center">Regístrate</h1>
        <hr />
        <div className="row my-4 h-100">
          <div className="col-md-4 col-lg-4 col-sm-8 mx-auto">
            <form onSubmit={handleSubmit}>
              {[
                { label: "Nombre completo", name: "nombre", type: "text" },
                { label: "Correo electrónico", name: "correo", type: "email" },
                { label: "Contraseña", name: "password", type: "password" },
                {
                  label: "Confirmar contraseña",
                  name: "confirmPassword",
                  type: "password",
                },
                { label: "Dirección", name: "direccion", type: "text" },
              ].map(({ label, name, type }) => (
                <div className="form-group my-3" key={name}>
                  <label htmlFor={name}>{label}</label>
                  <input
                    type={type}
                    className="form-control"
                    id={name}
                    name={name}
                    placeholder={`Ingrese su ${label.toLowerCase()}`}
                    value={formData[name]}
                    onChange={handleChange}
                    required
                  />
                </div>
              ))}

              <div className="my-3">
                <p>
                  ¿Ya tienes una cuenta?{" "}
                  <Link to="/login" className="text-decoration-underline text-info">
                    Ingreso
                  </Link>
                </p>
              </div>

              {message && <p className="text-center text-danger">{message}</p>}

              <div className="text-center">
                <button className="my-2 btn btn-dark" type="submit" disabled={loading}>
                  {loading ? "Registrando..." : "Registrarse"}
                </button>
                <button
                  type="button"
                  className="my-2 btn btn-light ms-2"
                  onClick={handleGoogleSignIn}
                  disabled={googleLoading}
                >
                  {googleLoading ? "Autenticando..." : "Registrarse con Google"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Register;
