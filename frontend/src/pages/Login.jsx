import { useState } from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import axios from "axios";

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");

  const toggleBtn = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const name = e.target.username.value;
    const password = e.target.password.value;

    const userData = { name, password };

    axios
      .post("http://localhost:8000/login", userData)
      .then((res) => console.log(res.data));

    console.log("Form submitted", name, password);
  };

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

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
