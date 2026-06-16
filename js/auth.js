/* ============================================================
   auth.js — Autenticación: login y registro
   ============================================================ */

/* ── LOGIN ── */
function handleLogin() {
  const username = document.getElementById('login-username').value.trim();
  const password = document.getElementById('login-password').value.trim();

  if (!username || !password) {
    mostrarError('login-error');
    return;
  }

  const usuario = usuarios.find(u => u.username === username && u.password === password);

  if (!usuario) {
    mostrarError('login-error');
    return;
  }

  ocultarError('login-error');
  sesionActual = usuario;
  limpiarCampos(['login-username', 'login-password']);
  showView('view-panel');
}

/* ── REGISTRO ── */
function handleRegistro() {
  const campos = ['reg-username', 'reg-password', 'reg-fullname', 'reg-level', 'reg-area'];

  if (!camposCompletos(campos)) {
    mostrarError('reg-error');
    return;
  }

  const nuevoUsername = document.getElementById('reg-username').value.trim();
  const yaExiste = usuarios.some(u => u.username === nuevoUsername);

  if (yaExiste) {
    const err = document.getElementById('reg-error');
    err.textContent = 'Ese nombre de usuario ya está en uso.';
    mostrarError('reg-error');
    return;
  }

  document.getElementById('reg-error').textContent = 'Completá todos los campos.';
  ocultarError('reg-error');

  const nuevo = {
    username: nuevoUsername,
    password: document.getElementById('reg-password').value.trim(),
    fullname: document.getElementById('reg-fullname').value.trim(),
    level:    document.getElementById('reg-level').value,
    area:     document.getElementById('reg-area').value,
    rol:      'postulante'
  };

  usuarios.push(nuevo);
  limpiarCampos(campos);

  alert(`¡Registro exitoso! Bienvenido/a, ${nuevo.fullname}. Ya podés iniciar sesión.`);
  showLoginPanel('login');
}

/* ── CERRAR SESIÓN ── */
function cerrarSesion() {
  sesionActual = null;
  showLoginPanel('login');
  showView('view-login');
}
