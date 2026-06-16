/* ============================================================
   listado.js — Vista de ofertas para el postulante
   ============================================================ */

function yaPostulado(ofertaId) {
  return postulaciones.some(
    p => p.username === sesionActual.username && p.ofertaId === ofertaId
  );
}

/* Formatea fecha: '2026-06-14' → '14 jun 2026' */
function formatFecha(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('es-AR', { day: 'numeric', month: 'short', year: 'numeric' });
}

/* Pre-carga los selects con el perfil del usuario logueado */
function initFiltros() {
  const nivelSel = document.getElementById('filtro-nivel');
  const areaSel  = document.getElementById('filtro-area');
  if (nivelSel && sesionActual?.level) nivelSel.value = sesionActual.level;
  if (areaSel  && sesionActual?.area)  areaSel.value  = sesionActual.area;
}

/* Renderiza las cards según los filtros activos */
function renderListado() {
  const container  = document.getElementById('listado-ofertas-container');
  container.innerHTML = '';

  const nivelFiltro = document.getElementById('filtro-nivel')?.value || '';
  const areaFiltro  = document.getElementById('filtro-area')?.value  || '';

  let visibles = ofertas.filter(o => o.estado === 'active');
  if (nivelFiltro) visibles = visibles.filter(o => o.nivel === nivelFiltro);
  if (areaFiltro)  visibles = visibles.filter(o => o.area  === areaFiltro);

  if (visibles.length === 0) {
    container.innerHTML = '<p class="sin-resultados">No hay ofertas disponibles para el filtro seleccionado.</p>';
    return;
  }

  visibles.forEach(oferta => {
    const postulado  = yaPostulado(oferta.id);
    const color      = AREA_COLOR[oferta.area] || '#7c3aed';
    const inicial    = oferta.empresa.charAt(0).toUpperCase();

    const card = document.createElement('div');
    card.className = 'oferta-card';
    card.style.setProperty('--area-color', color);

    card.innerHTML = `
      <div class="oferta-card-ribbon"></div>

      <div class="oferta-card-body">
        <div class="oferta-card-top">
          <div class="oferta-card-avatar" style="background:${color}22;color:${color}">
            ${inicial}
          </div>
          <div class="oferta-card-heading">
            <h3 class="oferta-card-titulo">${oferta.titulo}</h3>
            <span class="oferta-card-empresa">${oferta.empresa}</span>
          </div>
        </div>

        <div class="oferta-card-tags">
          <span class="oferta-tag">${NIVEL_LABEL[oferta.nivel] || oferta.nivel}</span>
          <span class="oferta-tag">${AREA_LABEL[oferta.area]  || oferta.area}</span>
          <span class="oferta-tag">${oferta.vacantes} vacante${oferta.vacantes !== 1 ? 's' : ''}</span>
        </div>

        <div class="oferta-card-fecha">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/>
            <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
          ${formatFecha(oferta.fecha)}
        </div>
      </div>

      <div class="oferta-card-footer">
        ${postulado
          ? '<span class="btn-postulado">✓ Ya postulado</span>'
          : `<button class="btn-action" onclick="postularse('${oferta.id}')">Postularse</button>`
        }
      </div>
    `;
    container.appendChild(card);
  });
}

/* Llamado por los selects de filtro */
function filtrarOfertas() {
  renderListado();
}

/* Registra una postulación */
function postularse(ofertaId) {
  if (!sesionActual) return;
  if (yaPostulado(ofertaId)) { alert('Ya te postulaste a esta oferta.'); return; }
  postulaciones.push({ username: sesionActual.username, ofertaId });
  renderListado();
}
