import { db } from './connection.js';

// Crea todas las tablas
export function initSchema() {
  db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS drug_types (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL UNIQUE,
      descripcion TEXT,
      estado TEXT DEFAULT 'Activo'
    );`);

    db.run(`CREATE TABLE IF NOT EXISTS brands (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL UNIQUE,
      estado TEXT DEFAULT 'Activo'
    );`);

    db.run(`CREATE TABLE IF NOT EXISTS locations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      descripcion TEXT,
      estante TEXT,
      estado TEXT DEFAULT 'Activo'
    );`);

    db.run(`CREATE TABLE IF NOT EXISTS medicines (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      drug_type_id INTEGER,
      brand_id INTEGER,
      location_id INTEGER,
      estado TEXT DEFAULT 'Activo',
      FOREIGN KEY(drug_type_id) REFERENCES drug_types(id),
      FOREIGN KEY(brand_id) REFERENCES brands(id),
      FOREIGN KEY(location_id) REFERENCES locations(id)
    );`);

    db.run(`CREATE TABLE IF NOT EXISTS doctors (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      identificador TEXT UNIQUE,
      cedula TEXT,
      tanda_laboral TEXT,
      especialidad TEXT,
      estado TEXT DEFAULT 'Disponible'
    );`);

    db.run(`CREATE TABLE IF NOT EXISTS patients (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      cedula TEXT,
      identificador TEXT UNIQUE,
      tipo TEXT,
      estado TEXT DEFAULT 'Activo',
      doctor_id INTEGER,
      FOREIGN KEY(doctor_id) REFERENCES doctors(id)
    );`);

    db.run(`CREATE TABLE IF NOT EXISTS visits (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      visitante TEXT NOT NULL,
      doctor_id INTEGER,
      patient_id INTEGER,
      medicine_id INTEGER,
      fecha TEXT,
      hora TEXT,
      sintomas TEXT,
      estado TEXT DEFAULT 'Activo',
      FOREIGN KEY(doctor_id) REFERENCES doctors(id),
      FOREIGN KEY(patient_id) REFERENCES patients(id),
      FOREIGN KEY(medicine_id) REFERENCES medicines(id)
    );`);

    // --- Migraciones aditivas (añaden columnas si no existen) ---
    // Helper que intenta ALTER y silencia error de columna duplicada
    function addColumn(table, columnDef){
      db.run(`ALTER TABLE ${table} ADD COLUMN ${columnDef};`, err => {
        if (err && !/duplicate column name/i.test(err.message)) {
          console.warn('[schema] No se pudo agregar columna', table, columnDef, err.message);
        }
      });
    }

    // brands: descripcion
    addColumn('brands', 'descripcion TEXT');
    // locations: tramo, celda (mantengo descripcion/estante por retro-compatibilidad)
    addColumn('locations', 'tramo TEXT');
    addColumn('locations', 'celda TEXT');
    // medicines: descripcion, dosis
    addColumn('medicines', 'descripcion TEXT');
    addColumn('medicines', 'dosis TEXT');
    // visits: recomendaciones
    addColumn('visits', 'recomendaciones TEXT');
    
    // INVENTARIO: cantidad disponible en medicamentos
    addColumn('medicines', 'cantidad_disponible INTEGER DEFAULT 0');
    addColumn('medicines', 'stock_minimo INTEGER DEFAULT 5');
    
    // INVENTARIO: cantidad despachada en visitas
    addColumn('visits', 'cantidad_despachada INTEGER DEFAULT 1');
    
    // Tabla de movimientos de inventario (para historial)
    db.run(`CREATE TABLE IF NOT EXISTS inventory_movements (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      medicine_id INTEGER NOT NULL,
      tipo TEXT NOT NULL,
      cantidad INTEGER NOT NULL,
      visit_id INTEGER,
      motivo TEXT,
      usuario TEXT DEFAULT 'sistema',
      fecha_hora TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(medicine_id) REFERENCES medicines(id),
      FOREIGN KEY(visit_id) REFERENCES visits(id)
    );`);
  });
}
