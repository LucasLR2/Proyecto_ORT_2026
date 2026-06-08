// postulante.js - Pantallas del postulante (F04, F05, F06)

document.addEventListener("DOMContentLoaded", () => {
  const sesion = verificarAcceso("postulante");
  if (!sesion) return;
  // TODO: renderizar panel del postulante
});

// F04 - Listado de ofertas
function renderizarOfertas(soloMiArea) {
  const sesion = obtenerSesion();
  const postulante = postulantes.find(p => p.usuario === sesion.usuario);
  if (!postulante) return [];

  let lista = obtenerOfertasCompatibles(postulante.nivel);
  if (soloMiArea) lista = lista.filter(o => o.area === postulante.area);
  lista = lista.filter(o => !postulaciones.some(p => p.usuario === sesion.usuario && p.ofertaId === o.id));

  // TODO: renderizar en el DOM
  return lista;
}

// F05 - Catálogo de destacadas
function renderizarDestacadas() {
  const sesion = obtenerSesion();
  const postulante = postulantes.find(p => p.usuario === sesion.usuario);
  if (!postulante) return [];

  let lista = obtenerOfertasDestacadas().filter(o => {
    const compatible =
      (postulante.nivel === "Junior" && o.nivelRequerido === "Junior") ||
      (postulante.nivel === "Semi-Senior" && o.nivelRequerido === "Semi-Senior") ||
      postulante.nivel === "Senior";
    const noAplicada = !postulaciones.some(p => p.usuario === sesion.usuario && p.ofertaId === o.id);
    return compatible && noAplicada;
  });

  // TODO: renderizar en el DOM
  return lista;
}

// F06 - Mis postulaciones
function renderizarMisPostulaciones() {
  const sesion = obtenerSesion();
  const lista = obtenerMisPostulaciones(sesion.usuario);
  // TODO: renderizar en el DOM
  return lista;
}
