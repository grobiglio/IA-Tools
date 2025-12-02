document.addEventListener("DOMContentLoaded", () => {
  // --- CÓDIGO DE MODALES (Existente) ---
  const infoButtons = document.querySelectorAll(".info-button");
  const closeButtons = document.querySelectorAll(".close-button");

  infoButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const modalId = button.getAttribute("data-modal");
      const modal = document.getElementById(modalId);
      if (modal) {
        modal.style.display = "flex";
      }
    });
  });

  closeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const modal = button.closest(".modal");
      if (modal) {
        modal.style.display = "none";
      }
    });
  });

  window.addEventListener("click", (event) => {
    if (event.target.classList.contains("modal")) {
      event.target.style.display = "none";
    }
  });

  // --- NUEVO CÓDIGO DARK MODE ---
  const themeToggle = document.getElementById("theme-toggle");
  const body = document.body;

  // Función para aplicar el tema
  const applyTheme = (isDark) => {
    if (isDark) {
      body.classList.add("dark-mode");
    } else {
      body.classList.remove("dark-mode");
    }
  };

  // Cargar preferencia guardada al cargar la página
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    themeToggle.checked = true; // Sincroniza el checkbox
    applyTheme(true); // Aplica el tema oscuro
  } else {
    themeToggle.checked = false; // Sincroniza el checkbox
    applyTheme(false); // Aplica el tema claro (por defecto)
  }

  // Evento al cambiar el toggle
  themeToggle.addEventListener("change", () => {
    if (themeToggle.checked) {
      // Si está marcado (oscuro)
      applyTheme(true);
      localStorage.setItem("theme", "dark"); // Guarda la preferencia
    } else {
      // Si no está marcado (claro)
      applyTheme(false);
      localStorage.setItem("theme", "light"); // Guarda la preferencia
    }
  });
});