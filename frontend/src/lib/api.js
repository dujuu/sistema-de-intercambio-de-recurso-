// src/lib/api.js
//
// Helper central para consumir el backend Laravel desde React (con fetch)

let token = localStorage.getItem("sistrecursos_token") || null;

/**
 * Establece o limpia el token global.
 */
export function setToken(t) {
  token = t || null;
  if (token) localStorage.setItem("sistrecursos_token", token);
  else localStorage.removeItem("sistrecursos_token");
}

/**
 * Llama al backend Laravel (por defecto en /api/*).
 * Incluye manejo de JSON, errores y token.
 */
async function request(
  path,
  { method = "GET", body, auth = false, isForm = false } = {}
) {
  const headers = {};

  if (!isForm) headers["Content-Type"] = "application/json";
  if (auth && token) headers["Authorization"] = `Bearer ${token}`;

  let res;
  try {
    res = await fetch(`/api${path}`, {
      method,
      headers,
      body: isForm ? body : body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new Error("No se pudo conectar con el servidor backend.");
  }

  // Intenta parsear JSON
  let data = null;
  try {
    data = await res.json();
  } catch {
    // Si no hay JSON, deja data = null
  }

  // Si el backend devolvió error HTTP
  if (!res.ok) {
    const msg = (data && (data.message || data.error)) || `Error HTTP ${res.status}`;
    throw new Error(msg);
  }

  return data;
}

// -----------------------------------------------------------------------------
// API pública exportada
// -----------------------------------------------------------------------------
export const api = {
  /**
   * Endpoint de salud para verificar conexión backend.
   */
  health: () => request("/health"),

  // -------------------------
  // Autenticación
  // -------------------------
  /**
   * Registra usuario mapeando el contrato del formulario
   * { nombre, apellido, email, password } -> { name, email, password, password_confirmation }
   */
  register: ({ nombre, apellido, email, password }) =>
    request("/auth/register", {
      method: "POST",
      body: {
        name: `${nombre ?? ""} ${apellido ?? ""}`.trim(),
        email,
        password,
        password_confirmation: password, // requerido por la regla 'confirmed'
      },
    }),

  login: async (email, password) => {
    const out = await request("/auth/login", {
      method: "POST",
      body: { email, password },
    });
    if (!out?.token) throw new Error("Respuesta inválida del servidor");
    setToken(out.token);
    return out; // { token, user? }
  },

  me: () => request("/auth/me", { auth: true }),

  logout: async () => {
    try {
      await request("/auth/logout", { method: "POST", auth: true });
    } catch {
      // Ignora si el token ya expiró
    } finally {
      setToken(null);
    }
  },

  // -------------------------
  // Catálogo
  // -------------------------
  asignaturas: () => request("/asignaturas"),
  temasByAsignatura: (id) => request(`/asignaturas/${id}/temas`),

  // -------------------------
  // Recursos
  // -------------------------
  listarRecursos: () => request("/recursos"),
  verRecurso: (id) => request(`/recursos/${id}`),
  crearRecurso: (payload) =>
    request("/recursos", { method: "POST", body: payload, auth: true }),
};
