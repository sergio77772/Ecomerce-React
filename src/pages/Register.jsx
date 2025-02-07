import React, { useState } from 'react';
import { Footer, Navbar } from "../components";
import { Link } from 'react-router-dom';

const Register = () => {
    const [formData, setFormData] = useState({
        nombre: "",
        correo: "",
        password: "",
        confirmPassword: "",
        direccion: ""
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");

        if (formData.password !== formData.confirmPassword) {
            setMessage("Las contraseñas no coinciden");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch("https://distribuidoraassefperico.com.ar/apis-stg/users.php?action=register", {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "token": "Bearer TU_TOKEN_AQUI"
                },
                body: new URLSearchParams({
                    nombre: formData.nombre,
                    correo: formData.correo,
                    password: formData.password,
                    direccion: formData.direccion
                })
            });

            const data = await response.json();
            if (response.ok) {
                setMessage("Registro exitoso. Redirigiendo...");
                setTimeout(() => window.location.href = "/login", 2000);
            } else {
                setMessage(data.error || "Error en el registro");
            }
        } catch (error) {
            setMessage("Error en la solicitud");
        }
        setLoading(false);
    };

    return (
        <>
            <Navbar />
            <div className="container my-3 py-3">
                <h1 className="text-center">Registrate</h1>
                <hr />
                <div className="row my-4 h-100">
                    <div className="col-md-4 col-lg-4 col-sm-8 mx-auto">
                        <form onSubmit={handleSubmit}>
                            <div className="form-group my-3">
                                <label htmlFor="Name">Nombre completo</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="Name"
                                    name="nombre"
                                    placeholder="Ingrese su nombre"
                                    value={formData.nombre}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group my-3">
                                <label htmlFor="Email">Correo electrónico</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    id="Email"
                                    name="correo"
                                    placeholder="name@example.com"
                                    value={formData.correo}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group my-3">
                                <label htmlFor="Password">Contraseña</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    id="Password"
                                    name="password"
                                    placeholder="Contraseña"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group my-3">
                                <label htmlFor="ConfirmPassword">Confirmar Contraseña</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    id="ConfirmPassword"
                                    name="confirmPassword"
                                    placeholder="Confirmar contraseña"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group my-3">
                                <label htmlFor="Address">Dirección</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="Address"
                                    name="direccion"
                                    placeholder="Ingrese su dirección"
                                    value={formData.direccion}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="my-3">
                                <p>¿Ya tienes una cuenta? <Link to="/login" className="text-decoration-underline text-info">Ingreso</Link> </p>
                            </div>
                            {message && <p className="text-center text-danger">{message}</p>}
                            <div className="text-center">
                                <button className="my-2 mx-auto btn btn-dark" type="submit" disabled={loading}>
                                    {loading ? "Registrando..." : "Registrarse"}
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