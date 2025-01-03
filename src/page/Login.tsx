import { useCallback } from "react";
import Form from "../components/Form";
import axios from "axios";
import { $notify } from "../utils/helper";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";

export default function Login() {
  const apiBaseUrl = import.meta.env.VITE_BASE_API_URL || "";
  const navigate = useNavigate();

  const handleLogin = useCallback(
    async (form: any) => {
      try {
        const response = await axios.post(
          apiBaseUrl + "/api/users/login",
          form
        );

        console.log(response.data);

        if (response.data.status !== "ok") {
          $notify(response.data);
          console.log("Login Failed");
        } else {
          // Login success, fetch user data
          const userResponse = await axios.get(apiBaseUrl + "/api/users/find", {
            params: { param: form.username },
          });

          const userData = userResponse.data.content;
          console.log("user id", userData.id);

          // Update localStorage
          localStorage.setItem("userId", userData?.id);
          localStorage.setItem("username", userData?.username);

          // Navigate to dashboard
          navigate("/dashboard");
        }
      } catch (err) {
        if (axios.isAxiosError(err)) {
          console.error(err.message);
        } else if (err instanceof Error) {
          console.error(err.message);
        } else {
          console.error("An unknown error occurred");
        }
      }
    },
    [apiBaseUrl, navigate]
  );

  const getFormData = useCallback(
    (formData: object) => {
      handleLogin(formData);
    },
    [handleLogin]
  );

  return (
    <>
      <ToastContainer />
      <div className="min-h-screen items-center justify-center flex m-4">
        <Form isLogin onFormSubmit={getFormData} />
      </div>
    </>
  );
}
