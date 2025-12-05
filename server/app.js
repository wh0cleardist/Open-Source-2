// Servidor principal
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import drugTypeRoutes from './routes/drugTypes.routes.js';
import brandRoutes from './routes/brands.routes.js';
import locationRoutes from './routes/locations.routes.js';
import medicineRoutes from './routes/medicines.routes.js';
import patientRoutes from './routes/patients.routes.js';
import doctorRoutes from './routes/doctors.routes.js';
import visitRoutes from './routes/visits.routes.js';
import reportRoutes from './routes/reports.routes.js';
import inventoryRoutes from './routes/inventory.routes.js';
import { initSchema } from './db/schema.js';

const app = express();

// Configuración de CORS más segura
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://tudominio.com'] // Cambiar en producción
    : '*', // Permitir todo en desarrollo
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' })); // Límite de tamaño de payload

// Sirve los archivos del frontend (carpeta Dispensario medico)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Rutas específicas ANTES de express.static
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'Dispensario medico', 'Html', 'login.html'));
});

app.get('/login.html', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'Dispensario medico', 'Html', 'login.html'));
});

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, '..', 'Dispensario medico')));

// Ruta simple para ver si está vivo
app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

// Crea tablas si no existen
initSchema();

// Rutas de la API
app.use('/api/drug-types', drugTypeRoutes);
app.use('/api/brands', brandRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/medicines', medicineRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/visits', visitRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/inventory', inventoryRoutes);

// Middleware de manejo de errores global
app.use((err, req, res, next) => {
  console.error('Error no capturado:', err);
  res.status(500).json({ 
    error: 'Error interno del servidor',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Si no encuentra la ruta
app.use((req, res) => {
  res.status(404).json({ error: 'Recurso no encontrado' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  const urlBase = `http://localhost:${PORT}`;
  const dashboard = `${urlBase}/Html/index.html`;
  console.log('==========================================');
  console.log(`Servidor desplegado en: ${urlBase}`);
  console.log('==========================================');
});
