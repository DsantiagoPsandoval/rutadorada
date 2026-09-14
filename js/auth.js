/**
 * RUTA DORADA QUIROGA — Módulo de Autenticación y Protección de Rutas
 * Manejo seguro de sesiones, verificación de tokens criptográficos y guardia de rutas.
 */

const AUTH_STORAGE_KEY = "ruta_dorada_token";
const USER_STORAGE_KEY = "ruta_dorada_usuario";

const Auth = {
  /**
   * Intenta iniciar sesión contra la API del backend
   */
  async login(username, password) {
    try {
      const resp = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });

      const data = await resp.json();

      if (resp.ok && data.success && data.token) {
        sessionStorage.setItem(AUTH_STORAGE_KEY, data.token);
        sessionStorage.setItem(USER_STORAGE_KEY, JSON.stringify(data.user || { username }));
        return { success: true, user: data.user };
      }

      return {
        success: false,
        error: data.error || "Usuario o contraseña incorrectos."
      };
    } catch (err) {
      console.error("Error de conexión durante login:", err);
      return {
        success: false,
        error: "No fue posible conectar con el servidor de autenticación."
      };
    }
  },

  /**
   * Obtiene el token de sesión almacenado
   */
  getToken() {
    return sessionStorage.getItem(AUTH_STORAGE_KEY);
  },

  /**
   * Obtiene el usuario en sesión
   */
  getUsuario() {
    try {
      return JSON.parse(sessionStorage.getItem(USER_STORAGE_KEY) || "{}");
    } catch {
      return null;
    }
  },

  /**
   * Verifica activamente con el servidor si la sesión es válida
   */
  async verificarSesion() {
    const token = this.getToken();
    if (!token) return false;

    try {
      const resp = await fetch("/api/auth/verify", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      const data = await resp.json();
      return resp.ok && data.valid;
    } catch (err) {
      console.warn("No se pudo verificar la sesión con el servidor:", err);
      return false;
    }
  },

  /**
   * Guardia de Rutas: Protege el panel administrativo
   * Si no hay sesión válida, bloquea la vista y redirige inmediatamente al login
   */
  async protegerRutaAdmin() {
    const token = this.getToken();
    if (!token) {
      window.location.replace("/login.html");
      return;
    }

    const esValida = await this.verificarSesion();
    if (!esValida) {
      this.cerrarSesion();
    }
  },

  /**
   * Cierra la sesión activa y redirige al login
   */
  cerrarSesion() {
    sessionStorage.removeItem(AUTH_STORAGE_KEY);
    sessionStorage.removeItem(USER_STORAGE_KEY);
    window.location.replace("/login.html");
  },

  /**
   * Retorna encabezados HTTP con autorización para llamadas API
   */
  getHeaders() {
    const token = this.getToken();
    return {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token || ""}`
    };
  }
};

// Exponer globalmente
if (typeof window !== "undefined") {
  window.Auth = Auth;
}
