import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/authContext";

function Login() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
     setLoading(true);

    try {
      const response = await axios.post(
        "https://proyectoconnodeyexpress-production.up.railway.app/api/auth/login",
        { email, password }
      );

      const { token, usuario } = response.data;

      // 🔹 Ahora usamos el contexto
      login(token, usuario);

      navigate("/");
    } catch (error) {
      setError("Credenciales incorrectas");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-white mb-6 text-center">
          Iniciar Sesión
        </h1>

        {/* 👈 agregado, igual que en registro */}
        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-300 text-sm p-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Contraseña"
            className="w-full p-3 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 transition p-3 rounded-lg text-white font-semibold"
              >
                {loading ? "Ingresando..." : "Ingresar"}
              </button>
            </form>

        <p className="mt-6 text-center text-gray-400 text-sm">
          ¿No tenés cuenta?{" "}
          <Link to="/registro" className="text-blue-400 hover:text-blue-300 transition">
            Registrate
          </Link>
        </p>
      </div>
    </div>
  );
}


export default Login;