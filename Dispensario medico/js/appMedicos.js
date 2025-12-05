const formDoc = document.getElementById('form-medico');
const tbodyDoc = document.querySelector('#tabla tbody');
const btnDocCancelar = document.getElementById('btn-doc-cancelar');
let editingDocId = null;

// Validación de cédula en tiempo real
document.addEventListener('DOMContentLoaded', () => {
  const cedulaInput = document.getElementById('cedula');
  if (cedulaInput) {
    // Crear elemento para mostrar el mensaje de validación
    const validationMsg = document.createElement('small');
    validationMsg.style.display = 'block';
    validationMsg.style.marginTop = '4px';
    validationMsg.style.fontSize = '12px';
    cedulaInput.parentElement.appendChild(validationMsg);

    // Validar al escribir
    cedulaInput.addEventListener('input', (e) => {
      const valor = e.target.value.trim();
      if (valor === '') {
        validationMsg.textContent = '';
        cedulaInput.style.borderColor = '';
        return;
      }

      if (window.validacionCedula && window.validacionCedula.validaCedula) {
        const esValida = window.validacionCedula.validaCedula(valor);
        if (esValida) {
          validationMsg.textContent = '✓ Cédula válida';
          validationMsg.style.color = '#28a745';
          cedulaInput.style.borderColor = '#28a745';
        } else {
          validationMsg.textContent = '✗ Cédula inválida (formato: XXX-XXXXXXX-X o 11 dígitos)';
          validationMsg.style.color = '#dc3545';
          cedulaInput.style.borderColor = '#dc3545';
        }
      }
    });

    // Formatear al perder el foco
    cedulaInput.addEventListener('blur', (e) => {
      const valor = e.target.value.trim();
      if (valor && window.validacionCedula && window.validacionCedula.formatearCedula) {
        if (window.validacionCedula.validaCedula(valor)) {
          e.target.value = window.validacionCedula.formatearCedula(valor);
        }
      }
    });
  }
});

async function cargarMedicos() {
  const data = await api.request('/doctors');
  tbodyDoc.innerHTML='';
  data.forEach(d => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${d.id}</td>
      <td>${d.nombre}</td>
      <td>${d.identificador||''}</td>
      <td>${d.cedula||''}</td>
      <td>${d.tanda_laboral||''}</td>
      <td>${d.especialidad||''}</td>
      <td>${d.estado}</td>
      <td><button data-edit="${d.id}">Editar</button><button data-del="${d.id}">Del</button></td>`;
    tbodyDoc.appendChild(tr);
  });
}

formDoc.addEventListener('submit', async (e) => {
  e.preventDefault();
  const cedulaValor = document.getElementById('cedula').value.trim();
  
  // Validar cédula antes de enviar
  if (cedulaValor && window.validacionCedula && window.validacionCedula.validaCedula) {
    if (!window.validacionCedula.validaCedula(cedulaValor)) {
      alert('La cédula ingresada no es válida. Por favor, verifique el formato.');
      return;
    }
  }
  
  const payload = {
    nombre: document.getElementById('nombre').value.trim(),
    identificador: document.getElementById('identificador').value.trim(),
    cedula: cedulaValor,
    tanda_laboral: document.getElementById('tanda_laboral').value,
    especialidad: document.getElementById('especialidad').value.trim(),
    estado: document.getElementById('estado').value
  };
  if (!payload.nombre) return alert('Nombre requerido');
  
  try {
    if (editingDocId) {
      await api.request(`/doctors/${editingDocId}`, { method: 'PUT', body: JSON.stringify(payload) });
      alert('Médico actualizado correctamente');
    } else {
      await api.request('/doctors', { method: 'POST', body: JSON.stringify(payload) });
      alert('Médico guardado correctamente');
    }
    editingDocId = null;
    formDoc.reset();
    btnDocCancelar.classList.add('hidden');
    document.getElementById('btn-doc-guardar').textContent='Guardar';
    await cargarMedicos();
  } catch (err) { 
    console.error('Error:', err);
    alert('Error: ' + err.message); 
  }
});

tbodyDoc.addEventListener('click', async (e) => {
  const id = e.target.dataset.edit || e.target.dataset.del;
  if (!id) return;
  if (e.target.dataset.edit) {
    const d = await api.request(`/doctors/${id}`);
    document.getElementById('nombre').value = d.nombre;
    document.getElementById('identificador').value = d.identificador || '';
    document.getElementById('cedula').value = d.cedula || '';
    document.getElementById('tanda_laboral').value = d.tanda_laboral || 'Diurna';
    document.getElementById('especialidad').value = d.especialidad || '';
    document.getElementById('estado').value = d.estado;
    editingDocId = id;
    btnDocCancelar.classList.remove('hidden');
    document.getElementById('btn-doc-guardar').textContent='Actualizar';
  } else if (e.target.dataset.del) {
    if (confirm('¿Eliminar?')) { await api.request(`/doctors/${id}`, { method: 'DELETE' }); await cargarMedicos(); }
  }
});

document.addEventListener('DOMContentLoaded', cargarMedicos);
btnDocCancelar?.addEventListener('click', ()=>{
  editingDocId = null;
  formDoc.reset();
  btnDocCancelar.classList.add('hidden');
  document.getElementById('btn-doc-guardar').textContent='Guardar';
});
