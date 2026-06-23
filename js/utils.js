/* ============================================================
   utils.js — Funciones utilitarias compartidas
   ============================================================ */

/* ── Errores ── */
function mostrarError(id) {
  const el = document.getElementById(id);
  if (el) el.classList.add('visible');
}

function ocultarError(id) {
  const el = document.getElementById(id);
  if (el) el.classList.remove('visible');
}

/* ── Campos ── */
function limpiarCampos(ids) {
  ids.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
}

function camposCompletos(ids) {
  return ids.every(id => {
    const el = document.getElementById(id);
    return el && el.value.trim() !== '';
  });
}

/* ── Password toggle ── */
function togglePw(id) {
  const input = document.getElementById(id);
  if (!input) return;
  input.type = input.type === 'password' ? 'text' : 'password';
}

/* ── Formato de fecha ── */
function formatearFecha(fechaStr) {
  if (!fechaStr) return '—';
  const [y, m, d] = fechaStr.split('-');
  return `${d}/${m}/${y}`;
}

/* ── Generar ID único para ofertas ── */
function generarOfertaId() {
  const num = ofertas.length + 1;
  return `JOB_OFFER_${num}_${Date.now()}`;
}

/* ── Toast de notificación ── */
function mostrarToast(mensaje, tipo = 'ok') {
  let toast = document.getElementById('toast-global');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast-global';
    document.body.appendChild(toast);
  }
  toast.textContent = mensaje;
  toast.className = `toast toast-${tipo} toast-visible`;
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove('toast-visible'), 2800);
}

/* ── Modal de confirmación ── */
function confirmar(mensaje, callback) {
  if (window.confirm(mensaje)) callback();
}

/* ── Generar ID con prefijo para cualquier colección ── */
function generarId(prefijo, coleccion) {
  return `${prefijo}${coleccion.length + 1}_${Date.now()}`;
}