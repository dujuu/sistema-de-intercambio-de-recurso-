/* src/components/SubirRecurso/subirRecurso.jsx */
import { useRef, useState, useEffect } from "react";
import "../Login/login.css";
import "./subir-recurso.css";
import { api } from "../../lib/api"; // 👈 usa tu helper que pega al backend

function SrNavbar() {
  const noop = (e) => e.preventDefault();
  return (
    <header className="sr-navbar">
      <div className="sr-nav-inner">
        <div className="sr-brand">
          <span className="brand-badge">SR</span>
          <div className="brand-text">
            <strong>SistRecursos</strong>
            <small>Sistema de Intercambio</small>
          </div>
        </div>
        <nav className="sr-nav-actions">
          <a href="#" onClick={noop}>Inicio</a>
          <a href="#" onClick={noop}>Recursos</a>
          <a href="#" onClick={noop} className="active">Subir</a>
          <a href="#" onClick={noop}>Mi cuenta</a>
        </nav>
      </div>
    </header>
  );
}

export default function SubirRecurso() {

  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const inputRef = useRef(null);

  const [asigs, setAsigs] = useState([]);
  const [temas, setTemas] = useState([]);

  const [form, setForm] = useState({
    titulo: "",
    descripcion: "",
    categoria: "",   // se mapea a tipo_archivo
    etiquetas: "",   // opcional: lo añadimos a la descripción
    ruta: "",        // URL (Drive, etc.)
    asignatura_id: "",
    tema_id: "",
  });

  const [errors, setErrors] = useState({});
  const [feedback, setFeedback] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Límites y tipos aceptados SOLO para la vista previa local
  const MAX_BYTES = 20 * 1024 * 1024; 
  const ACCEPTED = [
    "application/pdf","application/zip",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "image/png","image/jpeg"
  ];
  const isPdf = file?.type === "application/pdf";
  const isImage = ["image/png", "image/jpeg"].includes(file?.type);

  // Cargar catálogo desde la API
  useEffect(() => {
    api.asignaturas().then(setAsigs).catch(e => setFeedback("❌ "+e.message));
  }, []);
  useEffect(() => {
    if (form.asignatura_id) {
      api.temasByAsignatura(form.asignatura_id)
        .then(setTemas)
        .catch(e => setFeedback("❌ "+e.message));
    } else {
      setTemas([]);
      setForm((f) => ({ ...f, tema_id: "" }));
    }
  }, [form.asignatura_id]);

  // Vista previa local
  useEffect(() => {
    if (!file) { setPreviewUrl(""); return; }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const formatBytes = (b) =>
    b >= 1048576 ? (b/1048576).toFixed(2)+" MB" : Math.max(1,Math.round(b/1024))+" KB";

  const handleFile = (f) => {
    setFeedback("");
    const e = {};
    if (!f) { setFile(null); return; }
    if (f.size > MAX_BYTES) e.file = "Archivo demasiado grande (máx. 20 MB).";
    if (!ACCEPTED.includes(f.type)) e.file = "Tipo no permitido (PDF, DOCX, PPTX, XLSX, ZIP, PNG, JPG).";
    setErrors(e);
    if (Object.keys(e).length) return;
    setFile(f);
  };

  const onDrop = (ev) => { ev.preventDefault(); handleFile(ev.dataTransfer.files?.[0]); };
  const onDragOver = (ev) => ev.preventDefault();

  // ✅ Validación para la API actual (JSON)
  const validate = () => {
    const e = {};
    if (!form.titulo.trim()) e.titulo = "Ingresa un título.";
    if (!form.categoria) e.categoria = "Selecciona una categoría.";
    if (!form.asignatura_id) e.asignatura_id = "Selecciona una asignatura.";
    if (!form.tema_id) e.tema_id = "Selecciona un tema.";
    if (!form.ruta.trim()) e.ruta = "Pega la URL del recurso (Drive/WEB).";
    return e;
  };

  const submit = async (ev) => {
    ev.preventDefault();
    if (isSaving) return;

    const v = validate();
    if (Object.keys(v).length) { setErrors(v); return; }

    setIsSaving(true);
    setFeedback("");
    try {
      // Mapeo UI -> API
      const tipo_archivo = form.categoria || "otros";
      const descripcion = form.etiquetas
        ? `${form.descripcion || ""}\n\nEtiquetas: ${form.etiquetas}`
        : form.descripcion || null;

      const payload = {
        titulo: form.titulo,
        descripcion,
        tipo_archivo,
        ruta: form.ruta, // URL externa (Drive/WEB). El archivo NO se sube en esta versión.
        asignatura_id: Number(form.asignatura_id),
        tema_id: Number(form.tema_id),
      };

      await api.crearRecurso(payload); // 👈 pega a /api/recursos con token
      setFeedback("✅ Recurso creado correctamente.");
      setErrors({});
      setFile(null);
      setPreviewUrl("");
      if (inputRef.current) inputRef.current.value = "";
      setForm({
        titulo: "",
        descripcion: "",
        categoria: "",
        etiquetas: "",
        ruta: "",
        asignatura_id: "",
        tema_id: "",
      });
    } catch (err) {
      setFeedback("❌ " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="subir-page">
      <SrNavbar />

      <main className="upload-shell">
        <div className="login-card upload-card">
          <header className="login-header">
            <div className="brand">
              <span className="brand-badge">SR</span>
              <div className="brand-text">
                <h1>SistRecursos</h1>
                <p>Subir recurso · Sistema de Intercambio de Recursos Educativos</p>
              </div>
            </div>
          </header>

          {/* Layout 2 columnas: izquierda formulario, derecha preview */}
          <div className="upload-layout">
            <form className="login-form upload-left" onSubmit={submit} noValidate>
              {/* Dropzone (solo vista previa local) */}
              <div
                className={`dropzone ${errors.file ? "dz-error" : ""} ${file ? "dz-hasfile" : ""}`}
                onDrop={onDrop} onDragOver={onDragOver}
                onClick={() => inputRef.current?.click()} role="button" tabIndex={0}
              >
                {!file ? (
                  <>
                    <p className="dz-title">Arrastra y suelta tu archivo aquí</p>
                    <p className="dz-sub">o haz clic para seleccionarlo</p>
                    <p className="dz-accept">PDF · DOCX · PPTX · XLSX · ZIP · PNG · JPG (máx. 20 MB)</p>
                  </>
                ) : (
                  <div className="dz-fileinfo">
                    <div className="file-name">{file.name}</div>
                    <div className="file-meta">{file.type || "—"} · {formatBytes(file.size)}</div>
                  </div>
                )}
                <input
                  ref={inputRef}
                  type="file"
                  className="dz-input"
                  onChange={(e) => handleFile(e.target.files?.[0])}
                  accept=".pdf,.zip,.docx,.pptx,.xlsx,.png,.jpg,.jpeg"
                />
              </div>
              {errors.file && <small className="error">{errors.file}</small>}

              {/* Metadatos que van a la API */}
              <label className="field">
                <span>Título del recurso</span>
                <input
                  name="titulo"
                  value={form.titulo}
                  onChange={(e) => setForm({ ...form, titulo: e.target.value })}
                  placeholder="Ej: Apuntes de Cálculo III - Integrales múltiples"
                />
                {errors.titulo && <small className="error">{errors.titulo}</small>}
              </label>

              <label className="field">
                <span>Descripción</span>
                <textarea
                  className="textarea" rows={3}
                  value={form.descripcion}
                  onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                  placeholder="Breve contexto del material, curso, unidad, profesor, etc."
                />
              </label>

              <div className="grid-2">
                <label className="field">
                  <span>Categoría</span>
                  <select
                    value={form.categoria}
                    onChange={(e) => setForm({ ...form, categoria: e.target.value })}
                  >
                    <option value="">Selecciona…</option>
                    <option value="pdf">PDF</option>
                    <option value="docx">DOCX</option>
                    <option value="pptx">PPTX</option>
                    <option value="xlsx">XLSX</option>
                    <option value="img">Imagen</option>
                    <option value="link">Link</option>
                    <option value="otros">Otros</option>
                  </select>
                  {errors.categoria && <small className="error">{errors.categoria}</small>}
                </label>

                <label className="field">
                  <span>Etiquetas</span>
                  <input
                    value={form.etiquetas}
                    onChange={(e) => setForm({ ...form, etiquetas: e.target.value })}
                    placeholder="separa-con-comas, p.ej.: calculo, unidad-3, uta"
                  />
                </label>
              </div>

              <div className="grid-2">
                <label className="field">
                  <span>Asignatura</span>
                  <select
                    value={form.asignatura_id}
                    onChange={(e) => setForm({ ...form, asignatura_id: e.target.value, tema_id: "" })}
                    required
                  >
                    <option value="">Selecciona…</option>
                    {asigs.map((a) => (
                      <option key={a.id} value={a.id}>{a.nombre_asignatura}</option>
                    ))}
                  </select>
                  {errors.asignatura_id && <small className="error">{errors.asignatura_id}</small>}
                </label>

                <label className="field">
                  <span>Tema</span>
                  <select
                    value={form.tema_id}
                    onChange={(e) => setForm({ ...form, tema_id: e.target.value })}
                    required
                    disabled={!form.asignatura_id}
                  >
                    <option value="">Selecciona…</option>
                    {temas.map((t) => (
                      <option key={t.id} value={t.id}>{t.nombre_tema}</option>
                    ))}
                  </select>
                  {errors.tema_id && <small className="error">{errors.tema_id}</small>}
                </label>
              </div>

              <label className="field">
                <span>URL del recurso (ruta)</span>
                <input
                  value={form.ruta}
                  onChange={(e) => setForm({ ...form, ruta: e.target.value })}
                  placeholder="https://drive.google.com/… o enlace público"
                />
                {errors.ruta && <small className="error">{errors.ruta}</small>}
              </label>

              <div className="row-between" style={{ marginTop: 12 }}>
                <button
                  type="button"
                  className="link-btn"
                  onClick={() => {
                    setFile(null);
                    setFeedback("");
                    setErrors((prev) => ({ ...prev, file: "" }));
                    inputRef.current && (inputRef.current.value = "");
                  }}
                >
                  Quitar archivo
                </button>
                <button className="primary-btn" type="submit" disabled={isSaving}>
                  {isSaving ? "Guardando…" : "Guardar recurso"}
                </button>
              </div>

              

              {feedback && <div className="feedback" aria-live="polite">{feedback}</div>}
            </form>

            {/* Panel de preview */}
            <aside className="upload-right">
              <div className="preview-pane">
                {!file && (
                  <div className="preview-empty">
                    <span>Vista previa</span>
                    <small>Selecciona un archivo para previsualizarlo aquí.</small>
                  </div>
                )}

                {file && isPdf && previewUrl && (
                  <iframe className="pdf-frame" src={previewUrl} title="Vista previa PDF" />
                )}

                {file && isImage && previewUrl && (
                  <img className="img-preview" src={previewUrl} alt="Vista previa" />
                )}

                {file && !isPdf && !isImage && (
                  <div className="preview-generic">
                    <p>No hay vista previa para este tipo de archivo.</p>
                    <a className="link-btn" href={previewUrl} target="_blank" rel="noreferrer">
                      Abrir en pestaña nueva
                    </a>
                  </div>
                )}
              </div>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}
