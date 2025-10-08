import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Login from "./components/Login/login.jsx";
import Register from "./components/Register/register.jsx";
import "./App.css";

export default function App() {
  const navigate = useNavigate();
  const user = localStorage.getItem("sistrecursos_user"); // simple "auth" demo

  return (
    <Routes>
      {/* raíz: redirige según estado */}
      <Route
        path="/"
        element={<Navigate to={user ? "/home" : "/login"} replace />}
      />

      {/* Login */}
      <Route
        path="/login"
        element={
          <Login
            onSuccess={(email) => {
              localStorage.setItem("sistrecursos_user", email);
              navigate("/home", { replace: true });
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
              navigate("/home", { replace: true });
            }}
            onBack={() => navigate("/login")}
          />
        }
      />

      {/* Home protegida */}
      <Route
        path="/home"
        element={
          user ? (
            <main className="logged">
              <section className="logged-card">
                <h2>Bienvenido(a)</h2>
                <p>
                  Has iniciado sesión como <strong>{user}</strong>.
                </p>
                <button
                  className="primary-btn"
                  onClick={() => {
                    localStorage.removeItem("sistrecursos_user");
                    navigate("/login", { replace: true });
                  }}
                >
                  Cerrar sesión
                </button>
              </section>
            </main>
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


