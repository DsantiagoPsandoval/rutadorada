/**
 * RUTA DORADA QUIROGA — Calendario Interactivo Accesible
 * Vistas de calendario en español, navegación de meses y panel interactivo del día.
 */

(function () {
  const MESES_ES = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  let fechaActual = new Date(2026, 8, 14); // Iniciar en Septiembre 14, 2026 (fecha de referencia actual)
  let diaSeleccionadoISO = "2026-09-14";

  function initCalendario() {
    const btnPrev = document.getElementById("btn-cal-prev");
    const btnNext = document.getElementById("btn-cal-next");

    if (btnPrev) {
      btnPrev.addEventListener("click", () => {
        fechaActual.setMonth(fechaActual.getMonth() - 1);
        renderCalendario();
      });
    }

    if (btnNext) {
      btnNext.addEventListener("click", () => {
        fechaActual.setMonth(fechaActual.getMonth() + 1);
        renderCalendario();
      });
    }

    renderCalendario();
    renderPanelEventosDia(diaSeleccionadoISO);
  }

  function renderCalendario() {
    const mesTitulo = document.getElementById("cal-mes-titulo");
    const grillaDias = document.getElementById("cal-grilla-dias");

    if (!mesTitulo || !grillaDias) return;

    const anio = fechaActual.getFullYear();
    const mes = fechaActual.getMonth();

    mesTitulo.textContent = `${MESES_ES[mes]} ${anio}`;
    grillaDias.innerHTML = "";

    // Primer día del mes: 0 (domingo) a 6 (sábado)
    // Convertimos para que lunes sea el índice 0: (getDay() + 6) % 7
    const primerDia = new Date(anio, mes, 1);
    const primerDiaSemana = (primerDia.getDay() + 6) % 7;
    const ultimoDiaMes = new Date(anio, mes + 1, 0).getDate();
    const ultimoDiaMesAnterior = new Date(anio, mes, 0).getDate();

    // Días del mes anterior (relleno)
    for (let i = primerDiaSemana - 1; i >= 0; i--) {
      const celda = document.createElement("div");
      celda.className = "dia-celda otro-mes";
      celda.textContent = ultimoDiaMesAnterior - i;
      celda.setAttribute("aria-hidden", "true");
      grillaDias.appendChild(celda);
    }

    // Días del mes en curso
    const hoy = new Date();
    const hoyStr = `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}-${String(hoy.getDate()).padStart(2, '0')}`;

    for (let d = 1; d <= ultimoDiaMes; d++) {
      const mesStr = String(mes + 1).padStart(2, '0');
      const diaStr = String(d).padStart(2, '0');
      const fechaISO = `${anio}-${mesStr}-${diaStr}`;

      const celda = document.createElement("div");
      celda.className = "dia-celda";
      celda.setAttribute("role", "button");
      celda.setAttribute("tabindex", "0");
      celda.setAttribute("aria-label", `Día ${d} de ${MESES_ES[mes]}`);

      // Comprobar si hay actividades este día
      const actividadesDia = (window.TODAS_LAS_ACTIVIDADES || []).filter(a => a.fecha === fechaISO);
      
      if (actividadesDia.length > 0) {
        celda.classList.add("tiene-actividades");
        const punto = document.createElement("span");
        punto.className = "punto-actividad";
        punto.title = `${actividadesDia.length} actividad(es)`;
        celda.appendChild(punto);
      }

      // Marcar hoy
      if (fechaISO === hoyStr || (anio === 2026 && mes === 8 && d === 14)) {
        celda.classList.add("hoy");
      }

      // Marcar seleccionado
      if (fechaISO === diaSeleccionadoISO) {
        celda.classList.add("seleccionado");
      }

      const numSpan = document.createElement("span");
      numSpan.className = "numero-dia";
      numSpan.textContent = d;
      celda.prepend(numSpan);

      // Evento de clic
      celda.addEventListener("click", () => {
        seleccionarDia(fechaISO);
      });

      // Evento de teclado
      celda.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          seleccionarDia(fechaISO);
        }
      });

      grillaDias.appendChild(celda);
    }
  }

  function seleccionarDia(fechaISO) {
    diaSeleccionadoISO = fechaISO;
    const celdas = document.querySelectorAll(".dia-celda");
    celdas.forEach(c => c.classList.remove("seleccionado"));

    // Renderizar de nuevo para refrescar clases
    renderCalendario();
    renderPanelEventosDia(fechaISO);
  }

  function renderPanelEventosDia(fechaISO) {
    const fechaTextoEl = document.getElementById("panel-dia-fecha");
    const listaEventosEl = document.getElementById("panel-dia-lista");

    if (!fechaTextoEl || !listaEventosEl) return;

    fechaTextoEl.textContent = window.formatearFechaEspanol ? window.formatearFechaEspanol(fechaISO) : fechaISO;
    listaEventosEl.innerHTML = "";

    const actividadesDia = (window.TODAS_LAS_ACTIVIDADES || []).filter(a => a.fecha === fechaISO);

    if (actividadesDia.length === 0) {
      listaEventosEl.innerHTML = `
        <div class="sin-eventos-aviso">
          <p style="font-size: 2rem; margin-bottom: 10px;">☀️</p>
          <p><strong>No hay actividades registradas para este día.</strong></p>
          <p style="font-size: 0.95rem; margin-top: 6px;">¡Selecciona otro día en el calendario o consulta las actividades destacadas de la semana!</p>
        </div>
      `;
      return;
    }

    actividadesDia.forEach(act => {
      const item = document.createElement("div");
      item.className = "item-evento-dia";
      item.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
          <span class="badge-categoria" style="font-size: 0.8rem; padding: 3px 8px;">${act.icono || "📌"} ${window.obtenerNombreCategoria(act.categoriaPrincipal)}</span>
          <span style="font-size: 0.85rem; color: var(--color-dorado-oscuro); font-weight: 700;">${act.horaInicio}</span>
        </div>
        <h4 class="item-evento-dia-titulo">${act.titulo}</h4>
        <div class="item-evento-dia-meta">
          <span>🕐 <strong>Horario:</strong> ${act.horarioTexto}</span>
          <span>📍 <strong>Lugar:</strong> ${act.lugar}</span>
        </div>
        <button class="btn-ver-detalle-mini" onclick="window.abrirModalActividadPorId('${act.id}')">
          <span>👁️</span> Ver detalles completos
        </button>
      `;
      listaEventosEl.appendChild(item);
    });
  }

  // Exponer métodos globalmente
  window.initCalendario = initCalendario;
  window.seleccionarDia = seleccionarDia;
  window.renderCalendario = renderCalendario;
})();
