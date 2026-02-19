import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import Login from "./pages/login";
import Inicio from "./pages/inicio";
import { AuthProvider } from "./context/authContext";
import ComunidadFull from "./pages/comunidadFull";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/inicio" element={<Inicio />} />
          <Route path="/communities/:id" element={<ComunidadFull />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
