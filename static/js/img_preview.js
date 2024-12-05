// Función para abrir la vista previa de la imagen
const galleryImages = document.querySelectorAll(".gallery-image");
const previewContainer = document.getElementById("image-preview-container");
const previewImage = document.getElementById("preview-img");

// Al hacer clic en una imagen de la galería
galleryImages.forEach((image) => {
  image.addEventListener("click", function () {
    const imageSrc = this.src; // Obtener la fuente de la imagen
    previewImage.src = imageSrc; // Asignar la fuente a la imagen de vista previa
    previewContainer.style.display = "flex"; // Mostrar el contenedor de vista previa
  });
});

// Función para cerrar la vista previa
function closePreview() {
  previewContainer.style.display = "none"; // Ocultar la vista previa
}

// Cerrar la vista previa cuando se hace clic fuera de la imagen
previewContainer.addEventListener("click", function (e) {
  if (e.target === previewContainer) {
    closePreview();
  }
});
