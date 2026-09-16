/**
 * RUTA DORADA QUIROGA — Controlador del Dashboard Administrativo
 * Maneja llamadas autenticadas a la API del backend, cálculo de métricas,
 * tabla responsive, formulario de creación/edición y modal de confirmación.
 */

document.addEventListener("DOMContentLoaded", () => {
  // Verificar autenticación mediante clave de 6 dígitos
  if (!window.Auth || !window.Auth.estaAutenticado()) {
    window.location.replace("login.html");
    return;
  }

  // Elementos DOM
  const tbody = document.getElementById("tbody-actividades");
  const form = document.getElementById("form-actividad");
  const formTitulo = document.getElementById("form-titulo");
  const badgeEditando = document.getElementById("badge-editando");
  const btnCancelar = document.getElementById("btn-cancelar");
  const btnCerrarSesion = document.getElementById("btn-cerrar-sesion");
  const btnScrollNueva = document.getElementById("btn-scroll-nueva");
  const btnExportarJson = document.getElementById("btn-exportar-json");

  // Métricas DOM
  const statActivas = document.getElementById("stat-activas");
  const statProximas = document.getElementById("stat-proximas");
  const statMes = document.getElementById("stat-mes");

  // Modal confirmación eliminar
  const modalEliminar = document.getElementById("modal-confirmar-eliminar");
  const btnCancelarEliminar = document.getElementById("btn-cancelar-eliminar");
  const btnConfirmarEliminar = document.getElementById("btn-confirmar-eliminar");

  let idParaEliminar = null;
  let actividades = [];
  const LOCAL_STORAGE_KEY = "ruta_dorada_custom_actividades";
  const DELETED_STORAGE_KEY = "ruta_dorada_deleted_actividades";

  // Inicializar
  cargarActividades();

  // Cerrar sesión
  if (btnCerrarSesion) {
    btnCerrarSesion.addEventListener("click", () => {
      if (window.Auth) {
        window.Auth.cerrarSesion();
      } else {
        window.location.replace("login.html");
      }
    });
  }

  // Scroll a nueva actividad
  if (btnScrollNueva) {
    btnScrollNueva.addEventListener("click", () => {
      document.getElementById("nueva-actividad").scrollIntoView({ behavior: "smooth" });
      document.getElementById("act-titulo").focus();
    });
  }

  // Exportar archivo data/actividades.json para que los cambios se reflejen para todos los usuarios
  if (btnExportarJson) {
    btnExportarJson.addEventListener("click", () => {
      const localData = localStorage.getItem(LOCAL_STORAGE_KEY);
      const dataAExportar = localData ? JSON.parse(localData) : actividades.filter(a => !a.esOficial);
      const jsonStr = JSON.stringify(dataAExportar, null, 2);
      const blob = new Blob([jsonStr], { type: "application/json;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "actividades.json";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      alert("Se ha descargado 'actividades.json'. Guárdalo en la carpeta 'data/' para sincronizar los cambios de todos los usuarios al subirlo a GitHub.");
    });
  }

  function getApiUrl(endpoint) {
    const base = window.Auth && typeof window.Auth.getApiBaseUrl === "function" ? window.Auth.getApiBaseUrl() : "";
    return `${base}${endpoint}`;
  }

  // Cargar datos
  async function cargarActividades() {
    let customActs = [];
    let deletedIds = new Set();

    // 1. Obtener IDs eliminados de localStorage
    try {
      const delData = localStorage.getItem(DELETED_STORAGE_KEY);
      if (delData) {
        deletedIds = new Set(JSON.parse(delData));
      }
    } catch (e) {
      console.warn("Error leyendo eliminadas:", e);
    }

    // 2. Cargar actividades guardadas en localStorage (soporte local y GitHub)
    try {
      const localData = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (localData) {
        customActs = JSON.parse(localData);
      }
    } catch (e) {
      console.warn("Error leyendo actividades de localStorage:", e);
    }

    // 3. Consultar backend si está disponible; si no, consultar data/actividades.json
    let cargadasDelServidor = false;
    try {
      const resp = await fetch(getApiUrl("/api/actividades"));
      if (resp.ok) {
        const serverData = await resp.json();
        if (Array.isArray(serverData) && serverData.length > 0) {
          const map = new Map();
          serverData.forEach(d => map.set(d.id, d));
          customActs.forEach(d => { if (!map.has(d.id)) map.set(d.id, d); });
          customActs = Array.from(map.values());
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(customActs));
          cargadasDelServidor = true;
        }
      }
    } catch (err) {
      // Servidor backend offline
    }

    if (!cargadasDelServidor) {
      try {
        const respStatic = await fetch("data/actividades.json");
        if (respStatic.ok) {
          const staticData = await respStatic.json();
          if (Array.isArray(staticData) && staticData.length > 0) {
            const map = new Map();
            staticData.forEach(d => map.set(d.id, d));
            customActs.forEach(d => { if (!map.has(d.id)) map.set(d.id, d); });
            customActs = Array.from(map.values());
          }
        }
      } catch (e) {
        // Archivo estático offline
      }
    }

    // 4. Combinar con las actividades base de data.js
    const base = (window.TODAS_LAS_ACTIVIDADES || []);
    const idsCustom = new Set(customActs.map(d => d.id));
    actividades = [
      ...customActs.filter(a => !deletedIds.has(a.id)),
      ...base.filter(b => !idsCustom.has(b.id) && !deletedIds.has(b.id))
    ];

    actualizarMetricas();
    renderizarTabla();
  }

  function actualizarMetricas() {
    const hoyISO = "2026-09-14";
    const activas = actividades.filter(a => a.estado !== "inactiva" && a.activo !== false).length;
    const proximas = actividades.filter(a => (a.fecha >= hoyISO) && a.estado !== "inactiva" && a.activo !== false).length;
    const esteMes = actividades.filter(a => a.fecha && a.fecha.startsWith("2026-09")).length;

    if (statActivas) statActivas.textContent = activas;
    if (statProximas) statProximas.textContent = proximas;
    if (statMes) statMes.textContent = esteMes;
  }

  function renderizarTabla() {
    if (!tbody) return;
    tbody.innerHTML = "";

    if (actividades.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; padding: 25px;">No hay actividades registradas.</td></tr>`;
      return;
    }

    actividades.forEach(act => {
      const tr = document.createElement("tr");
      const esActiva = act.estado !== "inactiva" && act.activo !== false;
      const esOficial = act.fuenteTipo === "oficial" || act.esOficial;

      tr.innerHTML = `
        <td data-label="Actividad">
          <strong>${act.titulo}</strong>
        </td>
        <td data-label="Fecha">${act.fecha}</td>
        <td data-label="Hora">${act.horaInicio || "09:00"}</td>
        <td data-label="Lugar">${act.lugar}</td>
        <td data-label="Fuente">
          <span class="${esOficial ? 'badge-fuente-oficial' : 'badge-fuente-propia'}">
            ${esOficial ? '🏛️ Alcaldía' : '⭐ Ruta Dorada'}
          </span>
        </td>
        <td data-label="Estado">
          <span style="font-weight: 700; color: ${esActiva ? '#155724' : '#721c24'};">
            ${esActiva ? '● Activa' : '○ Inactiva'}
          </span>
        </td>
        <td data-label="Acciones">
          <div class="acciones-celda">
            <button class="btn-accion-sm editar" onclick="window.iniciarEdicion('${act.id}')">
              ✏️ Editar
            </button>
            <button class="btn-accion-sm eliminar" onclick="window.solicitarEliminacion('${act.id}')">
              🗑️ Eliminar
            </button>
          </div>
        </td>
      `;
      tbody.appendChild(tr);
    });
  }

  // Guardar actividad (Crear o Editar)
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const id = document.getElementById("act-id").value;
    const titulo = document.getElementById("act-titulo").value.trim();
    const fecha = document.getElementById("act-fecha").value;
    const categoria = document.getElementById("act-categoria").value;
    const horaInicio = document.getElementById("act-hora-inicio").value;
    const horaFin = document.getElementById("act-hora-fin").value;
    const lugar = document.getElementById("act-lugar").value.trim();
    const direccion = document.getElementById("act-direccion").value.trim() || lugar;
    const fuenteTipo = document.getElementById("act-fuente").value;
    const estado = document.getElementById("act-estado").value;
    const descripcion = document.getElementById("act-descripcion").value.trim();
    const imagen = document.getElementById("act-imagen").value.trim() || "IMG/fondo-inicio.jpg";
    const urlOficial = document.getElementById("act-url-oficial").value.trim();

    const actividadData = {
      id: id || `act-${Date.now()}`,
      titulo,
      fecha,
      fechaTexto: window.formatearFechaEspanol ? window.formatearFechaEspanol(fecha) : fecha,
      categoriaPrincipal: categoria,
      categorias: [categoria, "adultos-mayores"],
      horaInicio,
      horaFin,
      horarioTexto: `${horaInicio} a ${horaFin}`,
      lugar,
      direccion,
      fuenteTipo,
      esOficial: fuenteTipo === "oficial",
      fuenteOficial: fuenteTipo === "oficial" ? "Alcaldía Local de Rafael Uribe Uribe" : "Ruta Dorada Quiroga",
      estado,
      activo: estado === "activa",
      descripcion,
      imagen,
      urlOficial,
      recomendaciones: [
        "Llegar 10 minutos antes.",
        "Llevar ropa cómoda.",
        "Llevar hidratación."
      ]
    };

    // Guardar en localStorage inmediatamente (garantiza persistencia en GitHub Pages)
    try {
      let localGuardadas = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || "[]");
      const idx = localGuardadas.findIndex(a => a.id === actividadData.id);
      if (idx >= 0) {
        localGuardadas[idx] = actividadData;
      } else {
        localGuardadas.unshift(actividadData);
      }
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(localGuardadas));

      // Si estaba en la lista de eliminadas, removerlo
      let deletedIds = JSON.parse(localStorage.getItem(DELETED_STORAGE_KEY) || "[]");
      if (deletedIds.includes(actividadData.id)) {
        deletedIds = deletedIds.filter(item => item !== actividadData.id);
        localStorage.setItem(DELETED_STORAGE_KEY, JSON.stringify(deletedIds));
      }
    } catch (err) {
      console.warn("Error guardando en almacenamiento local:", err);
    }

    const headers = window.Auth ? window.Auth.getHeaders() : { "Content-Type": "application/json" };

    // Si hay backend, también enviar la petición al servidor
    try {
      if (id) {
        // PUT
        await fetch(getApiUrl(`/api/actividades/${id}`), {
          method: "PUT",
          headers,
          body: JSON.stringify(actividadData)
        });
      } else {
        // POST
        await fetch(getApiUrl("/api/actividades"), {
          method: "POST",
          headers,
          body: JSON.stringify(actividadData)
        });
      }
    } catch (err) {
      console.info("[Admin] Guardado local exitoso (servidor backend offline).");
    }

    limpiarFormulario();
    await cargarActividades();
    alert("¡Actividad guardada correctamente!");
  });

  // Editar
  window.iniciarEdicion = (id) => {
    const act = actividades.find(a => a.id === id);
    if (!act) return;

    document.getElementById("act-id").value = act.id;
    document.getElementById("act-titulo").value = act.titulo;
    document.getElementById("act-fecha").value = act.fecha;
    document.getElementById("act-categoria").value = act.categoriaPrincipal || "adultos-mayores";
    document.getElementById("act-hora-inicio").value = act.horaInicio || "09:00";
    document.getElementById("act-hora-fin").value = act.horaFin || "11:00";
    document.getElementById("act-lugar").value = act.lugar;
    document.getElementById("act-direccion").value = act.direccion || "";
    document.getElementById("act-fuente").value = act.fuenteTipo || (act.esOficial ? "oficial" : "ruta-dorada");
    document.getElementById("act-estado").value = act.estado || (act.activo !== false ? "activa" : "inactiva");
    document.getElementById("act-descripcion").value = act.descripcion;
    document.getElementById("act-imagen").value = act.imagen || "";
    document.getElementById("act-url-oficial").value = act.urlOficial || "";

    formTitulo.textContent = "✏️ Editar actividad";
    badgeEditando.style.display = "inline-block";
    btnCancelar.style.display = "inline-block";

    document.getElementById("nueva-actividad").scrollIntoView({ behavior: "smooth" });
  };

  btnCancelar.addEventListener("click", limpiarFormulario);

  function limpiarFormulario() {
    form.reset();
    document.getElementById("act-id").value = "";
    formTitulo.textContent = "➕ Nueva actividad";
    badgeEditando.style.display = "none";
    btnCancelar.style.display = "none";
  }

  // Eliminar con Modal de Confirmación
  window.solicitarEliminacion = (id) => {
    idParaEliminar = id;
    if (modalEliminar) {
      modalEliminar.classList.add("activo");
    }
  };

  if (btnCancelarEliminar) {
    btnCancelarEliminar.addEventListener("click", () => {
      idParaEliminar = null;
      modalEliminar.classList.remove("activo");
    });
  }

  if (btnConfirmarEliminar) {
    btnConfirmarEliminar.addEventListener("click", async () => {
      if (!idParaEliminar) return;

      // 1. Guardar ID en lista de eliminadas de localStorage
      try {
        let deletedIds = JSON.parse(localStorage.getItem(DELETED_STORAGE_KEY) || "[]");
        if (!deletedIds.includes(idParaEliminar)) {
          deletedIds.push(idParaEliminar);
          localStorage.setItem(DELETED_STORAGE_KEY, JSON.stringify(deletedIds));
        }

        // Remover de actividades personalizadas si estaba allí
        let localGuardadas = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || "[]");
        localGuardadas = localGuardadas.filter(a => a.id !== idParaEliminar);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(localGuardadas));
      } catch (err) {
        console.warn("Error eliminando en localStorage:", err);
      }

      const headers = window.Auth ? window.Auth.getHeaders() : { "Content-Type": "application/json" };
      try {
        await fetch(getApiUrl(`/api/actividades/${idParaEliminar}`), {
          method: "DELETE",
          headers
        });
      } catch (err) {
        console.info("[Admin] Eliminación local realizada (servidor backend offline).");
      }

      modalEliminar.classList.remove("activo");
      idParaEliminar = null;
      await cargarActividades();
    });
  }
});
