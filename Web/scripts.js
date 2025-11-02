document.addEventListener("DOMContentLoaded", () => {
        // Seleccionar todos los botones de información
        const infoButtons = document.querySelectorAll(".info-button");

        // Seleccionar todos los botones de cerrar (la 'x')
        const closeButtons = document.querySelectorAll(".close-button");

        // Función para abrir un modal
        infoButtons.forEach((button) => {
          button.addEventListener("click", () => {
            const modalId = button.getAttribute("data-modal");
            const modal = document.getElementById(modalId);
            if (modal) {
              modal.style.display = "flex"; // Usamos 'flex' para centrar el modal-content
            }
          });
        });

        // Función para cerrar un modal
        closeButtons.forEach((button) => {
          button.addEventListener("click", () => {
            const modal = button.closest(".modal"); // Encuentra el modal más cercano al botón 'x'
            if (modal) {
              modal.style.display = "none";
            }
          });
        });

        // Cerrar modal si el usuario hace clic fuera de él
        window.addEventListener("click", (event) => {
          if (event.target.classList.contains("modal")) {
            event.target.style.display = "none";
          }
        });
      });