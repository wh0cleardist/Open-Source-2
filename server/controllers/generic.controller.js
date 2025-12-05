// Genera funciones CRUD para un modelo
export function createController(model, { mapCreate = d => d, mapUpdate = d => d } = {}) {
  return {
    create: async (req, res) => { // crear
      try {
        const payload = mapCreate(req.body);
        if (!payload.nombre && payload.nombre !== undefined) {
          return res.status(400).json({ error: 'Campo nombre requerido' });
        }
        // Validación específica para ciertas tablas
        if (model.table === 'medicines' && payload.dosis && payload.dosis.length > 120) {
          return res.status(400).json({ error: 'Dosis muy larga (máximo 120 caracteres)' });
        }
        const result = await model.create(payload);
        const row = await model.findById(result.id);
        res.status(201).json(row);
      } catch (e) {
        console.error(`Error al crear en ${model.table}:`, e);
        res.status(400).json({ error: e.message });
      }
    },
    all: async (_req, res) => { // listar todo
      try {
        const rows = await model.findAll();
        res.json(rows);
      } catch (e) {
        console.error(`Error al listar ${model.table}:`, e);
        res.status(500).json({ error: 'Error al obtener registros' });
      }
    },
    one: async (req, res) => { // uno
      try {
        const row = await model.findById(req.params.id);
        if (!row) return res.status(404).json({ error: 'No encontrado' });
        res.json(row);
      } catch (e) {
        console.error(`Error al obtener registro de ${model.table}:`, e);
        res.status(500).json({ error: 'Error al obtener registro' });
      }
    },
    update: async (req, res) => { // actualizar
      try {
        const payload = mapUpdate(req.body);
        if (model.table === 'medicines' && payload.dosis && payload.dosis.length > 120) {
          return res.status(400).json({ error: 'Dosis muy larga (máximo 120 caracteres)' });
        }
        const result = await model.update(req.params.id, payload);
        if (!result.changes) return res.status(404).json({ error: 'No encontrado' });
        const row = await model.findById(req.params.id);
        res.json(row);
      } catch (e) {
        console.error(`Error al actualizar en ${model.table}:`, e);
        res.status(400).json({ error: e.message });
      }
    },
    remove: async (req, res) => { // eliminar
      try {
        const result = await model.remove(req.params.id);
        if (!result.changes) return res.status(404).json({ error: 'No encontrado' });
        res.json({ ok: true });
      } catch (e) {
        console.error(`Error al eliminar de ${model.table}:`, e);
        res.status(500).json({ error: 'Error al eliminar registro' });
      }
    }
  };
}
