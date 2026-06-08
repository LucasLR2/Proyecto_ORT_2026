// auth.js - Registro, login, logout y manejo de sesión

// F01 - Registro de Postulante
function registrarPostulante(usuario, contrasena, nombreCompleto, nivel, area) {
  const errores = [];

  if (esCampoVacio(usuario))
    errores.push({ campo: "usuario", msg: "El nombre de usuario es obligatorio." });
  else if (!tieneLongitudMinima(usuario, 5))
    errores.push({ campo: "usuario", msg: "El nombre de usuario debe tener al menos 5 caracteres." });
  else if (usuarioExiste(usuario))
    errores.push({ campo: "usuario", msg: "El nombre de usuario ya está en uso. Por favor elija otro." });

  const erroresPass = validarContrasena(contrasena);
  erroresPass.forEach(msg => errores.push({ campo: "contrasena", msg }));

  if (esCampoVacio(nombreCompleto))
    errores.push({ campo: "nombreCompleto", msg: "El nombre completo es obligatorio." });

  if (!nivel || !NIVELES.includes(nivel))
    errores.push({ campo: "nivel", msg: "Debe seleccionar un nivel de experiencia." });

  if (!area || !AREAS.includes(area))
    errores.push({ campo: "area", msg: "Debe seleccionar un área de interés." });

  if (errores.length > 0) return { ok: false, errores };

  postulantes.push({ usuario: usuario.trim(), contrasena, nombreCompleto: nombreCompleto.trim(), nivel, area });
  guardarDatos();
  return { ok: true };
}

function usuarioExiste(usuario) {
  const u = usuario.toLowerCase();
  return postulantes.some(p => p.usuario.toLowerCase() === u) ||
         administradores.some(a => a.usuario.toLowerCase() === u);
}

// F02 - Inicio de Sesión
function iniciarSesion(usuario, contrasena) {
  const errores = [];

  if (esCampoVacio(usuario))
    errores.push({ campo: "usuario", msg: "El nombre de usuario es obligatorio." });
  if (esCampoVacio(contrasena))
    errores.push({ campo: "contrasena", msg: "La contraseña es obligatoria." });

  if (errores.length > 0) return { ok: false, errores };

  const admin = administradores.find(a => a.usuario === usuario && a.contrasena === contrasena);
  if (admin) {
    sessionStorage.setItem("sesion", JSON.stringify({ usuario: admin.usuario, tipo: "admin" }));
    return { ok: true, tipo: "admin" };
  }

  const postulante = postulantes.find(p => p.usuario === usuario && p.contrasena === contrasena);
  if (postulante) {
    sessionStorage.setItem("sesion", JSON.stringify({ usuario: postulante.usuario, tipo: "postulante" }));
    return { ok: true, tipo: "postulante" };
  }

  return { ok: false, errores: [{ campo: "credenciales", msg: "Usuario o contraseña incorrectos." }] };
}

// F03 - Cerrar Sesión
function cerrarSesion() {
  sessionStorage.removeItem("sesion");
  window.location.href = "../index.html";
}

function obtenerSesion() {
  return JSON.parse(sessionStorage.getItem("sesion"));
}

function verificarAcceso(tipoRequerido) {
  const sesion = obtenerSesion();
  if (!sesion) { window.location.href = "../index.html"; return null; }
  if (tipoRequerido && sesion.tipo !== tipoRequerido) { window.location.href = "../index.html"; return null; }
  return sesion;
}
