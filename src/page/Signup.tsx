import Form from "../components/Form";
import { useEffect, useState } from "react";
import axios from "axios";
import { Bounce, toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

// Sesuaikan dengan format respons dari API
interface ApiResponse {
  status: string;
  message: string;
  errors: [];
}

function Signup() {
  const [form, setForm] = useState({});
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const getFormData = (formData: object) => {
    setForm(formData);
    navigate("/login");
  };

  const apiBaseUrl = import.meta.env.VITE_BASE_API_URL || "";

  useEffect(() => {
    if (Object.keys(form).length === 0) return;

    const createUser = async () => {
      try {
        setLoading(true);
        const response = await axios.post<ApiResponse>(
          `${apiBaseUrl}/api/users/signup`,
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
          console.error("Axios Error:", err.message);
          setError(err.message);
        } else if (err instanceof Error) {
          console.error("Error:", err.message);
          setError(err.message);
        } else {
          console.error("Unknown Error");
          setError("An unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    createUser();
  }, [form, apiBaseUrl]);

  useEffect(() => {
    if (data?.message) {
      const { status, message } = data;
      const notif = status === "ok" ? toast.success : toast.error;

      notif(message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Bounce,
      });
    }
  }, [data]);

  console.log("State Data:", data);
  console.log("Loading:", loading);
  console.log("Error:", error);

  return (
    <div className="min-h-screen items-center justify-center flex m-4">
      <ToastContainer />
      <Form isLogin={false} onFormSubmit={getFormData} />
    </div>
  );
}

export default Signup;
