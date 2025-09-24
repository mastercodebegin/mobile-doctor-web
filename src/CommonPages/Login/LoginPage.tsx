import { SetStateAction, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../features/auth/UserLoginSlice";
import { Link, useNavigate } from "react-router-dom";
import Loading from "../../components/Loading";
import { toast } from "react-toastify";
import { AppDispatch, RootState } from "../../redux/store";
import { Dispatch } from "@reduxjs/toolkit";
import { inputClass, SubmitButtonClass } from "../../helper/ApplicationConstants";
import { Eye, EyeOff } from "lucide-react";

interface LoginPageProps {
  onLogin: Dispatch<SetStateAction<string>>;
}

const Login: React.FC<LoginPageProps> = ({ onLogin }) => {

  const { isLoading } = useSelector((state: RootState) => state.UserLoginSlice)
  const [showPass, setShowPass] = useState(false);

  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()

  const [formData, setFormData] = useState<any>({
    email: "",
    password: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const login = async (e) => {
    e.preventDefault();

    try {
      const res = await dispatch(loginUser(formData)).unwrap();

      console.log("FULL LOGIN RESPONSE", res);

      const token = res?.token;
      const user = res?.user;

      console.log("Token:", token);
      console.log("User:", user);

      if (token) {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        onLogin(token)
        navigate("/", { replace: true });
        toast.success("Login Successful!");
      } else {
        toast.error("Token is missing in response");
      }

      setFormData({ email: "", password: "" });
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

{isLoading && <Loading overlay={true} />}

  return (
    <>

      <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
            Login
          </h2>
          <form onSubmit={login} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter Email"
                value={formData.email}
                onChange={handleChange}
                required
                className={`mt-1 ${inputClass}`}
              />
            </div>

            <div className="mb-6 relative">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                type={showPass ? "text" : "password"}
                id="password"
                name="password"
                placeholder="Enter Password"
                value={formData.password}
                onChange={handleChange}
                required
                className={`mt-1 ${inputClass}`}
              />
              <span
                className="absolute right-3 top-[58%] -translate-y-0/2 cursor-pointer text-gray-500 hover:text-gray-700 transition"
                onClick={() => setShowPass(!showPass)}
              >
                {showPass ? <Eye size={20} /> : <EyeOff size={20} />}
              </span>
            </div>

            <button
              type="submit"
              className={`w-full ${SubmitButtonClass}`}
            >
              Login
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-4">
            Don't have an account?
            <Link to="/forgot-password" className="text-blue-500 hover:underline ml-1">
              Forgot Password
            </Link>
          </p>
        </div>
      </div>

      {isLoading && <Loading overlay={true} />}
    </>

  )
}

export default Login;
