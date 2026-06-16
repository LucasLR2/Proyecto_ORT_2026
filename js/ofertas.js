/* ============================================================
   ofertas.js — CRUD de ofertas laborales
   Depende de: data.js, utils.js, ui.js
   ============================================================ */

/* ── Renderiza la tabla completa con los datos actuales ── */
function renderTabla() {
  const tbody = document.getElementById('ofertas-tbody');
  tbody.innerHTML = '';

  if (ofertas.length === 0) {
    tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;color:var(--gray-500);padding:24px;">No hay ofertas cargadas.</td></tr>';
    return;
  }

  ofertas.forEach(oferta => {
    const badge  = BADGE[oferta.estado] || BADGE.inactive;
    const cerrada = oferta.estado === 'closed';

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${oferta.id}</td>
      <td>${oferta.titulo}</td>
      <td><span class="badge ${badge.clase}">${badge.label}</span></td>
      <td class="td-actions">
        ${cerrada
          ? '—'
          : `<button class="btn-table btn-edit"  onclick="editar('${oferta.id}')">Editar</button>
             <button class="btn-table btn-close" onclick="cerrar('${oferta.id}')">Cerrar</button>`
        }
      </td>
    `;
    tbody.appendChild(tr);
  });
}

/* ── Crear nueva oferta ── */
function crearOferta() {
  const titulo = prompt('Título de la nueva oferta:');
  if (!titulo || !titulo.trim()) return;

  const nueva = {
    id:     generarId('JOB_OFFER_', ofertas),
    titulo: titulo.trim(),
    estado: 'active'
  };

  ofertas.push(nueva);
  renderTabla();
}

/* ── Editar título de una oferta ── */
function editar(id) {
  const oferta = ofertas.find(o => o.id === id);
  if (!oferta) return;

  const nuevoTitulo = prompt('Nuevo título:', oferta.titulo);
  if (!nuevoTitulo || !nuevoTitulo.trim()) return;

  oferta.titulo = nuevoTitulo.trim();
  renderTabla();
}

/* ── Cerrar una oferta (cambia estado a 'closed') ── */
function cerrar(id) {
  const oferta = ofertas.find(o => o.id === id);
  if (!oferta) return;

  const confirmar = confirm(`¿Cerrar la oferta "${oferta.titulo}"? Esta acción no se puede deshacer.`);
  if (!confirmar) return;

  oferta.estado = 'closed';
  renderTabla();
}