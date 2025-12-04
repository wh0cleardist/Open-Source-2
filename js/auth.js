// Sistema de autenticación centralizado
const SESSION_KEY = 'dispensario_sesion';

// Verificar si hay sesión activa
export function tieneSesion() {
  const sesion = localStorage.getItem(SESSION_KEY);
  return !!sesion;
}

// Obtener datos del usuario autenticado
export function obtenerUsuario() {
  const sesion = localStorage.getItem(SESSION_KEY);
  if (sesion) {
    try {
      return JSON.parse(sesion);
    } catch (e) {
      return null;
    }
  }
  return null;
}

// Proteger página: redirigir a login si no hay sesión
export function protegerPagina() {
  if (!tieneSesion()) {
    window.location.href = '/Html/login.html';
    return false;
  }
  return true;
}

// Cerrar sesión
export function cerrarSesion() {
  if (confirm('¿Está seguro que desea cerrar sesión?')) {
    localStorage.removeItem(SESSION_KEY);
    window.location.href = '/Html/login.html';
  }
}

// Exponer funciones globalmente para uso en navbar
window.cerrarSesion = cerrarSesion;
window.protegerPagina = protegerPagina;
