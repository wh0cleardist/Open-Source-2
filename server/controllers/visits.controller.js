import { Visit, Medicine } from '../models/index.js';
import { all, run, get } from '../db/connection.js';

export const VisitsController = {
  async create(req, res) { // crear visita
    try {
      if (!req.body.visitante) throw new Error('Visitante requerido');
      if (req.body.recomendaciones && req.body.recomendaciones.length > 255) throw new Error('Recomendaciones muy largas');
      
      const cantidadDespachada = req.body.cantidad_despachada || 1;
      
      // Si se asigna medicamento, validar y descontar stock
      if (req.body.medicine_id) {
        const medicine = await Medicine.findById(req.body.medicine_id);
        if (!medicine) throw new Error('Medicamento no encontrado');
        
        const stockActual = medicine.cantidad_disponible || 0;
        
        if (stockActual < cantidadDespachada) {
          throw new Error(`Stock insuficiente. Disponible: ${stockActual}, Solicitado: ${cantidadDespachada}`);
        }
        
        // Descontar stock
        const nuevoStock = stockActual - cantidadDespachada;
        await Medicine.update(req.body.medicine_id, { 
          cantidad_disponible: nuevoStock,
          estado: nuevoStock === 0 ? 'Agotado' : medicine.estado
        });
        
        // Registrar movimiento de inventario
        await run(
          `INSERT INTO inventory_movements (medicine_id, tipo, cantidad, visit_id, motivo) VALUES (?, ?, ?, ?, ?)`,
          [req.body.medicine_id, 'SALIDA', cantidadDespachada, null, 'Despacho en visita']
        );
      }
      
      const result = await Visit.create(req.body);
      
      // Actualizar el visit_id en el movimiento
      if (req.body.medicine_id) {
        await run(
          `UPDATE inventory_movements SET visit_id = ? WHERE medicine_id = ? AND visit_id IS NULL ORDER BY id DESC LIMIT 1`,
          [result.id, req.body.medicine_id]
        );
      }
      
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
    if (req.body.recomendaciones && req.body.recomendaciones.length > 255) return res.status(400).json({ error: 'Recomendaciones muy largas' });
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
