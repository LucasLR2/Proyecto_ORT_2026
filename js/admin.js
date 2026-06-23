/* ============================================================
   admin.js — Secciones del panel de administrador
   Depende de: data.js, utils.js, ofertas.js
   ============================================================ */

/* ════════════════════════════════════════════════════════════
   SECCIÓN: Procesar postulaciones pendientes
   ════════════════════════════════════════════════════════════ */
function renderProcesar() {
  const container = document.getElementById('procesar-container');
  if (!container) return;

  const pendientes = postulaciones.filter(p => p.estado === 'pendiente');

  if (pendientes.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
          <path d="M9 11l3 3L22 4"/>
          <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
        </svg>
        <p>No hay postulaciones pendientes. ¡Todo al día!</p>
      </div>`;
    return;
  }

  container.innerHTML = `
    <div class="procesar-list">
      ${pendientes.map(p => {
        const oferta = ofertas.find(o => o.id === p.ofertaId);
        return `
          <div class="procesar-row" id="prow-${p.id}">
            <div class="procesar-info">
              <div class="procesar-candidato">
                <div class="procesar-avatar">${p.fullname.charAt(0).toUpperCase()}</div>
                <div>
                  <div class="procesar-nombre">${p.fullname}</div>
                  <div class="procesar-user">@${p.username}</div>
                </div>
              </div>
              <div class="procesar-oferta">
                <div class="procesar-oferta-titulo">${oferta?.titulo || '(Oferta eliminada)'}</div>
                <div class="procesar-oferta-meta">
                  ${oferta ? `${oferta.empresa} · ${NIVEL_LABEL[oferta.nivel] || oferta.nivel}` : '—'}
                </div>
              </div>
              <div class="procesar-fecha">Recibida el ${formatearFecha(p.fecha)}</div>
            </div>
            <div class="procesar-acciones">
              <button class="btn-aprobar" onclick="procesarPostulacion('${p.id}', 'aprobado')">
                <svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                Aprobar
              </button>
              <button class="btn-rechazar" onclick="procesarPostulacion('${p.id}', 'rechazado')">
                <svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
                Rechazar
              </button>
            </div>
          </div>`;
      }).join('')}
    </div>`;
}

function procesarPostulacion(postId, nuevoEstado) {
  const post = postulaciones.find(p => p.id === postId);
  if (!post) return;
  post.estado = nuevoEstado;

  const row = document.getElementById(`prow-${postId}`);
  if (row) {
    row.classList.add('procesar-row-salida');
    setTimeout(() => {
      renderProcesar();
      construirSidebar(); // actualiza badge
      const activeSec = document.querySelector('.seccion.active')?.id;
      if (activeSec) {
        document.querySelectorAll('.sidebar-item').forEach(el => {
          el.classList.toggle('active', el.dataset.sec === activeSec);
        });
      }
    }, 320);
  }

  const label = nuevoEstado === 'aprobado' ? 'aprobada' : 'rechazada';
  mostrarToast(`Postulación de ${post.fullname} ${label}.`);
}

/* ════════════════════════════════════════════════════════════
   SECCIÓN: Estadísticas del sistema
   ════════════════════════════════════════════════════════════ */
function renderEstadisticas() {
  const container = document.getElementById('stats-container');
  if (!container) return;

  const totalOfertas     = ofertas.length;
  const ofertasActivas   = ofertas.filter(o => o.estado === 'active').length;
  const totalPost        = postulaciones.length;
  const pendientes       = postulaciones.filter(p => p.estado === 'pendiente').length;
  const aprobadas        = postulaciones.filter(p => p.estado === 'aprobado').length;
  const rechazadas       = postulaciones.filter(p => p.estado === 'rechazado').length;
  const totalUsuarios    = usuarios.filter(u => u.rol === 'postulante').length;

  // Postulaciones por área
  const porArea = {};
  postulaciones.forEach(p => {
    const oferta = ofertas.find(o => o.id === p.ofertaId);
    if (!oferta) return;
    porArea[oferta.area] = (porArea[oferta.area] || 0) + 1;
  });

  // Top oferta
  const conteoOferta = {};
  postulaciones.forEach(p => {
    conteoOferta[p.ofertaId] = (conteoOferta[p.ofertaId] || 0) + 1;
  });
  const topOfertaId = Object.keys(conteoOferta).sort((a,b) => conteoOferta[b] - conteoOferta[a])[0];
  const topOferta   = ofertas.find(o => o.id === topOfertaId);

  container.innerHTML = `
    <div class="stats-grid">

      <div class="stat-card">
        <div class="stat-icon stat-icon-purple">
          <svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
            <rect x="2" y="7" width="20" height="14" rx="3"/>
            <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
          </svg>
        </div>
        <div class="stat-data">
          <div class="stat-numero">${totalOfertas}</div>
          <div class="stat-label">Total de ofertas</div>
        </div>
        <div class="stat-sub">${ofertasActivas} activas · ${totalOfertas - ofertasActivas} inactivas</div>
      </div>

      <div class="stat-card">
        <div class="stat-icon stat-icon-blue">
          <svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
        </div>
        <div class="stat-data">
          <div class="stat-numero">${totalUsuarios}</div>
          <div class="stat-label">Postulantes registrados</div>
        </div>
        <div class="stat-sub">1 administrador en el sistema</div>
      </div>

      <div class="stat-card">
        <div class="stat-icon stat-icon-green">
          <svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
            <path d="M9 11l3 3L22 4"/>
            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
          </svg>
        </div>
        <div class="stat-data">
          <div class="stat-numero">${totalPost}</div>
          <div class="stat-label">Total postulaciones</div>
        </div>
        <div class="stat-sub">${aprobadas} aprobadas · ${rechazadas} rechazadas · ${pendientes} pendientes</div>
      </div>

      <div class="stat-card">
        <div class="stat-icon stat-icon-amber">
          <svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
          </svg>
        </div>
        <div class="stat-data">
          <div class="stat-numero">${topOferta ? conteoOferta[topOfertaId] : '—'}</div>
          <div class="stat-label">Postulaciones a la oferta más popular</div>
        </div>
        <div class="stat-sub">${topOferta ? topOferta.titulo : 'Sin postulaciones aún'}</div>
      </div>

    </div>

    ${Object.keys(porArea).length > 0 ? `
    <div class="stats-section">
      <h2 class="stats-section-title">Postulaciones por área</h2>
      <div class="stats-bars">
        ${Object.entries(porArea)
            .sort((a,b) => b[1] - a[1])
            .map(([area, cant]) => {
              const max   = Math.max(...Object.values(porArea));
              const pct   = Math.round((cant / max) * 100);
              const color = AREA_COLOR[area] || '#7c3aed';
              return `
                <div class="stat-bar-row">
                  <div class="stat-bar-label">${AREA_LABEL[area] || area}</div>
                  <div class="stat-bar-track">
                    <div class="stat-bar-fill" style="width:${pct}%;background:${color}"></div>
                  </div>
                  <div class="stat-bar-val">${cant}</div>
                </div>`;
            }).join('')}
      </div>
    </div>` : ''}

    ${ofertas.length > 0 ? `
    <div class="stats-section">
      <h2 class="stats-section-title">Distribución de ofertas por área</h2>
      <div class="stats-tags-grid">
        ${Object.entries(
            ofertas.reduce((acc, o) => { acc[o.area] = (acc[o.area]||0)+1; return acc; }, {})
          ).map(([area, cant]) => `
            <div class="stats-tag" style="--tag-color:${AREA_COLOR[area] || '#7c3aed'}">
              <span class="stats-tag-label">${AREA_LABEL[area] || area}</span>
              <span class="stats-tag-count">${cant} oferta${cant !== 1 ? 's' : ''}</span>
            </div>`).join('')}
      </div>
    </div>` : ''}`;
}