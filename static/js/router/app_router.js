// Navegación entre secciones
const links = document.querySelectorAll(".sidebar-menu a");
const sections = document.querySelectorAll(".section");
const breadcrumbText = document.getElementById("breadcrumb-text");
// Manejo de la barra lateral
const sidebar = document.getElementsByClassName("sidebar");
const mainContent = document.querySelector(".main-content");
// Mostrar la sección activa al cargar
const savedSection = localStorage.getItem("activeSection") || defaultSection;
showSection(savedSection);

const defaultSection = "video";

function showSection(sectionId) {
  // Ocultar todas las secciones y mostrar solo la activa
  sections.forEach((section) => {
    section.classList.remove("active");
  });
  document.getElementById(sectionId).classList.add("active");
  breadcrumbText.textContent = document.querySelector(
    `a[data-section="${sectionId}"]`
  ).textContent;
}

links.forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    const targetSection = link.dataset.section;
    localStorage.setItem("activeSection", targetSection); // Guardar sección activa
    showSection(targetSection);
  });
});

function applySidebarState() {
  const isHidden = localStorage.getItem("sidebar-hidden") === "true";

  if (isHidden) {
    sidebar[0].classList.add("hidden");
    mainContent.style.marginLeft = "0";
  } else {
    sidebar[0].classList.remove("hidden");
    mainContent.style.marginLeft = getComputedStyle(sidebar[0]).width;
  }
}

// Aplicar estado guardado al cargar
applySidebarState();
