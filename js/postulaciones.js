// postulaciones.js - Lógica de postulaciones

// F04/F05 - Postularse a una oferta
function postularse(usuarioPostulante, ofertaId) {
  const yaPostulado = postulaciones.some(p => p.usuario === usuarioPostulante && p.ofertaId === ofertaId);
  if (yaPostulado) return { ok: false, msg: "Ya te postulaste a esta oferta." };

  const postulacion = {
    id: "JOB_" + contadorPostulaciones++,
    usuario: usuarioPostulante,
    ofertaId,
    estado: "Pendiente"
  };

  postulaciones.push(postulacion);
  guardarDatos();
  return { ok: true, postulacion };
}

// F09 - Aceptar postulación
function aceptarPostulacion(postulacionId) {
  const postulacion = postulaciones.find(p => p.id === postulacionId);
  if (!postulacion) return { ok: false, msg: "Postulación no encontrada." };
  if (postulacion.estado !== "Pendiente")
    return { ok: false, msg: "Esta postulación ya fue procesada anteriormente." };

  postulacion.estado = "Aceptada";
  const oferta = ofertas.find(o => o.id === postulacion.ofertaId);
  let mensaje = "Postulación aceptada.";

  if (oferta) {
    const aceptadas = postulaciones.filter(p => p.ofertaId === oferta.id && p.estado === "Aceptada").length;

    if (aceptadas >= oferta.vacantes) {
      oferta.estado = "Inactiva";
      const pendientes = postulaciones.filter(p => p.ofertaId === oferta.id && p.estado === "Pendiente");
      pendientes.forEach(p => p.estado = "Rechazada");
      mensaje = `Postulación aceptada. Oferta pasó a Inactiva (todas las vacantes cubiertas). Se rechazaron ${pendientes.length} postulaciones pendientes automáticamente.`;
    } else {
      const totalProcesadas = postulaciones.filter(
        p => p.ofertaId === oferta.id && (p.estado === "Aceptada" || p.estado === "Rechazada")
      ).length;
      if (totalProcesadas >= oferta.limitePostulaciones) {
        oferta.estado = "Inactiva";
        mensaje = "Postulación aceptada. Oferta pasó a Inactiva (límite de postulaciones alcanzado).";
      }
    }
  }

  guardarDatos();
  return { ok: true, msg: mensaje };
}

// F09 - Rechazar postulación
function rechazarPostulacion(postulacionId) {
  const postulacion = postulaciones.find(p => p.id === postulacionId);
  if (!postulacion) return { ok: false, msg: "Postulación no encontrada." };
  if (postulacion.estado !== "Pendiente")
    return { ok: false, msg: "Esta postulación ya fue procesada anteriormente." };

  postulacion.estado = "Rechazada";
  guardarDatos();
  return { ok: true, msg: "Postulación rechazada correctamente." };
}

// F06 - Mis postulaciones
function obtenerMisPostulaciones(usuario) {
  return postulaciones
    .filter(p => p.usuario === usuario)
    .map(p => {
      const oferta = ofertas.find(o => o.id === p.ofertaId);
      return { id: p.id, ofertaTitulo: oferta ? oferta.titulo : "Oferta no encontrada", estado: p.estado };
    });
}

// F09 - Postulaciones pendientes
function obtenerPostulacionesPendientes() {
  return postulaciones
    .filter(p => p.estado === "Pendiente")
    .map(p => {
      const oferta = ofertas.find(o => o.id === p.ofertaId);
      return {
        id: p.id, usuario: p.usuario, ofertaId: p.ofertaId,
        ofertaTitulo: oferta ? oferta.titulo : "Oferta no encontrada",
        vacantesDisponibles: oferta ? vacantesDisponibles(oferta.id) : 0
      };
    });
}
