/**
 * RUTA DORADA QUIROGA — Controlador Principal de la Aplicación
 * Manejo de accesibilidad, filtros de actividades, búsqueda, modales,
 * síntesis de voz (TTS), integración de calendarios y menú móvil.
 */

document.addEventListener("DOMContentLoaded", async () => {
  // 1. Inicializar datos y configuraciones en la vista
  cargarConfiguracionEnVista();
  inicializarMenuMovil();
  
  // 2. Cargar actividades dinámicas desde el backend (si están disponibles)
  await cargarActividadesServidor();

  // 3. Renderizar secciones interactivas
  renderizarEstaSemana();
  renderizarFiltrosCategorias();
  renderizarCatalogoActividades();
  
  // 4. Inicializar Calendario si la función existe
  if (typeof window.initCalendario === "function") {
    window.initCalendario();
  }

  // 5. Inicializar Buscador de actividades
  inicializarBuscador();

  // 6. Configurar Modal de Detalle
  inicializarModal();
});

// Variables de estado
let categoriaSeleccionada = "todas";
let terminoBusqueda = "";
let limiteMostrar = 6;
let actividadActualEnModal = null;

/**
 * Aplica los datos de RUTA_CONFIG en el DOM (teléfonos, WhatsApp, impacto, etc.)
 */
function cargarConfiguracionEnVista() {
  const config = window.RUTA_CONFIG;
  if (!config) return;

  // Botón flotante WhatsApp
  const btnWaFlotante = document.getElementById("wa-flotante");
  if (btnWaFlotante && config.contacto) {
    const msg = encodeURIComponent(config.contacto.whatsappMensaje);
    btnWaFlotante.href = `https://wa.me/${config.contacto.whatsappNumero}?text=${msg}`;
  }

  // Enlaces de contacto
  const btnTel195 = document.getElementById("contacto-btn-tel-195");
  if (btnTel195 && config.contacto) {
    btnTel195.href = config.contacto.telefonoLlamada195 || "tel:195";
  }

  const btnTelFijo = document.getElementById("contacto-btn-tel-fijo");
  if (btnTelFijo && config.contacto) {
    btnTelFijo.href = config.contacto.telefonoLlamadaFijo || "tel:+576013387000";
  }

  const btnWa = document.getElementById("contacto-btn-wa");
  if (btnWa && config.contacto) {
    const msg = encodeURIComponent(config.contacto.whatsappMensaje);
    btnWa.href = `https://wa.me/${config.contacto.whatsappNumero}?text=${msg}`;
  }

  const btnMail = document.getElementById("contacto-btn-mail");
  if (btnMail && config.contacto) {
    btnMail.href = `mailto:${config.contacto.correo}?subject=Consulta%20Ruta%20Dorada%20Quiroga`;
  }

  const btnPortal = document.getElementById("contacto-btn-portal");
  if (btnPortal && config.contacto) {
    btnPortal.href = config.contacto.portalWeb || "https://bogota.gov.co";
  }

  // Impacto
  const contenedorImpacto = document.getElementById("grid-impacto");
  if (contenedorImpacto && config.impacto) {
    contenedorImpacto.innerHTML = config.impacto.map(item => `
      <div class="tarjeta-impacto">
        <div class="tarjeta-impacto-icono">${item.icono}</div>
        <div class="tarjeta-impacto-numero">${item.numero}</div>
        <div class="tarjeta-impacto-texto">${item.etiqueta}</div>
      </div>
    `).join("");
  }
}

/**
 * Obtiene la URL base para las peticiones a la API
 */
function obtenerApiBaseUrl() {
  if (window.location.protocol === "http:" || window.location.protocol === "https:") {
    return "";
  }
  return "http://localhost:8080";
}

/**
 * Carga actividades personalizadas agregadas por el administrador desde el backend y localStorage
 */
