import { Visit } from '../models/index.js';
import { all } from '../db/connection.js';

export const VisitsController = {
  async create(req, res) { // crear visita
    try {
      if (!req.body.visitante) throw new Error('Visitante requerido');
      const result = await Visit.create(req.body);
      const row = await Visit.findById(result.id);
      res.status(201).json(row);
    } catch (e) {
      res.status(400).json({ error: e.message });
    }
  },
  async all(_req, res) { // listar visitas
    const rows = await Visit.findAll();
    res.json(rows);
  },
  async one(req, res) { // una visita
    const row = await Visit.findById(req.params.id);
    if (!row) return res.status(404).json({ error: 'No encontrado' });
    res.json(row);
  },
  async update(req, res) { // actualizar
    if (req.body.visitante !== undefined && !req.body.visitante) return res.status(400).json({ error: 'Visitante requerido' });
    const result = await Visit.update(req.params.id, req.body);
    if (!result.changes) return res.status(404).json({ error: 'No encontrado' });
    const row = await Visit.findById(req.params.id);
    res.json(row);
  },
  async remove(req, res) { // borrar
    const result = await Visit.remove(req.params.id);
    if (!result.changes) return res.status(404).json({ error: 'No encontrado' });
    res.json({ ok: true });
  },
  async report(req, res) { // reporte con filtros
    const { doctorId, patientId, date, from, to } = req.query;
    const conditions = [];
    const params = [];
    if (doctorId) { conditions.push('v.doctor_id = ?'); params.push(doctorId); }
    if (patientId) { conditions.push('v.patient_id = ?'); params.push(patientId); }
    if (date) { conditions.push('v.fecha = ?'); params.push(date); }
    if (from && to) { conditions.push('v.fecha BETWEEN ? AND ?'); params.push(from, to); }
    const where = conditions.length ? 'WHERE ' + conditions.join(' AND ') : '';
    const sql = `SELECT v.*, d.nombre as doctor_nombre, p.nombre as paciente_nombre, m.nombre as medicamento_nombre
                 FROM visits v
                 LEFT JOIN doctors d ON d.id = v.doctor_id
                 LEFT JOIN patients p ON p.id = v.patient_id
                 LEFT JOIN medicines m ON m.id = v.medicine_id
                 ${where}
                 ORDER BY v.fecha DESC, v.hora DESC`;
    const rows = await all(sql, params);
    res.json(rows);
  }
};
