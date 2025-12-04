const formDoc = document.getElementById('form-medico');
const tbodyDoc = document.querySelector('#tabla tbody');
const btnDocCancelar = document.getElementById('btn-doc-cancelar');
let editingDocId = null;

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
  const payload = {
    nombre: document.getElementById('nombre').value.trim(),
    identificador: document.getElementById('identificador').value.trim(),
    cedula: document.getElementById('cedula').value.trim(),
    tanda_laboral: document.getElementById('tanda_laboral').value,
    especialidad: document.getElementById('especialidad').value.trim(),
    estado: document.getElementById('estado').value
  };
  if (!payload.nombre) return alert('Nombre requerido');
  try {
    if (editingDocId) {
      await api.request(`/doctors/${editingDocId}`, { method: 'PUT', body: JSON.stringify(payload) });
    } else {
      await api.request('/doctors', { method: 'POST', body: JSON.stringify(payload) });
    }
    editingDocId = null;
    formDoc.reset();
    btnDocCancelar.classList.add('hidden');
    document.getElementById('btn-doc-guardar').textContent='Guardar';
    await cargarMedicos();
  } catch (err) { alert(err.message); }
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
