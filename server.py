# Importamos las bibliotecas necesarias
from flask import Flask, request, send_from_directory, render_template, redirect, url_for, flash, Response
import os  # Para manipular archivos y rutas
from datetime import datetime  # Para manejar fechas y horas
import requests  # Para realizar solicitudes HTTP

# Creamos una instancia de la aplicación Flask
app = Flask(__name__)

# Clave secreta para manejar sesiones y funciones como flash
app.secret_key = 'secure_key'

# Configuración de la carpeta donde se almacenarán las fotos
UPLOAD_FOLDER = 'photos'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# URL del ESP32-CAM para obtener el streaming de video (cambia a la IP de tu dispositivo)
ESP32_CAM_STREAM_URL = "http://192.168.169.82:81/"

# Aseguramos que la carpeta de fotos exista. Si no, la creamos.
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

# Ruta principal que muestra las fotos almacenadas y opciones de filtro
@app.route('/')
def index():
    """
    Página principal que muestra las fotos almacenadas y el video en vivo.
    Permite filtrar fotos según el tiempo (última hora o hoy).
    """
    # Obtiene el filtro seleccionado en los parámetros de consulta (por defecto 'all')
    filter_option = request.args.get('filter', 'all')
    photos = []

    # Obtenemos la lista de fotos en la carpeta de fotos
    for filename in sorted(os.listdir(app.config['UPLOAD_FOLDER']), reverse=True):
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)  # Ruta completa
        upload_time = datetime.fromtimestamp(os.path.getmtime(filepath))  # Fecha de modificación
        upload_time_str = upload_time.strftime('%d %B %Y, %H:%M:%S')  # Formato legible

        # Aplicamos filtros según el tiempo
        if filter_option == 'last-hour' and (datetime.now() - upload_time).total_seconds() > 3600:
            continue
        if filter_option == 'today' and upload_time.date() != datetime.now().date():
            continue

        # Añadimos la foto a la lista con su nombre y fecha de subida
        photos.append({'filename': filename, 'upload_time': upload_time_str})

    # Renderizamos la plantilla index.html con la lista de fotos y el filtro aplicado
    return render_template('index.html', photos=photos, filter_option=filter_option)

# Ruta para recibir imágenes desde el ESP32
@app.route('/upload', methods=['POST'])
def upload_photo():
    """
    Ruta para recibir imágenes desde el ESP32 y almacenarlas en el servidor.
    """
    global last_notification  # Accede a la variable global para guardar la notificación
    try:
        # Leer los datos de la imagen
        photo_data = request.data
        if not photo_data:
            last_notification = '⚠️ No se recibió ninguna imagen.'
            flash(last_notification, 'danger')  # Notificación de error
            return 'No se recibió ninguna imagen', 400

        # Crear un nombre de archivo único basado en la fecha y hora
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        filename = f"photo_{timestamp}.jpg"
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)

        # Guardar la imagen
        with open(filepath, 'wb') as f:
            f.write(photo_data)

        last_notification = f'📷 Foto recibida y almacenada exitosamente: {filename}'
        flash(last_notification, 'success')  # Notificación de éxito
        return redirect(url_for('index'))  # Redirigir para refrescar la página de fotos

    except Exception as e:
        last_notification = f'⚠️ Error al recibir la foto: {str(e)}'
        flash(last_notification, 'danger')  # Notificación de error
        return f'Error: {str(e)}', 500

# Ruta para mostrar una foto específica
@app.route('/photos/<filename>')
def get_photo(filename):
    """Envía una foto específica al cliente."""
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

# Ruta para eliminar una foto específica
@app.route('/delete/<filename>', methods=['POST'])
def delete_photo(filename):
    """
    Elimina una foto del sistema.
    """
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    if os.path.exists(filepath):  # Verificamos si el archivo existe
        os.remove(filepath)  # Eliminamos el archivo
        flash(f'🗑️ Foto eliminada: {filename}', 'success')
    else:
        flash(f'⚠️ Foto no encontrada: {filename}', 'danger')
    return redirect(url_for('index'))  # Redirigimos al índice

# Ruta para descargar una foto
@app.route('/download/<filename>')
def download_photo(filename):
    """Permite al usuario descargar una foto almacenada."""
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename, as_attachment=True)

# Ruta para mostrar el flujo de video en vivo desde el ESP32-CAM
@app.route('/video_feed')
def video_feed():
    """
    Proporciona un flujo de video en vivo desde el ESP32-CAM utilizando MJPEG.
    """
    def generate():
        try:
            # Solicitamos el stream MJPEG del ESP32-CAM
            with requests.get(ESP32_CAM_STREAM_URL, stream=True) as response:
                for chunk in response.iter_content(chunk_size=1024):
                    if chunk:  # Enviamos cada fragmento del stream al cliente
                        yield chunk
        except requests.exceptions.RequestException:
            # Si hay un error de conexión, enviamos un mensaje de error
            yield b"--frame\r\nContent-Type: text/plain\r\n\r\nError conectando al ESP32-CAM.\r\n"

    # Respondemos con el flujo como multipart/x-mixed-replace (stream MJPEG)
    return Response(
        generate(),
        content_type='multipart/x-mixed-replace; boundary=frame'
    )

# Punto de entrada de la aplicación
if __name__ == '__main__':
    # Ejecutamos la aplicación en modo depuración y aceptamos conexiones externas
    app.run(debug=True, host='0.0.0.0', port=5000)
