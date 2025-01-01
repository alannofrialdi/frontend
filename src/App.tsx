import "./index.css";
import Login from "./page/Login";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signup from "./page/Signup";
import Home from "./page/Home";
import { AuthProvider } from "./context/AuthContext";
// import PrivateRoute from "./components/PrivateRoute";
import MainLayout from "./layouts/MainLayout";
import { ApiProvider } from "./context/ApiContext";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <ApiProvider>
      <AuthProvider>
        <BrowserRouter>
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
          />

          <Routes>
            <Route path="/" element={<MainLayout />}>
              <Route path="/dashboard" element={<Home />} />
            </Route>
            {/* <Route path="/" element={<MainLayout />}>
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Home />
                </PrivateRoute>
              }
            />
          </Route> */}
            <Route path="/login" index element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/" element={<Signup />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ApiProvider>
  );
}

export default App;
