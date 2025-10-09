const formVis = document.getElementById('form-visita');
const formFiltro = document.getElementById('form-filtro');
const tbodyVis = document.querySelector('#tabla tbody');
let editingVisitId = null;

async function cargarSelectBase(path, id) { // llena selects
  const data = await api.request(path);
  const sel = document.getElementById(id);
  sel.innerHTML = '<option value="">--</option>' + data.map(r => `<option value="${r.id}">${r.nombre}</option>`).join('');
  const fSel = document.getElementById('f_' + id);
  if (fSel) {
    fSel.innerHTML = '<option value="">--</option>' + data.map(r => `<option value="${r.id}">${r.nombre}</option>`).join('');
  }
}

async function cargarVisitas(params='') { // lista visitas
  const data = await api.request('/visits' + params);
  tbodyVis.innerHTML = '';
  data.forEach(v => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${v.id}</td>
      <td>${v.visitante}</td>
      <td>${v.doctor_id||''}</td>
      <td>${v.patient_id||''}</td>
      <td>${v.medicine_id||''}</td>
      <td>${v.fecha||''}</td>
      <td>${v.hora||''}</td>
      <td>${v.sintomas||''}</td>
      <td>${v.estado}</td>
      <td><button data-edit="${v.id}">Editar</button><button data-del="${v.id}">Del</button></td>`;
    tbodyVis.appendChild(tr);
  });
}

formVis.addEventListener('submit', async (e) => { // guardar visita
  e.preventDefault();
  const payload = {
    visitante: document.getElementById('visitante').value.trim(),
    doctor_id: document.getElementById('doctor_id').value || null,
    patient_id: document.getElementById('patient_id').value || null,
    medicine_id: document.getElementById('medicine_id').value || null,
    fecha: document.getElementById('fecha').value,
    hora: document.getElementById('hora').value,
    sintomas: document.getElementById('sintomas').value.trim(),
    estado: document.getElementById('estado').value
  };
  if (!payload.visitante) return alert('Visitante requerido');
  try {
    if (editingVisitId) {
      await api.request(`/visits/${editingVisitId}`, { method: 'PUT', body: JSON.stringify(payload) });
    } else {
      await api.request('/visits', { method: 'POST', body: JSON.stringify(payload) });
    }
    editingVisitId = null;
    formVis.reset();
    await cargarVisitas();
  } catch (err) { alert(err.message); }
});

tbodyVis.addEventListener('click', async (e) => { // editar o borrar
  const id = e.target.dataset.edit || e.target.dataset.del;
  if (!id) return;
  if (e.target.dataset.edit) {
    const v = await api.request(`/visits/${id}`);
    document.getElementById('visitante').value = v.visitante;
    document.getElementById('doctor_id').value = v.doctor_id || '';
    document.getElementById('patient_id').value = v.patient_id || '';
    document.getElementById('medicine_id').value = v.medicine_id || '';
    document.getElementById('fecha').value = v.fecha || '';
    document.getElementById('hora').value = v.hora || '';
    document.getElementById('sintomas').value = v.sintomas || '';
    document.getElementById('estado').value = v.estado;
    editingVisitId = id;
  } else if (e.target.dataset.del) {
    if (confirm('¿Eliminar visita?')) { await api.request(`/visits/${id}`, { method: 'DELETE' }); await cargarVisitas(); }
  }
});

formFiltro.addEventListener('submit', async (e) => { // filtros reporte
  e.preventDefault();
  const doctorId = document.getElementById('f_doctor_id').value;
  const patientId = document.getElementById('f_patient_id').value;
  const date = document.getElementById('f_date').value;
  const from = document.getElementById('f_from').value;
  const to = document.getElementById('f_to').value;
  const q = new URLSearchParams();
  if (doctorId) q.append('doctorId', doctorId);
  if (patientId) q.append('patientId', patientId);
  if (date) q.append('date', date);
  if (from && to) { q.append('from', from); q.append('to', to); }
  const rows = await api.request('/reports/visits?' + q.toString());
  // Reuse table for filtered results
  tbodyVis.innerHTML='';
  rows.forEach(v => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${v.id}</td>
      <td>${v.visitante}</td>
      <td>${v.doctor_nombre||v.doctor_id||''}</td>
      <td>${v.paciente_nombre||v.patient_id||''}</td>
      <td>${v.medicamento_nombre||v.medicine_id||''}</td>
      <td>${v.fecha||''}</td>
      <td>${v.hora||''}</td>
      <td>${v.sintomas||''}</td>
      <td>${v.estado}</td>
      <td>-</td>`;
    tbodyVis.appendChild(tr);
  });
});

document.addEventListener('DOMContentLoaded', async () => { // inicio
  await Promise.all([
    cargarSelectBase('/doctors','doctor_id'),
    cargarSelectBase('/patients','patient_id'),
    cargarSelectBase('/medicines','medicine_id')
  ]);
  await cargarVisitas();
});
