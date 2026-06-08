// utils.js - Validaciones y utilidades comunes

function esCampoVacio(valor) {
  return !valor || valor.trim() === "";
}

function tieneLongitudMinima(valor, min) {
  return valor && valor.trim().length >= min;
}

function tieneMayuscula(contrasena) {
  return /[A-Z]/.test(contrasena);
}

function tieneMinuscula(contrasena) {
  return /[a-z]/.test(contrasena);
}

function tieneNumero(contrasena) {
  return /[0-9]/.test(contrasena);
}

function validarContrasena(contrasena) {
  const errores = [];
  if (esCampoVacio(contrasena)) {
    errores.push("La contraseña es obligatoria.");
    return errores;
  }
  if (!tieneLongitudMinima(contrasena, 5))
    errores.push("La contraseña debe tener al menos 5 caracteres.");
  if (!tieneMayuscula(contrasena))
    errores.push("La contraseña debe incluir al menos una letra mayúscula.");
  if (!tieneMinuscula(contrasena))
    errores.push("La contraseña debe incluir al menos una letra minúscula.");
  if (!tieneNumero(contrasena))
    errores.push("La contraseña debe incluir al menos un número.");
  return errores;
}

function esEnteroPositivo(valor) {
  const num = parseInt(valor);
  return !isNaN(num) && num > 0 && String(num) === String(valor).trim();
}

function mostrarError(elementoId, mensaje) {
  const el = document.getElementById(elementoId);
  if (el) { el.textContent = mensaje; el.style.display = "block"; }
}

function limpiarError(elementoId) {
  const el = document.getElementById(elementoId);
  if (el) { el.textContent = ""; el.style.display = "none"; }
}

function limpiarErrores(ids) {
  ids.forEach(id => limpiarError(id));
}