async function cargarActividadesServidor() {
  let customActs = [];
  let deletedIds = new Set();

  // 1. Cargar IDs eliminados desde localStorage
  try {
    const delData = localStorage.getItem("ruta_dorada_deleted_actividades");
    if (delData) {
      deletedIds = new Set(JSON.parse(delData));
    }
  } catch (e) {
    console.warn("Error leyendo eliminadas:", e);
  }

  // 2. Cargar actividades creadas en el panel de admin desde localStorage (soporte GitHub Pages)
  try {
    const localData = localStorage.getItem("ruta_dorada_custom_actividades");
    if (localData) {
      customActs = JSON.parse(localData);
    }
  } catch (e) {
    console.warn("Error leyendo localStorage:", e);
  }

  // 3. Consultar backend si está disponible; si no, cargar data/actividades.json
  let cargadasDelServidor = false;
  try {
    const apiUrl = `${obtenerApiBaseUrl()}/api/actividades`;
    const resp = await fetch(apiUrl);
    if (resp.ok) {
      const serverActs = await resp.json();
      if (Array.isArray(serverActs) && serverActs.length > 0) {
        const map = new Map();
        serverActs.forEach(a => map.set(a.id, a));
        customActs.forEach(a => { if (!map.has(a.id)) map.set(a.id, a); });
        customActs = Array.from(map.values());
        cargadasDelServidor = true;
      }
    }
  } catch (err) {
    // Servidor backend offline
  }

  // Cargar data/actividades.json para que todos los usuarios en GitHub Pages vean los cambios
  if (!cargadasDelServidor) {
    try {
      const respStatic = await fetch("data/actividades.json");
      if (respStatic.ok) {
        const staticActs = await respStatic.json();
        if (Array.isArray(staticActs) && staticActs.length > 0) {
          const map = new Map();
          staticActs.forEach(a => map.set(a.id, a));
          customActs.forEach(a => { if (!map.has(a.id)) map.set(a.id, a); });
          customActs = Array.from(map.values());
        }
      }
    } catch (e) {
      // Archivo estático no disponible
    }
  }

  // 4. Filtrar y fusionar con catálogo base
  const idsCustom = new Set(customActs.map(a => a.id));
  const base = (window.TODAS_LAS_ACTIVIDADES || []).filter(a => !idsCustom.has(a.id) && !deletedIds.has(a.id));
  const activasCustom = customActs.filter(a => !deletedIds.has(a.id));

  window.TODAS_LAS_ACTIVIDADES = [...activasCustom, ...base].sort((a, b) => {
    if (a.fecha !== b.fecha) return (a.fecha || "").localeCompare(b.fecha || "");
    return (a.horaInicio || "").localeCompare(b.horaInicio || "");
  });
}

/**
 * Menú Móvil
 */
function inicializarMenuMovil() {
  const btnAbrir = document.getElementById("btn-abrir-menu");
  const btnCerrar = document.getElementById("btn-cerrar-menu");
  const menuPanel = document.getElementById("menu-movil");

  function cerrarMenuMovil() {
    if (menuPanel) {
      menuPanel.classList.remove("abierto");
      document.body.style.overflow = "";
      if (btnAbrir) btnAbrir.setAttribute("aria-expanded", "false");
    }
  }

  function abrirMenuMovil() {
    if (menuPanel) {
      menuPanel.classList.add("abierto");
      document.body.style.overflow = "hidden";
      if (btnAbrir) btnAbrir.setAttribute("aria-expanded", "true");
    }
  }

  if (btnAbrir) {
    btnAbrir.addEventListener("click", abrirMenuMovil);
  }

  if (btnCerrar) {
    btnCerrar.addEventListener("click", cerrarMenuMovil);
  }

  // Cerrar al hacer clic en el fondo oscuro
  if (menuPanel) {
    menuPanel.addEventListener("click", (e) => {
      if (e.target === menuPanel) {
        cerrarMenuMovil();
      }
    });
  }

  // Cerrar al presionar la tecla Escape
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && menuPanel && menuPanel.classList.contains("abierto")) {
      cerrarMenuMovil();
    }
  });

  // Cerrar al hacer clic en cualquiera de los enlaces de navegación
  const enlaces = menuPanel ? menuPanel.querySelectorAll("a") : [];
  enlaces.forEach(a => {
    a.addEventListener("click", () => {
      cerrarMenuMovil();
    });
  });
}

