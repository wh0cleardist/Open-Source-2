// Función para pedir datos a la API
const API_BASE = '/api';

async function apiRequest(path, options = {}) {
  const res = await fetch(API_BASE + path, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Error desconocido' }));
    throw new Error(err.error || 'Error de servidor');
  }
  return res.json();
}

// Lo uso en otras partes
window.api = { request: apiRequest };
