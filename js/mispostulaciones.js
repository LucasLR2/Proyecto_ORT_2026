/* ============================================================
   mispostulaciones.js — Vista "Mis Postulaciones" (postulante)
   Depende de: data.js, utils.js
   ============================================================ */

const ESTADO_POST = {
  pendiente: { clase: 'post-badge-pendiente', label: 'Pendiente' },
  aceptada:  { clase: 'post-badge-aceptada',  label: 'Aceptada'  },
  rechazada: { clase: 'post-badge-rechazada', label: 'Rechazada' }
};

function renderMisPostulaciones() {
  const container = document.getElementById('mis-postulaciones-container');
  if (!container) return;

  const mias = postulaciones.filter(p => p.username === sesionActual?.username);

  if (mias.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"
             stroke-linecap="round" stroke-linejoin="round">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <polyline points="16 11 18 13 22 9"/>
        </svg>
        <p>Todavía no te postulaste a ninguna oferta.</p>
        <button class="btn-empty-action" onclick="showSeccion('sec-listado')">Ver ofertas disponibles</button>
      </div>`;
    return;
  }

  /* Resumen rápido */
  const total     = mias.length;
  const pendientes = mias.filter(p => p.estado === 'pendiente').length;
  const aceptadas  = mias.filter(p => p.estado === 'aceptada').length;
  const rechazadas = mias.filter(p => p.estado === 'rechazada').length;

  container.innerHTML = `
    <div class="mispost-summary">
      <div class="mispost-stat">
        <span class="mispost-stat-value">${total}</span>
        <span class="mispost-stat-label">Total</span>
      </div>
      <div class="mispost-stat">
        <span class="mispost-stat-value mispost-val-pendiente">${pendientes}</span>
        <span class="mispost-stat-label">Pendientes</span>
      </div>
      <div class="mispost-stat">
        <span class="mispost-stat-value mispost-val-aceptada">${aceptadas}</span>
        <span class="mispost-stat-label">Aceptadas</span>
      </div>
      <div class="mispost-stat">
        <span class="mispost-stat-value mispost-val-rechazada">${rechazadas}</span>
        <span class="mispost-stat-label">Rechazadas</span>
      </div>
    </div>

    <div class="mispost-grid">
      ${mias.map(p => buildCardPostulacion(p)).join('')}
    </div>`;
}

function buildCardPostulacion(post) {
  const oferta     = ofertas.find(o => o.id === post.ofertaId);
  const color      = oferta ? (AREA_COLOR[oferta.area] || '#7c3aed') : '#94a3b8';
  const areaLabel  = oferta ? (AREA_LABEL[oferta.area]  || oferta.area)  : '—';
  const nivelLabel = oferta ? (NIVEL_LABEL[oferta.nivel] || oferta.nivel) : '—';
  const titulo     = oferta?.titulo   || 'Oferta eliminada';
  const empresa    = oferta?.empresa  || '—';
  const inicial    = empresa.charAt(0).toUpperCase();

  const estado     = post.estado || 'pendiente';
  const badgeInfo  = ESTADO_POST[estado] || ESTADO_POST.pendiente;

  const fecha = post.fecha
    ? new Date(post.fecha + 'T00:00:00').toLocaleDateString('es-UY', {
        day: '2-digit', month: 'short', year: 'numeric'
      })
    : '—';

  return `
    <div class="mispost-card" style="--area-color:${color}">
      <div class="mispost-card-header">
        <div class="mispost-badge-wrap">
          <span class="oferta-tag oferta-tag-area" style="background:${color}20;color:${color}">${areaLabel}</span>
          <span class="oferta-tag oferta-tag-nivel">${nivelLabel}</span>
        </div>
        <span class="post-badge ${badgeInfo.clase}">${badgeInfo.label}</span>
      </div>

      <div class="mispost-card-body">
        <div class="mispost-avatar" style="background:${color}18;color:${color}">${inicial}</div>
        <div class="mispost-info">
          <h3 class="mispost-titulo">${titulo}</h3>
          <p class="mispost-empresa">${empresa}</p>
        </div>
      </div>

      <div class="mispost-card-footer">
        <span class="mispost-fecha">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
               stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2"/>
            <line x1="16" y1="2" x2="16" y2="6"/>
            <line x1="8" y1="2" x2="8" y2="6"/>
            <line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
          Postulado el ${fecha}
        </span>
      </div>
    </div>`;
}