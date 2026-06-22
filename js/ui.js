/* ============================================================
   ui.js — Navegación: vistas, sidebar y secciones
   Depende de: data.js, ofertas.js, listado.js
   ============================================================ */

const VISTAS_CENTRADAS = ['view-login'];
const DECO_IDS = [];

/* ── Menú por rol ── */
const MENU = {
  postulante: [
    {
      label: '',
      items: [
        {
          id: 'sec-listado',
          label: 'Listado de ofertas',
          icon: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 8h10M7 12h10M7 16h6"/>'
        },
        {
          id: 'sec-destacadas',
          label: 'Ofertas destacadas',
          icon: '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>'
        },
        {
          id: 'sec-mis-postulaciones',
          label: 'Mis postulaciones',
          icon: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><polyline points="16 11 18 13 22 9"/>',
          badge: () => postulaciones.filter(p => p.username === sesionActual?.username).length || null
        }
      ]
    }
  ],

  admin: [
    {
      label: 'Ofertas',
      items: [
        {
          id: 'sec-crear-oferta',
          label: 'Crear oferta',
          icon: '<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>'
        },
        {
          id: 'sec-gestionar-ofertas',
          label: 'Gestionar ofertas',
          icon: '<rect x="2" y="7" width="20" height="14" rx="3"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/><path d="M2 13h20"/>'
        }
      ]
    },
    {
      label: 'Postulaciones',
      items: [
        {
          id: 'sec-procesar-postulaciones',
          label: 'Procesar pendientes',
          icon: '<path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>',
          badge: () => postulaciones.filter(p => p.estado === 'pendiente').length || null
        }
      ]
    },
    {
      label: 'Sistema',
      items: [
        {
          id: 'sec-estadisticas',
          label: 'Estadísticas',
          icon: '<line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>'
        }
      ]
    }
  ]
};

/* ── Cambia la vista principal ── */
function showView(id) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  const vista = document.getElementById(id);
  if (!vista) { console.warn('Vista no encontrada:', id); return; }
  vista.classList.add('active');

  const esCentrada = VISTAS_CENTRADAS.includes(id);
  DECO_IDS.forEach(d => {
    const el = document.getElementById(d);
    if (el) el.style.display = esCentrada ? '' : 'none';
  });

  if (id === 'view-panel') {
    construirSidebar();
    const rol = sesionActual?.rol || 'postulante';
    const defaultSec = rol === 'postulante' ? 'sec-listado' : 'sec-gestionar-ofertas';
    showSeccion(defaultSec);
  }
}

/* ── Muestra una sección dentro del panel ── */
function showSeccion(secId) {
  document.querySelectorAll('.seccion').forEach(s => s.classList.remove('active'));
  const sec = document.getElementById(secId);
  if (sec) sec.classList.add('active');

  document.querySelectorAll('.sidebar-item').forEach(el => {
    el.classList.toggle('active', el.dataset.sec === secId);
  });

  if (secId === 'sec-listado') {
    initFiltros();
    renderListado();
  }
  if (secId === 'sec-destacadas')             renderDestacadas?.();
  if (secId === 'sec-mis-postulaciones')      renderMisPostulaciones?.();
  if (secId === 'sec-gestionar-ofertas')      renderTabla();
  if (secId === 'sec-procesar-postulaciones') renderProcesar?.();
  if (secId === 'sec-estadisticas')           renderEstadisticas?.();
}

/* ── Construye el sidebar según el rol ── */
function construirSidebar() {
  const rol  = sesionActual?.rol || 'postulante';
  const menu = MENU[rol] || [];

  /* Navbar: nombre como botón con dropdown de cerrar sesión */
  const saludo = document.getElementById('navbar-saludo');
  if (saludo && sesionActual) {
    saludo.innerHTML = `
      <div class="navbar-user-btn" onclick="toggleUserMenu(event)">
        <span>${sesionActual.fullname}</span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
             stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="6 9 12 15 18 9"/>
        </svg>
        <div class="navbar-user-dropdown" id="navbar-dropdown">
          <button onclick="cerrarSesion()">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                 stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            Cerrar sesión
          </button>
        </div>
      </div>
    `;
  }

  /* Limpiar footer del sidebar */
  const userBlock = document.getElementById('sidebar-user');
  if (userBlock) userBlock.innerHTML = '';

  /* Construir nav */
  const nav = document.getElementById('sidebar-nav');
  nav.innerHTML = '';

  menu.forEach((grupo, gi) => {
    /* Si el grupo tiene label, renderizarlo; si no, ir directo a los items */
    if (grupo.label) {
      const labelEl = document.createElement('div');
      labelEl.className = 'sidebar-group-label';
      labelEl.innerHTML = `<span>${grupo.label}</span>`;
      nav.appendChild(labelEl);
    }

    grupo.items.forEach(item => {
      const btn = document.createElement('div');
      btn.className = 'sidebar-item';
      btn.dataset.sec = item.id;

      const badgeVal = typeof item.badge === 'function' ? item.badge() : null;
      const badgeHTML = badgeVal ? `<span class="sidebar-badge">${badgeVal}</span>` : '';

      btn.innerHTML = `
        <svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">${item.icon}</svg>
        <span>${item.label}</span>
        ${badgeHTML}
      `;
      btn.addEventListener('click', () => showSeccion(item.id));
      nav.appendChild(btn);
    });
  });
}

/* ── Toggle del dropdown de usuario en navbar ── */
function toggleUserMenu(e) {
  e.stopPropagation();
  const dropdown = document.getElementById('navbar-dropdown');
  if (dropdown) dropdown.classList.toggle('open');
}

/* Cierra el dropdown si se hace click fuera */
document.addEventListener('click', () => {
  const dropdown = document.getElementById('navbar-dropdown');
  if (dropdown) dropdown.classList.remove('open');
});

/* ── Alterna entre login y registro ── */
function showLoginPanel(panel) {
  const loginWrap = document.getElementById('login-form-wrap');
  const regWrap   = document.getElementById('reg-form-wrap');
  if (!loginWrap || !regWrap) return;

  if (panel === 'registro') {
    loginWrap.style.display = 'none';
    regWrap.style.display   = 'flex';
  } else {
    loginWrap.style.display = 'flex';
    regWrap.style.display   = 'none';
  }
}

/* ── Inicialización ── */
document.addEventListener('DOMContentLoaded', () => {
  showView('view-login');
});