// // Manejo de mensajes Flash: las notificaciones se desvanecen después de 4 segundos
// document.addEventListener("DOMContentLoaded", () => {
//   const flashMessages = document.querySelectorAll(".flash-message");
//   if (flashMessages.length > 0) {
//     setTimeout(() => {
//       flashMessages.forEach((message) => {
//         message.style.transition = "opacity 0.5s"; // Transición suave para el desvanecimiento
//         message.style.opacity = "0"; // Desvanecer el mensaje
//         setTimeout(() => message.remove(), 500); // Eliminar el mensaje después de la transición
//       });
//     }, 4000); // Esperar 4 segundos antes de iniciar el desvanecimiento
//   }
// });
