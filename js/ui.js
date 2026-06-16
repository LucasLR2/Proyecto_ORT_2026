/* ============================================================
   ui.js — Navegación: vistas, sidebar y secciones
   Depende de: data.js, ofertas.js, listado.js
   ============================================================ */

const VISTAS_CENTRADAS = ['view-home', 'view-login', 'view-registro'];
const DECO_IDS = ['deco-tr', 'deco-br', 'deco-bl', 'deco-dots-tr', 'deco-dots-bl', 'deco-brand'];

/* ── Definición del menú por rol ──────────────────────────────
   Cada grupo tiene: label, items[]
   Cada item:  { id (id de sección), label, icon (SVG inner), badge? }
   badge puede ser una función () => número o null
─────────────────────────────────────────────────────────────── */
const MENU = {
  postulante: [
    {
      label: 'Explorar',
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
        }
      ]
    },
    {
      label: 'Mi cuenta',
      items: [
        {
          id: 'sec-mis-postulaciones',
          label: 'Mis postulaciones',
          icon: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><polyline points="16 11 18 13 22 9"/>',
          badge: () => postulaciones.filter(p => p.username === sesionActual?.username).length
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
          label: 'Crear oferta laboral',
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
          label: 'Ver estadísticas',
          icon: '<line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>'
        }
      ]
    }
  ]
};

/* ── Cambia la vista principal (home / login / registro / panel) ── */
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
    // Mostrar la primera sección disponible para el rol
    const rol = sesionActual?.rol || 'postulante';
    const primeraSeccion = MENU[rol][0].items[0].id;
    showSeccion(primeraSeccion);
  }
}

/* ── Muestra una sección dentro del panel ── */
function showSeccion(secId) {
  document.querySelectorAll('.seccion').forEach(s => s.classList.remove('active'));
  const sec = document.getElementById(secId);
  if (sec) sec.classList.add('active');

  // Marcar ítem activo en sidebar
  document.querySelectorAll('.sidebar-item').forEach(el => {
    el.classList.toggle('active', el.dataset.sec === secId);
  });

  // Disparar render según sección
  if (secId === 'sec-listado') {
    renderListado('mi-area');
    const radio = document.querySelector('input[name="filtro-ofertas"][value="mi-area"]');
    if (radio) radio.checked = true;
  }
  if (secId === 'sec-destacadas')            renderDestacadas?.();
  if (secId === 'sec-mis-postulaciones')     renderMisPostulaciones?.();
  if (secId === 'sec-gestionar-ofertas')     renderTabla();
  if (secId === 'sec-procesar-postulaciones') renderProcesar?.();
  if (secId === 'sec-estadisticas')          renderEstadisticas?.();
}

/* ── Construye el sidebar según el rol del usuario logueado ── */
function construirSidebar() {
  const rol  = sesionActual?.rol || 'postulante';
  const menu = MENU[rol] || [];

  // Saludo en navbar
  const saludo = document.getElementById('navbar-saludo');
  if (saludo && sesionActual) saludo.textContent = `Hola, ${sesionActual.fullname}`;

  // Bloque de usuario
  const userBlock = document.getElementById('sidebar-user');
  userBlock.innerHTML = `
    <div class="sidebar-user-name">${sesionActual?.fullname || ''}</div>
    <div class="sidebar-user-role">${rol}</div>
  `;

  // Construir nav
  const nav = document.getElementById('sidebar-nav');
  nav.innerHTML = '';

  menu.forEach((grupo, gi) => {
    const groupEl = document.createElement('div');
    groupEl.className = 'sidebar-group';
    groupEl.dataset.group = gi;

    const labelEl = document.createElement('div');
    labelEl.className = 'sidebar-group-label';
    labelEl.innerHTML = `<span>${grupo.label}</span><span class="chevron">▾</span>`;
    labelEl.addEventListener('click', () => toggleGrupo(groupEl));

    const itemsEl = document.createElement('div');
    itemsEl.className = 'sidebar-group-items';

    grupo.items.forEach(item => {
      const btn = document.createElement('div');
      btn.className = 'sidebar-item';
      btn.dataset.sec = item.id;

      const badgeVal = typeof item.badge === 'function' ? item.badge() : null;
      const badgeHTML = badgeVal ? `<span class="sidebar-badge">${badgeVal}</span>` : '';

      btn.innerHTML = `
        <svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">${item.icon}</svg>
        ${item.label}
        ${badgeHTML}
      `;
      btn.addEventListener('click', () => showSeccion(item.id));
      itemsEl.appendChild(btn);
    });

    groupEl.appendChild(labelEl);
    groupEl.appendChild(itemsEl);
    nav.appendChild(groupEl);
  });
}

/* ── Colapsa / expande un grupo del sidebar ── */
function toggleGrupo(groupEl) {
  groupEl.classList.toggle('collapsed');
}

/* ── Inicialización ── */
document.addEventListener('DOMContentLoaded', () => {
  showView('view-home');
});