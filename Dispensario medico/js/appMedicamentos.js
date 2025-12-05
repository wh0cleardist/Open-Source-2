// Script para manejar CRUD de medicamentos
const formMed = document.getElementById('form-medicamento');
const tbodyMed = document.querySelector('#tabla tbody');
let editingMedId = null;

// Cache catálogos para mostrar nombres
const cache = { tipos: [], marcas: [], ubicaciones: [] };

async function cargarCatalogos() { // trae catálogos y llena selects
  const [tipos, marcas, ubicaciones] = await Promise.all([
    api.request('/drug-types'),
    api.request('/brands'),
    api.request('/locations')
  ]);
  cache.tipos = tipos;
  cache.marcas = marcas;
  cache.ubicaciones = ubicaciones;
  fillSelect('drug_type_id', tipos);
  fillSelect('brand_id', marcas);
  fillSelect('location_id', ubicaciones);
}

function fillSelect(id, data) {
  const sel = document.getElementById(id);
  sel.innerHTML = '<option value="">--</option>' + data.map(d => `<option value="${d.id}">${d.nombre}</option>`).join('');
}

function nombreDe(id, lista){
  if(!id) return '';
  const item = lista.find(x=> x.id === id);
  return item ? item.nombre : id;
}

async function cargarMedicamentos() { // lista y pinta medicamentos
  const data = await api.request('/medicines');
  tbodyMed.innerHTML = '';
  data.forEach(m => {
    const stock = m.cantidad_disponible || 0;
    const stockMin = m.stock_minimo || 5;
    let stockColor = 'green';
    let stockIcon = '✓';
    
    if (stock === 0) {
      stockColor = 'red';
      stockIcon = '✗';
    } else if (stock <= stockMin) {
      stockColor = 'orange';
      stockIcon = '⚠';
    }
    
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${m.id}</td>
      <td>${m.nombre}</td>
      <td>${m.descripcion||''}</td>
      <td>${m.dosis||''}</td>
      <td style="color:${stockColor}; font-weight:bold;">${stockIcon} ${stock}</td>
      <td>${nombreDe(m.drug_type_id, cache.tipos)}</td>
      <td>${nombreDe(m.brand_id, cache.marcas)}</td>
      <td>${nombreDe(m.location_id, cache.ubicaciones)}</td>
      <td>${m.estado}</td>
      <td><button data-edit="${m.id}">Editar</button><button data-del="${m.id}">Del</button></td>`;
    tbodyMed.appendChild(tr);
  });
}

formMed.addEventListener('submit', async (e) => { // guardar o actualizar
  e.preventDefault();
  const payload = {
    nombre: document.getElementById('nombre').value.trim(),
    descripcion: document.getElementById('descripcion').value.trim(),
    dosis: document.getElementById('dosis').value.trim(),
    cantidad_disponible: parseInt(document.getElementById('cantidad_disponible').value) || 0,
    stock_minimo: parseInt(document.getElementById('stock_minimo').value) || 5,
    drug_type_id: +document.getElementById('drug_type_id').value || null,
    brand_id: +document.getElementById('brand_id').value || null,
    location_id: +document.getElementById('location_id').value || null,
    estado: document.getElementById('estado').value
  };
  if (!payload.nombre) return alert('Nombre requerido');
  
  try {
    if (editingMedId) {
      await api.request(`/medicines/${editingMedId}`, { method: 'PUT', body: JSON.stringify(payload) });
      alert('Medicamento actualizado correctamente');
    } else {
      await api.request('/medicines', { method: 'POST', body: JSON.stringify(payload) });
      alert('Medicamento guardado correctamente');
    }
    formMed.reset();
    editingMedId = null;
    await cargarMedicamentos();
  } catch (err) { 
    console.error('Error:', err);
    alert('Error: ' + err.message); 
  }
});

tbodyMed.addEventListener('click', async (e) => { // editar o borrar
  const id = e.target.dataset.edit || e.target.dataset.del;
  if (!id) return;
  
  if (e.target.dataset.edit) {
    const m = await api.request(`/medicines/${id}`);
    document.getElementById('nombre').value = m.nombre;
    document.getElementById('descripcion').value = m.descripcion || '';
    document.getElementById('dosis').value = m.dosis || '';
    document.getElementById('cantidad_disponible').value = m.cantidad_disponible || 0;
    document.getElementById('stock_minimo').value = m.stock_minimo || 5;
    document.getElementById('drug_type_id').value = m.drug_type_id || '';
    document.getElementById('brand_id').value = m.brand_id || '';
    document.getElementById('location_id').value = m.location_id || '';
    document.getElementById('estado').value = m.estado || 'Activo';
    editingMedId = id;
  } else if (e.target.dataset.del) {
    if (confirm('¿Eliminar?')) { 
      await api.request(`/medicines/${id}`, { method: 'DELETE' }); 
      await cargarMedicamentos(); 
    }
  }
});

document.addEventListener('DOMContentLoaded', async () => { // inicio
  await cargarCatalogos();
  await cargarMedicamentos();
});
