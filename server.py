# Importamos las bibliotecas necesarias
from flask import Flask, request, send_from_directory, render_template, redirect, url_for, flash, Response
from flask_mail import Mail, Message
import os  # Para manipular archivos y rutas
from datetime import datetime  # Para manejar fechas y horas
import requests  # Para realizar solicitudes HTTP

# Creamos una instancia de la aplicación Flask
app = Flask(__name__)

# Clave secreta para manejar sesiones y funciones como flash
app.secret_key = 'secure_key'

# Configuración de Flask-Mail
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = 'pasache.1518@gmail.com'  # Tu correo
app.config['MAIL_PASSWORD'] = 'tlcw kxtg agly phak'  # Tu contraseña
app.config['MAIL_DEFAULT_SENDER'] = 'pasachen.2022@gmail.com'  # Remitente por defecto

mail = Mail(app)

# Configuración de la carpeta donde se almacenarán las fotos
UPLOAD_FOLDER = 'photos'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# URL del ESP32-CAM para obtener el streaming de video
ESP32_CAM_STREAM_URL = "http://192.168.169.82:81/"

# Aseguramos que la carpeta de fotos exista. Si no, la creamos.
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

# Ruta principal que muestra las fotos almacenadas y opciones de filtro
@app.route('/')
def index():
    """Página principal que muestra las fotos almacenadas y el video en vivo."""
    filter_option = request.args.get('filter', 'all')
    photos = []

    for filename in sorted(os.listdir(app.config['UPLOAD_FOLDER']), reverse=True):
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        upload_time = datetime.fromtimestamp(os.path.getmtime(filepath))
        upload_time_str = upload_time.strftime('%d %B %Y, %H:%M:%S')

        if filter_option == 'last-hour' and (datetime.now() - upload_time).total_seconds() > 3600:
            continue
        if filter_option == 'today' and upload_time.date() != datetime.now().date():
            continue

        photos.append({'filename': filename, 'upload_time': upload_time_str})

    return render_template('index.html', photos=photos, filter_option=filter_option)

# Ruta para enviar un correo electrónico con la imagen adjunta
@app.route('/send_email', methods=['POST'])
def send_email():
    """Envía un correo a través de Gmail con la posibilidad de adjuntar una imagen."""
    try:
        subject = request.form['subject']
        recipient = request.form['recipient']
        message_body = request.form['message']
        image_filename = request.form.get('image_filename')  # Nombre de la imagen seleccionada

        # Crear el mensaje
        msg = Message(subject=subject, recipients=[recipient], body=message_body)

        # Si se proporciona una imagen, adjuntarla
        if image_filename:
            filepath = os.path.join(app.config['UPLOAD_FOLDER'], image_filename)
            if os.path.exists(filepath):
                with open(filepath, 'rb') as img:
                    msg.attach(image_filename, 'image/jpeg', img.read())
            else:
                flash('La imagen seleccionada no existe.', 'danger')

        # Enviar el correo
        mail.send(msg)
        flash("Correo enviado con éxito!", 'success')
        return redirect(url_for('index'))
    except Exception as e:
        flash(f"Error al enviar el correo: {str(e)}", 'danger')
        return redirect(url_for('index'))

# Ruta para recibir imágenes desde el ESP32
@app.route('/upload', methods=['POST'])
def upload_photo():
    """Ruta para recibir imágenes desde el ESP32 y almacenarlas en el servidor."""
    try:
        photo_data = request.data
        if not photo_data:
            flash('⚠️ No se recibió ninguna imagen.', 'danger')
            return 'No se recibió ninguna imagen', 400

        # Crear un nombre de archivo único basado en la fecha y hora
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        filename = f"photo_{timestamp}.jpg"
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)

        # Guardar la imagen
        with open(filepath, 'wb') as f:
            f.write(photo_data)

        flash(f'📷 Foto recibida y almacenada exitosamente: {filename}', 'success')
        return redirect(url_for('index'))
    except Exception as e:
        flash(f'⚠️ Error al recibir la foto: {str(e)}', 'danger')
        return f'Error: {str(e)}', 500

# Ruta para mostrar una foto específica
@app.route('/photos/<filename>')
def get_photo(filename):
    """Envía una foto específica al cliente."""
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

# Ruta para eliminar una foto específica
@app.route('/delete/<filename>', methods=['POST'])
def delete_photo(filename):
    """Elimina una foto del sistema."""
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    if os.path.exists(filepath):
        os.remove(filepath)
        flash(f'🗑️ Foto eliminada: {filename}', 'success')
    else:
        flash(f'⚠️ Foto no encontrada: {filename}', 'danger')
    return redirect(url_for('index'))

# Ruta para descargar una foto
@app.route('/download/<filename>')
def download_photo(filename):
    """Permite al usuario descargar una foto almacenada."""
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename, as_attachment=True)

# Ruta para mostrar el flujo de video en vivo desde el ESP32-CAM
@app.route('/video_feed')
def video_feed():
    """Proporciona un flujo de video en vivo desde el ESP32-CAM utilizando MJPEG."""
    def generate():
        try:
            with requests.get(ESP32_CAM_STREAM_URL, stream=True) as response:
                for chunk in response.iter_content(chunk_size=1024):
                    if chunk:
                        yield chunk
        except requests.exceptions.RequestException:
            yield b"--frame\r\nContent-Type: text/plain\r\n\r\nError conectando al ESP32-CAM.\r\n"

    return Response(generate(), content_type='multipart/x-mixed-replace; boundary=frame')

# Ruta para obtener estadísticas de fotos
@app.route('/data/photos')
def photo_data():
    """Devuelve datos estadísticos sobre las fotos almacenadas."""
    stats = {}
    timestamps = []
    for filename in os.listdir(app.config['UPLOAD_FOLDER']):
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        upload_date = datetime.fromtimestamp(os.path.getmtime(filepath)).strftime('%Y-%m-%d')
        stats[upload_date] = stats.get(upload_date, 0) + 1
        timestamps.append(os.path.getmtime(filepath))

    sorted_stats = dict(sorted(stats.items()))
    return {
        'labels': list(sorted_stats.keys()),
        'values': list(sorted_stats.values()),
        'timestamps': timestamps
    }

# Punto de entrada de la aplicación
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
