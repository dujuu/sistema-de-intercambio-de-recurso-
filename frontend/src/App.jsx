// src/App.jsx
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Login from "./components/Login/login.jsx";
import Register from "./components/Register/register.jsx";
import SubirRecurso from "./components/SubirRecurso/subirRecurso.jsx";
import "./App.css";
import { api, setToken } from "./lib/api";

export default function App() {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("sistrecursos_user");
    return raw ? JSON.parse(raw) : null;
  });

  // Al cargar, si hay token en localStorage -> cargarlo al helper y validar
  useEffect(() => {
    const token = localStorage.getItem("sistrecursos_token");
    if (!token) return;

    // 1) MUY IMPORTANTE: cargar el token al helper antes de hacer me()
    setToken(token);

    api
      .me()
      .then((data) => {
        // Asegura forma consistente (depende de tu backend: {id,name,email} o {user:{...}})
        const u = data?.user ?? data;
        if (u) {
          setUser(u);
          // opcional: normaliza localStorage si venía solo {email}
          localStorage.setItem("sistrecursos_user", JSON.stringify(u));
        }
      })
      .catch(() => {
        // si el token expiró o es inválido, limpia y manda a login
        localStorage.removeItem("sistrecursos_user");
        localStorage.removeItem("sistrecursos_token");
        setToken(null);
        setUser(null);
        navigate("/login", { replace: true });
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // no pongas navigate en deps para no re-ejecutar

  const handleLogout = async () => {
    try {
      await api.logout();
    } catch (e) {
      console.warn("Logout local:", e?.message || e);
    }
    localStorage.removeItem("sistrecursos_user");
    localStorage.removeItem("sistrecursos_token");
    setToken(null);
    setUser(null);
    navigate("/login", { replace: true });
  };

  return (
    <>
      <header
        style={{
          background: "#011322ff",
          padding: "8px 16px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h3 style={{ margin: 0 }}></h3>
        {user && (
          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <span>Hola, {user.name || user.email}</span>
            <button onClick={handleLogout}>Cerrar sesión</button>
          </div>
        )}
      </header>

      <Routes>
        <Route
          path="/"
          element={<Navigate to={user ? "/subir" : "/login"} replace />}
        />

        <Route
          path="/login"
          element={
            <Login
              onSuccess={async (email, token, userInfo) => {
                // guarda token + usuario
                localStorage.setItem("sistrecursos_token", token);
                setToken(token);
                const u = userInfo ?? { email };
                localStorage.setItem("sistrecursos_user", JSON.stringify(u));
                setUser(u);
                navigate("/subir", { replace: true });
              }}
              onGoRegister={() => navigate("/register")}
            />
          }
        />

        <Route
          path="/register"
          element={
            <Register
              onSuccess={async (email, token, userInfo) => {
                localStorage.setItem("sistrecursos_token", token);
                setToken(token);
                const u = userInfo ?? { email };
                localStorage.setItem("sistrecursos_user", JSON.stringify(u));
                setUser(u);
                navigate("/subir", { replace: true });
              }}
              onBack={() => navigate("/login")}
            />
          }
        />

        <Route
          path="/subir"
          element={user ? <SubirRecurso /> : <Navigate to="/login" replace />}
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
