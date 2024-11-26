// Definir las traducciones
const translations = {
    en: {
      welcomeText: "Welcome",
      descriptionText: "This is an example description in English.",
      settingsLabel: "Select Language",
    },
    es: {
      welcomeText: "Bienvenido",
      descriptionText: "Esta es una descripción de ejemplo en español.",
      settingsLabel: "Selecciona el idioma",
    },
    fr: {
      welcomeText: "Bienvenue",
      descriptionText: "Ceci est une description d'exemple en français.",
      settingsLabel: "Sélectionnez la langue",
    },
  };
  
  // Función para cambiar el idioma
  function changeLanguage() {
    const language = document.getElementById('language-select').value; // Obtener el idioma seleccionado
    const selectedTranslations = translations[language]; // Obtener las traducciones para el idioma seleccionado
    
    // Cambiar los textos en la página
    document.getElementById('welcome-text').textContent = selectedTranslations.welcomeText;
    document.getElementById('description-text').textContent = selectedTranslations.descriptionText;
    
    // Cambiar el label del selector de idioma si es necesario
    document.querySelector('label[for="language-select"]').textContent = selectedTranslations.settingsLabel;
  }
  