/**
 * Renderiza la sección "¿Qué hay esta semana?" (Top 3 actividades destacadas)
 */
function renderizarEstaSemana() {
  const contenedor = document.getElementById("grid-esta-semana");
  if (!contenedor) return;

  const hoyISO = "2026-09-14"; // Lunes 14 de Septiembre 2026
  const mananaISO = "2026-09-15"; // Martes 15 de Septiembre 2026

  const todas = window.TODAS_LAS_ACTIVIDADES || [];
  
  // Actividad de HOY
  const actHoy = todas.find(a => a.fecha === hoyISO && a.destacada) || todas.find(a => a.fecha === hoyISO) || todas[0];
  // Actividad de MAÑANA
  const actManana = todas.find(a => a.fecha === mananaISO && a.destacada) || todas.find(a => a.fecha === mananaISO) || todas[1];
  // Actividad de ESTE VIERNES o PRÓXIMA destacada
  const actProxima = todas.find(a => a.fecha > mananaISO && a.destacada) || todas[2];

  const seleccionadas = [
    { tiempo: "HOY", claseTiempo: "hoy", actividad: actHoy },
    { tiempo: "MAÑANA", claseTiempo: "manana", actividad: actManana },
    { tiempo: "ESTA SEMANA", claseTiempo: "proximo", actividad: actProxima }
  ];

  contenedor.innerHTML = seleccionadas.map(item => {
    const act = item.actividad;
    if (!act) return "";
    return `
      <article class="tarjeta-semana ${item.claseTiempo}">
        <div>
          <span class="badge-tiempo ${item.claseTiempo}">${item.tiempo} • ${act.fechaTexto.split(",")[0]}</span>
          <h3 class="tarjeta-semana-titulo">${act.titulo}</h3>
          <div class="tarjeta-semana-meta">
            <span>🕐 <strong>Hora:</strong> ${act.horarioTexto}</span>
            <span>📍 <strong>Lugar:</strong> ${act.lugar}</span>
            <span>🏷️ <strong>Categoría:</strong> ${window.obtenerNombreCategoria(act.categoriaPrincipal)}</span>
          </div>
        </div>
        <button class="btn-detalles-semana" onclick="window.abrirModalActividadPorId('${act.id}')">
          <span>🔍</span> Ver detalles y cómo asistir
        </button>
      </article>
    `;
  }).join("");
}

/**
 * Renderiza los botones de categorías
 */
function renderizarFiltrosCategorias() {
  const contenedor = document.getElementById("filtros-categorias");
  if (!contenedor) return;

  const categorias = window.CATEGORIAS_ACTIVIDADES || [];
  contenedor.innerHTML = categorias.map(cat => `
    <button class="btn-filtro ${cat.id === categoriaSeleccionada ? 'activo' : ''}" data-categoria="${cat.id}">
      <span>${cat.icono}</span>
      <span>${cat.nombre}</span>
    </button>
  `).join("");

  contenedor.querySelectorAll(".btn-filtro").forEach(btn => {
    btn.addEventListener("click", () => {
      contenedor.querySelectorAll(".btn-filtro").forEach(b => b.classList.remove("activo"));
      btn.classList.add("activo");
      categoriaSeleccionada = btn.dataset.categoria;
      limiteMostrar = 6; // Reiniciar paginación al cambiar filtro
      renderizarCatalogoActividades();
    });
  });
}

/**
 * Buscador en vivo
 */
function inicializarBuscador() {
  const input = document.getElementById("buscador-actividades");
  if (!input) return;

  input.addEventListener("input", (e) => {
    terminoBusqueda = e.target.value.toLowerCase().trim();
    limiteMostrar = 6;
    renderizarCatalogoActividades();
  });
}

