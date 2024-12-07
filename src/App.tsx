import "./index.css";
import Login from "./page/Login";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signup from "./page/Signup";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" index element={<Login />} />
        <Route path="/signup" index element={<Signup />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
