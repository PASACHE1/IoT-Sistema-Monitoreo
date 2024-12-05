// Función para mostrar la imagen seleccionada en el selector
document.getElementById("image").addEventListener("change", function () {
  var imageUrl = this.value;
  var imagePreview = document.getElementById("image-preview");
  var previewImg = document.getElementById("preview-img");

  if (imageUrl) {
    previewImg.src = "{{ url_for('get_photo', filename='') }}" + imageUrl;
    imagePreview.style.display = "block";
  } else {
    imagePreview.style.display = "none";
  }
});
