import { Medicine } from '../models/index.js';
import { all, run } from '../db/connection.js';

// Endpoint para obtener medicamentos con stock bajo
export async function getLowStock(req, res) {
  try {
    const medicines = await all(`
      SELECT m.*, 
             dt.nombre as tipo_nombre,
             b.nombre as marca_nombre,
             l.nombre as ubicacion_nombre
      FROM medicines m
      LEFT JOIN drug_types dt ON m.drug_type_id = dt.id
      LEFT JOIN brands b ON m.brand_id = b.id
      LEFT JOIN locations l ON m.location_id = l.id
      WHERE m.cantidad_disponible <= m.stock_minimo
        AND m.estado != 'Inactivo'
      ORDER BY m.cantidad_disponible ASC
    `);
    res.json(medicines);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

// Endpoint para ajustar inventario manualmente
export async function adjustStock(req, res) {
  try {
    const { id } = req.params;
    const { cantidad, motivo } = req.body;
    
    if (!cantidad || cantidad === 0) {
      return res.status(400).json({ error: 'Cantidad requerida' });
    }
    
    const medicine = await Medicine.findById(id);
    if (!medicine) {
      return res.status(404).json({ error: 'Medicamento no encontrado' });
    }
    
    const cantidadActual = medicine.cantidad_disponible || 0;
    const nuevaCantidad = cantidadActual + parseInt(cantidad);
    
    if (nuevaCantidad < 0) {
      return res.status(400).json({ error: 'La cantidad resultante no puede ser negativa' });
    }
    
    // Actualizar stock
    await Medicine.update(id, {
      cantidad_disponible: nuevaCantidad,
      estado: nuevaCantidad === 0 ? 'Agotado' : (medicine.estado === 'Agotado' ? 'Activo' : medicine.estado)
    });
    
    // Registrar movimiento
    const tipo = cantidad > 0 ? 'ENTRADA' : 'SALIDA';
    await run(
      `INSERT INTO inventory_movements (medicine_id, tipo, cantidad, motivo) VALUES (?, ?, ?, ?)`,
      [id, tipo, Math.abs(cantidad), motivo || 'Ajuste manual']
    );
    
    const updated = await Medicine.findById(id);
    res.json(updated);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

// Endpoint para obtener historial de movimientos
export async function getMovements(req, res) {
  try {
    const { medicineId } = req.params;
    const movements = await all(`
      SELECT im.*,
             m.nombre as medicamento_nombre,
             v.visitante as visitante_nombre
      FROM inventory_movements im
      LEFT JOIN medicines m ON im.medicine_id = m.id
      LEFT JOIN visits v ON im.visit_id = v.id
      WHERE im.medicine_id = ?
      ORDER BY im.fecha_hora DESC
    `, [medicineId]);
    res.json(movements);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
