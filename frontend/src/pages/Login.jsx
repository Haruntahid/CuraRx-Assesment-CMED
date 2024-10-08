import { useContext, useEffect, useState } from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { BiLoaderAlt } from "react-icons/bi";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { AuthContext } from "../provider/AuthProvider";

function Login() {
  const { login, user, loading, setLoading } = useContext(AuthContext);

  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const toggleBtn = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    const name = e.target.username.value;
    const password = e.target.password.value;

    const userData = { name, password };

    axios
      .post("http://localhost:8000/login", userData)
      .then((res) => {
        setLoading(false);
        if (res.data.validUser) {
          login(res.data.validUser.email);
          navigate("/", { replace: true });
          toast.success(res.data.message);
        }
      })
      .catch((err) => {
        setLoading(false);
        // error message
        if (err.response && err.response.data.message) {
          setErrorMessage(err.response.data.message);
        } else {
          setErrorMessage("Something went wrong. Please try again.");
        }
      });

    console.log("Form submitted", name, password);
  };

  useEffect(() => {
    if (user) {
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

  return (
    <div className="bg-gray-300 h-screen flex justify-center items-center w-full">
      <div className="w-full max-w-xl">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-lg shadow-lg w-full"
        >
          <h2 className="text-4xl font-bold mb-8 text-center">Login</h2>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">
              Username or Email
            </label>
            <input
              type="text"
              name="username"
              placeholder="Enter your username or email"
              className="w-full px-4 py-2 border border-gray-400 rounded"
              required
            />
          </div>

          <div className="mb-4 relative">
            <label className="block text-gray-700 mb-2">Password</label>
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-400 rounded"
              required
            />
            {password && (
              <button
                type="button"
                onClick={toggleBtn}
                className="absolute right-3 top-11 text-gray-600"
              >
                {showPassword ? (
                  <AiFillEyeInvisible size={20} />
                ) : (
                  <AiFillEye size={20} />
                )}
              </button>
            )}
          </div>

          {/* error message */}
          {errorMessage && (
            <div className="mb-4">
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                <strong className="font-bold">Error: </strong>
                <span className="block sm:inline">{errorMessage}</span>
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
            disabled={loading}
          >
            {loading ? (
              <BiLoaderAlt className="animate-spin mx-auto" size={20} />
            ) : (
              "Login"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
