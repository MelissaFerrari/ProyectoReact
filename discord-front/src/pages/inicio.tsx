 /*`Bearer ${token}`*/

import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authContext";

interface Comunidad {
  id: number;
  nombre: string;
  descripcion: string;
}

function Inicio() {
  const { usuario, token, logout } = useContext(AuthContext);

  const navigate = useNavigate();

  const [comunidades, setComunidades] = useState<Comunidad[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    const fetchComunidades = async () => {
      if (!token) return;

      try {
        const response = await axios.get<Comunidad[]>(
          "http://localhost:3000/api/communities",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setComunidades(response.data);
      } catch (error) {
        console.error("Error al traer comunidades:", error);
      }
    };

    fetchComunidades();
  }, [token]);

  const comunidadesFiltradas = comunidades.filter((comunidad) =>
    comunidad.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const manejarCerrarSesion = () => {
    // Usar el logout del AuthContext
    if (typeof logout === "function") logout();
    navigate("/", { replace: true });
  };

  if (!usuario) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <h2>No estás autenticado</h2>
      </div>
    );
  }

return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      {/* Cabecera con usuario y botón de cerrar sesión */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-lg font-bold shadow-lg">
            {usuario.nombre_usuario.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="font-semibold">{usuario.nombre_usuario}</div>
            <div className="text-sm text-gray-400">{usuario.email}</div>
          </div>
        </div>
        <button
          onClick={manejarCerrarSesion}
          className="px-4 py-2 bg-red-600 hover:bg-red-500 rounded-md text-white font-semibold"
        >
          Cerrar sesión
        </button>
      </div>

      {/* Comunidades */}
      <div>
        <h3 className="text-xl font-bold mb-4">Tus Comunidades</h3>

        {/* Buscador */}
        <input
          type="text"
          placeholder="Buscar comunidad..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-3 mb-6 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Grid de comunidades */}
        <div className="grid gap-4">
          {comunidadesFiltradas.length > 0 ? (
            comunidadesFiltradas.map((comunidad) => (
              <Link
                key={comunidad.id}
                to={`/communities/${comunidad.id}`}
                className="bg-gray-800 p-4 rounded-xl hover:bg-gray-700 transition cursor-pointer shadow block"
              >
                <h4 className="font-semibold text-lg">{comunidad.nombre}</h4>
                <p className="text-gray-400 text-sm">{comunidad.descripcion}</p>
              </Link>
            ))
          ) : (
            <p className="text-gray-500">
              No se encontraron comunidades con ese nombre.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}



export default Inicio;