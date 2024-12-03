// Colores predefinidos para los gráficos
const predefinedBarColors = [
    'rgba(255, 99, 132, 0.7)',  // Rojo
    'rgba(54, 162, 235, 0.7)',  // Azul
    'rgba(75, 192, 192, 0.7)',  // Verde agua
    'rgba(153, 102, 255, 0.7)', // Morado
    'rgba(255, 159, 64, 0.7)',  // Naranja
    'rgba(255, 205, 86, 0.7)'   // Amarillo
];

const predefinedPieColors = [
    'rgba(255, 159, 64, 0.7)',  // Naranja
    'rgba(75, 192, 192, 0.7)',  // Verde agua
    'rgba(153, 102, 255, 0.7)'  // Morado
];
// Función para ampliar el gráfico en el modal
function expandChart(chart) {
    const modal = document.getElementById('chartModal');
    const expandedCanvas = document.getElementById('expandedChart').getContext('2d');

    // Crear un nuevo gráfico en el modal con las mismas configuraciones
    const expandedChart = new Chart(expandedCanvas, {
        type: chart.config.type,  // Tipo de gráfico (barras, línea, etc.)
        data: chart.data,         // Datos del gráfico
        options: chart.options    // Opciones del gráfico
    });

    // Mostrar el modal
    modal.style.display = 'flex';

    // Cerrar el modal cuando el usuario haga clic en el botón de cerrar
    document.getElementById('closeModal').onclick = () => {
        modal.style.display = 'none';  // Ocultar el modal
        expandedChart.destroy();       // Destruir el gráfico ampliado cuando se cierra
    };
}


// Variables globales para los gráficos
let barChart, pieChart, lineChart, areaChart, radarChart, scatterChart;

// Función para obtener los datos de la API y actualizar los gráficos
function updateCharts() {
    fetch('/data/photos')  // Llamada a la API para obtener los datos
        .then(response => response.json())
        .then(data => {
            const now = new Date();
            const totalFotos = data.values.reduce((a, b) => a + b, 0);

            // Calcular "Última Hora"
            const lastHourCount = data.timestamps.reduce((sum, timestamp) => {
                return timestamp * 1000 >= now.getTime() - 60 * 60 * 1000 ? sum + 1 : sum;
            }, 0);

            // Calcular "Hoy"
            const todayCount = data.timestamps.reduce((sum, timestamp) => {
                const date = new Date(timestamp * 1000); 
                return date.toDateString() === now.toDateString() ? sum + 1 : sum;
            }, 0);

            // Actualización de los gráficos
            updateBarChart(data);
            updatePieChart(lastHourCount, todayCount, totalFotos);
            updateLineChart(data);
            updateAreaChart(data);
            updateRadarChart(data);
            updateScatterChart(data);  // Actualiza el gráfico de dispersión
        })
        .catch(error => console.error('Error al cargar los datos:', error));
}

// Función de actualización del gráfico de barras
function updateBarChart(data) {
    barChart.data.datasets[0].data = data.values;
    barChart.data.labels = data.labels;
    barChart.data.datasets[0].backgroundColor = predefinedBarColors.slice(0, data.values.length);
    barChart.data.datasets[0].borderColor = predefinedBarColors.slice(0, data.values.length).map(color => color.replace('0.7', '1'));
    barChart.update();
}

// Función de actualización del gráfico de tortas
function updatePieChart(lastHourCount, todayCount, totalFotos) {
    pieChart.data.datasets[0].data = [lastHourCount, todayCount, totalFotos];
    pieChart.update();
}

// Función de actualización del gráfico lineal
function updateLineChart(data) {
    lineChart.data.datasets[0].data = data.values;
    lineChart.data.labels = data.labels;
    lineChart.update();
}

// Función de actualización del gráfico de área
function updateAreaChart(data) {
    areaChart.data.datasets[0].data = data.values;
    areaChart.data.labels = data.labels;
    areaChart.update();
}

// Función de actualización del gráfico radar
function updateRadarChart(data) {
    radarChart.data.datasets[0].data = data.values;
    radarChart.data.labels = data.labels;
    radarChart.update();
}

// Función de actualización del gráfico de dispersión
function updateScatterChart(data) {
    scatterChart.data.datasets[0].data = data.values.map((value, index) => ({
        x: index,  // Usamos el índice como valor de X
        y: value   // Los valores de fotos como valor de Y
    }));

    // Establece el color de los puntos
    scatterChart.data.datasets[0].backgroundColor = 'rgba(0, 0, 0, 1)'; // Negro
    scatterChart.data.datasets[0].borderColor = 'rgba(0, 0, 0, 1)';     // Borde negro
    scatterChart.update();  // Actualiza el gráfico con los nuevos datos
}

// Inicialización de los gráficos
// Función para inicializar los gráficos
function initializeCharts() {
    barChart = new Chart(document.getElementById('photoBarChart').getContext('2d'), {
        type: 'bar',
        data: {
            labels: [],
            datasets: [{
                label: 'Fotos tomadas',
                data: [],
                backgroundColor: predefinedBarColors.slice(0, 6),
                borderColor: predefinedBarColors.slice(0, 6).map(color => color.replace('0.7', '1')),
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    pieChart = new Chart(document.getElementById('photoPieChart').getContext('2d'), {
        type: 'pie',
        data: {
            labels: ['Última Hora', 'Hoy', 'Total'],
            datasets: [{
                data: [],
                backgroundColor: predefinedPieColors,
            }]
        }
    });

    lineChart = new Chart(document.getElementById('photoLineChart').getContext('2d'), {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Fotos tomadas',
                data: [],
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderWidth: 1
            }]
        }
    });

    areaChart = new Chart(document.getElementById('photoAreaChart').getContext('2d'), {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Fotos tomadas',
                data: [],
                fill: true,
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderWidth: 1
            }]
        }
    });

    radarChart = new Chart(document.getElementById('photoRadarChart').getContext('2d'), {
        type: 'radar',
        data: {
            labels: [],
            datasets: [{
                label: 'Fotos tomadas',
                data: [],
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderWidth: 1
            }]
        }
    });

    scatterChart = new Chart(document.getElementById('photoScatterChart').getContext('2d'), {
        type: 'scatter',
        data: {
            datasets: [{
                label: 'Fotos tomadas',
                data: [],
                borderColor: 'rgba(0, 0, 0, 1)',   // Borde negro
                backgroundColor: 'rgba(0, 0, 0, 1)', // Fondo negro
                borderWidth: 1,
                pointRadius: 5  // Ajusta el tamaño de los puntos
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    type: 'linear',
                    position: 'bottom'
                },
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Descargar gráfico como imagen
function downloadChart(chart, fileName) {
    const link = document.createElement('a');
    link.href = chart.toBase64Image(); 
    link.download = fileName;         
    link.click();                     
}

// Ampliar gráfico en el modal
function expandChart(chart) {
    const modal = document.getElementById('chartModal');
    const expandedCanvas = document.getElementById('expandedChart').getContext('2d');

    const expandedChart = new Chart(expandedCanvas, {
        type: chart.config.type,
        data: chart.data,
        options: chart.options
    });

    modal.style.display = 'flex';
    document.getElementById('closeModal').onclick = () => {
        modal.style.display = 'none';
        expandedChart.destroy();
    };
}

// Inicializa los gráficos y botones
document.addEventListener('DOMContentLoaded', () => {
    initializeCharts();
    updateCharts();
    setInterval(updateCharts, 10000);  // Actualización cada 10 segundos
});
