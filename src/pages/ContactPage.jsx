import React, { useState } from "react";
import { Footer, Navbar } from "../components";
import { mensajeRespuesta } from "../utils/services";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "El nombre es obligatorio.";
    if (!formData.email.trim()) {
      newErrors.email = "El correo electrónico es obligatorio.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "El correo electrónico no es válido.";
    }
    if (!formData.message.trim()) newErrors.message = "El mensaje es obligatorio.";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      const response = await fetch(process.env.REACT_APP_API + "RecepcionEmail.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSuccessMessage("Mensaje enviado con éxito. ¡Gracias por contactarnos!");
        
        setFormData({ name: "", email: "", message: "" });
      } else {
        setErrors({ form: "Hubo un error al enviar el mensaje. Inténtalo nuevamente." });
        
      }
    } catch (error) {
      setErrors({ form: "Error de conexión. Por favor, inténtalo más tarde." });
      
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <>
      <Navbar />
      <div className="container my-3 py-3">
        <h1 className="text-center">Contáctenos</h1>
        <hr />
        <div className="row">
          <div className="col-md-6">
            {/* Información de contacto */}
            <div className="row">
              <div className="col-md-12 item_contacto">📞 (0388) 4918813</div>
            </div>
            <div className="row mt-3">
              <div className="col-md-12 item_contacto">🤳 WhatsApp 388</div>
            </div>
            <div className="row mt-3">
              <div className="col-md-12 item_contacto">
                📧 info@distribuidoraassefperico.com.ar
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-md-12 item_contacto">
                📌 C. Republica de Siria 136, Y4610 Perico, Jujuy, Argentina
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-md-12 item_contacto">
                ⏰ Lunes a Viernes de 8.30hs a 13hs y de 14hs a 18hs
              </div>
            </div>
          </div>
          <div className="col-md-6">
            {/* Formulario */}
            <form onSubmit={handleSubmit}>
              <div className="form-group my-3">
                <label htmlFor="nameInput">Nombre</label>
                <input
                  type="text"
                  className="form-control"
                  id="nameInput"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Ingresa tu nombre"
                />
                {errors.name && <small className="text-danger">{errors.name}</small>}
              </div>
              <div className="form-group my-3">
                <label htmlFor="emailInput">Correo electrónico</label>
                <input
                  type="email"
                  className="form-control"
                  id="emailInput"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="nombre@ejemplo.com"
                />
                {errors.email && <small className="text-danger">{errors.email}</small>}
              </div>
              <div className="form-group my-3">
                <label htmlFor="messageInput">Mensaje</label>
                <textarea
                  rows={5}
                  className="form-control"
                  id="messageInput"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Escribe tu mensaje"
                ></textarea>
                {errors.message && <small className="text-danger">{errors.message}</small>}
              </div>
              <div className="text-center">
                <button
                  className="btn btn-dark my-2 px-4"
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Enviando..." : "Enviar"}
                </button>
              </div>
              {errors.form && (
                <div className="alert alert-danger mt-3" role="alert">
                  {errors.form}
                </div>
              )}
              {successMessage && (
                <div className="alert alert-success mt-3" role="alert">
                  {successMessage}
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ContactPage;