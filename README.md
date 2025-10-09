# Sistema Dispensario Médico (Versión Simple)

Este proyecto es un sistema básico para gestionar un pequeño dispensario médico.
Tiene un backend en Node.js con Express y base de datos SQLite.
El frontend son páginas HTML con JavaScript simple que usan fetch para llamar a la API.

## Qué Incluye

- CRUD de: Tipos de Fármacos, Marcas, Ubicaciones, Medicamentos, Médicos, Pacientes y Visitas.
- Reporte básico de visitas con filtros.
- Página de Almacén para manejar catálogos (Tipos, Marcas, Ubicaciones).
- Menú navegable reutilizable (navbar) y un dashboard inicial (`index.html`).

## Estructura (Resumida)

```
server/          -> Código del backend (Express)
Dispensario medico/Html/  -> Páginas HTML
Dispensario medico/js/    -> Scripts JS
Dispensario medico/css/   -> Estilos
data/dispensario.db       -> Base SQLite (se crea sola)
```

## Entidades Principales

- drug_types
- brands
- locations
- medicines
- doctors
- patients
- visits

## Cómo Ejecutar

1. Ir a la carpeta del backend:
```bash
cd server
npm install
```
2. Levantar en modo desarrollo:
```bash
npm run dev
```
3. Abrir en el navegador:
```
http://localhost:3000/
```
Si quieres otra página: por ejemplo `http://localhost:3000/Html/Almacen.html`.

## Página de Almacén

Desde `Almacen.html` puedes crear:
- Ubicaciones
- Tipos de fármacos
- Marcas

Estos datos luego sirven para registrar Medicamentos.

## Flujo de Uso
1. En Almacén crea Tipos, Marcas y Ubicaciones.
2. Crea Médicos y Pacientes.
3. Crea Medicamentos (usando los catálogos previos por sus IDs de momento).
4. Registra Visitas (elige médico y paciente, y opcionalmente medicamento).
5. Usa filtros de la página de Visitas para ver reportes.

---

Este README es intencionalmente simple. Se pueden agregar más detalles después si hace falta.
