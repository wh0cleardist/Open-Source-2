// Dashboard - cargar alertas de stock bajo
async function cargarAlertasStock() {
  try {
    const medicamentos = await api.request('/inventory/low-stock');
    const alertasSection = document.getElementById('alertas-stock');
    const listaAlertas = document.getElementById('lista-alertas');
    
    if (medicamentos.length === 0) {
      alertasSection.style.display = 'none';
      return;
    }
    
    alertasSection.style.display = 'block';
    listaAlertas.innerHTML = '';
    
    medicamentos.forEach(m => {
      const div = document.createElement('div');
      div.className = 'alerta-item';
      
      const stock = m.cantidad_disponible || 0;
      const nivel = stock === 0 ? 'critico' : 'bajo';
      const icono = stock === 0 ? '🔴' : '🟡';
      
      div.innerHTML = `
        <div class="alerta-${nivel}">
          ${icono} <strong>${m.nombre}</strong> 
          - Stock: ${stock} unidades
          ${m.ubicacion_nombre ? `(${m.ubicacion_nombre})` : ''}
        </div>
      `;
      listaAlertas.appendChild(div);
    });
  } catch (err) {
    console.error('Error cargando alertas:', err);
  }
}

// Cargar al inicio
document.addEventListener('DOMContentLoaded', cargarAlertasStock);
