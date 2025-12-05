// Catálogo simplificado
const selectCat = document.getElementById('catalogo');
const form = document.getElementById('form-catalogo');
const btnCancelar = document.getElementById('btn-cancelar');
const headRow = document.getElementById('head-row');
const bodyRows = document.getElementById('body-rows');

// Campos
const fNombre = document.getElementById('f-nombre');
const fDesc = document.getElementById('f-descripcion');
const fEstante = document.getElementById('f-estante');
const fEstado = document.getElementById('f-estado');
const fTramo = document.getElementById('f-tramo');
const fCelda = document.getElementById('f-celda');
const wrapDesc = document.getElementById('wrap-descripcion');
const wrapEst = document.getElementById('wrap-estante');
const wrapTramo = document.getElementById('wrap-tramo');
const wrapCelda = document.getElementById('wrap-celda');

let editingId = null;

// Config catálogos
const catalogs = {
  ubicaciones: {
    endpoint: '/locations',
    cols: ['ID','Nombre','Descripción','Estante','Tramo','Celda','Estado','Acciones'],
    show: { descripcion:true, estante:true, tramo:true, celda:true },
    map(row){ return [row.id,row.nombre,row.descripcion||'',row.estante||'',row.tramo||'',row.celda||'',row.estado]; }
  },
  tipos: {
    endpoint: '/drug-types',
    cols: ['ID','Nombre','Descripción','Estado','Acciones'],
  show: { descripcion:true, estante:false, tramo:false, celda:false },
    map(row){ return [row.id,row.nombre,row.descripcion||'',row.estado]; }
  },
  marcas: {
    endpoint: '/brands',
    cols: ['ID','Nombre','Estado','Acciones'],
  show: { descripcion:false, estante:false, tramo:false, celda:false },
    map(row){ return [row.id,row.nombre,row.estado]; }
  }
};

function renderHead(cfg){
  headRow.innerHTML = '';
  cfg.cols.forEach(c=>{
    const th=document.createElement('th');
    th.textContent=c; headRow.appendChild(th);
  });
}

async function loadRows(){
  const cat = selectCat.value;
  const cfg = catalogs[cat];
  bodyRows.innerHTML = '';
  const data = await api.request(cfg.endpoint);
  data.forEach(r=>{
    const tr=document.createElement('tr');
    const values = cfg.map(r);
    values.forEach(v=>{
      const td=document.createElement('td');
      td.textContent=v; tr.appendChild(td);
    });
    const tdAcc = document.createElement('td');
    tdAcc.className='acciones';
    tdAcc.innerHTML = `<button data-edit="${r.id}">Editar</button><button data-del="${r.id}">Del</button>`;
    tr.appendChild(tdAcc);
    bodyRows.appendChild(tr);
  });
}

function updateVisibility(){
  const cfg = catalogs[selectCat.value];
  wrapDesc.classList.toggle('hidden', !cfg.show.descripcion);
  wrapEst.classList.toggle('hidden', !cfg.show.estante);
  wrapTramo.classList.toggle('hidden', !cfg.show.tramo);
  wrapCelda.classList.toggle('hidden', !cfg.show.celda);
}

function resetForm(){
  form.reset();
  editingId = null;
  btnCancelar.classList.add('hidden');
  document.getElementById('btn-guardar').textContent='Guardar';
}

selectCat.addEventListener('change', ()=>{
  resetForm();
  renderHead(catalogs[selectCat.value]);
  updateVisibility();
  loadRows();
});

form.addEventListener('submit', async e => {
  e.preventDefault();
  const nombre = fNombre.value.trim();
  if(!nombre) return alert('Nombre requerido');
  const cat = selectCat.value;
  const cfg = catalogs[cat];
  const payload = { nombre, estado: fEstado.value };
  if (cfg.show.descripcion) payload.descripcion = fDesc.value.trim();
  if (cfg.show.estante) payload.estante = fEstante.value.trim();
  if (cfg.show.tramo) payload.tramo = fTramo.value.trim();
  if (cfg.show.celda) payload.celda = fCelda.value.trim();
  try {
    if (editingId) {
      await api.request(`${cfg.endpoint}/${editingId}`, { method:'PUT', body: JSON.stringify(payload) });
    } else {
      await api.request(cfg.endpoint, { method:'POST', body: JSON.stringify(payload) });
    }
    resetForm();
    loadRows();
  } catch(err){ alert(err.message); }
});

btnCancelar.addEventListener('click', resetForm);

bodyRows.addEventListener('click', async e => {
  const id = e.target.dataset.edit || e.target.dataset.del;
  if(!id) return;
  const cfg = catalogs[selectCat.value];
  if (e.target.dataset.edit){
    const row = await api.request(`${cfg.endpoint}/${id}`);
    fNombre.value = row.nombre || '';
    if (cfg.show.descripcion) fDesc.value = row.descripcion || '';
    if (cfg.show.estante) fEstante.value = row.estante || '';
    if (cfg.show.tramo) fTramo.value = row.tramo || '';
    if (cfg.show.celda) fCelda.value = row.celda || '';
    fEstado.value = row.estado || 'Activo';
    editingId = id;
    btnCancelar.classList.remove('hidden');
    document.getElementById('btn-guardar').textContent='Actualizar';
  } else if (e.target.dataset.del){
    if (confirm('¿Eliminar registro?')){
      await api.request(`${cfg.endpoint}/${id}`, { method:'DELETE' });
      loadRows();
    }
  }
});

// Init
document.addEventListener('DOMContentLoaded', () => {
  renderHead(catalogs[selectCat.value]);
  updateVisibility();
  loadRows();
});
