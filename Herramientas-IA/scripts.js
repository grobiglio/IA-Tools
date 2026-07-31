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

  // --- TEMA CLARO / OSCURO ---
  // El script del <head> ya fijó data-theme antes del primer pintado; acá solo
  // se sincroniza el botón y se atiende el clic.
  const raiz = document.documentElement;
  const toggle = document.getElementById("theme-toggle");

  const pintarToggle = (tema) => {
    if (!toggle) return;
    const oscuro = tema === "dark";
    toggle.textContent = oscuro ? "☀️" : "🌙";
    toggle.setAttribute("aria-pressed", String(oscuro));
    toggle.setAttribute("aria-label", oscuro ? "Cambiar a tema claro" : "Cambiar a tema oscuro");
    toggle.title = toggle.getAttribute("aria-label");
  };

  pintarToggle(raiz.getAttribute("data-theme") || "dark");

  if (toggle) {
    toggle.addEventListener("click", () => {
      const nuevo = raiz.getAttribute("data-theme") === "dark" ? "light" : "dark";
      raiz.setAttribute("data-theme", nuevo);
      try {
        localStorage.setItem("theme", nuevo);
      } catch (e) {
        // Modo privado: el tema cambia igual, solo no se recuerda.
      }
      pintarToggle(nuevo);

      const meta = document.querySelector('meta[name="theme-color"]');
      if (meta) meta.setAttribute("content", nuevo === "dark" ? "#121212" : "#f8f9fa");
    });
  }
});