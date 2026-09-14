/**
 * RUTA DORADA QUIROGA — Controlador del Dashboard Administrativo
 * Maneja llamadas autenticadas a la API del backend, cálculo de métricas,
 * tabla responsive, formulario de creación/edición y modal de confirmación.
 */

document.addEventListener("DOMContentLoaded", () => {
  // Verificar autenticación
  if (window.Auth) {
    window.Auth.protegerRutaAdmin();
  }

  // Elementos DOM
  const tbody = document.getElementById("tbody-actividades");
  const form = document.getElementById("form-actividad");
  const formTitulo = document.getElementById("form-titulo");
  const badgeEditando = document.getElementById("badge-editando");
  const btnCancelar = document.getElementById("btn-cancelar");
  const btnCerrarSesion = document.getElementById("btn-cerrar-sesion");
  const btnScrollNueva = document.getElementById("btn-scroll-nueva");

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

  // Inicializar
  cargarActividades();

  // Cerrar sesión
  if (btnCerrarSesion) {
    btnCerrarSesion.addEventListener("click", () => {
      if (window.Auth) {
        window.Auth.cerrarSesion();
      } else {
        window.location.replace("/login.html");
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

  // Cargar datos
  async function cargarActividades() {
    try {
      const resp = await fetch("/api/actividades");
      if (resp.ok) {
        const dataCustom = await resp.json();
        // Combinar oficiales con las personalizadas
        const base = (window.TODAS_LAS_ACTIVIDADES || []).slice(0, 20);
        // Filtrar repetidas
        const idsCustom = new Set(dataCustom.map(d => d.id));
        actividades = [...dataCustom, ...base.filter(b => !idsCustom.has(b.id))];
      } else {
        actividades = (window.TODAS_LAS_ACTIVIDADES || []).slice(0, 25);
      }
    } catch {
      actividades = (window.TODAS_LAS_ACTIVIDADES || []).slice(0, 25);
    }

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

    const headers = window.Auth ? window.Auth.getHeaders() : { "Content-Type": "application/json" };

    try {
      if (id) {
        // PUT
        await fetch(`/api/actividades/${id}`, {
          method: "PUT",
          headers,
          body: JSON.stringify(actividadData)
        });
      } else {
        // POST
        await fetch("/api/actividades", {
          method: "POST",
          headers,
          body: JSON.stringify(actividadData)
        });
      }
    } catch (err) {
      console.warn("Guardado local fallback:", err);
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

      const headers = window.Auth ? window.Auth.getHeaders() : { "Content-Type": "application/json" };
      try {
        await fetch(`/api/actividades/${idParaEliminar}`, {
          method: "DELETE",
          headers
        });
      } catch (err) {
        console.warn("Fallback de eliminación:", err);
      }

      modalEliminar.classList.remove("activo");
      idParaEliminar = null;
      await cargarActividades();
    });
  }
});
