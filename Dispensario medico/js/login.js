// Login y autenticación
// CREDENCIALES HARDCODEADAS:
// Usuario: admin
// Contraseña: admin123

const VALID_CREDENTIALS = {
  username: 'admin',
  password: 'admin123'
};

const SESSION_KEY = 'dispensario_sesion';

// Verificar si el usuario ya está autenticado (para la página de login)
function verificarAutenticacion() {
  const sesion = localStorage.getItem(SESSION_KEY);
  if (sesion) {
    // Usuario ya autenticado, ir al dashboard
    window.location.href = '/Html/index.html';
  }
}

// Verificar si el usuario está autenticado (para páginas protegidas)
function requiereSesion() {
  const sesion = localStorage.getItem(SESSION_KEY);
  if (!sesion) {
    // No hay sesión, redirigir al login
    window.location.href = '/Html/login.html';
    return false;
  }
  return true;
}

// Hacer logout
function logout() {
  localStorage.removeItem(SESSION_KEY);
  window.location.href = '/Html/login.html';
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

// Manejo del formulario de login
document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  const errorMessage = document.getElementById('errorMessage');

  // Si estamos en la página de login
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const username = document.getElementById('username').value.trim();
      const password = document.getElementById('password').value;

      // Validar credenciales hardcodeadas
      if (username === VALID_CREDENTIALS.username && password === VALID_CREDENTIALS.password) {
        // Login exitoso
        localStorage.setItem(SESSION_KEY, JSON.stringify({
          username: username,
          loginTime: new Date().toISOString()
        }));
        
        // Ir al dashboard
        window.location.href = '/Html/index.html';
      } else {
        // Login fallido
        errorMessage.textContent = 'Usuario o contraseña incorrectos';
        errorMessage.classList.add('show');
        
        // Limpiar campos
        loginForm.reset();
        
        // Ocultar mensaje después de 4 segundos
        setTimeout(() => {
          errorMessage.classList.remove('show');
        }, 4000);
      }
    });

    // Verificar autenticación al cargar la página de login
    verificarAutenticacion();
  } else {
    // Si NO estamos en la página de login, verificar que haya sesión
    // (esto aplica para index.html y otras páginas protegidas)
    const isLoginPage = window.location.pathname.includes('login.html');
    if (!isLoginPage) {
      requiereSesion();
    }
  }
});
