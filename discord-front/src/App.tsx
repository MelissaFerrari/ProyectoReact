import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import Login from "./pages/login"; // 👈 IMPORTANTE

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/app" element={<h1>App Principal</h1>} />
        <Route path="/login" element={<Login />} /> {/* 👈 usar el componente */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;

