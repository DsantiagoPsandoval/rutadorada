/**
 * RUTA DORADA QUIROGA - Datos de Actividades Comunitarias
 * Incorpora los programas oficiales para personas mayores en el Barrio Quiroga
 * y Centro Día 'Casa de la Sabiduría Palabras Mayores' (Septiembre - Diciembre 2026).
 */

const CATEGORIAS_ACTIVIDADES = [
  { id: "todas", nombre: "Todas", icono: "📋" },
  { id: "adultos-mayores", nombre: "Adultos mayores", icono: "👵" },
  { id: "salud", nombre: "Salud", icono: "❤️" },
  { id: "actividad-fisica", nombre: "Actividad física", icono: "🏃" },
  { id: "cultura", nombre: "Cultura", icono: "🎨" },
  { id: "recreacion", nombre: "Recreación", icono: "🎵" },
  { id: "talleres", nombre: "Talleres", icono: "🧠" },
  { id: "integracion", nombre: "Integración comunitaria", icono: "🤝" },
  { id: "educacion", nombre: "Educación", icono: "📚" }
];

// Definiciones maestras de programas comunitarios oficiales
const PROGRAMAS_OFICIALES = [
  {
    id: "prog-1",
    titulo: "Acondicionamiento Físico y Gimnasia Dirigida",
    categoriaPrincipal: "actividad-fisica",
    categorias: ["actividad-fisica", "salud", "adultos-mayores"],
    icono: "🏃",
    frecuenciaTexto: "Todos los martes y jueves (Septiembre a Diciembre)",
    diasSemana: [2, 4], // 2 = Martes, 4 = Jueves
    horaInicio: "08:00",
    horaFin: "11:00",
    horarioTexto: "8:00 a. m. a 9:30 a. m. (Grupo 1) y 9:30 a. m. a 11:00 a. m. (Grupo 2)",
    lugar: "Salón Comunal del Barrio Quiroga",
    direccion: "Calle 31b Sur # 22 - 25, Quiroga, Bogotá",
    mapaUrl: "https://www.google.com/maps/search/?api=1&query=Calle+31b+Sur+%23+22-25+Bogota",
    descripcion: "Sesiones dirigidas de actividad física adaptada. Se realizan ejercicios de calistenia, flexibilidad para la prevención de caídas, estimulación muscular leve y dinámicas cardiovasculares de bajo impacto acordes a las capacidades de los asistentes.",
    recomendaciones: [
      "Llevar ropa deportiva cómoda y calzado antideslizante.",
      "Llevar termo con agua para hidratación continua.",
      "Llegar 10 minutos antes del inicio de la sesión."
    ],
    fuenteOficial: "Alcaldía Local de Rafael Uribe Uribe / Programa Comunitario Quiroga",
    urlOficial: "https://rafaeluribe.gobiernobogota.gov.co/calendario/ano",
    esOficial: true,
    destacada: true
  },
  {
    id: "prog-2",
    titulo: "Talleres de Expresión Artística y Proyectos Ocupacionales",
    categoriaPrincipal: "cultura",
    categorias: ["cultura", "recreacion", "talleres", "adultos-mayores"],
    icono: "🎨",
    frecuenciaTexto: "Todos los lunes, miércoles y viernes (Septiembre a Diciembre)",
    diasSemana: [1, 3, 5], // 1=Lun, 3=Mié, 5=Vie
    horaInicio: "13:00",
    horaFin: "15:00",
    horarioTexto: "1:00 p. m. a 3:00 p. m.",
    lugar: "Centro Día 'Casa de la Sabiduría Palabras Mayores'",
    direccion: "Calle 31b Sur # 23 - 14, Quiroga, Bogotá",
    mapaUrl: "https://www.google.com/maps/search/?api=1&query=Calle+31b+Sur+%23+23-14+Bogota",
    descripcion: "Espacios lúdico-creativos orientados al fortalecimiento de la motricidad fina y la socialización. Incluye módulos prácticos de artes plásticas (pintura, modelado) y manualidades (tejido, bordado) enfocados hacia el desarrollo de emprendimientos productivos.",
    recomendaciones: [
      "No se requiere experiencia previa.",
      "Materiales básicos suministrados en el taller.",
      "Traer delantal o prenda para proteger la ropa."
    ],
    fuenteOficial: "Centro Día 'Casa de la Sabiduría Palabras Mayores' - Alcaldía Local",
    urlOficial: "https://rafaeluribe.gobiernobogota.gov.co/calendario/ano",
    esOficial: true,
    destacada: true
  },
  {
    id: "prog-3",
    titulo: "Alfabetización Digital e Inclusión Tecnológica",
    categoriaPrincipal: "educacion",
    categorias: ["educacion", "talleres", "adultos-mayores"],
    icono: "📱",
    frecuenciaTexto: "Todos los martes y jueves (Septiembre a Diciembre)",
    diasSemana: [2, 4],
    horaInicio: "14:45",
    horaFin: "16:15",
    horarioTexto: "2:45 p. m. a 4:15 p. m.",
    lugar: "Centro Día 'Casa de la Sabiduría Palabras Mayores'",
    direccion: "Calle 31b Sur # 23 - 14, Quiroga, Bogotá",
    mapaUrl: "https://www.google.com/maps/search/?api=1&query=Calle+31b+Sur+%23+23-14+Bogota",
    descripcion: "Clases teoricoprácticas para reducir la brecha digital en la vejez. Se enseña el uso y configuración de teléfonos inteligentes, navegación segura en portales web, uso de WhatsApp y la autogestión de trámites virtuales (como la solicitud de citas médicas en la EPS).",
    recomendaciones: [
      "Traer su teléfono celular o tableta con buena carga de batería.",
      "Traer libreta de apuntes y esfero para notas personales.",
      "Paciencia y entusiasmo por aprender."
    ],
    fuenteOficial: "Iniciativa de Inclusión Digital Local - Rafael Uribe Uribe",
    urlOficial: "https://rafaeluribe.gobiernobogota.gov.co/calendario/ano",
    esOficial: true,
    destacada: true
  },
  {
    id: "prog-4",
    titulo: "Estimulación Cognitiva y Juegos de Mesa",
    categoriaPrincipal: "talleres",
    categorias: ["talleres", "salud", "adultos-mayores"],
    icono: "🧠",
    frecuenciaTexto: "Todos los lunes y miércoles (Septiembre a Diciembre)",
    diasSemana: [1, 3],
    horaInicio: "10:15",
    horaFin: "12:00",
    horarioTexto: "10:15 a. m. a 12:00 m.",
    lugar: "Centro Día 'Casa de la Sabiduría Palabras Mayores'",
    direccion: "Calle 31b Sur # 23 - 14, Quiroga, Bogotá",
    mapaUrl: "https://www.google.com/maps/search/?api=1&query=Calle+31b+Sur+%23+23-14+Bogota",
    descripcion: "Ejercicios de gimnasia cerebral diseñados para retrasar el deterioro cognitivo. Mediante talleres de memoria, lectura guiada, crucigramas y torneos de juegos tradicionales (ajedrez, parqués, dominó), se estimulan las funciones ejecutivas del cerebro.",
    recomendaciones: [
      "Llegar con 10 minutos de anticipación.",
      "Traer gafas de lectura si las utiliza habitualmente."
    ],
    fuenteOficial: "Centro Día Palabras Mayores - Secretaría de Integración Social",
    urlOficial: "https://rafaeluribe.gobiernobogota.gov.co/calendario/ano",
    esOficial: true,
    destacada: true
  },
  {
    id: "prog-5",
    titulo: "Servicio de Apoyo Nutricional Integral",
    categoriaPrincipal: "salud",
    categorias: ["salud", "adultos-mayores"],
    icono: "🥗",
    frecuenciaTexto: "De lunes a viernes continuo (Septiembre a Diciembre)",
    diasSemana: [1, 2, 3, 4, 5],
    horaInicio: "07:30",
    horaFin: "13:00",
    horarioTexto: "7:30 a. m. (Refrigerio) y 11:45 a. m. (Almuerzo balanceado)",
    lugar: "Comedor del Centro Día 'Casa de la Sabiduría Palabras Mayores'",
    direccion: "Calle 31b Sur # 23 - 14, Quiroga, Bogotá",
    mapaUrl: "https://www.google.com/maps/search/?api=1&query=Calle+31b+Sur+%23+23-14+Bogota",
    descripcion: "Entrega de raciones alimentarias bajo estricta supervisión de profesionales de la salud. Diseñado metodológicamente para combatir la malnutrición en la vejez, aportando los porcentajes macro y micronutricionales requeridos para las actividades del día.",
    recomendaciones: [
      "Estar inscrito activamente en el programa Centro Día.",
      "Presentar documento de identidad al ingreso.",
      "Informar oportunamente sobre alergias o restricciones médicas."
    ],
    fuenteOficial: "Secretaría Distrital de Integración Social / Alcaldía Local",
    urlOficial: "https://rafaeluribe.gobiernobogota.gov.co/calendario/ano",
    esOficial: true,
    destacada: false
  },
  {
    id: "prog-6",
    titulo: "Atención Interdisciplinaria y Valoración en Salud",
    categoriaPrincipal: "salud",
    categorias: ["salud", "adultos-mayores"],
    icono: "🩺",
    frecuenciaTexto: "De lunes a viernes (Bajo agendamiento previo)",
    diasSemana: [1, 2, 3, 4, 5],
    horaInicio: "08:00",
    horaFin: "16:00",
    horarioTexto: "8:00 a. m. a 4:00 p. m. (Citas programadas)",
    lugar: "Consultorios del Centro Día 'Casa de la Sabiduría Palabras Mayores'",
    direccion: "Calle 31b Sur # 23 - 14, Quiroga, Bogotá",
    mapaUrl: "https://www.google.com/maps/search/?api=1&query=Calle+31b+Sur+%23+23-14+Bogota",
    descripcion: "Monitoreo preventivo de la salud general de los usuarios. Personal cualificado realiza tomas periódicas de signos vitales (presión arterial, glucometría), tamizajes de peso/talla y brinda acompañamiento y contención psicosocial.",
    recomendaciones: [
      "Solicitar turno previamente en la recepción de Centro Día.",
      "Traer documento de identidad y carné de salud EPS.",
      "Llevar lista de medicamentos de consumo diario."
    ],
    fuenteOficial: "Subred Integrada de Servicios de Salud Centro Oriente / Centro Día",
    urlOficial: "https://rafaeluribe.gobiernobogota.gov.co/calendario/ano",
    esOficial: true,
    destacada: false
  },
  {
    id: "prog-7",
    titulo: "Encuentros Pedagógicos Intergeneracionales",
    categoriaPrincipal: "integracion",
    categorias: ["integracion", "cultura", "educacion", "adultos-mayores"],
    icono: "🤝",
    frecuenciaTexto: "Último viernes de septiembre, octubre y noviembre",
    tipoRegla: "ultimo-viernes",
    fechasEspecificas: ["2026-09-25", "2026-10-30", "2026-11-27"],
    horaInicio: "14:00",
    horaFin: "16:00",
    horarioTexto: "2:00 p. m. a 4:00 p. m.",
    lugar: "Aula múltiple del Centro Día Quiroga",
    direccion: "Calle 31b Sur # 23 - 14, Quiroga, Bogotá",
    mapaUrl: "https://www.google.com/maps/search/?api=1&query=Calle+31b+Sur+%23+23-14+Bogota",
    descripcion: "Jornadas de intercambio de saberes culturales y comunitarios. Adultos mayores interactúan con jóvenes y niños de colegios del sector para compartir técnicas de narración oral, rescatar la historia del barrio Quiroga y realizar juegos autóctonos tradicionales.",
    recomendaciones: [
      "Actividad abierta a la comunidad y familias.",
      "Llegar con disposición para compartir vivencias y recuerdos.",
      "Acompañamiento intergeneracional bienvenido."
    ],
    fuenteOficial: "Alcaldía Local de Rafael Uribe Uribe / Red de Colegios Locales",
    urlOficial: "https://rafaeluribe.gobiernobogota.gov.co/calendario/ano",
    esOficial: true,
    destacada: true
  },
  {
    id: "prog-8",
    titulo: "Sesiones del Consejo Local de Sabios y Sabias",
    categoriaPrincipal: "integracion",
    categorias: ["integracion", "adultos-mayores"],
    icono: "🏛️",
    frecuenciaTexto: "Primer miércoles de septiembre, octubre, noviembre y diciembre",
    tipoRegla: "primer-miercoles",
    fechasEspecificas: ["2026-09-02", "2026-10-07", "2026-11-04", "2026-12-02"],
    horaInicio: "09:00",
    horaFin: "11:30",
    horarioTexto: "9:00 a. m. a 11:30 a. m.",
    lugar: "Salón de reuniones de la Alcaldía Local de Rafael Uribe Uribe",
    direccion: "Calle 32 Sur # 23 - 62, Quiroga / Rafael Uribe Uribe, Bogotá",
    mapaUrl: "https://www.google.com/maps/search/?api=1&query=Calle+32+Sur+%23+23-62+Bogota",
    descripcion: "Espacio formal de control social y ciudadanía activa. Los líderes de las personas mayores de la localidad se reúnen para capacitarse en derechos, evaluar la gestión de los recursos públicos locales y planificar las veedurías ciudadanas en salud y bienestar.",
    recomendaciones: [
      "Ingreso libre a personas mayores de la localidad.",
      "Llevar documento de identificación para registro en portería.",
      "Puntualidad obligatoria."
    ],
    fuenteOficial: "Consejo Local de Sabios y Sabias / Alcaldía Local",
    urlOficial: "https://rafaeluribe.gobiernobogota.gov.co/calendario/ano",
    esOficial: true,
    destacada: true
  }
];

