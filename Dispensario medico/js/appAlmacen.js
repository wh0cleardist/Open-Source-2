// Almacén: Ubicaciones, Tipos y Marcas
// Ubicaciones
const formAlmacen = document.getElementById('form-almacen');
const tbodyAlmacen = document.querySelector('#tabla tbody');
let editingIdAlmacen = null;

async function cargarUbicaciones() { // lista ubicaciones
  const data = await api.request('/locations');
  tbodyAlmacen.innerHTML = '';
  data.forEach(loc => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${loc.id}</td>
      <td>${loc.nombre}</td>
      <td>${loc.descripcion || ''}</td>
      <td>${loc.estante || ''}</td>
      <td>${loc.estado}</td>
      <td>
        <button data-edit-loc="${loc.id}">Editar</button>
        <button data-del-loc="${loc.id}">Eliminar</button>
      </td>`;
    tbodyAlmacen.appendChild(tr);
  });
}

formAlmacen.addEventListener('submit', async (e) => { // guardar ubicacion
  e.preventDefault();
  const nombre = document.getElementById('nombre').value.trim();
  if (!nombre) return alert('Nombre requerido');
  const payload = {
    nombre,
    descripcion: document.getElementById('descripcion').value.trim(),
    estante: document.getElementById('estante').value.trim(),
    estado: document.getElementById('estado').value
  };
  try {
    if (editingIdAlmacen) {
      await api.request(`/locations/${editingIdAlmacen}`, { method: 'PUT', body: JSON.stringify(payload) });
    } else {
      await api.request('/locations', { method: 'POST', body: JSON.stringify(payload) });
    }
    formAlmacen.reset();
    editingIdAlmacen = null;
    await cargarUbicaciones();
  } catch (err) { alert(err.message); }
});

tbodyAlmacen.addEventListener('click', async (e) => { // editar o borrar ubicacion
  const id = e.target.dataset.editLoc || e.target.dataset.delLoc;
  if (!id) return;
  if (e.target.dataset.editLoc) {
    const loc = await api.request(`/locations/${id}`);
    document.getElementById('nombre').value = loc.nombre;
    document.getElementById('descripcion').value = loc.descripcion || '';
    document.getElementById('estante').value = loc.estante || '';
    document.getElementById('estado').value = loc.estado;
    editingIdAlmacen = id;
  } else if (e.target.dataset.delLoc) {
    if (confirm('¿Eliminar ubicación?')) {
      await api.request(`/locations/${id}`, { method: 'DELETE' });
      await cargarUbicaciones();
    }
  }
});

// Tipos
const formTipo = document.getElementById('form-tipo');
const tbodyTipos = document.querySelector('#tabla-tipos tbody');
let editingTipoId = null;

async function cargarTipos() { // lista tipos
  const data = await api.request('/drug-types');
  tbodyTipos.innerHTML = '';
  data.forEach(t => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${t.id}</td>
      <td>${t.nombre}</td>
      <td>${t.descripcion || ''}</td>
      <td>${t.estado}</td>
      <td>
        <button data-edit-tipo="${t.id}">Editar</button>
        <button data-del-tipo="${t.id}">Eliminar</button>
      </td>`;
    tbodyTipos.appendChild(tr);
  });
}

formTipo?.addEventListener('submit', async (e) => { // guardar tipo
  e.preventDefault();
  const payload = {
    nombre: document.getElementById('tipo-nombre').value.trim(),
    descripcion: document.getElementById('tipo-descripcion').value.trim(),
    estado: document.getElementById('tipo-estado').value
  };
  if (!payload.nombre) return alert('Nombre requerido');
  try {
    if (editingTipoId) {
      await api.request(`/drug-types/${editingTipoId}`, { method: 'PUT', body: JSON.stringify(payload) });
    } else {
      await api.request('/drug-types', { method: 'POST', body: JSON.stringify(payload) });
    }
    formTipo.reset();
    editingTipoId = null;
    await cargarTipos();
  } catch (err) { alert(err.message); }
});

tbodyTipos?.addEventListener('click', async (e) => { // editar o borrar tipo
  const id = e.target.dataset.editTipo || e.target.dataset.delTipo;
  if (!id) return;
  if (e.target.dataset.editTipo) {
    const t = await api.request(`/drug-types/${id}`);
    document.getElementById('tipo-nombre').value = t.nombre;
    document.getElementById('tipo-descripcion').value = t.descripcion || '';
    document.getElementById('tipo-estado').value = t.estado;
    editingTipoId = id;
  } else if (e.target.dataset.delTipo) {
    if (confirm('¿Eliminar tipo?')) { await api.request(`/drug-types/${id}`, { method: 'DELETE' }); await cargarTipos(); }
  }
});

// Marcas
const formMarca = document.getElementById('form-marca');
const tbodyMarcas = document.querySelector('#tabla-marcas tbody');
let editingMarcaId = null;

async function cargarMarcas() { // lista marcas
  const data = await api.request('/brands');
  tbodyMarcas.innerHTML = '';
  data.forEach(m => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${m.id}</td>
      <td>${m.nombre}</td>
      <td>${m.estado}</td>
      <td>
        <button data-edit-marca="${m.id}">Editar</button>
        <button data-del-marca="${m.id}">Eliminar</button>
      </td>`;
    tbodyMarcas.appendChild(tr);
  });
}

formMarca?.addEventListener('submit', async (e) => { // guardar marca
  e.preventDefault();
  const payload = {
    nombre: document.getElementById('marca-nombre').value.trim(),
    estado: document.getElementById('marca-estado').value
  };
  if (!payload.nombre) return alert('Nombre requerido');
  try {
    if (editingMarcaId) {
      await api.request(`/brands/${editingMarcaId}`, { method: 'PUT', body: JSON.stringify(payload) });
    } else {
      await api.request('/brands', { method: 'POST', body: JSON.stringify(payload) });
    }
    formMarca.reset();
    editingMarcaId = null;
    await cargarMarcas();
  } catch (err) { alert(err.message); }
});

tbodyMarcas?.addEventListener('click', async (e) => { // editar o borrar marca
  const id = e.target.dataset.editMarca || e.target.dataset.delMarca;
  if (!id) return;
  if (e.target.dataset.editMarca) {
    const m = await api.request(`/brands/${id}`);
    document.getElementById('marca-nombre').value = m.nombre;
    document.getElementById('marca-estado').value = m.estado;
    editingMarcaId = id;
  } else if (e.target.dataset.delMarca) {
    if (confirm('¿Eliminar marca?')) { await api.request(`/brands/${id}`, { method: 'DELETE' }); await cargarMarcas(); }
  }
});

document.addEventListener('DOMContentLoaded', async () => { // cargar todo al inicio
  await Promise.all([
    cargarUbicaciones(),
    cargarTipos(),
    cargarMarcas()
  ]);
});
