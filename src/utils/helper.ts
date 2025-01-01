import { Bounce, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface NotifProps {
  message: string;
  status: string;
}

export const $notify = ({ message, status }: NotifProps) => {
  const notif =
    status === "ok"
      ? toast.success
      : status === "validation"
      ? toast.warning
      : toast.error;

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
};
