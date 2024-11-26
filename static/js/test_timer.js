const timerElement = document.getElementById("timer");
// Función que recarga la página
function refreshGallery() {
    location.reload();  // Recargar la página para reflejar las fotos nuevas
  }
  
  // Temporizador de 10 segundos
  function startTimer() {
    let countdown = 15;  // 10 segundos
    const interval = setInterval(() => {
      countdown--;
      timerElement.textContent = `${countdown} Segundos`;  // Actualizar el temporizador

      // Si el tiempo llega a cero, se detiene el temporizador y se recarga la página
      if (countdown <= 0) {
        clearInterval(interval);  // Detener el temporizador
        refreshGallery();  // Llamar a la función de recarga
      }
    }, 1000);  // Actualizar cada segundo
    
  }
  
  // Iniciar el temporizador automáticamente cuando se cargue la página
  startTimer();
  
  
  timerElement.addEventListener("click", () => {
    location.reload();  // Recargar la página para reflejar las fotos nuevas
  });