/* ============================================================
   listado.js — Vista de ofertas para el postulante
   Depende de: data.js, utils.js, ui.js
   ============================================================ */

/* ── Devuelve true si el usuario ya se postuló a una oferta ── */
function yaPostulado(ofertaId) {
  return postulaciones.some(
    p => p.username === sesionActual.username && p.ofertaId === ofertaId
  );
}

/* ── Renderiza las cards de ofertas según el filtro activo ── */
function renderListado(filtro) {
  const container = document.getElementById('listado-ofertas-container');
  container.innerHTML = '';

  // Solo mostrar ofertas activas
  let visibles = ofertas.filter(o => o.estado === 'active');

  // Filtrar por área del postulante si corresponde
  if (filtro === 'mi-area' && sesionActual) {
    visibles = visibles.filter(o => o.area === sesionActual.area);
  }

  if (visibles.length === 0) {
    container.innerHTML = '<p class="sin-resultados">No hay ofertas disponibles para tu área en este momento.</p>';
    return;
  }

  visibles.forEach(oferta => {
    const postulado = yaPostulado(oferta.id);

    const card = document.createElement('div');
    card.className = 'oferta-card';
    card.innerHTML = `
      <div class="oferta-card-header">
        <strong>${oferta.id}</strong> | ${oferta.titulo}
      </div>
      <div class="oferta-card-body">
        <span>Empresa: ${oferta.empresa}</span>
        <span>Nivel: ${NIVEL_LABEL[oferta.nivel] || oferta.nivel}</span>
        <span>Área: ${AREA_LABEL[oferta.area] || oferta.area}</span>
        <span>Vacantes: ${oferta.vacantes}</span>
      </div>
      <div class="oferta-card-footer">
        ${postulado
          ? '<span class="btn-postulado">✓ Ya te postulaste</span>'
          : `<button class="btn-action" onclick="postularse('${oferta.id}')">Postularse</button>`
        }
      </div>
    `;
    container.appendChild(card);
  });
}

/* ── Filtra el listado al cambiar el radio ── */
function filtrarOfertas(valor) {
  renderListado(valor);
}

/* ── Registra una postulación ── */
function postularse(ofertaId) {
  if (!sesionActual) return;

  if (yaPostulado(ofertaId)) {
    alert('Ya te postulaste a esta oferta.');
    return;
  }

  postulaciones.push({ username: sesionActual.username, ofertaId });

  // Leer el filtro activo para no perder la selección al re-renderizar
  const radioActivo = document.querySelector('input[name="filtro-ofertas"]:checked');
  const filtro = radioActivo ? radioActivo.value : 'mi-area';

  renderListado(filtro);
}