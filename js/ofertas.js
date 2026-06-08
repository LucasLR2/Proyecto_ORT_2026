// ofertas.js - Lógica de creación, edición y gestión de ofertas

// F07 - Crear Oferta Laboral
function crearOferta(titulo, empresa, descripcion, nivel, area, limitePost, vacantes, destacada) {
  const errores = validarCamposOferta(titulo, empresa, descripcion, nivel, area, limitePost, vacantes);
  if (errores.length > 0) return { ok: false, errores };

  const nuevaOferta = {
    id: "JOB_OFFER_" + contadorOfertas++,
    titulo: titulo.trim(), empresa: empresa.trim(), descripcion: descripcion.trim(),
    nivelRequerido: nivel, area,
    limitePostulaciones: parseInt(limitePost),
    vacantes: parseInt(vacantes),
    destacada: !!destacada,
    estado: "Activa"
  };

  ofertas.push(nuevaOferta);
  guardarDatos();
  return { ok: true, oferta: nuevaOferta };
}

// F08 - Editar Oferta
function editarOferta(id, titulo, empresa, descripcion, nivel, area, limitePost, vacantes, destacada) {
  const oferta = ofertas.find(o => o.id === id);
  if (!oferta) return { ok: false, errores: [{ campo: "general", msg: "Oferta no encontrada." }] };
  if (oferta.estado === "Cerrada")
    return { ok: false, errores: [{ campo: "general", msg: "No es posible modificar una oferta cerrada." }] };

  const errores = validarCamposOferta(titulo, empresa, descripcion, nivel, area, limitePost, vacantes);
  if (errores.length > 0) return { ok: false, errores };

  Object.assign(oferta, {
    titulo: titulo.trim(), empresa: empresa.trim(), descripcion: descripcion.trim(),
    nivelRequerido: nivel, area,
    limitePostulaciones: parseInt(limitePost),
    vacantes: parseInt(vacantes),
    destacada: !!destacada
  });
  guardarDatos();
  return { ok: true };
}

// F08 - Cerrar Oferta
function cerrarOferta(id) {
  const oferta = ofertas.find(o => o.id === id);
  if (!oferta) return { ok: false, msg: "Oferta no encontrada." };
  if (oferta.estado === "Cerrada") return { ok: false, msg: "No es posible modificar una oferta cerrada." };
  oferta.estado = "Cerrada";
  guardarDatos();
  return { ok: true };
}

function validarCamposOferta(titulo, empresa, descripcion, nivel, area, limitePost, vacantes) {
  const errores = [];
  if (esCampoVacio(titulo))
    errores.push({ campo: "titulo", msg: "El título de la oferta es obligatorio." });
  if (esCampoVacio(empresa))
    errores.push({ campo: "empresa", msg: "El nombre de la empresa es obligatorio." });
  if (esCampoVacio(descripcion))
    errores.push({ campo: "descripcion", msg: "La descripción de la oferta es obligatoria." });
  if (!nivel || !NIVELES.includes(nivel))
    errores.push({ campo: "nivel", msg: "Debe seleccionar un nivel requerido." });
  if (!area || !AREAS.includes(area))
    errores.push({ campo: "area", msg: "Debe seleccionar un área." });
  if (!esEnteroPositivo(limitePost))
    errores.push({ campo: "limitePost", msg: "El límite de postulaciones debe ser un número entero mayor a 0." });
  if (!esEnteroPositivo(vacantes))
    errores.push({ campo: "vacantes", msg: "La cantidad de vacantes debe ser un número entero mayor a 0." });
  if (esEnteroPositivo(limitePost) && esEnteroPositivo(vacantes) && parseInt(limitePost) < parseInt(vacantes))
    errores.push({ campo: "limitePost", msg: "El límite de postulaciones debe ser mayor o igual a la cantidad de vacantes." });
  return errores;
}

function obtenerOfertasCompatibles(nivelPostulante) {
  return ofertas.filter(o => {
    if (o.estado !== "Activa") return false;
    if (nivelPostulante === "Junior") return o.nivelRequerido === "Junior";
    if (nivelPostulante === "Semi-Senior") return o.nivelRequerido === "Semi-Senior";
    if (nivelPostulante === "Senior") return true;
    return false;
  });
}

function obtenerOfertasDestacadas() {
  return ofertas.filter(o => o.estado === "Activa" && o.destacada);
}

function vacantesDisponibles(ofertaId) {
  const aceptadas = postulaciones.filter(p => p.ofertaId === ofertaId && p.estado === "Aceptada").length;
  const oferta = ofertas.find(o => o.id === ofertaId);
  return oferta ? oferta.vacantes - aceptadas : 0;
}