/**
 * Renderiza el grid de actividades con filtro y buscador
 */
function renderizarCatalogoActividades() {
  const grid = document.getElementById("grid-actividades-catalogo");
  const contenedorVerMas = document.getElementById("contenedor-ver-mas");
  if (!grid) return;

  let filtradas = window.TODAS_LAS_ACTIVIDADES || [];

  // Filtrar por categoría
  if (categoriaSeleccionada !== "todas") {
    filtradas = filtradas.filter(act => 
      act.categoriaPrincipal === categoriaSeleccionada || 
      (act.categorias && act.categorias.includes(categoriaSeleccionada))
    );
  }

  // Filtrar por texto de búsqueda
  if (terminoBusqueda) {
    filtradas = filtradas.filter(act => 
      act.titulo.toLowerCase().includes(terminoBusqueda) ||
      act.descripcion.toLowerCase().includes(terminoBusqueda) ||
      act.lugar.toLowerCase().includes(terminoBusqueda)
    );
  }

  if (filtradas.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 40px 20px;">
        <p style="font-size: 2.5rem; margin-bottom: 10px;">🔍</p>
        <h3 style="color: var(--color-verde-principal); margin-bottom: 8px;">No se encontraron actividades</h3>
        <p style="color: var(--color-texto-secundario); font-size: 1.1rem;">Intenta seleccionar otra categoría o cambiar el término de búsqueda.</p>
      </div>
    `;
    if (contenedorVerMas) contenedorVerMas.style.display = "none";
    return;
  }

  const visibles = filtradas.slice(0, limiteMostrar);

  grid.innerHTML = visibles.map(act => {
    const esOficial = act.fuenteTipo === "oficial" || act.esOficial || (!act.fuenteTipo && !act.fuente);
    const badgeFuente = esOficial
      ? `<span class="badge-fuente-oficial">🏛️ Actividad oficial</span>`
      : `<span class="badge-fuente-propia">⭐ Actividad Ruta Dorada</span>`;

    return `
    <article class="tarjeta-actividad">
      <div>
        <div class="actividad-header">
          <span class="badge-categoria">
            ${act.icono || "📌"} ${window.obtenerNombreCategoria(act.categoriaPrincipal)}
          </span>
          ${badgeFuente}
        </div>

        <h3 class="actividad-titulo">${act.titulo}</h3>

        <div class="actividad-detalles-rapidos">
          <div class="actividad-fila-meta">
            <span class="icono-meta">📅</span>
            <div><strong>${act.fechaTexto}</strong></div>
          </div>
          <div class="actividad-fila-meta">
            <span class="icono-meta">🕐</span>
            <div>${act.horarioTexto}</div>
          </div>
          <div class="actividad-fila-meta">
            <span class="icono-meta">📍</span>
            <div>${act.lugar}</div>
          </div>
        </div>

        <p class="actividad-descripcion-corta">${act.descripcion}</p>
      </div>

      <button class="btn-ver-detalles-card" onclick="window.abrirModalActividadPorId('${act.id}')">
        <span>👁️</span> Consultar detalles completos
      </button>
    </article>
  `;
  }).join("");

  // Botón Ver Más
  if (contenedorVerMas) {
    if (filtradas.length > limiteMostrar) {
      contenedorVerMas.style.display = "block";
      const btnVerMas = document.getElementById("btn-ver-mas-actividades");
      if (btnVerMas) {
        btnVerMas.onclick = () => {
          limiteMostrar += 6;
          renderizarCatalogoActividades();
        };
      }
    } else {
      contenedorVerMas.style.display = "none";
    }
  }
}

/**
 * Modal de Detalle Completo de Actividad
 */
function inicializarModal() {
  const overlay = document.getElementById("modal-actividad");
  const btnCerrar = document.getElementById("btn-cerrar-modal");

  if (btnCerrar && overlay) {
    btnCerrar.addEventListener("click", cerrarModal);
  }

  if (overlay) {
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) cerrarModal();
    });
  }

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && overlay && overlay.classList.contains("activo")) {
      cerrarModal();
    }
  });

  // Botón para escuchar por voz dentro del modal
  const btnVoz = document.getElementById("btn-modal-voz");
  if (btnVoz) {
    btnVoz.addEventListener("click", hablarDetalleActividad);
  }
}

function abrirModalActividadPorId(actividadId) {
  const act = (window.TODAS_LAS_ACTIVIDADES || []).find(a => a.id === actividadId);
  if (act) {
    abrirModalActividad(act);
  }
}

function abrirModalActividad(act) {
  actividadActualEnModal = act;
  const overlay = document.getElementById("modal-actividad");
  if (!overlay) return;

  document.getElementById("modal-titulo").textContent = act.titulo;
  document.getElementById("modal-fecha").textContent = act.fechaTexto;
  document.getElementById("modal-horario").textContent = act.horarioTexto;
  document.getElementById("modal-lugar").textContent = `${act.lugar} (${act.direccion})`;
  document.getElementById("modal-descripcion").textContent = act.descripcion;
  document.getElementById("modal-categoria").textContent = window.obtenerNombreCategoria(act.categoriaPrincipal);

  // Recomendaciones
  const listaRec = document.getElementById("modal-recomendaciones");
  if (listaRec) {
    listaRec.innerHTML = (act.recomendaciones || []).map(r => `<li>${r}</li>`).join("");
  }

  // Atribución
  const elAtrib = document.getElementById("modal-atribucion");
  if (elAtrib) {
    const esOficial = act.fuenteTipo === "oficial" || act.esOficial || (!act.fuenteTipo && !act.fuente);
    if (esOficial) {
      elAtrib.innerHTML = `<strong>🏛️ Fuente Oficial:</strong> Actividad articulada con ${act.fuenteOficial || "Alcaldía Local de Rafael Uribe Uribe / Centro Día"}.`;
    } else {
      elAtrib.innerHTML = `<strong>⭐ Iniciativa Propia:</strong> Actividad organizada por la Red Comunitaria Ruta Dorada Quiroga.`;
    }
  }

  // Botón Ver Mapa
  const btnMapa = document.getElementById("btn-modal-mapa");
  if (btnMapa) {
    btnMapa.href = act.mapaUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(act.direccion || act.lugar)}`;
  }

  // Botón Agregar a Google Calendar
  const btnCal = document.getElementById("btn-modal-calendario");
  if (btnCal) {
    btnCal.href = window.generarEnlaceGoogleCalendar(act);
  }

  // Botón Descargar ICS
  const btnIcs = document.getElementById("btn-modal-ics");
  if (btnIcs) {
    btnIcs.onclick = (e) => {
      e.preventDefault();
      window.descargarArchivoICS(act);
    };
  }

  // Botón Información Oficial
  const btnOficial = document.getElementById("btn-modal-oficial");
  if (btnOficial) {
    btnOficial.href = act.urlOficial || "https://rafaeluribe.gobiernobogota.gov.co/calendario/ano";
  }

  overlay.classList.add("activo");
  document.body.style.overflow = "hidden";
  
  // Reiniciar estado del botón de voz al abrir cualquier actividad
  actualizarBotonVoz("detenido");
}

