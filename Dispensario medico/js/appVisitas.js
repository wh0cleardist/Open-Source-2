const formVis = document.getElementById('form-visita');
const formFiltro = document.getElementById('form-filtro');
const tbodyVis = document.querySelector('#tabla tbody');
let editingVisitId = null;
let cacheDocs=[], cachePacs=[], cacheMeds=[];

async function cargarSelectBase(path, id) { // llena selects
  const data = await api.request(path);
  const sel = document.getElementById(id);
  sel.innerHTML = '<option value="">--</option>' + data.map(r => `<option value="${r.id}">${r.nombre}</option>`).join('');
  const fSel = document.getElementById('f_' + id);
  if (fSel) {
    fSel.innerHTML = '<option value="">--</option>' + data.map(r => `<option value="${r.id}">${r.nombre}</option>`).join('');
  }
}

function nombre(list, id){ if(!id) return ''; const f=list.find(x=>x.id===id); return f?f.nombre:id; }

async function cargarVisitas(params='') { // lista visitas
  const data = await api.request('/visits' + params);
  tbodyVis.innerHTML = '';
  data.forEach(v => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${v.id}</td>
      <td>${v.visitante}</td>
      <td>${nombre(cacheDocs, v.doctor_id)}</td>
      <td>${nombre(cachePacs, v.patient_id)}</td>
      <td>${nombre(cacheMeds, v.medicine_id)}</td>
      <td>${v.cantidad_despachada || 1}</td>
      <td>${v.fecha||''}</td>
      <td>${v.hora||''}</td>
      <td>${v.sintomas||''}</td>
      <td>${v.recomendaciones||''}</td>
      <td>${v.estado}</td>
      <td><button data-edit="${v.id}">Editar</button><button data-del="${v.id}">Del</button></td>`;
    tbodyVis.appendChild(tr);
  });
}

formVis.addEventListener('submit', async (e) => { // guardar visita
  e.preventDefault();
  
  // Validar campos requeridos
  const visitante = document.getElementById('visitante').value.trim();
  const fecha = document.getElementById('fecha').value;
  const hora = document.getElementById('hora').value;
  
  if (!visitante) {
    alert('El nombre del visitante es requerido');
    return;
  }
  if (!fecha) {
    alert('La fecha de visita es requerida');
    return;
  }
  if (!hora) {
    alert('La hora de visita es requerida');
    return;
  }
  
  const payload = {
    visitante: visitante,
    doctor_id: document.getElementById('doctor_id').value || null,
    patient_id: document.getElementById('patient_id').value || null,
    medicine_id: document.getElementById('medicine_id').value || null,
    cantidad_despachada: parseInt(document.getElementById('cantidad_despachada').value) || 1,
    fecha: fecha,
    hora: hora,
    sintomas: document.getElementById('sintomas').value.trim(),
    recomendaciones: document.getElementById('recomendaciones').value.trim(),
    estado: document.getElementById('estado').value
  };
  
  try {
    let mensaje = '';
    if (editingVisitId) {
      await api.request(`/visits/${editingVisitId}`, { method: 'PUT', body: JSON.stringify(payload) });
      mensaje = 'Visita actualizada correctamente';
    } else {
      await api.request('/visits', { method: 'POST', body: JSON.stringify(payload) });
      mensaje = 'Visita guardada correctamente';
    }
    
    editingVisitId = null;
    formVis.reset();
    alert(mensaje); // Feedback visual
    await cargarVisitas();
  } catch (err) { 
    console.error('Error al guardar visita:', err);
    alert('Error al guardar: ' + err.message); 
  }
});

tbodyVis.addEventListener('click', async (e) => { // editar o borrar
  const id = e.target.dataset.edit || e.target.dataset.del;
  if (!id) return; // Importante: salir si no hay ID
  
  try {
    if (e.target.dataset.edit) {
      const v = await api.request(`/visits/${id}`);
      document.getElementById('visitante').value = v.visitante;
      document.getElementById('doctor_id').value = v.doctor_id || '';
      document.getElementById('patient_id').value = v.patient_id || '';
      document.getElementById('medicine_id').value = v.medicine_id || '';
      document.getElementById('cantidad_despachada').value = v.cantidad_despachada || 1;
      document.getElementById('fecha').value = v.fecha || '';
      document.getElementById('hora').value = v.hora || '';
      document.getElementById('sintomas').value = v.sintomas || '';
      document.getElementById('recomendaciones').value = v.recomendaciones || '';
      document.getElementById('estado').value = v.estado;
      editingVisitId = id;
      // Scroll al formulario
      document.getElementById('form-visita').scrollIntoView({ behavior: 'smooth' });
    } else if (e.target.dataset.del) {
      if (confirm('¿Eliminar visita?')) { 
        await api.request(`/visits/${id}`, { method: 'DELETE' }); 
        await cargarVisitas(); 
      }
    }
  } catch (err) {
    console.error('Error en operación:', err);
    alert('Error: ' + err.message);
  }
});

formFiltro.addEventListener('submit', async (e) => { // filtros reporte
  e.preventDefault();
  const doctorId = document.getElementById('f_doctor_id').value;
  const patientId = document.getElementById('f_patient_id').value;
  const date = document.getElementById('f_date').value;
  const from = document.getElementById('f_from').value;
  const to = document.getElementById('f_to').value;
  
  try {
    const q = new URLSearchParams();
    if (doctorId) q.append('doctorId', doctorId);
    if (patientId) q.append('patientId', patientId);
    if (date) q.append('date', date);
    if (from && to) { q.append('from', from); q.append('to', to); }
    
    const rows = await api.request('/reports/visits?' + q.toString());
    
    // Limpiar tabla antes de mostrar resultados filtrados
    tbodyVis.innerHTML = '';
    
    if (rows.length === 0) {
      tbodyVis.innerHTML = '<tr><td colspan="12" style="text-align:center;padding:20px;">No hay resultados</td></tr>';
      return;
    }
    
    rows.forEach(v => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${v.id}</td>
        <td>${v.visitante}</td>
        <td>${v.doctor_nombre||v.doctor_id||''}</td>
        <td>${v.paciente_nombre||v.patient_id||''}</td>
        <td>${v.medicamento_nombre||v.medicine_id||''}</td>
        <td>${v.cantidad_despachada || 1}</td>
        <td>${v.fecha||''}</td>
        <td>${v.hora||''}</td>
        <td>${v.sintomas||''}</td>
        <td>${v.recomendaciones||''}</td>
        <td>${v.estado}</td>
        <td>-</td>`;
      tbodyVis.appendChild(tr);
    });
  } catch (err) {
    console.error('Error en filtro:', err);
    alert('Error al filtrar: ' + err.message);
  }
});

document.addEventListener('DOMContentLoaded', async () => { // inicio
  const [docs, pacs, meds] = await Promise.all([
    api.request('/doctors'),
    api.request('/patients'),
    api.request('/medicines')
  ]);
  cacheDocs = docs; cachePacs = pacs; cacheMeds = meds;
  // llenar selects
  fillSelect('doctor_id', docs);
  fillSelect('patient_id', pacs);
  fillSelect('medicine_id', meds);
  fillSelect('f_doctor_id', docs);
  fillSelect('f_patient_id', pacs);
  fillSelect('f_medicine_id', meds);
  await cargarVisitas();
  
  // Agregar listener para limpiar filtro
  const btnLimpiar = document.getElementById('btn-limpiar-filtro');
  if (btnLimpiar) {
    btnLimpiar.addEventListener('click', async () => {
      formFiltro.reset();
      await cargarVisitas();
    });
  }
});

function fillSelect(id, data){
  const el = document.getElementById(id);
  if(!el) return;
  el.innerHTML = '<option value="">--</option>' + data.map(d=>`<option value="${d.id}">${d.nombre}</option>`).join('');
}
