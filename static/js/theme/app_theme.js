const toggleButton = document.getElementById("toggle-theme-btn");
const body = document.body;
const cards = document.querySelectorAll(".card");

// Función para alternar entre el tema claro y oscuro
function toggleTheme() {
  if (body.classList.contains("bg-light")) {
    body.classList.remove("bg-light", "text-dark");
    body.classList.add("bg-dark", "text-light");
    toggleButton.textContent = "☀️ Modo Claro";
    cards.forEach((card) => {
      card.classList.remove("bg-light", "text-dark");
      card.classList.add("bg-dark", "text-light");
    });
  } else {
    body.classList.remove("bg-dark", "text-light");
    body.classList.add("bg-light", "text-dark");
    cards.forEach((card) => {
      card.classList.remove("bg-dark", "text-light");
      card.classList.add("bg-light", "text-dark");
    });
    toggleButton.textContent = "🌙 Modo Oscuro";
  }

  // Guardar la preferencia en el almacenamiento local
  localStorage.setItem(
    "theme",
    body.classList.contains("bg-dark") ? "dark" : "light"
  );
}

// Detectar el tema guardado en el almacenamiento local al cargar la página
document.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("theme") || "light";
  if (savedTheme === "dark") {
    body.classList.add("bg-dark", "text-light");
    body.classList.remove("bg-light", "text-dark");
    cards.forEach((card) => {
      card.classList.add("bg-dark", "text-light");
      card.classList.remove("bg-light", "text-dark");
    });
    toggleButton.textContent = "☀️ Modo Claro";
  } else {
    body.classList.add("bg-light", "text-dark");
    body.classList.remove("bg-dark", "text-light");
    cards.forEach((card) => {
      card.classList.add("bg-light", "text-dark");
      card.classList.remove("bg-dark", "text-light");
    });
    toggleButton.textContent = "🌙 Modo Oscuro";
  }
});

// Asignar el evento al botón
toggleButton.addEventListener("click", toggleTheme);
