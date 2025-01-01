import { useCallback } from "react";
import Form from "../components/Form";
import axios from "axios";
import { $notify } from "../utils/helper";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { useAuth } from "../hooks/useAuth";

export default function Login() {
  const apiBaseUrl = import.meta.env.VITE_BASE_API_URL || "";
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = useCallback(
    async (form: object) => {
      try {
        const response = await axios.post(
          apiBaseUrl + "/api/users/login",
          form
        );

        console.log(response.data);

        if (response.data.status != "ok") {
          $notify(response.data);
        } else {
          login(response.data);
          navigate("/dashboard");
        }
      } catch (err) {
        if (axios.isAxiosError(err)) {
          console.log(err.message);
        } else if (err instanceof Error) {
          console.log(err.message);
        } else {
          console.log("An unknown error occurred");
        }
      }
    },
    [apiBaseUrl, login, navigate]
  );

  const getFormData = useCallback(
    (formData: object) => {
      handleLogin(formData);
    },
    [handleLogin]
  );

  return (
    <div className="min-h-screen items-center justify-center flex m-4">
      <ToastContainer />
      <Form isLogin onFormSubmit={getFormData} />
    </div>
  );
}
