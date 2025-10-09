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
  });
}
