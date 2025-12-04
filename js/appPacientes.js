const formPac = document.getElementById('form-paciente');
const tbodyPac = document.querySelector('#tabla tbody');
const btnPacCancelar = document.getElementById('btn-pac-cancelar');
let editingPacId = null;
let cacheDocs = [];

async function cargarDoctoresPaciente() {
  cacheDocs = await api.request('/doctors');
  const sel = document.getElementById('doctor_id');
  sel.innerHTML = '<option value="">--</option>' + cacheDocs.map(d => `<option value="${d.id}">${d.nombre}</option>`).join('');
}

async function cargarPacientes() {
  const data = await api.request('/patients');
  tbodyPac.innerHTML='';
  data.forEach(p => {
    const doctorNombre = cacheDocs.find(d=> d.id === p.doctor_id)?.nombre || '';
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${p.id}</td>
      <td>${p.nombre}</td>
      <td>${p.cedula||''}</td>
      <td>${p.identificador||''}</td>
      <td>${p.tipo||''}</td>
      <td>${p.estado}</td>
      <td>${doctorNombre}</td>
      <td><button data-edit="${p.id}">Editar</button><button data-del="${p.id}">Del</button></td>`;
    tbodyPac.appendChild(tr);
  });
}

formPac.addEventListener('submit', async (e) => {
  e.preventDefault();
  const payload = {
    nombre: document.getElementById('nombre').value.trim(),
    cedula: document.getElementById('cedula').value.trim(),
    identificador: document.getElementById('identificador').value.trim(),
    tipo: document.getElementById('tipo').value,
    estado: document.getElementById('estado').value,
    doctor_id: document.getElementById('doctor_id').value || null
  };
  if (!payload.nombre) return alert('Nombre requerido');
  try {
    if (editingPacId) {
      await api.request(`/patients/${editingPacId}`, { method: 'PUT', body: JSON.stringify(payload) });
    } else {
      await api.request('/patients', { method: 'POST', body: JSON.stringify(payload) });
    }
    editingPacId = null;
    formPac.reset();
    btnPacCancelar.classList.add('hidden');
    document.getElementById('btn-pac-guardar').textContent='Guardar';
    await cargarPacientes();
  } catch (err) { alert(err.message); }
});

tbodyPac.addEventListener('click', async (e) => {
  const id = e.target.dataset.edit || e.target.dataset.del;
  if (!id) return;
  if (e.target.dataset.edit) {
    const p = await api.request(`/patients/${id}`);
    document.getElementById('nombre').value = p.nombre;
    document.getElementById('cedula').value = p.cedula || '';
    document.getElementById('identificador').value = p.identificador || '';
    document.getElementById('tipo').value = p.tipo || 'Estudiante';
    document.getElementById('estado').value = p.estado;
    document.getElementById('doctor_id').value = p.doctor_id || '';
    editingPacId = id;
    btnPacCancelar.classList.remove('hidden');
    document.getElementById('btn-pac-guardar').textContent='Actualizar';
  } else if (e.target.dataset.del) {
    if (confirm('¿Eliminar?')) { await api.request(`/patients/${id}`, { method: 'DELETE' }); await cargarPacientes(); }
  }
});

document.addEventListener('DOMContentLoaded', async () => {
  await cargarDoctoresPaciente();
  await cargarPacientes();
});
btnPacCancelar?.addEventListener('click', ()=>{
  editingPacId = null;
  formPac.reset();
  btnPacCancelar.classList.add('hidden');
  document.getElementById('btn-pac-guardar').textContent='Guardar';
});
