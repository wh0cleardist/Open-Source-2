// Navegación tipo SPA básica: intercepta enlaces data-link y carga páginas sin recargar todo
// Limitaciones: como cada página tiene sus propios scripts, se hace una carga superficial del <main>.

async function fetchPage(url) {
  const res = await fetch(url, { headers: { 'X-Partial': 'true' } });
  if (!res.ok) throw new Error('No se pudo cargar la página');
  return res.text();
}

function extractMain(htmlText) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlText, 'text/html');
  const main = doc.querySelector('main');
  return main ? main.innerHTML : '<p>No se encontró contenido principal.</p>';
}

async function navigateTo(href) {
  try {
    // Evita recargar la misma vista
    if (window.location.pathname.endsWith(href)) return;
    const html = await fetchPage(href);
    const content = extractMain(html);
    const targetMain = document.querySelector('main');
    if (targetMain) {
      targetMain.innerHTML = content;
      window.history.pushState({ path: href }, '', href);
      if (window.loadNavbar) window.loadNavbar();
      // Rescargar scripts específicos si la página lo requiere (fallback: full reload)
      // Sencillo: recargar toda la página para inicializar JS per-page que quedaría perdido.
      // Mejora futura: modularizar scripts para re-ejecución.
      window.location.href = href; // fallback real para asegurar funcionalidad CRUD
    }
  } catch (e) {
    console.error(e);
  }
}

function wireSpaLinks() {
  document.body.addEventListener('click', (e) => {
    const a = e.target.closest('a[data-link]');
    if (!a) return;
    const href = a.getAttribute('href');
    if (!href || href.startsWith('http') || href.startsWith('#')) return;
    e.preventDefault();
    navigateTo(href);
  });
}

window.addEventListener('popstate', (ev) => {
  if (ev.state?.path) navigateTo(ev.state.path);
});

document.addEventListener('DOMContentLoaded', wireSpaLinks);
