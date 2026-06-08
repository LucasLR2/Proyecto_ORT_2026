// admin.js - Panel administrador (F07, F08, F09, F10)

document.addEventListener("DOMContentLoaded", () => {
  const sesion = verificarAcceso("admin");
  if (!sesion) return;
  // TODO: renderizar panel del administrador
});

// F08 - Gestión de ofertas
function renderizarGestionOfertas() {
  // TODO: renderizar en el DOM
  return ofertas;
}

// F09 - Postulaciones pendientes
function renderizarPostulacionesPendientes() {
  const pendientes = obtenerPostulacionesPendientes();
  // TODO: renderizar en el DOM
  return pendientes;
}

// F10 - Estadísticas del sistema
function calcularEstadisticas() {
  const porOferta = ofertas.map(o => {
    const rel = postulaciones.filter(p => p.ofertaId === o.id);
    return {
      titulo: o.titulo,
      pendientes: rel.filter(p => p.estado === "Pendiente").length,
      aceptadas: rel.filter(p => p.estado === "Aceptada").length,
      rechazadas: rel.filter(p => p.estado === "Rechazada").length,
      total: rel.length
    };
  });

  const totalActivas   = ofertas.filter(o => o.estado === "Activa").length;
  const totalInactivas = ofertas.filter(o => o.estado === "Inactiva").length;
  const totalCerradas  = ofertas.filter(o => o.estado === "Cerrada").length;

  const totalVacantes  = ofertas.reduce((acc, o) => acc + o.vacantes, 0);
  const totalCubiertas = postulaciones.filter(p => p.estado === "Aceptada").length;
  const porcentajeCubierto = totalVacantes > 0 ? Math.round((totalCubiertas / totalVacantes) * 100) : 0;

  const conteo = {};
  postulaciones.filter(p => p.estado === "Pendiente").forEach(p => {
    conteo[p.usuario] = (conteo[p.usuario] || 0) + 1;
  });
  const top = Object.entries(conteo).sort((a, b) => b[1] - a[1])[0];

  return {
    porOferta, totalActivas, totalInactivas, totalCerradas,
    totalVacantes, totalCubiertas, porcentajeCubierto,
    topPostulante: top ? { usuario: top[0], cantidad: top[1] } : null
  };
}

// F10 - Filtro por título
function filtrarEstadisticasPorTitulo(titulo) {
  const stats = calcularEstadisticas();
  if (!titulo || titulo.trim() === "") return stats;
  const filtradas = stats.porOferta.filter(o => o.titulo.toLowerCase().includes(titulo.toLowerCase()));
  return { ...stats, porOferta: filtradas, sinResultados: filtradas.length === 0 };
}
