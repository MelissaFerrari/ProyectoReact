import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/authContext";

interface Comunidad {
  id: number;
  nombre: string;
  descripcion: string;
}

function Inicio() {
  const { usuario, token } = useContext(AuthContext);
  const [comunidades, setComunidades] = useState<Comunidad[]>([]);

useEffect(() => {
  const fetchComunidades = async () => {
    try {
      const response = await axios.get(
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

  if (token) {
    fetchComunidades();
  }
}, [token]);

  if (!usuario) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <h2>No estás autenticado</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      {/* Usuario */}
      <div className="flex flex-col items-center mb-10">
        <div className="w-32 h-32 rounded-full bg-blue-600 flex items-center justify-center text-4xl font-bold shadow-lg">
          {usuario.nombre_usuario.charAt(0).toUpperCase()}
        </div>

        <h2 className="mt-4 text-2xl font-semibold">
          {usuario.nombre_usuario}
        </h2>

        <p className="text-gray-400">{usuario.email}</p>
      </div>

      {/* Comunidades */}
      <div>
        <h3 className="text-xl font-bold mb-4">Tus Comunidades</h3>

        <div className="grid gap-4">
          {comunidades.length > 0 ? (
            comunidades.map((comunidad) => (
              <div
                key={comunidad.id}
                className="bg-gray-800 p-4 rounded-xl hover:bg-gray-700 transition cursor-pointer shadow"
              >
                <h4 className="font-semibold text-lg">
                  {comunidad.nombre}
                </h4>
                <p className="text-gray-400 text-sm">
                  {comunidad.descripcion}
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">
              No perteneces a ninguna comunidad todavía.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Inicio;