import "./index.css";
import Login from "./page/Login";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signup from "./page/Signup";
import Home from "./page/Home";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import MainLayout from "./layouts/MainLayout";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route
              path="/home"
              element={
                <PrivateRoute>
                  <Home />
                </PrivateRoute>
              }
            />
          </Route>
          <Route path="/login" index element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
