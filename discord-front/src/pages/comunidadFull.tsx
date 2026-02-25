// ComunidadFull.tsx
import { useEffect, useState, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/authContext";

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

const API = "https://proyectoconnodeyexpress-production.up.railway.app/api";

const ComunidadFull = () => {
  const { id } = useParams<{ id: string }>();
  const { usuario, token } = useContext(AuthContext);
  const navigate = useNavigate();

  const [comunidad, setComunidad] = useState<ComunidadFullData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estado para nueva publicación
  const [nuevaPub, setNuevaPub] = useState("");
  const [loadingPub, setLoadingPub] = useState(false);

  // Estado para nuevos comentarios: un input por publicación
  const [nuevosComs, setNuevosComs] = useState<Record<number, string>>({});

  const authHeader = { Authorization: `Bearer ${token}` };

  // ── Fetch inicial ──────────────────────────────────────────────
  useEffect(() => {
    const fetchComunidad = async () => {
      try {
        const res = await axios.get<ComunidadFullData>(
          `${API}/communities/${id}/full`
        );
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

  // ── Crear publicación ──────────────────────────────────────────
  const crearPublicacion = async () => {
    if (!nuevaPub.trim()) return;
    if (!usuario) { navigate("/login"); return; }
    setLoadingPub(true);
    try {
      const res = await axios.post<Publicacion>(
        `${API}/posts`,
        { contenido: nuevaPub, comunidad_id: Number(id), usuario_id: usuario.id },
        { headers: authHeader }
      );
      // El back devuelve el post sin nested usuario, lo completamos
      const pubCompleta: Publicacion = {
        ...res.data,
        usuario: { id: usuario.id, nombre_usuario: usuario.nombre_usuario },
        comentarios: [],
      };
      setComunidad((prev) =>
        prev
          ? { ...prev, publicaciones: [pubCompleta, ...prev.publicaciones] }
          : prev
      );
      setNuevaPub("");
    } catch (err) {
      console.error("Error al crear publicación:", err);
    } finally {
      setLoadingPub(false);
    }
  };

  // ── Eliminar publicación ───────────────────────────────────────
  const eliminarPublicacion = async (pubId: number) => {
    if (!confirm("¿Eliminar esta publicación?")) return;
    try {
      await axios.delete(`${API}/posts/${pubId}`, { headers: authHeader });
      setComunidad((prev) =>
        prev
          ? {
              ...prev,
              publicaciones: prev.publicaciones.filter((p) => p.id !== pubId),
            }
          : prev
      );
    } catch (err) {
      console.error("Error al eliminar publicación:", err);
    }
  };

  // ── Crear comentario ───────────────────────────────────────────
  const crearComentario = async (pubId: number) => {
    const contenido = nuevosComs[pubId]?.trim();
    if (!contenido) return;
    if (!usuario) { navigate("/login"); return; }
    try {
      const res = await axios.post<Comentario>(
        `${API}/comments`,
        { contenido, publicacion_id: pubId, usuario_id: usuario.id },
        { headers: authHeader }
      );
      const comCompleto: Comentario = {
        ...res.data,
        usuario: { id: usuario.id, nombre_usuario: usuario.nombre_usuario },
      };
      setComunidad((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          publicaciones: prev.publicaciones.map((p) =>
            p.id === pubId
              ? { ...p, comentarios: [...p.comentarios, comCompleto] }
              : p
          ),
        };
      });
      setNuevosComs((prev) => ({ ...prev, [pubId]: "" }));
    } catch (err) {
      console.error("Error al crear comentario:", err);
    }
  };

  // ── Eliminar comentario ────────────────────────────────────────
  const eliminarComentario = async (pubId: number, comId: number) => {
    if (!confirm("¿Eliminar este comentario?")) return;
    try {
      await axios.delete(`${API}/comments/${comId}`, { headers: authHeader });
      setComunidad((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          publicaciones: prev.publicaciones.map((p) =>
            p.id === pubId
              ? {
                  ...p,
                  comentarios: p.comentarios.filter((c) => c.id !== comId),
                }
              : p
          ),
        };
      });
    } catch (err) {
      console.error("Error al eliminar comentario:", err);
    }
  };

  // ── Render ─────────────────────────────────────────────────────
  if (loading) return <p className="text-center mt-8 text-white">Cargando comunidad...</p>;
  if (error) return <p className="text-center mt-8 text-red-500">{error}</p>;
  if (!comunidad) return <p className="text-center mt-8 text-white">No se encontró la comunidad</p>;

  return (
    <div className="min-h-screen w-full bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-4">{comunidad.nombre}</h1>

      <Link
        to="/"
        className="inline-block mb-6 px-4 py-2 bg-blue-600 rounded hover:bg-blue-500 transition"
      >
        ← Volver a comunidades
      </Link>

      {/* ── Crear publicación ── */}
      {usuario ? (
        <div className="mb-8 p-4 bg-gray-800 rounded-xl">
          <h2 className="font-semibold mb-2">Nueva publicación</h2>
          <textarea
            rows={3}
            value={nuevaPub}
            onChange={(e) => setNuevaPub(e.target.value)}
            placeholder="¿Qué querés compartir?"
            className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
          <button
            onClick={crearPublicacion}
            disabled={loadingPub || !nuevaPub.trim()}
            className="mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 rounded font-semibold transition"
          >
            {loadingPub ? "Publicando..." : "Publicar"}
          </button>
        </div>
      ) : (
        <div className="mb-8 p-4 bg-gray-800 rounded-xl text-center">
          <p className="text-gray-400 mb-3">¿Querés publicar algo?</p>
          <Link
            to="/login"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded font-semibold transition inline-block"
          >
            Inicia sesión para publicar
          </Link>
        </div>
      )}

      {/* ── Lista de publicaciones ── */}
      {comunidad.publicaciones.length > 0 ? (
        comunidad.publicaciones.map((pub) => (
          <div key={pub.id} className="mb-6 p-4 bg-gray-800 rounded-xl shadow">
            {/* Cabecera publicación */}
            <div className="flex justify-between items-start">
              <p className="font-semibold">{pub.usuario.nombre_usuario} publicó:</p>
              {usuario && pub.usuario.id === usuario.id && (
                <button
                  onClick={() => eliminarPublicacion(pub.id)}
                  className="text-xs px-2 py-1 bg-red-700 hover:bg-red-600 rounded transition"
                >
                  Eliminar
                </button>
              )}
            </div>
            <p className="mt-2 text-gray-200">{pub.contenido}</p>

            {/* Comentarios */}
            <div className="mt-4 ml-4 border-l border-gray-700 pl-4">
              <h3 className="font-semibold mb-2 text-sm text-gray-400">Comentarios</h3>

              {pub.comentarios.length > 0 ? (
                pub.comentarios.map((com) => (
                  <div key={com.id} className="mb-2 flex justify-between items-start gap-2">
                    <p>
                      <span className="font-medium text-blue-400">
                        {com.usuario.nombre_usuario}:
                      </span>{" "}
                      <span className="text-gray-200">{com.contenido}</span>
                    </p>
                    {usuario && com.usuario.id === usuario.id && (
                      <button
                        onClick={() => eliminarComentario(pub.id, com.id)}
                        className="text-xs px-2 py-1 bg-red-800 hover:bg-red-700 rounded transition shrink-0"
                      >
                        Eliminar
                      </button>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">Sin comentarios</p>
              )}

              {/* Crear comentario */}
              {usuario ? (
                <div className="mt-3 flex gap-2">
                  <input
                    type="text"
                    value={nuevosComs[pub.id] ?? ""}
                    onChange={(e) =>
                      setNuevosComs((prev) => ({ ...prev, [pub.id]: e.target.value }))
                    }
                    onKeyDown={(e) => e.key === "Enter" && crearComentario(pub.id)}
                    placeholder="Escribí un comentario..."
                    className="flex-1 p-2 rounded bg-gray-700 text-white text-sm border border-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <button
                    onClick={() => crearComentario(pub.id)}
                    disabled={!nuevosComs[pub.id]?.trim()}
                    className="px-3 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 rounded text-sm font-semibold transition"
                  >
                    Comentar
                  </button>
                </div>
              ) : (
                <div className="mt-3">
                  <Link
                    to="/login"
                    className="text-sm text-blue-400 hover:text-blue-300 transition"
                  >
                    Inicia sesión para comentar
                  </Link>
                </div>
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

