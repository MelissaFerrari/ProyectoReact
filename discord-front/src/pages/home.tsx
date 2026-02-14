import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Bienvenida a MyCommunity</h1>
      <p style={styles.subtitle}>
        Una app inspirada en Discord para crear comunidades y chatear.
      </p>

      <div style={styles.buttonContainer}>
        <Link to="/app" style={styles.primaryButton}>
          Ir a la App
        </Link>

        <Link
          to="/login"
          className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg text-white transition"
        >
          Iniciar Sesión
        </Link>

      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1e1f22",
    color: "white",
    textAlign: "center",
    padding: "20px",
  },
  title: {
    fontSize: "3rem",
    marginBottom: "1rem",
  },
  subtitle: {
    fontSize: "1.2rem",
    marginBottom: "2rem",
    color: "#b5bac1",
  },
  buttonContainer: {
    display: "flex",
    gap: "1rem",
  },
  primaryButton: {
    padding: "10px 20px",
    backgroundColor: "#5865f2",
    color: "white",
    textDecoration: "none",
    borderRadius: "8px",
  },
  secondaryButton: {
    padding: "10px 20px",
    backgroundColor: "#3a3c43",
    color: "white",
    textDecoration: "none",
    borderRadius: "8px",
  },
};
