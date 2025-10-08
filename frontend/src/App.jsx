// src/App.jsx
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Login from "./components/Login/login.jsx";
import Register from "./components/Register/register.jsx";
import SubirRecurso from "./components/SubirRecurso/subirRecurso.jsx";
import "./App.css";

export default function App() {
  const navigate = useNavigate();
  const user = localStorage.getItem("sistrecursos_user"); // demo auth

  return (
    <Routes>
      {/* raíz: si hay sesión → /subir, si no → /login */}
      <Route
        path="/"
        element={<Navigate to={user ? "/subir" : "/login"} replace />}
      />

      {/* Login */}
      <Route
        path="/login"
        element={
          <Login
            onSuccess={(email) => {
              localStorage.setItem("sistrecursos_user", email);
              navigate("/subir", { replace: true });
            }}
            onGoRegister={() => navigate("/register")}
          />
        }
      />

      {/* Registro */}
      <Route
        path="/register"
        element={
          <Register
            onSuccess={(email) => {
              localStorage.setItem("sistrecursos_user", email);
              navigate("/subir", { replace: true });
            }}
            onBack={() => navigate("/login")}
          />
        }
      />

      {/* Subir Recurso (ruta protegida) */}
      <Route
        path="/subir"
        element={
          user ? (
            <SubirRecurso />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      {/* catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
