import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/app" element={<h1>App Principal</h1>} />
        <Route path="/login" element={<h1>Login</h1>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