let estadoLecturaVoz = "detenido"; // "detenido", "reproduciendo"

function actualizarBotonVoz(estado) {
  estadoLecturaVoz = estado;
  const btnVoz = document.getElementById("btn-modal-voz");
  if (!btnVoz) return;

  if (estado === "reproduciendo") {
    btnVoz.classList.add("reproduciendo");
    btnVoz.innerHTML = `<span>⏹️</span> Detener lectura (Escuchando...)`;
    btnVoz.setAttribute("aria-label", "Detener lectura en voz alta");
  } else {
    btnVoz.classList.remove("reproduciendo");
    btnVoz.innerHTML = `<span>🔊</span> Escuchar detalles en voz alta (Audio)`;
    btnVoz.setAttribute("aria-label", "Escuchar detalles en voz alta");
  }
}

function detenerLecturaVoz() {
  if (window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
  actualizarBotonVoz("detenido");
}

function cerrarModal() {
  const overlay = document.getElementById("modal-actividad");
  if (overlay) {
    overlay.classList.remove("activo");
    document.body.style.overflow = "";
  }
  // Detener inmediatamente la síntesis de voz al cerrar el modal
  detenerLecturaVoz();
}

/**
 * Asistente de Voz Accesible (TTS - Web Speech API)
 * Lee en voz alta la actividad para personas mayores con dificultad de visión.
 * Soporta iniciar, detener y alternar estado visual interactivo.
 */
function hablarDetalleActividad() {
  if (!("speechSynthesis" in window)) {
    alert("Tu navegador o dispositivo no tiene habilitada la función de síntesis de voz.");
    return;
  }

  // Si ya se está reproduciendo, este clic detiene la lectura inmediatamente
  if (window.speechSynthesis.speaking || estadoLecturaVoz === "reproduciendo") {
    detenerLecturaVoz();
    return;
  }

  if (!actividadActualEnModal) return;

  // Cancelar cualquier locución anterior pendiente
  window.speechSynthesis.cancel();

  const act = actividadActualEnModal;
  const textoRecomendaciones = (act.recomendaciones && act.recomendaciones.length > 0)
    ? `Recomendaciones importantes: ${act.recomendaciones.join(". ")}.`
    : "";

  const textoParaHablar = `Actividad: ${act.titulo}. ` +
    `Fecha: ${act.fechaTexto}. ` +
    `Horario: ${act.horarioTexto}. ` +
    `Lugar: ${act.lugar}, en ${act.direccion}. ` +
    `Descripción: ${act.descripcion}. ` +
    textoRecomendaciones;

  const locucion = new SpeechSynthesisUtterance(textoParaHablar);

  // Buscar voces en español (priorizando español de Colombia es-CO)
  const voces = window.speechSynthesis.getVoices ? window.speechSynthesis.getVoices() : [];
  const vozEspanol = voces.find(v => v.lang === "es-CO") ||
                     voces.find(v => v.lang && (v.lang.startsWith("es-419") || v.lang.startsWith("es-"))) ||
                     voces.find(v => v.lang && v.lang.includes("es"));

  if (vozEspanol) {
    locucion.voice = vozEspanol;
    locucion.lang = vozEspanol.lang;
  } else {
    locucion.lang = "es-CO";
  }

  locucion.rate = 0.9; // Velocidad pausada y cómoda para adultos mayores
  locucion.pitch = 1.0;

  locucion.onstart = () => {
    actualizarBotonVoz("reproduciendo");
  };

  locucion.onend = () => {
    actualizarBotonVoz("detenido");
  };

  locucion.onerror = (e) => {
    // Si fue cancelado manualmente, no emitir alerta
    if (e.error !== "canceled" && e.error !== "interrupted") {
      console.warn("Error en locución TTS:", e);
    }
    actualizarBotonVoz("detenido");
  };

  actualizarBotonVoz("reproduciendo");
  window.speechSynthesis.speak(locucion);
}

// Cargar voces al inicio para asegurar disponibilidad inmediata
if (typeof window !== "undefined" && window.speechSynthesis && window.speechSynthesis.onvoiceschanged !== undefined) {
  window.speechSynthesis.onvoiceschanged = () => {
    if (window.speechSynthesis.getVoices) window.speechSynthesis.getVoices();
  };
}

// Exponer métodos globales
window.abrirModalActividadPorId = abrirModalActividadPorId;
window.abrirModalActividad = abrirModalActividad;
window.cerrarModal = cerrarModal;
window.detenerLecturaVoz = detenerLecturaVoz;
window.hablarDetalleActividad = hablarDetalleActividad;
window.actualizarBotonVoz = actualizarBotonVoz;
