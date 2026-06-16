/* ============================================================
   data.js — Datos y estado central de la aplicación
   ============================================================ */

/* ── Usuarios registrados (persisten en memoria durante la sesión) ── */
const usuarios = [
  {
    username: 'admin',
    password: 'admin',
    fullname: 'Administrador',
    rol:      'admin',
    level:    '',
    area:     ''
  }
];

/* ── Ofertas laborales ── */
const ofertas = [
  {
    id:       'JOB_OFFER_1',
    titulo:   'Desarrollador Frontend',
    empresa:  'TechCorp',
    nivel:    'junior',
    area:     'tecnologia',
    vacantes: 2,
    estado:   'active'
  },
  {
    id:       'JOB_OFFER_2',
    titulo:   'Analista de Datos',
    empresa:  'DataInc',
    nivel:    'semi-senior',
    area:     'tecnologia',
    vacantes: 1,
    estado:   'inactive'
  },
  {
    id:       'JOB_OFFER_3',
    titulo:   'Diseñador UX',
    empresa:  'CreativeStudio',
    nivel:    'senior',
    area:     'diseno',
    vacantes: 3,
    estado:   'active'
  },
  {
    id:       'JOB_OFFER_4',
    titulo:   'Coordinador de Marketing',
    empresa:  'BrandCo',
    nivel:    'semi-senior',
    area:     'marketing',
    vacantes: 1,
    estado:   'active'
  }
];

/* ── Postulaciones: { username, ofertaId } ── */
const postulaciones = [];

/* ── Estado de sesión ── */
let sesionActual = null; // null = sin sesión, objeto usuario = logueado

/* ── Mapa de estado → badge (tabla admin) ── */
const BADGE = {
  active:   { clase: 'badge-active',   label: 'Activa'   },
  inactive: { clase: 'badge-inactive', label: 'Inactiva' },
  closed:   { clase: 'badge-closed',   label: 'Cerrada'  }
};

/* ── Etiquetas legibles para nivel y área ── */
const NIVEL_LABEL = {
  junior:      'Junior',
  'semi-senior': 'Semi-Senior',
  senior:      'Senior'
};

const AREA_LABEL = {
  tecnologia:    'Tecnología',
  diseno:        'Diseño',
  marketing:     'Marketing',
  administracion:'Administración'
};