import "./index.css";
import Login from "./page/Login";
import Signup from "./page/Signup";
import Home from "./page/Home";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import MainLayout from "./layouts/MainLayout";
import { ApiProvider } from "./context/ApiContext";
import { ToastContainer } from "react-toastify";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import CategoryPage from "./page/CategoryPage";
import UserSettings from "./page/UserPage";

interface Category {
  category: string;
  id: number;
}

function App() {
  const username = localStorage.getItem("username");
  const apiBaseUrl = import.meta.env.VITE_BASE_API_URL || "";
  const [categories, setCategories] = useState<Category[]>([]);

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      )
    );
  }, []);

  // Fungsi untuk mendapatkan kategori dari API
  const getCategories = useCallback(async () => {
    try {
      const response = await axios.get<Category[]>(
        `${apiBaseUrl}/api/categories`,
        {
          params: { username },
        }
      );
      setCategories(response.data);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  }, [apiBaseUrl, username]);

  useEffect(() => {
    getCategories();
  }, [getCategories]);

  if (isMobile) {
    return (
      <div className="max-h-screen flex flex-col justify-between items-center">
        <div className=" animate-pulse flex-grow flex flex-col items-center justify-center">
          <h1 className="text-sm text-center px-4">
            Aplikasi ini <b>tidak tersedia untuk perangkat mobile</b>, karena
            ini bukan main project si developer.
          </h1>
          <p className="text-center underline text-blue-500">
            Silakan buka di perangkat desktop.
          </p>
        </div>

        <div className="pb-4">
          <p className="text-center">Made by love ❤️</p>
        </div>
      </div>
    );
  }

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
            theme="light"
          />
          <Routes>
            {/* Layout utama */}
            <Route path="/" element={<MainLayout />}>
              <Route path="/dashboard" element={<Home />} />
              <Route path="/profile" element={<UserSettings />} />
              {/* Halaman dinamis berdasarkan kategori */}
              {categories.length > 0 ? (
                categories.map((item, index) => (
                  <Route
                    key={index}
                    path={`/${item.category.toLowerCase()}`}
                    element={
                      <CategoryPage
                        categoryId={item.id}
                        categoryName={item.category}
                      />
                    }
                  />
                ))
              ) : (
                <Route path="*" element={<div className="text-center"></div>} />
              )}
            </Route>

            {/* Halaman login dan signup */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ApiProvider>
  );
}

export default App;