/**
 * Generador de instancias de eventos por fecha
 * Expande las reglas de los programas entre Septiembre y Diciembre 2026
 */
function generarInstanciasActividades(fechaInicioStr = "2026-09-01", fechaFinStr = "2026-12-31") {
  const eventos = [];
  const fechaIni = new Date(fechaInicioStr + "T00:00:00");
  const fechaFin = new Date(fechaFinStr + "T23:59:59");
  
  // Días por programa semanal
  let cursor = new Date(fechaIni);
  while (cursor <= fechaFin) {
    const diaSemana = cursor.getDay(); // 0=Dom, 1=Lun, 2=Mar, 3=Mié, 4=Jue, 5=Vie, 6=Sáb
    const yyyy = cursor.getFullYear();
    const mm = String(cursor.getMonth() + 1).padStart(2, '0');
    const dd = String(cursor.getDate()).padStart(2, '0');
    const fechaISO = `${yyyy}-${mm}-${dd}`;

    PROGRAMAS_OFICIALES.forEach(prog => {
      let aplica = false;
      if (prog.fechasEspecificas && prog.fechasEspecificas.includes(fechaISO)) {
        aplica = true;
      } else if (prog.diasSemana && prog.diasSemana.includes(diaSemana)) {
        aplica = true;
      }

      if (aplica) {
        eventos.push({
          id: `${prog.id}-${fechaISO}`,
          programaId: prog.id,
          titulo: prog.titulo,
          fecha: fechaISO,
          fechaTexto: formatearFechaEspanol(fechaISO),
          horaInicio: prog.horaInicio,
          horaFin: prog.horaFin,
          horarioTexto: prog.horarioTexto,
          lugar: prog.lugar,
          direccion: prog.direccion,
          mapaUrl: prog.mapaUrl,
          categoriaPrincipal: prog.categoriaPrincipal,
          categorias: prog.categorias,
          icono: prog.icono,
          descripcion: prog.descripcion,
          recomendaciones: prog.recomendaciones,
          fuenteOficial: prog.fuenteOficial,
          urlOficial: prog.urlOficial,
          esOficial: prog.esOficial,
          destacada: prog.destacada,
          esDemo: false
        });
      }
    });

    cursor.setDate(cursor.getDate() + 1);
  }

  // Cargar eventos personalizados creados por el Administrador desde localStorage
  try {
    const eventosAdmin = JSON.parse(localStorage.getItem("ruta_dorada_eventos_custom") || "[]");
    eventosAdmin.forEach(ev => {
      if (ev.activo !== false) {
        eventos.push(ev);
      }
    });
  } catch (e) {
    console.warn("No se pudieron cargar eventos locales:", e);
  }

  // Ordenar cronológicamente
  eventos.sort((a, b) => {
    if (a.fecha !== b.fecha) return a.fecha.localeCompare(b.fecha);
    return a.horaInicio.localeCompare(b.horaInicio);
  });

  return eventos;
}

