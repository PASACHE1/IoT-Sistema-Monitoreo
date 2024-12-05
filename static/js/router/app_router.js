// Función para manejar la navegación entre secciones
const links = document.querySelectorAll(".navbar-nav .nav-link"); // Enlaces de la barra lateral
const sections = document.querySelectorAll(".section"); // Secciones a mostrar/ocultar

// Función para mostrar una sección y actualizar la barra de navegación
function showSection(sectionId) {
  // Ocultar todas las secciones
  sections.forEach((section) => {
    section.classList.remove("active"); // Eliminar clase "active" de todas las secciones
  });

  // Mostrar solo la sección seleccionada
  const activeSection = document.getElementById(sectionId);
  activeSection.classList.add("active");
}

// Agregar evento de clic a cada enlace de la barra lateral
links.forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault(); // Prevenir acción predeterminada del enlace
    const targetSection = link.dataset.section; // Obtener la sección objetivo
    showSection(targetSection); // Mostrar la sección correspondiente
    localStorage.setItem("section", targetSection); // Guardar la sección actual en el almacenamiento local
  });
});
// Función para cargar la última sección seleccionada al recargar la página
function loadLastSection() {
  // Obtener la última sección guardada en localStorage
  const lastSection = localStorage.getItem("section");

  // Si hay una sección guardada, mostrarla
  if (lastSection) {
    showSection(lastSection);
  } else {
    // Si no hay sección guardada, mostrar una sección por defecto
    showSection("video");
  }
}

// Mostrar la sección inicial por defecto (por ejemplo, "video")
showSection("video");
// Llamar a la función para cargar la última sección al cargar la página
loadLastSection();
