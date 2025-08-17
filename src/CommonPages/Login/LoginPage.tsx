import { SetStateAction, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../features/auth/UserLoginSlice";
import { useNavigate } from "react-router-dom";
import Loading from "../../components/Loading";
import { toast } from "react-toastify";
import { AppDispatch, RootState } from "../../redux/store";
import { Dispatch } from "@reduxjs/toolkit";
import { SubmitButtonClass } from "../../helper/ApplicationConstants";
import useAuthStatus from "../../hooks/useAuthStatus";

interface LoginPageProps {
  onLogin: Dispatch<SetStateAction<string>>;
}

const Login: React.FC<LoginPageProps> = ({onLogin}) => {

const {isLoading, data} = useSelector((state : RootState) => state.UserLoginSlice)
const {loggedIn} = useAuthStatus()

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

useEffect(() => {
  if (!loggedIn) {
    navigate("/login", { replace: true });
  } else if (data?.role?.name === "customer") {
    navigate("/orders", { replace: true });
  } else if (data?.role?.name === "admin") {
    navigate("/", { replace: true });
  } else if (data?.role?.name === "vendor") {
    navigate("/product-part", {replace: true})
  }
}, [loggedIn, data, navigate]);


if(isLoading){
 return <Loading />
}

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
              value={formData.email}
              onChange={handleChange}
              required
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
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
          <a href="/signup" className="text-blue-500 hover:underline ml-1">
            forget Password
          </a>
        </p>
      </div>
    </div>
    </>

  )
}

export default Login;
