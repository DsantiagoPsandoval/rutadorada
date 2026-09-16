/**
 * RUTA DORADA QUIROGA - Configuración Centralizada
 * Permite actualizar fácilmente los datos de contacto, impacto, redes y fuentes oficiales.
 */
const RUTA_CONFIG = {
  nombre: "Ruta Dorada Quiroga",
  slogan: "Conectando experiencias, bienestar y comunidad.",
  descripcionHero: "Un espacio creado para acercar a los adultos mayores del barrio Quiroga a las actividades programadas y servicios que fortalecen su bienestar, integración y calidad de vida.",
  
  // Ubicación Principal
  ubicacion: {
    barrio: "Barrio Quiroga",
    localidad: "Localidad 18 - Rafael Uribe Uribe",
    ciudad: "Bogotá D.C., Colombia",
    direccionPrincipal: "Calle 31b Sur # 22 - 25 (Salón Comunal) y Calle 31b Sur # 23 - 14 (Centro Día Palabras Mayores)",
    googleMapsLink: "https://www.google.com/maps/search/?api=1&query=Barrio+Quiroga+Bogota",
    embedMapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3977.0177726588825!2d-74.11654852418587!3d4.582845642602758!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e3f99015c6896e3%3A0xc175027cecfd7b42!2sQuiroga%2C%20Bogot%C3%A1!5e0!3m2!1ses!2sco!4v1726329600000!5m2!1ses!2sco"
  },

  // Canales de Contacto Directo Institucional y Comunitario
  contacto: {
    linea195: "195",
    telefonoFijo: "(601) 338 7000",
    telefonoLlamada195: "tel:195",
    telefonoLlamadaFijo: "tel:+576013387000",
    whatsappNumero: "573213288127",
    whatsappFormato: "+57 321 3288127",
    whatsappMensaje: "Hola, quisiera consultar información sobre las actividades y programas para adultos mayores de Ruta Dorada Quiroga.",
    whatsappHorario: "Lunes a viernes de 7:00 a.m. a 7:00 p.m. y sábados de 8:00 a.m. a 12:00 m.",
    correo: "rutadoradaquiroga@gmail.com",
    portalWeb: "https://bogota.gov.co",
    portalWebTexto: "Bogota.gov.co"
  },

  // Métricas de Impacto Comunitario (Demostración configurable)
  impacto: [
    {
      numero: "120+",
      etiqueta: "Adultos mayores beneficiados",
      icono: "👵"
    },
    {
      numero: "25+",
      etiqueta: "Actividades realizadas al mes",
      icono: "🏃"
    },
    {
      numero: "15+",
      etiqueta: "Espacios y puntos comunitarios",
      icono: "🏡"
    },
    {
      numero: "100%",
      etiqueta: "Compromiso con nuestra comunidad",
      icono: "❤️"
    }
  ],

  // Fuente Oficial Institucional
  fuenteOficial: {
    nombre: "Alcaldía Local de Rafael Uribe Uribe",
    sitioWeb: "https://rafaeluribe.gobiernobogota.gov.co",
    calendarioUrl: "https://rafaeluribe.gobiernobogota.gov.co/calendario/ano",
    atribucionTexto: "Información de actividades coordinada con programas de la Alcaldía Local de Rafael Uribe Uribe y Centro Día Palabras Mayores."
  },

  // Redes Sociales (configurables)
  redes: {
    facebook: "https://facebook.com",
    instagram: "https://instagram.com",
    youtube: "https://youtube.com"
  }
};

// Exportar en window para uso global en vanilla JS
if (typeof window !== 'undefined') {
  window.RUTA_CONFIG = RUTA_CONFIG;
}
