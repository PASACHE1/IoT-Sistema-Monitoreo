  // Función para manejar la navegación entre secciones
  const links = document.querySelectorAll(".navbar-nav .nav-link");  // Enlaces de la barra lateral
  const sections = document.querySelectorAll(".section");  // Secciones a mostrar/ocultar
  const breadcrumbText = document.getElementById("breadcrumb-text");  // Texto de la barra de navegación

  // Función para mostrar una sección y actualizar la barra de navegación
  function showSection(sectionId) {
    // Ocultar todas las secciones
    sections.forEach(section => {
      section.classList.remove("active");  // Eliminar clase "active" de todas las secciones
    });

    // Mostrar solo la sección seleccionada
    const activeSection = document.getElementById(sectionId);
    activeSection.classList.add("active");

    // Actualizar el texto de la barra de navegación (breadcrumb)
/*     breadcrumbText.textContent = document.querySelector(`a[data-section="${sectionId}"]`).textContent; */
  }

  // Agregar evento de clic a cada enlace de la barra lateral
  links.forEach(link => {
    link.addEventListener("click", (event) => {
      event.preventDefault();  // Prevenir acción predeterminada del enlace
      const targetSection = link.dataset.section;  // Obtener la sección objetivo
      showSection(targetSection);  // Mostrar la sección correspondiente
    });
  });

  // Mostrar la sección inicial por defecto (por ejemplo, "video")
  showSection("video");
