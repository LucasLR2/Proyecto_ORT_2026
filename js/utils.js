/* ============================================================
   utils.js — Funciones utilitarias reutilizables
   ============================================================ */

/* Muestra u oculta el texto de un campo contraseña */
function togglePw(inputId) {
  const inp = document.getElementById(inputId);
  inp.type = inp.type === 'password' ? 'text' : 'password';
}

/* Muestra un mensaje de error dado su id */
function mostrarError(id) {
  document.getElementById(id).classList.add('visible');
}

/* Oculta un mensaje de error dado su id */
function ocultarError(id) {
  document.getElementById(id).classList.remove('visible');
}

/* Devuelve true si TODOS los ids de campo tienen valor */
function camposCompletos(ids) {
  return ids.every(id => {
    const el = document.getElementById(id);
    return el && el.value.trim() !== '';
  });
}

/* Limpia los campos de un formulario dado un array de ids */
function limpiarCampos(ids) {
  ids.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
}

/* Genera un ID simple con prefijo: ej. "JOB_OFFER_4" */
function generarId(prefijo, lista) {
  return prefijo + (lista.length + 1);
}