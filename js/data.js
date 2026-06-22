/* ============================================================
   data.js — Datos y estado central
   ============================================================ */

const usuarios = [
  {
    username: 'admin',
    password: 'admin',
    fullname: 'Administrador',
    rol:      'admin',
    level:    '',
    area:     ''
  },
  {
    username: 'Test',
    password: '123',
    fullname: 'Test User',
    rol:      'postulante',
    level:    'junior',
    area:     'tecnologia'
  }
];

const ofertas = [
  {
    id: 'JOB_OFFER_1',
    titulo:   'Desarrollador Frontend',
    empresa:  'TechCorp',
    nivel:    'junior',
    area:     'tecnologia',
    vacantes: 2,
    estado:   'active',
    fecha:    '2026-05-10'
  },
  {
    id: 'JOB_OFFER_2',
    titulo:   'Analista de Datos',
    empresa:  'DataInc',
    nivel:    'semi-senior',
    area:     'tecnologia',
    vacantes: 1,
    estado:   'active',
    fecha:    '2026-05-14'
  },
  {
    id: 'JOB_OFFER_3',
    titulo:   'Diseñador UX/UI',
    empresa:  'CreativeStudio',
    nivel:    'senior',
    area:     'diseno',
    vacantes: 3,
    estado:   'active',
    fecha:    '2026-05-18'
  },
  {
    id: 'JOB_OFFER_4',
    titulo:   'Coordinador de Marketing',
    empresa:  'BrandCo',
    nivel:    'semi-senior',
    area:     'marketing',
    vacantes: 1,
    estado:   'active',
    fecha:    '2026-05-22'
  },
  {
    id: 'JOB_OFFER_5',
    titulo:   'Desarrollador Backend',
    empresa:  'ServerStack',
    nivel:    'senior',
    area:     'tecnologia',
    vacantes: 2,
    estado:   'active',
    fecha:    '2026-05-28'
  },
  {
    id: 'JOB_OFFER_6',
    titulo:   'Especialista en SEO',
    empresa:  'GrowthLabs',
    nivel:    'junior',
    area:     'marketing',
    vacantes: 1,
    estado:   'active',
    fecha:    '2026-06-01'
  },
  {
    id: 'JOB_OFFER_7',
    titulo:   'Administrador de Sistemas',
    empresa:  'CloudBase',
    nivel:    'semi-senior',
    area:     'tecnologia',
    vacantes: 1,
    estado:   'active',
    fecha:    '2026-06-03'
  },
  {
    id: 'JOB_OFFER_8',
    titulo:   'Diseñador Gráfico',
    empresa:  'PixelForge',
    nivel:    'junior',
    area:     'diseno',
    vacantes: 2,
    estado:   'active',
    fecha:    '2026-06-05'
  },
  {
    id: 'JOB_OFFER_9',
    titulo:   'Analista Administrativo',
    empresa:  'FinGroup',
    nivel:    'semi-senior',
    area:     'administracion',
    vacantes: 1,
    estado:   'active',
    fecha:    '2026-06-08'
  },
  {
    id: 'JOB_OFFER_10',
    titulo:   'Product Manager',
    empresa:  'Innovatech',
    nivel:    'senior',
    area:     'administracion',
    vacantes: 1,
    estado:   'active',
    fecha:    '2026-06-10'
  },
  {
    id: 'JOB_OFFER_11',
    titulo:   'Desarrollador Full Stack',
    empresa:  'WebWorks',
    nivel:    'senior',
    area:     'tecnologia',
    vacantes: 3,
    estado:   'active',
    fecha:    '2026-06-12'
  },
  {
    id: 'JOB_OFFER_12',
    titulo:   'Community Manager',
    empresa:  'DigitalMind',
    nivel:    'junior',
    area:     'marketing',
    vacantes: 2,
    estado:   'active',
    fecha:    '2026-06-14'
  }
];

const postulaciones = [];

let sesionActual = null;

const BADGE = {
  active:   { clase: 'badge-active',   label: 'Activa'   },
  inactive: { clase: 'badge-inactive', label: 'Inactiva' },
  closed:   { clase: 'badge-closed',   label: 'Cerrada'  }
};

const NIVEL_LABEL = {
  junior:        'Junior',
  'semi-senior': 'Semi-Senior',
  senior:        'Senior'
};

const AREA_LABEL = {
  tecnologia:     'Tecnología',
  diseno:         'Diseño',
  marketing:      'Marketing',
  administracion: 'Administración'
};

/* Color de acento por área (usado en las cards) */
const AREA_COLOR = {
  tecnologia:     '#7c3aed',
  diseno:         '#3b82f6',
  marketing:      '#22c55e',
  administracion: '#f59e0b'
};