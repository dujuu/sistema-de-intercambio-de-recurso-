import { useState } from "react";
import "./register.css";

export default function Register({ onSuccess, onBack }) {
  const [form, setForm] = useState({
    nombre: "",
    correo: "",
    carrera: "",
    semestre: "",
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
    if (!form.correo.trim()) e.correo = "Ingresa tu correo";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.correo)) e.correo = "Correo inválido";
    if (!form.carrera) e.carrera = "Selecciona tu carrera";
    if (!form.semestre) e.semestre = "Selecciona tu semestre";
    if (!form.password) e.password = "Crea una contraseña";
    else if (form.password.length < 6) e.password = "Mínimo 6 caracteres";
    if (!form.confirm) e.confirm = "Confirma tu contraseña";
    if (form.password && form.confirm && form.password !== form.confirm) e.confirm = "No coincide";
    if (!form.acepta) e.acepta = "Debes aceptar las políticas";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const v = validate();
    if (Object.keys(v).length) { setErrors(v); return; }

    setBusy(true);

    // 🔸 Payload SIN IDs ni rol (backend los genera automáticamente)
    const payload = {
      nombre: form.nombre.trim(),
      correo: form.correo.trim(),
      carrera: form.carrera,
      semestre: Number(form.semestre),
      contrasena: form.password,
    };

    // TODO: POST /api/estudiantes con 'payload'
    await new Promise((r) => setTimeout(r, 700)); // demo

    // Guardamos datos básicos de sesión (sin id/rol)
    localStorage.setItem(
      "sistrecursos_user",
      JSON.stringify({
        nombre: payload.nombre,
        correo: payload.correo,
        carrera: payload.carrera,
        semestre: payload.semestre,
      })
    );

    setBusy(false);
    setFeedback("Cuenta creada con éxito");
    onSuccess?.(payload.correo);
  };

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
          <label className="field">
            <span>Nombre completo</span>
            <input
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              placeholder="Andrea Navia"
              autoComplete="name"
            />
            {errors.nombre && <small className="error">{errors.nombre}</small>}
          </label>

          <label className="field">
            <span>Correo</span>
            <input
              type="email"
              name="correo"
              value={form.correo}
              onChange={handleChange}
              placeholder="nombre.apellido@alumnos.uta.cl"
              autoComplete="email"
            />
            {errors.correo && <small className="error">{errors.correo}</small>}
          </label>

          <div className="grid-2">
            <label className="field">
              <span>Carrera</span>
              <select name="carrera" value={form.carrera} onChange={handleChange}>
                <option value="">Selecciona…</option>
                <option value="Ing. Informática">Ing. Informática</option>
                <option value="Ing. Civil">Ing. Civil</option>
                <option value="Ing. Industrial">Ing. Industrial</option>
                <option value="Arquitectura">Arquitectura</option>
                <option value="Otra">Otra</option>
              </select>
              {errors.carrera && <small className="error">{errors.carrera}</small>}
            </label>

            <label className="field">
              <span>Semestre</span>
              <select name="semestre" value={form.semestre} onChange={handleChange}>
                <option value="">Selecciona…</option>
                {Array.from({ length: 12 }).map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>
              {errors.semestre && <small className="error">{errors.semestre}</small>}
            </label>
          </div>

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
            {errors.confirm && <small className="error">{errors.confirm}</small>}
          </label>

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
