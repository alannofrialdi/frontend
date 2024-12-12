import { useState, useCallback, useEffect } from "react";
import Form from "../components/Form";
import axios from "axios";
import { $notify } from "../utils/helper";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import useAuth from "../hooks/useAuth";

export default function Login() {
  const [data, setData] = useState<{
    message: string;
    code: number;
    status: string;
  }>({
    message: "",
    status: "",
    code: 0,
  });

  const [shouldRunEffect, setShouldRunEffect] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = useCallback(async (form: object) => {
    try {
      const response = await axios.post(
        "http://localhost:8080/api/users/login",
        form,
        {
          timeout: 10000,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setData(response.data);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        console.log(err.message);
      } else if (err instanceof Error) {
        console.log(err.message);
      } else {
        console.log("An unknown error occurred");
      }
    } finally {
      setShouldRunEffect(true);
    }
  }, []);

  const getFormData = useCallback(
    (formData: object) => {
      handleLogin(formData);
    },
    [handleLogin]
  );

  useEffect(() => {
    if (!shouldRunEffect) return;

    if (data.status == "ok") {
      login();
      navigate("/home");
    } else {
      return $notify(data);
    }
  }, [data, navigate, shouldRunEffect, login]);

  return (
    <div className="min-h-screen items-center justify-center flex m-4">
      <ToastContainer />
      <Form isLogin onFormSubmit={getFormData} />
    </div>
  );
}
