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

  // Modal
  const [modalAbierto, setModalAbierto] = useState(false);
  const [nombreNueva, setNombreNueva] = useState("");
  const [descripcionNueva, setDescripcionNueva] = useState("");
  const [loadingCrear, setLoadingCrear] = useState(false);

  useEffect(() => {
    const fetchComunidades = async () => {
      try {
        const response = await axios.get<Comunidad[]>(
          "http://localhost:3000/api/communities",
          token ? { headers: { Authorization: `Bearer ${token}` } } : {}
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
    if (typeof logout === "function") logout();
    navigate("/");
  };

  const crearComunidad = async () => {
    if (!nombreNueva.trim()) return;
    if (!token) { navigate("/login"); return; }
    setLoadingCrear(true);
    try {
      const res = await axios.post<Comunidad>(
        "http://localhost:3000/api/communities",
        { nombre: nombreNueva, descripcion: descripcionNueva },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setComunidades((prev) => [res.data, ...prev]);
      setModalAbierto(false);
      setNombreNueva("");
      setDescripcionNueva("");
    } catch (error) {
      console.error("Error al crear comunidad:", error);
    } finally {
      setLoadingCrear(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-900 text-white p-8">

      {/* Cabecera */}
      <div className="flex items-center justify-between mb-6">
        {usuario ? (
          <>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-lg font-bold shadow-lg">
                {usuario.nombre_usuario.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="font-semibold">{usuario.nombre_usuario}</div>
                <div className="text-sm text-gray-400">{usuario.email}</div>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setModalAbierto(true)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-md text-white font-semibold transition"
              >
                + Crear comunidad
              </button>
              <button
                onClick={manejarCerrarSesion}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 rounded-md text-white font-semibold transition"
              >
                Cerrar sesión
              </button>
            </div>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold">MyCommunity</h2>
            <div className="flex gap-2">
              <Link
                to="/login"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-md text-white font-semibold transition"
              >
                Iniciar sesión
              </Link>
              <Link
                to="/registro"
                className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded-md text-white font-semibold transition"
              >
                Registrarse
              </Link>
            </div>
          </>
        )}
      </div>

      {/* Comunidades */}
      <div>
        <h3 className="text-xl font-bold mb-4">{usuario ? "Tus Comunidades" : "Comunidades"}</h3>

        <input
          type="text"
          placeholder="Buscar comunidad..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-3 mb-6 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <div className="grid gap-4">
          {comunidadesFiltradas.length > 0 ? (
            comunidadesFiltradas.map((comunidad) => (
              <div
                key={comunidad.id}
                onClick={() => navigate(`/communities/${comunidad.id}`)}
                className="bg-gray-800 p-4 rounded-xl hover:bg-gray-700 transition cursor-pointer shadow"
              >
                <h4 className="font-semibold text-lg">{comunidad.nombre}</h4>
                <p className="text-gray-400 text-sm">{comunidad.descripcion}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">
              No se encontraron comunidades con ese nombre.
            </p>
          )}
        </div>
      </div>

      {/* Modal crear comunidad */}
      {modalAbierto && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h2 className="text-xl font-bold mb-4">Nueva comunidad</h2>

            <input
              type="text"
              placeholder="Nombre de la comunidad"
              value={nombreNueva}
              onChange={(e) => setNombreNueva(e.target.value)}
              className="w-full p-3 mb-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <textarea
              rows={3}
              placeholder="Descripción (opcional)"
              value={descripcionNueva}
              onChange={(e) => setDescripcionNueva(e.target.value)}
              className="w-full p-3 mb-4 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setModalAbierto(false);
                  setNombreNueva("");
                  setDescripcionNueva("");
                }}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded-md text-white font-semibold transition"
              >
                Cancelar
              </button>
              <button
                onClick={crearComunidad}
                disabled={loadingCrear || !nombreNueva.trim()}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 rounded-md text-white font-semibold transition"
              >
                {loadingCrear ? "Creando..." : "Crear"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default Inicio;