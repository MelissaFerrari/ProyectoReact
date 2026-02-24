import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import Inicio from "./pages/inicio";
import Registro from "./pages/registro";
import { AuthProvider } from "./context/authContext";
import ComunidadFull from "./pages/comunidadFull";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/communities/:id" element={<ComunidadFull />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
