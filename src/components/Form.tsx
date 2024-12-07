import { useState } from "react";
import { connect } from "react-redux";
import { RootState } from "../utils/store";
import { Button, Card } from "flowbite-react";
import { Label, TextInput } from "flowbite-react";
import { HiMail } from "react-icons/hi";
import { TbEye, TbEyeOff } from "react-icons/tb";
import { CiUser } from "react-icons/ci";
import { IoAdd, IoEnterOutline } from "react-icons/io5";
import { Link } from "react-router-dom";

interface FormProps {
  isLogin: boolean;
  onFormSubmit: (data: {
    username: string;
    email?: string;
    password: string;
  }) => void; // Tambahkan props ini
}

export const Form: React.FC<FormProps> = ({ isLogin, onFormSubmit }) => {
  const [formState, setFormState] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFormSubmit(formState); // Kirim data ke komponen induk
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prevState) => !prevState);
  };

  return (
    <Card className="max-w-sm w-full">
      <section>
        <h1 className="text-4xl font-bold">{isLogin ? "Login" : "Sign Up"}</h1>
      </section>
      <form onSubmit={handleSubmit} className="space-y-4">
        {!isLogin && (
          <div className="max-w-md">
            <div className="mb-2 block">
              <Label htmlFor="email" value="Email" />
            </div>
            <TextInput
              id="email"
              type="email"
              name="email"
              placeholder="email"
              required
              value={formState.email}
              onChange={handleChange}
              rightIcon={HiMail}
            />
          </div>
        )}

        <div className="max-w-md">
          <div className="mb-2 block">
            <Label htmlFor="username" value="Username" />
          </div>
          <TextInput
            id="username"
            type="text"
            name="username"
            placeholder="username"
            required
            value={formState.username}
            onChange={handleChange}
            rightIcon={CiUser}
          />
        </div>

        <div className="max-w-md">
          <div className="mb-2 block">
            <Label htmlFor="password" value="Password" />
          </div>
          <div className="relative">
            <TextInput
              id="password"
              type={isPasswordVisible ? "text" : "password"}
              name="password"
              placeholder="password"
              required
              value={formState.password}
              onChange={handleChange}
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute inset-y-0 right-3 flex items-center text-gray-500"
            >
              {isPasswordVisible ? <TbEyeOff size={20} /> : <TbEye size={20} />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Button type="submit" color="blue" pill>
            {isLogin ? (
              <>
                <IoEnterOutline className="mr-2" size={20} />
                Sign In
              </>
            ) : (
              <>
                <IoAdd className="mr-2" size={20} />
                Sign Up
              </>
            )}
          </Button>
          {isLogin ? (
            <Link to="/signup" className="text-blue-600 underline">
              Don't have an account?
            </Link>
          ) : (
            <Link to="/login" className="text-blue-600 underline">
              Have an account?
            </Link>
          )}
        </div>
      </form>
    </Card>
  );
};

// Map state to props
const mapStateToProps = (state: RootState) => ({
  username: state.user.username,
  email: state.user.email,
  password: state.user.password,
});

// Map dispatch to props (optional)
const mapDispatchToProps = {};

// Connect the component to the Redux store
export default connect(mapStateToProps, mapDispatchToProps)(Form);