/**
 * Formatea una fecha YYYY-MM-DD en texto cálido en español
 * Ejemplo: "Martes, 15 de septiembre de 2026"
 */
function formatearFechaEspanol(fechaISO) {
  if (!fechaISO) return "";
  const partes = fechaISO.split("-");
  const fecha = new Date(partes[0], partes[1] - 1, partes[2]);
  const diasSemana = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
  const meses = [
    "enero", "febrero", "marzo", "abril", "mayo", "junio",
    "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
  ];
  return `${diasSemana[fecha.getDay()]}, ${fecha.getDate()} de ${meses[fecha.getMonth()]} de ${fecha.getFullYear()}`;
}

/**
 * Obtiene el nombre legible de una categoría a partir de su ID
 */
function obtenerNombreCategoria(catId) {
  const cat = CATEGORIAS_ACTIVIDADES.find(c => c.id === catId);
  return cat ? cat.nombre : catId;
}

/**
 * Genera el enlace de Google Calendar para una actividad
 */
function generarEnlaceGoogleCalendar(actividad) {
  const f = actividad.fecha.replace(/-/g, "");
  const hi = (actividad.horaInicio || "08:00").replace(":", "") + "00";
  const hf = (actividad.horaFin || "10:00").replace(":", "") + "00";
  const startISO = `${f}T${hi}`;
  const endISO = `${f}T${hf}`;

  const title = encodeURIComponent(actividad.titulo + " - Ruta Dorada Quiroga");
  const details = encodeURIComponent(
    `${actividad.descripcion}\n\nRecomendaciones:\n${(actividad.recomendaciones || []).map(r => "• " + r).join("\n")}\n\nOrganiza: ${actividad.fuenteOficial || "Ruta Dorada Quiroga"}`
  );
  const location = encodeURIComponent(actividad.direccion || actividad.lugar);

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startISO}/${endISO}&details=${details}&location=${location}`;
}

/**
 * Genera un archivo iCalendar (.ics) descargable para cualquier dispositivo
 */
function descargarArchivoICS(actividad) {
  const f = actividad.fecha.replace(/-/g, "");
  const hi = (actividad.horaInicio || "08:00").replace(":", "") + "00";
  const hf = (actividad.horaFin || "10:00").replace(":", "") + "00";
  
  const icsContent = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Ruta Dorada Quiroga//Actividades Comunitarias//ES",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:${actividad.id || Date.now()}@rutadoradaquiroga.org`,
    `DTSTAMP:${f}T000000Z`,
    `DTSTART:${f}T${hi}`,
    `DTEND:${f}T${hf}`,
    `SUMMARY:${actividad.titulo}`,
    `DESCRIPTION:${actividad.descripcion ? actividad.descripcion.replace(/\n/g, "\\n") : ""}`,
    `LOCATION:${actividad.lugar} - ${actividad.direccion}`,
    "END:VEVENT",
    "END:VCALENDAR"
  ].join("\r\n");

  const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
  const link = document.createElement("a");
  link.href = window.URL.createObjectURL(blob);
  link.setAttribute("download", `${actividad.id || "evento-quiroga"}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Instanciar actividades para uso global
const TODAS_LAS_ACTIVIDADES = generarInstanciasActividades("2026-09-01", "2026-12-31");

if (typeof window !== "undefined") {
  window.CATEGORIAS_ACTIVIDADES = CATEGORIAS_ACTIVIDADES;
  window.PROGRAMAS_OFICIALES = PROGRAMAS_OFICIALES;
  window.TODAS_LAS_ACTIVIDADES = TODAS_LAS_ACTIVIDADES;
  window.generarInstanciasActividades = generarInstanciasActividades;
  window.formatearFechaEspanol = formatearFechaEspanol;
  window.obtenerNombreCategoria = obtenerNombreCategoria;
  window.generarEnlaceGoogleCalendar = generarEnlaceGoogleCalendar;
  window.descargarArchivoICS = descargarArchivoICS;
}
