const searchBar = document.getElementById("photo-search");
const galleryGrid = document.getElementById("gallery-grid");
const galleryItems = galleryGrid.querySelectorAll(".gallery-item");
const timerElement = document.getElementById("timer");

let interval;  // Variable para el temporizador
let countdown = 15;  // Inicializamos el temporizador en 15 segundos
let typingTimeout;  // Variable para el timeout de escritura

// Función que recarga la página
function refreshGallery() {
  location.reload();  // Recargar la página para reflejar las fotos nuevas
}

// Función que inicia o reanuda el temporizador
function startTimer() {
  interval = setInterval(() => {
    countdown--;
    timerElement.textContent = `⏱️${countdown} Segundos`;  // Actualizar el temporizador

    if (countdown <= 0) {
      clearInterval(interval);  // Detener el temporizador
      refreshGallery();  // Recargar la página
    }
  }, 1000);  // Actualizar cada segundo
}

// Función que pausa el temporizador
function pauseTimer() {
  clearInterval(interval);  // Detener el temporizador
}

// Función para gestionar la búsqueda en la galería
searchBar.addEventListener("input", () => {
  const query = searchBar.value.toLowerCase();

  // Si hay texto en el input, pausamos el temporizador
  if (query.length > 0) {
    pauseTimer();  // Detener el temporizador mientras el usuario escribe
  }

  // Mostrar solo los elementos que coincidan con la búsqueda
  galleryItems.forEach(item => {
    const name = item.getAttribute("data-name").toLowerCase();
    const date = item.getAttribute("data-date").toLowerCase();

    if (name.includes(query) || date.includes(query)) {
      item.style.display = "";
    } else {
      item.style.display = "none";
    }
  });

  // Si el input está vacío, reiniciamos el temporizador después de 500 ms de inactividad
  if (query.length === 0) {
    clearTimeout(typingTimeout);  // Limpiar cualquier timeout previo

    typingTimeout = setTimeout(() => {
      countdown = 15;  // Reiniciar el temporizador
      startTimer();  // Reanudar el temporizador
    }, 500);  // Esperar 500 ms después de que el usuario deje de escribir
  }
});

// Iniciar el temporizador cuando se cargue la página
startTimer();

// Event listener para recargar la página al hacer clic en el temporizador
timerElement.addEventListener("click", () => {
  location.reload();  // Recargar la página
});
