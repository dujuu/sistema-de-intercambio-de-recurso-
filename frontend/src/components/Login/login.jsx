// src/components/Login.jsx
import { useState } from "react";
import { Link } from "react-router-dom"; // ← si ya usas router
import "./login.css";

export default function Login({ onSuccess }) {
  const [form, setForm] = useState({ email: "", password: "", remember: true });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState("");

  const validate = () => {
    const e = {};
    if (!form.email.trim()) e.email = "Ingresa tu correo institucional";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "Formato de correo inválido";

    if (!form.password.trim()) e.password = "Ingresa tu contraseña";
    else if (form.password.length < 6) e.password = "Mínimo 6 caracteres";
    return e;
  };

  const handleChange = (ev) => {
    const { name, value, type, checked } = ev.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
    setErrors((e) => ({ ...e, [name]: "" }));
    setFeedback("");
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (isSubmitting) return; // evita doble submit

    const e = validate();
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }

    setIsSubmitting(true);
    setFeedback("");

    try {
      // 🔐 Simulación de autenticación (reemplaza por tu llamada a Laravel)
      await new Promise((r) => setTimeout(r, 900));
      const ok = form.email && form.password;

      if (ok) {
        if (form.remember) localStorage.setItem("sistrecursos_user", form.email);
        setFeedback("Autenticación exitosa");
        onSuccess?.(form.email);
      } else {
        setFeedback("Autenticación fallida. Verifica tus credenciales.");
      }
    } catch (err) {
      setFeedback("Ocurrió un error inesperado. Intenta nuevamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <header className="login-header">
          <div className="brand">
            <span className="brand-badge">SR</span>
            <div className="brand-text">
              <h1>SistRecursos</h1>
              <p>Sistema de Intercambio de Recursos Educativos</p>
            </div>
          </div>
        </header>

        <form className="login-form" onSubmit={handleSubmit} noValidate>
          <label className="field">
            <span>Correo electrónico</span>
            <input
              type="email"
              name="email"
              placeholder="nombre.apellido@alumnos.uta.cl"
              value={form.email}
              onChange={handleChange}
              aria-invalid={!!errors.email}
              aria-describedby="email-error"
              autoComplete="email"
              autoFocus
              required
            />
            {errors.email && (
              <small id="email-error" className="error">
                {errors.email}
              </small>
            )}
          </label>

          <label className="field">
            <span>Contraseña</span>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              aria-invalid={!!errors.password}
              aria-describedby="password-error"
              autoComplete="current-password"
              required
            />
            {errors.password && (
              <small id="password-error" className="error">
                {errors.password}
              </small>
            )}
          </label>

          <div className="row-between">
            <label className="remember">
              <input
                type="checkbox"
                name="remember"
                checked={form.remember}
                onChange={handleChange}
              />
              <span>Recordarme</span>
            </label>

            <button
              type="button"
              className="link-btn"
              onClick={() =>
                setFeedback("Te enviamos un enlace de recuperación (demo)")
              }
              disabled={isSubmitting}
            >
              ¿Olvidaste tu contraseña?
            </button>
          </div>

          <button className="primary-btn" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Ingresando..." : "Iniciar sesión"}
          </button>

          {/* Región accesible para feedback */}
          {feedback && (
            <div className="feedback" aria-live="polite">
              {feedback}
            </div>
          )}

          {/* Enlace a registro con Router */}
          <p className="legal">
            ¿No tienes cuenta?{" "}
            <Link className="link-btn" to="/register">
              Crear cuenta
            </Link>
          </p>

          <p className="legal">
            Al continuar aceptas las políticas de uso y comunidad académica.
          </p>
        </form>
      </div>
    </div>
  );
}
