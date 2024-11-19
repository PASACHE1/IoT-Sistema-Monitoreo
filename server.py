from flask import Flask, request, send_from_directory, render_template, redirect, url_for, flash
import os
from datetime import datetime

app = Flask(__name__)
app.secret_key = 'secure_key'

# Configuración de la carpeta de fotos
UPLOAD_FOLDER = 'photos'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Asegurarse de que la carpeta de fotos exista
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

@app.route('/')
def index():
    """Página principal que muestra las fotos almacenadas."""
    photos = []
    for filename in sorted(os.listdir(app.config['UPLOAD_FOLDER']), reverse=True):
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        upload_time = datetime.fromtimestamp(os.path.getmtime(filepath)).strftime('%d %B %Y, %H:%M:%S')
        photos.append({'filename': filename, 'upload_time': upload_time})
    return render_template('index.html', photos=photos)

@app.route('/upload', methods=['POST'])
def upload_photo():
    """Ruta para recibir imágenes desde el ESP32."""
    try:
        # Leer los datos de la imagen
        photo_data = request.data
        if not photo_data:
            return 'No se recibió ninguna imagen', 400

        # Crear un nombre de archivo único basado en la fecha y hora
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        filename = f"photo_{timestamp}.jpg"
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)

        # Guardar la imagen
        with open(filepath, 'wb') as f:
            f.write(photo_data)

        flash(f'📷 Foto recibida: {filename}', 'success')
        return 'Foto subida con éxito', 200

    except Exception as e:
        flash(f'⚠️ Error al recibir la foto: {str(e)}', 'danger')
        return f'Error: {str(e)}', 500

@app.route('/photos/<filename>')
def get_photo(filename):
    """Descargar una foto específica."""
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

@app.route('/delete/<filename>', methods=['POST'])
def delete_photo(filename):
    """Eliminar una foto específica."""
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    if os.path.exists(filepath):
        os.remove(filepath)
        flash(f'🗑️ Foto eliminada: {filename}', 'success')
    else:
        flash(f'⚠️ Foto no encontrada: {filename}', 'danger')
    return redirect(url_for('index'))

@app.route('/download/<filename>')
def download_photo(filename):
    """Descargar una foto con intención de guardarla en el cliente."""
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename, as_attachment=True)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
