// data.js - Datos precargados del sistema

const administradores = [
  { usuario: "admin1", contrasena: "Admin1" }
];

let postulantes = JSON.parse(localStorage.getItem("postulantes")) || [];

let ofertas = JSON.parse(localStorage.getItem("ofertas")) || [
  {
    id: "JOB_OFFER_1",
    titulo: "Desarrollador Frontend",
    empresa: "TechCorp",
    descripcion: "Desarrollo de interfaces web modernas.",
    nivelRequerido: "Junior",
    area: "Tecnologia",
    limitePostulaciones: 5,
    vacantes: 2,
    destacada: true,
    estado: "Activa"
  },
  {
    id: "JOB_OFFER_2",
    titulo: "Desarrollador Backend",
    empresa: "TechCorp",
    descripcion: "Desarrollo de APIs REST.",
    nivelRequerido: "Senior",
    area: "Tecnologia",
    limitePostulaciones: 3,
    vacantes: 1,
    destacada: true,
    estado: "Activa"
  },
  {
    id: "JOB_OFFER_3",
    titulo: "Analista de Datos",
    empresa: "DataInc",
    descripcion: "Análisis y visualización de datos.",
    nivelRequerido: "Junior",
    area: "Tecnologia",
    limitePostulaciones: 4,
    vacantes: 1,
    destacada: false,
    estado: "Activa"
  },
  {
    id: "JOB_OFFER_4",
    titulo: "Diseñador UX/UI",
    empresa: "CreativeStudio",
    descripcion: "Diseño de experiencias de usuario.",
    nivelRequerido: "Semi-Senior",
    area: "Diseno",
    limitePostulaciones: 3,
    vacantes: 2,
    destacada: true,
    estado: "Activa"
  }
];

let postulaciones = JSON.parse(localStorage.getItem("postulaciones")) || [];

let contadorOfertas = JSON.parse(localStorage.getItem("contadorOfertas")) || 5;
let contadorPostulaciones = JSON.parse(localStorage.getItem("contadorPostulaciones")) || 1;

const AREAS = ["Tecnologia", "Diseno", "Marketing", "Administracion"];
const NIVELES = ["Junior", "Semi-Senior", "Senior"];

function guardarDatos() {
  localStorage.setItem("postulantes", JSON.stringify(postulantes));
  localStorage.setItem("ofertas", JSON.stringify(ofertas));
  localStorage.setItem("postulaciones", JSON.stringify(postulaciones));
  localStorage.setItem("contadorOfertas", JSON.stringify(contadorOfertas));
  localStorage.setItem("contadorPostulaciones", JSON.stringify(contadorPostulaciones));
}
