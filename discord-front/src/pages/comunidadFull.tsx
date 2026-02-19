import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";


interface Usuario {
  id: number;
  nombre_usuario: string;
}

interface Comentario {
  id: number;
  contenido: string;
  usuario: Usuario;
}

interface Publicacion {
  id: number;
  contenido: string;
  usuario: Usuario;
  comentarios: Comentario[];
}

interface ComunidadFullData {
  id: number;
  nombre: string;
  publicaciones: Publicacion[];
}

const ComunidadFull = () => {
  const { id } = useParams<{ id: string }>();
  const [comunidad, setComunidad] = useState<ComunidadFullData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchComunidad = async () => {
      try {
       const res = await axios.get<ComunidadFullData>(
        `http://localhost:3000/api/communities/${id}/full`
        );
        console.log(res.data);
        setComunidad(res.data);
      } catch (err) {
        console.error(err);
        setError("Error al cargar la comunidad");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchComunidad();
  }, [id]);

  if (loading) return <p className="text-center mt-8">Cargando comunidad...</p>;
  if (error) return <p className="text-center mt-8 text-red-500">{error}</p>;
  if (!comunidad) return <p className="text-center mt-8">No se encontró la comunidad</p>;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8 max-w-3xl mx-auto">
      {/* Nombre de la comunidad */}
      <h1 className="text-3xl font-bold mb-6">{comunidad.nombre}</h1>

      {/* Botón para volver */}
      <Link
        to="/inicio"
        className="inline-block mb-6 px-4 py-2 bg-blue-600 rounded hover:bg-blue-500 transition"
      >
        ← Volver a comunidades
      </Link>

      {/* Publicaciones */}
      {comunidad.publicaciones.length > 0 ? (
        comunidad.publicaciones.map((pub) => (
          <div key={pub.id} className="mb-6 p-4 bg-gray-800 rounded shadow">
            <p className="font-semibold">{pub.usuario.nombre_usuario} publicó:</p>
            <p className="mt-2">{pub.contenido}</p>

            {/* Comentarios */}
            <div className="mt-4 ml-4">
              <h3 className="font-semibold mb-2">Comentarios:</h3>
              {pub.comentarios.length > 0 ? (
                pub.comentarios.map((com) => (
                  <div key={com.id} className="mb-2">
                    <span className="font-medium">{com.usuario.nombre_usuario}:</span>{" "}
                    <span>{com.contenido}</span>
                  </div>
                ))
              ) : (
                <p className="text-gray-400">Sin comentarios</p>
              )}
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-400">No hay publicaciones aún en esta comunidad.</p>
      )}
    </div>
  );
};

export default ComunidadFull;