// src/components/Register.jsx
import { useState } from "react";
import "./register.css";
import { api } from "../../lib/api";
// 👈 ajusta ruta si tu archivo está en /components/Register/register.jsx

export default function Register({ onSuccess, onBack }) {
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    email: "",
    password: "",
    confirm: "",
    acepta: true,
  });
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
    setErrors((er) => ({ ...er, [name]: "" }));
    setFeedback("");
  };

  const validate = () => {
    const e = {};
    if (!form.nombre.trim()) e.nombre = "Ingresa tu nombre";
    if (!form.apellido.trim()) e.apellido = "Ingresa tu apellido";

    if (!form.email.trim()) e.email = "Ingresa tu correo";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "Formato de correo inválido";

    if (!form.password) e.password = "Crea una contraseña";
    else if (form.password.length < 6) e.password = "Mínimo 6 caracteres";

    if (!form.confirm) e.confirm = "Confirma tu contraseña";
    if (form.password && form.confirm && form.password !== form.confirm)
      e.confirm = "Las contraseñas no coinciden";

    if (!form.acepta) e.acepta = "Debes aceptar las políticas de uso";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const v = validate();
    if (Object.keys(v).length) {
      setErrors(v);
      return;
    }
    setBusy(true);
    setFeedback("");

    try {
      // 1) Crear usuario en Laravel
await api.register({
  nombre: form.nombre,
  apellido: form.apellido,
  email: form.email,
  password: form.password,
});

      // 2) Login para obtener token
      const out = await api.login(form.email, form.password); // { token: '...' }

      setFeedback("✅ Cuenta creada con éxito");
      onSuccess?.(form.email, out.token); // 👈 importante: pasa token al App.jsx
    } catch (err) {
      setFeedback(`❌ ${err.message}`);
    } finally {
      setBusy(false);
    }
  };

  const seguridad = getPasswordScore(form.password);

  return (
    <div className="register-wrapper">
      <div className="register-card">
        <header className="register-header">
          <div className="brand">
            <span className="brand-badge">SR</span>
            <div className="brand-text">
              <h1>SistRecursos</h1>
              <p>Crear cuenta · Sistema de Intercambio de Recursos</p>
            </div>
          </div>
        </header>

        <form className="register-form" onSubmit={handleSubmit} noValidate>
          <div className="grid-2">
            <label className="field">
              <span>Nombre</span>
              <input
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                placeholder="Andrea"
                autoComplete="given-name"
              />
              {errors.nombre && <small className="error">{errors.nombre}</small>}
            </label>

            <label className="field">
              <span>Apellido</span>
              <input
                name="apellido"
                value={form.apellido}
                onChange={handleChange}
                placeholder="Navia"
                autoComplete="family-name"
              />
              {errors.apellido && <small className="error">{errors.apellido}</small>}
            </label>
          </div>

          <label className="field">
            <span>Correo</span>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="nombre.apellido@ejemplo.cl"
              autoComplete="email"
            />
            {errors.email && <small className="error">{errors.email}</small>}
          </label>

          <label className="field">
            <span>Contraseña</span>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              autoComplete="new-password"
            />
            {errors.password && <small className="error">{errors.password}</small>}

            {form.password && (
              <>
                <div className={`pwd-meter lvl-${seguridad.level}`}>
                  <div style={{ width: `${seguridad.percent}%` }} />
                </div>
                <small className="hint">Seguridad: {seguridad.label}</small>
              </>
            )}
          </label>

          <label className="field">
            <span>Confirmar contraseña</span>
            <input
              type="password"
              name="confirm"
              value={form.confirm}
              onChange={handleChange}
              placeholder="••••••••"
              autoComplete="new-password"
            />
          </label>
          {errors.confirm && <small className="error">{errors.confirm}</small>}

          <div className="row-between">
            <label className="remember">
              <input
                type="checkbox"
                name="acepta"
                checked={form.acepta}
                onChange={handleChange}
              />
              <span>Acepto las políticas de uso y comunidad académica</span>
            </label>
          </div>
          {errors.acepta && <small className="error">{errors.acepta}</small>}

          <button className="primary-btn" type="submit" disabled={busy}>
            {busy ? "Creando cuenta..." : "Crear cuenta"}
          </button>

          {feedback && <div className="feedback">{feedback}</div>}

          <button type="button" className="link-btn" onClick={onBack}>
            ¿Ya tienes cuenta? Inicia sesión
          </button>
        </form>
      </div>
    </div>
  );
}

/** Medidor simple de seguridad de contraseña */
function getPasswordScore(pwd) {
  let score = 0;
  if (pwd.length >= 6) score += 25;
  if (/[A-Z]/.test(pwd)) score += 20;
  if (/[a-z]/.test(pwd)) score += 20;
  if (/\d/.test(pwd)) score += 20;
  if (/[^A-Za-z0-9]/.test(pwd)) score += 15;

  const percent = Math.min(score, 100);
  let label = "Débil", level = 1;
  if (percent >= 75) { label = "Fuerte"; level = 3; }
  else if (percent >= 50) { label = "Media"; level = 2; }

  return { percent, label, level };
}
