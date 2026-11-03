"use strict";

document.addEventListener("DOMContentLoaded", () => {
  // Obtiene el año actual automáticamente.
  const elementoAnio = document.getElementById("anio-actual");

  if (elementoAnio) {
    elementoAnio.textContent = String(new Date().getFullYear());
  }

  // Hace que el botón vuelva al principio de la página.
  const botonVolverArriba = document.getElementById("volver-arriba");

  if (botonVolverArriba) {
    botonVolverArriba.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    });
  }

  // Control del formulario de contacto y envío de correo en segundo plano
  const formularioContacto = document.getElementById("formulario-contacto");
  const campoOculto = document.getElementById("campo-oculto");
  const mensajeEstado = document.getElementById("mensaje-estado");
  const botonEnviar = document.getElementById("boton-enviar");

  if (formularioContacto) {
    // Al resetear el formulario, limpiamos cualquier mensaje de estado previo
    formularioContacto.addEventListener("reset", () => {
      if (mensajeEstado) {
        mensajeEstado.textContent = "";
        mensajeEstado.style.display = "none";
      }
    });

    formularioContacto.addEventListener("submit", async (evento) => {
      evento.preventDefault();

      // 1. Verificación de seguridad: si el campo oculto ha sido rellenado (honeypot), se bloquea el envío
      if (campoOculto && campoOculto.value.trim() !== "") {
        if (mensajeEstado) {
          mensajeEstado.textContent = "No se puede enviar el formulario: se ha detectado el campo oculto rellenado (antispam).";
          mensajeEstado.className = "mensaje-estado error";
          mensajeEstado.style.display = "block";
        }

        console.warn("Envío bloqueado: el campo oculto contiene valor.");
        return;
      }

      // 2. Indicador visual mientras se envía el correo
      if (mensajeEstado) {
        mensajeEstado.textContent = "Enviando correo...";
        mensajeEstado.className = "mensaje-estado info";
        mensajeEstado.style.display = "block";
      }

      if (botonEnviar) {
        botonEnviar.disabled = true;
        botonEnviar.textContent = "Enviando...";
      }

      // 3. Envío directo al correo en segundo plano (el usuario no ve nada externo)
      try {
        const formData = new FormData(formularioContacto);

        const respuesta = await fetch("https://formsubmit.co/ajax/2904062@alu.murciaeduca.es", {
          method: "POST",
          headers: {
            "Accept": "application/json"
          },
          body: formData
        });

        if (respuesta.ok) {
          if (mensajeEstado) {
            mensajeEstado.textContent = "correo enviado";
            mensajeEstado.className = "mensaje-estado exito";
            mensajeEstado.style.display = "block";
          }
          formularioContacto.reset();
        } else {
          throw new Error("Respuesta no satisfactoria del servicio de correo");
        }
      } catch (error) {
        console.error("Error al enviar el correo:", error);
        if (mensajeEstado) {
          mensajeEstado.textContent = "No se pudo enviar el correo. Por favor, inténtalo de nuevo.";
          mensajeEstado.className = "mensaje-estado error";
          mensajeEstado.style.display = "block";
        }
      } finally {
        if (botonEnviar) {
          botonEnviar.disabled = false;
          botonEnviar.textContent = "Enviar mensaje";
        }
      }
    });
  }
});
