/* ============================================================
   ofertas.js — CRUD de ofertas laborales
   Depende de: data.js, utils.js, ui.js
   ============================================================ */

/* ── Renderiza la tabla completa con los datos actuales ── */
function renderTabla() {
  const tbody = document.getElementById('ofertas-tbody');
  tbody.innerHTML = '';

  if (ofertas.length === 0) {
    tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;color:var(--text-subtle);padding:28px;">No hay ofertas cargadas.</td></tr>';
    return;
  }

  ofertas.forEach(oferta => {
    const badge   = BADGE[oferta.estado] || BADGE.inactive;
    const cerrada = oferta.estado === 'closed';

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${oferta.id}</td>
      <td>${oferta.titulo}</td>
      <td><span class="badge ${badge.clase}">${badge.label}</span></td>
      <td class="td-actions">
        ${cerrada
          ? '—'
          : `<button class="btn-table btn-edit"  onclick="editarOferta('${oferta.id}')">Editar</button>
             <button class="btn-table btn-close" onclick="cerrar('${oferta.id}')">Cerrar</button>`
        }
      </td>
    `;
    tbody.appendChild(tr);
  });
}

/* ── Abre el formulario para crear una nueva oferta ── */
function crearOferta() {
  resetFormOferta();
  document.getElementById('crear-oferta-titulo').textContent = 'Crear Oferta Laboral';
  document.getElementById('of-submit-btn').textContent = 'Publicar oferta';
  showSeccion('sec-crear-oferta');
}

/* ── Abre el formulario precargado para editar una oferta existente ── */
function editarOferta(id) {
  const oferta = ofertas.find(o => o.id === id);
  if (!oferta) return;

  document.getElementById('of-id').value       = oferta.id;
  document.getElementById('of-titulo').value   = oferta.titulo;
  document.getElementById('of-empresa').value  = oferta.empresa  || '';
  document.getElementById('of-nivel').value    = oferta.nivel    || '';
  document.getElementById('of-area').value     = oferta.area     || '';
  document.getElementById('of-vacantes').value = oferta.vacantes || '';
  document.getElementById('of-estado').value   = oferta.estado   || 'active';

  document.getElementById('crear-oferta-titulo').textContent = 'Editar Oferta Laboral';
  document.getElementById('of-submit-btn').textContent = 'Guardar cambios';
  showSeccion('sec-crear-oferta');
}

/* ── Guarda: crea o actualiza según si hay ID en el campo oculto ── */
function guardarOferta() {
  const campos = ['of-titulo', 'of-empresa', 'of-nivel', 'of-area', 'of-vacantes'];
  if (!camposCompletos(campos)) {
    mostrarError('of-error');
    return;
  }
  ocultarError('of-error');

  const id       = document.getElementById('of-id').value;
  const titulo   = document.getElementById('of-titulo').value.trim();
  const empresa  = document.getElementById('of-empresa').value.trim();
  const nivel    = document.getElementById('of-nivel').value;
  const area     = document.getElementById('of-area').value;
  const vacantes = parseInt(document.getElementById('of-vacantes').value, 10);
  const estado   = document.getElementById('of-estado').value;

  if (id) {
    /* Edición */
    const oferta = ofertas.find(o => o.id === id);
    if (oferta) {
      oferta.titulo   = titulo;
      oferta.empresa  = empresa;
      oferta.nivel    = nivel;
      oferta.area     = area;
      oferta.vacantes = vacantes;
      oferta.estado   = estado;
    }
    mostrarToast('Oferta actualizada correctamente.');
  } else {
    /* Creación */
    ofertas.push({
      id:       generarId('JOB_OFFER_', ofertas),
      titulo,
      empresa,
      nivel,
      area,
      vacantes,
      estado,
      fecha:    new Date().toISOString().split('T')[0]
    });
    mostrarToast('Oferta publicada correctamente.');
  }

  resetFormOferta();
  showSeccion('sec-gestionar-ofertas');
}

/* ── Limpia el formulario y vuelve al modo creación ── */
function resetFormOferta() {
  document.getElementById('of-id').value       = '';
  document.getElementById('of-titulo').value   = '';
  document.getElementById('of-empresa').value  = '';
  document.getElementById('of-nivel').value    = '';
  document.getElementById('of-area').value     = '';
  document.getElementById('of-vacantes').value = '';
  document.getElementById('of-estado').value   = 'active';
  ocultarError('of-error');
}

/* ── Cerrar una oferta (cambia estado a 'closed') ── */
function cerrar(id) {
  const oferta = ofertas.find(o => o.id === id);
  if (!oferta) return;

  confirmar(`¿Cerrar la oferta "${oferta.titulo}"? Esta acción no se puede deshacer.`, () => {
    oferta.estado = 'closed';
    renderTabla();
    mostrarToast(`Oferta "${oferta.titulo}" cerrada.`);
  });
}