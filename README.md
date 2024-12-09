Flask Web Application for Photo Management, Video Streaming, and Email Integration

Este proyecto implementa una aplicación web basada en Flask, diseñada para la gestión de imágenes y la integración de video en tiempo real desde un dispositivo ESP32-CAM. La aplicación proporciona una interfaz intuitiva para:

Recepción y almacenamiento de imágenes: Las imágenes enviadas por el ESP32-CAM se almacenan en el servidor, permitiendo su visualización en una galería. Además, se pueden aplicar filtros para visualizar fotos subidas recientemente o las de un día específico.

Visualización de video en vivo: La aplicación ofrece un flujo de video en tiempo real desde el ESP32-CAM utilizando el protocolo MJPEG.

Envío de correos electrónicos: Mediante Flask-Mail, los usuarios pueden enviar correos electrónicos con imágenes adjuntas, lo que facilita la integración de la aplicación con otras herramientas de comunicación.

Gestión de fotos: Permite al usuario eliminar fotos del sistema y descargar las imágenes almacenadas en el servidor.

Características Clave:
Filtro de fotos: Filtro por fecha (última hora, fotos del día).
Envío de correos con imágenes: Capacidad para adjuntar imágenes en correos electrónicos.
Flujo de video en vivo: Transmisión de video en tiempo real desde un ESP32-CAM.
Interfaz fácil de usar: Acceso a las funcionalidades mediante una interfaz web simple y clara.
Requisitos:
Flask: Framework principal para desarrollar la aplicación web.
Flask-Mail: Para la gestión de correos electrónicos y envío de imágenes.
Requests: Para realizar solicitudes HTTP al ESP32-CAM y obtener el flujo de video.
python-dotenv: Para cargar variables de entorno y gestionar de manera segura las credenciales sensibles.
Instalación y Configuración:
Clona el repositorio.
Crea un archivo .env en el directorio raíz con las credenciales de correo electrónico (Gmail).
Instala las dependencias mediante pip install -r requirements.txt.
Ejecuta la aplicación con python app.py y accede a la interfaz web a través de http://localhost:5000.
Consideraciones:
Es necesario contar con un dispositivo ESP32-CAM configurado para enviar imágenes al servidor.
Asegúrate de permitir el acceso a aplicaciones menos seguras si usas Gmail para el envío de correos electrónicos.
