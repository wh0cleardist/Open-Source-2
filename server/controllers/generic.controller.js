// Genera funciones CRUD para un modelo
export function createController(model, { mapCreate = d => d, mapUpdate = d => d } = {}) {
  return {
  create: async (req, res) => { // crear
      try {
        const payload = mapCreate(req.body);
        if (!payload.nombre && payload.nombre !== undefined) throw new Error('Campo nombre requerido');
        const result = await model.create(payload);
        const row = await model.findById(result.id);
        res.status(201).json(row);
      } catch (e) {
        res.status(400).json({ error: e.message });
      }
    },
  all: async (_req, res) => { // listar todo
      const rows = await model.findAll();
      res.json(rows);
    },
  one: async (req, res) => { // uno
      const row = await model.findById(req.params.id);
      if (!row) return res.status(404).json({ error: 'No encontrado' });
      res.json(row);
    },
  update: async (req, res) => { // actualizar
      try {
        const payload = mapUpdate(req.body);
        const result = await model.update(req.params.id, payload);
        if (!result.changes) return res.status(404).json({ error: 'No encontrado' });
        const row = await model.findById(req.params.id);
        res.json(row);
      } catch (e) {
        res.status(400).json({ error: e.message });
      }
    },
  remove: async (req, res) => { // eliminar
      const result = await model.remove(req.params.id);
      if (!result.changes) return res.status(404).json({ error: 'No encontrado' });
      res.json({ ok: true });
    }
  };
}
