/* ============================================================
   destacadas.js — Ofertas Destacadas
   Depende de: data.js, utils.js, ui.js
   ============================================================ */

/* Cuántas destacadas mostrar */
const DESTACADAS_MAX = 3;

/* ── Renderiza la sección de ofertas destacadas ── */
function renderDestacadas() {
  const container = document.getElementById('destacadas-container');
  if (!container) return;

  /* Las N activas con más vacantes; empate → más reciente primero */
  const destacadas = ofertas
    .filter(o => o.estado === 'active')
    .sort((a, b) => {
      if (b.vacantes !== a.vacantes) return b.vacantes - a.vacantes;
      return new Date(b.fecha) - new Date(a.fecha);
    })
    .slice(0, DESTACADAS_MAX);

  if (destacadas.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
        <p>No hay ofertas destacadas disponibles.</p>
      </div>`;
    return;
  }

  container.innerHTML = `
    <p class="destacadas-intro">
      Las oportunidades con más vacantes disponibles hoy.
    </p>
    <div class="destacadas-grid">
      ${destacadas.map(o => buildCardDestacada(o)).join('')}
    </div>`;
}

/* ── Construye el HTML de una card destacada ── */
function buildCardDestacada(oferta) {
  const color      = AREA_COLOR[oferta.area]  || '#7c3aed';
  const areaLabel  = AREA_LABEL[oferta.area]  || oferta.area;
  const nivelLabel = NIVEL_LABEL[oferta.nivel] || oferta.nivel;

  /* ¿Ya postuló el usuario actual? */
  const yaPostulo = postulaciones.some(
    p => p.ofertaId === oferta.id && p.username === sesionActual?.username
  );

  /* Fecha formateada */
  const fecha = oferta.fecha
    ? new Date(oferta.fecha + 'T00:00:00').toLocaleDateString('es-UY', {
        day:   '2-digit',
        month: 'short',
        year:  'numeric'
      })
    : '';

  return `
    <div class="dest-card" style="--area-color:${color}">
      <div class="dest-card-header">
        <div class="dest-card-badge-wrap">
          <span class="dest-tag dest-tag-area" style="background:${color}20;color:${color}">${areaLabel}</span>
          <span class="dest-tag dest-tag-nivel">${nivelLabel}</span>
        </div>
        <span class="dest-star" title="Oferta destacada">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="${color}" stroke="${color}"
               stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
          </svg>
        </span>
      </div>

      <div class="dest-card-body">
        <h3 class="dest-titulo">${oferta.titulo}</h3>
        <p class="dest-empresa">${oferta.empresa}</p>

        <div class="dest-meta">
          <span class="dest-meta-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                 stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="16"/>
              <line x1="8" y1="12" x2="16" y2="12"/>
            </svg>
            ${oferta.vacantes} vacante${oferta.vacantes !== 1 ? 's' : ''}
          </span>
          <span class="dest-meta-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                 stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            ${fecha}
          </span>
        </div>
      </div>

      <div class="dest-card-footer">
        <div class="dest-vacantes-bar">
          <div class="dest-vacantes-fill" style="width:${Math.min(100, oferta.vacantes * 20)}%;background:${color}"></div>
        </div>
        ${yaPostulo
          ? `<button class="btn-dest-applied" disabled>✓ Ya postulado</button>`
          : `<button class="btn-dest-apply" onclick="postularDesde('${oferta.id}')"
                     style="--area-color:${color}">Postularme</button>`
        }
      </div>
    </div>`;
}

/* ── Postular desde la card destacada ── */
function postularDesde(ofertaId) {
  if (!sesionActual) return;

  const oferta = ofertas.find(o => o.id === ofertaId);
  if (!oferta || oferta.estado !== 'active') return;

  const yaPostulo = postulaciones.some(
    p => p.ofertaId === ofertaId && p.username === sesionActual.username
  );
  if (yaPostulo) return;

  postulaciones.push({
    id:       generarId('POST_', postulaciones),
    ofertaId: ofertaId,
    username: sesionActual.username,
    fullname: sesionActual.fullname,
    estado:   'pendiente',
    fecha:    new Date().toISOString().split('T')[0]
  });

  oferta.vacantes--;
  if (oferta.vacantes <= 0) {
    oferta.vacantes = 0;
    oferta.estado = 'closed';
  }

  /* Re-renderiza para reflejar el cambio */
  renderDestacadas();

  /* Actualiza el badge de "Mis postulaciones" en el sidebar */
  construirSidebar();
  const secId = document.querySelector('.seccion.active')?.id;
  if (secId) {
    document.querySelectorAll('.sidebar-item').forEach(el => {
      el.classList.toggle('active', el.dataset.sec === secId);
    });
  }
}