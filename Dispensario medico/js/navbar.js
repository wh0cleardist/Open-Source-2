// Carga dinámica del fragmento navbar.html y marca enlace activo
async function loadNavbar() {
  const container = document.getElementById('navbar-container');
  if (!container) return;
  try {
    const res = await fetch('navbar.html');
    const html = await res.text();
    container.innerHTML = html;
    activateNavLogic();
  } catch (e) {
    container.innerHTML = '<p style="color:red">Error cargando navbar</p>';
  }
}

function setActiveLink(path) {
  const links = document.querySelectorAll('.main-nav a[data-link]');
  links.forEach(a => {
    const href = a.getAttribute('href');
    if (href && path.endsWith(href)) a.classList.add('active'); else a.classList.remove('active');
  });
}

function activateNavLogic() {
  // Toggle mobile menu
  const toggle = document.getElementById('nav-toggle');
  const nav = document.querySelector('.main-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => nav.classList.toggle('open'));
  }
  
  // Botón de logout
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      // La función logout está definida en login.js
      if (typeof logout === 'function') {
        logout();
      } else {
        // Fallback si login.js no está cargado
        localStorage.removeItem('dispensario_sesion');
        window.location.href = '/Html/login.html';
      }
    });
  }
  
  setActiveLink(window.location.pathname);
}

document.addEventListener('DOMContentLoaded', loadNavbar);
