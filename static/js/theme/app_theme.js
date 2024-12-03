// Alternar modo oscuro y guardar en localStorage
const toggleDarkMode = document.getElementById("toggle-dark-mode");
const main = document.getElementsByClassName("main");
const sidebarHeader = document.getElementsByClassName("sidebar-header");
const siderbarMenuItem = document.getElementsByClassName("sidebar-menu-item");

function applyDarkMode(mode) {
  if (mode === "dark") {
    if (main) {
      removeAddClass(main[0], "main-light", "main-dark");
    }
    // Sidebar
    if (sidebar) {
      removeAddClass(sidebar[0], "sidebar-light", "sidebar-dark");
    }
    if (sidebarHeader) {
      removeAddClass(
        sidebarHeader[0],
        "sidebar-header-light",
        "sidebar-header-dark"
      );
    }
    if (siderbarMenuItem) {
      for (let i = 0; i < siderbarMenuItem.length; i++) {
        removeAddClass(
          siderbarMenuItem[i],
          "sidebar-menu-item-light",
          "sidebar-menu-item-dark"
        );
      }
    }
    // Texto
    toggleDarkMode.textContent = "☀️ Modo Claro";
  } else {
    if (main) {
      removeAddClass(main[0], "main-dark", "main-light");
    }
    // Sidebar
    if (sidebar) {
      removeAddClass(sidebar[0], "sidebar-dark", "sidebar-light");
    }
    if (sidebarHeader) {
      removeAddClass(
        sidebarHeader[0],
        "sidebar-header-dark",
        "sidebar-header-light"
      );
    }
    if (siderbarMenuItem) {
      for (let i = 0; i < siderbarMenuItem.length; i++) {
        removeAddClass(
          siderbarMenuItem[i],
          "sidebar-menu-item-dark",
          "sidebar-menu-item-light"
        );
      }
    }

    toggleDarkMode.textContent = "🌙 Modo Oscuro";
  }
}
// fuuncion para eliminar y agregar uan clase
function removeAddClass(element, removeClass, addClass) {
  element.classList.remove(removeClass);
  element.classList.add(addClass);
}

// Recuperar el modo guardado en localStorage al cargar la página
const savedMode = localStorage.getItem("theme") || "light";
if (savedMode === "dark") {
  applyDarkMode(savedMode);
}

// Evento para alternar entre modo claro y oscuro
toggleDarkMode.addEventListener("click", () => {
  const currentMode = localStorage.getItem("theme") || "light";
  const newMode = currentMode === "dark" ? "light" : "dark";

  localStorage.setItem("theme", newMode); // Guardar nuevo estado
  applyDarkMode(newMode);
});
