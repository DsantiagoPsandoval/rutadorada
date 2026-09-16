/**
 * RUTA DORADA QUIROGA — Módulo de Autenticación y Control de Acceso Privado
 * Sistema de acceso protegido mediante clave numérica de 6 dígitos.
 */

// =========================================================================
// CLAVE DE ACCESO DEL ADMINISTRADOR (EXACTAMENTE 6 DÍGITOS NUMÉRICOS)
// Modifica este valor directamente aquí cuando desees cambiar la clave:
// =========================================================================
const ADMIN_PASSWORD = "202612";

const AUTH_STORAGE_KEY = "ruta_dorada_admin_token";
const AUTH_TIME_KEY = "ruta_dorada_admin_login_time";

const Auth = {
  // Exponer la clave para referencia directa
  ADMIN_PASSWORD: ADMIN_PASSWORD,

  /**
   * Valida que la clave contenga exactamente 6 dígitos numéricos
   */
  validarFormatoPin(pin) {
    if (typeof pin !== "string" && typeof pin !== "number") return false;
    const str = String(pin).trim();
    return /^\d{6}$/.test(str);
  },

  /**
   * Intenta autenticar al usuario con la clave de 6 números
   */
  async login(pin) {
    const pinStr = String(pin || "").trim();

    // 1. Validar que tenga exactamente 6 dígitos
    if (!this.validarFormatoPin(pinStr)) {
      return {
        success: false,
        error: "La clave debe tener exactamente 6 dígitos numéricos."
      };
    }

    // 2. Validar que coincida con la clave maestra definida en el código
    if (pinStr !== this.ADMIN_PASSWORD) {
      return {
        success: false,
        error: "Clave de administración incorrecta. Acceso no válido."
      };
    }

    // 3. Generar token de sesión y registrar hora de acceso
    const token = "auth_pin_" + btoa(`${pinStr}_${Date.now()}`);
    sessionStorage.setItem(AUTH_STORAGE_KEY, token);
    sessionStorage.setItem(AUTH_TIME_KEY, Date.now().toString());

    // 4. Si el backend está disponible, autenticar también contra el servidor
    try {
      await fetch(`${this.getApiBaseUrl()}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: pinStr })
      });
    } catch {
      // Backend offline: la sesión local es suficiente para entornos estáticos
    }

    return {
      success: true,
      token
    };
  },

  /**
   * Comprueba si existe una sesión válida y activa
   */
  estaAutenticado() {
    const token = sessionStorage.getItem(AUTH_STORAGE_KEY);
    if (!token) return false;

    // Verificar que el token comience con el prefijo válido
    if (!token.startsWith("auth_pin_")) return false;

    // Control de expiración de sesión (24 horas)
    const loginTime = parseInt(sessionStorage.getItem(AUTH_TIME_KEY) || "0", 10);
    const ahora = Date.now();
    const duracion24Horas = 24 * 60 * 60 * 1000;
    if (ahora - loginTime > duracion24Horas) {
      this.cerrarSesion();
      return false;
    }

    return true;
  },

  /**
   * Guardia de Rutas: Bloquea inmediatamente el panel si no hay sesión autorizada
   * Redirige forzosamente a login.html
   */
  protegerRutaAdmin() {
    if (!this.estaAutenticado()) {
      window.location.replace("login.html");
      return false;
    }
    return true;
  },

  /**
   * Cierra la sesión activa y redirige al formulario de acceso
   */
  cerrarSesion() {
    sessionStorage.removeItem(AUTH_STORAGE_KEY);
    sessionStorage.removeItem(AUTH_TIME_KEY);
    window.location.replace("login.html");
  },

  /**
   * Encabezados HTTP con autorización para llamadas a la API
   */
  getHeaders() {
    const token = sessionStorage.getItem(AUTH_STORAGE_KEY) || "";
    return {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
      "X-Admin-Pin": this.ADMIN_PASSWORD
    };
  },

  /**
   * URL base del backend
   */
  getApiBaseUrl() {
    if (window.location.protocol === "http:" || window.location.protocol === "https:") {
      return "";
    }
    return "http://localhost:8080";
  }
};

// Exponer globalmente
if (typeof window !== "undefined") {
  window.Auth = Auth;
  window.ADMIN_PASSWORD = ADMIN_PASSWORD;
}
