// Sistema de autenticación centralizado
const SESSION_KEY = 'dispensario_sesion';

// Verificar si hay sesión activa
function tieneSesion() {
  const sesion = localStorage.getItem(SESSION_KEY);
  return !!sesion;
}

// Obtener datos del usuario autenticado
function obtenerUsuario() {
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
function protegerPagina() {
  if (!tieneSesion()) {
    window.location.href = '/';
    return false;
  }
  return true;
}

// Cerrar sesión
function cerrarSesion() {
  if (confirm('¿Está seguro que desea cerrar sesión?')) {
    localStorage.removeItem(SESSION_KEY);
    window.location.href = '/';
  }
}

// Exponer funciones globalmente para uso en HTML
window.cerrarSesion = cerrarSesion;
window.protegerPagina = protegerPagina;
window.tieneSesion = tieneSesion;
window.obtenerUsuario = obtenerUsuario;
