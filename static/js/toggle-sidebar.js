const toggleSidebarButton = document.getElementById("toggle-sidebar");
// Alternar estado de la barra lateral
toggleSidebarButton.addEventListener("click", () => {
  const isCurrentlyHidden = sidebar.classList.toggle("hidden");
  localStorage.setItem("sidebar-hidden", isCurrentlyHidden);
  mainContent.style.marginLeft = isCurrentlyHidden
    ? "0"
    : getComputedStyle(sidebar).getPropertyValue("width");
});
