import { useEffect, useState } from "react";
import Form from "../components/Form";
import axios from "axios";

export default function Login() {
  const [data, setData] = useState([]);
  const [form, setForm] = useState({});

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); // Specify the type for error

  const getFormData = (formData: object) => {
    setForm(formData); // Simpan data dari Form ke state
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:8080/api/users", {
          timeout: 10000,
          headers: {
            "Content-Type": "application/json",
          },
        });
        setData(response.data);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setError(err.message);
        } else if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  console.log(data);
  console.log(form, loading, error);

  return (
    <div className="min-h-screen items-center justify-center flex">
      <Form isLogin onFormSubmit={getFormData} />
    </div>
  );
}
