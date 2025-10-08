import { useRef, useState, useEffect } from "react";
import "../Login/login.css";        // reusa el look base (card/colores)
import "./subir-recurso.css";       // estilos propios de esta vista

/* ------- Navbar simulado (no navega) ------- */
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
  const [meta, setMeta] = useState({ titulo: "", descripcion: "", categoria: "", etiquetas: "" });
  const [errors, setErrors] = useState({});
  const [feedback, setFeedback] = useState("");
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const xhrRef = useRef(null);
  const inputRef = useRef(null);

  const MAX_BYTES = 20 * 1024 * 1024; // 20MB
  const ACCEPTED = [
    "application/pdf","application/zip",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "image/png","image/jpeg"
  ];

  const isPdf = file?.type === "application/pdf";
  const isImage = ["image/png", "image/jpeg"].includes(file?.type);

  // URL blob para previsualizar (y liberar memoria al cambiar/eliminar)
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

  const validate = () => {
    const e = {};
    if (!file) e.file = "Selecciona un archivo.";
    if (!meta.titulo.trim()) e.titulo = "Ingresa un título.";
    if (!meta.categoria) e.categoria = "Selecciona una categoría.";
    return e;
  };

  const submit = (ev) => {
    ev.preventDefault();
    if (isUploading) return;
    const v = validate();
    if (Object.keys(v).length) { setErrors(v); return; }

    setIsUploading(true);
    setProgress(0);
    setFeedback("");

    const fd = new FormData();
    fd.append("file", file);
    fd.append("titulo", meta.titulo);
    fd.append("descripcion", meta.descripcion);
    fd.append("categoria", meta.categoria);
    fd.append("etiquetas", meta.etiquetas);

    // 🔗 Cambia por tu endpoint real de Laravel
    const xhr = new XMLHttpRequest();
    xhrRef.current = xhr;
    xhr.open("POST", "/api/recursos/subir");

    xhr.upload.onprogress = (e) => e.lengthComputable && setProgress(Math.round((e.loaded/e.total)*100));
    xhr.onload = () => {
      setIsUploading(false);
      if (xhr.status >= 200 && xhr.status < 300) {
        setFeedback("✅ Recurso subido correctamente.");
        setFile(null);
        setMeta({ titulo: "", descripcion: "", categoria: "", etiquetas: "" });
        setProgress(0);
        if (inputRef.current) inputRef.current.value = "";
      } else setFeedback("❌ Error al subir. Intenta nuevamente.");
    };
    xhr.onerror = () => { setIsUploading(false); setFeedback("❌ Error de red. Revisa tu conexión."); };

    xhr.send(fd);
  };

  const cancel = () => {
    xhrRef.current?.abort();
    setIsUploading(false);
    setProgress(0);
    setFeedback("⚠️ Carga cancelada.");
  };

  return (
    /* ⬇️ usamos el wrapper de página y el navbar, NO .login-wrapper */
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
              {/* Dropzone */}
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

              {/* Metadatos */}
              <label className="field">
                <span>Título del recurso</span>
                <input
                  name="titulo"
                  value={meta.titulo}
                  onChange={(e) => setMeta({ ...meta, titulo: e.target.value })}
                  placeholder="Ej: Apuntes de Cálculo III - Integrales múltiples"
                />
                {errors.titulo && <small className="error">{errors.titulo}</small>}
              </label>

              <label className="field">
                <span>Descripción</span>
                <textarea
                  className="textarea" rows={3}
                  value={meta.descripcion}
                  onChange={(e) => setMeta({ ...meta, descripcion: e.target.value })}
                  placeholder="Breve contexto del material, curso, unidad, profesor, etc."
                />
              </label>

              <div className="grid-2">
                <label className="field">
                  <span>Categoría</span>
                  <select
                    value={meta.categoria}
                    onChange={(e) => setMeta({ ...meta, categoria: e.target.value })}
                  >
                    <option value="">Selecciona…</option>
                    <option value="apuntes">Apuntes</option>
                    <option value="presentacion">Presentación</option>
                    <option value="tarea">Tarea/Informe</option>
                    <option value="examen">Examen/Guía</option>
                    <option value="libro">Libro/Capítulo</option>
                    <option value="otros">Otros</option>
                  </select>
                  {errors.categoria && <small className="error">{errors.categoria}</small>}
                </label>

                <label className="field">
                  <span>Etiquetas</span>
                  <input
                    value={meta.etiquetas}
                    onChange={(e) => setMeta({ ...meta, etiquetas: e.target.value })}
                    placeholder="separa-con-comas, p.ej.: calculo, unidad-3, uta"
                  />
                </label>
              </div>

              {/* Progreso */}
              {isUploading && (
                <div className="progress">
                  <div className="progress-track">
                    <div className="progress-bar" style={{ width: `${progress}%` }} />
                  </div>
                  <div className="progress-info">{progress}%</div>
                </div>
              )}

              {/* Acciones */}
              <div className="row-between">
                {!isUploading ? (
                  <>
                    <button type="button" className="link-btn"
                            onClick={() => { setFile(null); setFeedback(""); setErrors({ ...errors, file: "" }); inputRef.current && (inputRef.current.value=""); }}>
                      Quitar archivo
                    </button>
                    <button className="primary-btn" type="submit">Subir recurso</button>
                  </>
                ) : (
                  <>
                    <span />
                    <button type="button" className="primary-btn" onClick={cancel}>Cancelar</button>
                  </>
                )}
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
                  <>
                    <iframe className="pdf-frame" src={previewUrl} title="Vista previa PDF" />
                    {/* El visor nativo del navegador trae controles de páginas/zoom */}
                  </>
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
