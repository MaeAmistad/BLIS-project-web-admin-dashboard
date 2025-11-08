import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import photo from "../../assets/logo1.jpg";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/") {
      setEmail("");
      setPassword("");
      setEmailError("");
      setPasswordError("");
    }
  }, [location]);

  const validateInputs = () => {
    let valid = true;

    if (!email.trim()) {
      setEmailError("Username is required.");
      valid = false;
    } else {
      setEmailError("");
    }

    if (!password.trim()) {
      setPasswordError("Password is required.");
      valid = false;
    } else {
      setPasswordError("");
    }

    return valid;
  };

  const handleClick = () => {
    if (!validateInputs()) return;

    if (email === "admin" && password === "12345") {
      Swal.fire({
        icon: "success",
        title: "Welcome!",
        text: "Login successful. Redirecting...",
        showConfirmButton: false,
        timer: 1500,
      });
      setTimeout(() => {
        setEmail("");
        setPassword("");
        navigate("/dashboard");
      }, 1500);
    } else {
      Swal.fire({
        icon: "error",
        title: "Invalid Credentials",
        text: "Please check your username or password.",
        confirmButtonColor: "#4CAF50",
      });
      setEmail("");
      setPassword("");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-800 to-green-400 p-4">
      <div className="bg-white/90 backdrop-blur-lg shadow-lg rounded-2xl p-8 w-full max-w-sm">
        {/* Logo */}
        <div className="flex justify-center mb-4">
          <img
            src={photo}
            alt="logo"
            className="w-24 h-24 rounded-full object-cover"
          />
        </div>

        <h1 className="text-2xl font-bold text-green-700 text-center mb-6">
          Bantay Livestock Information and Registration System
        </h1>

        <form className="space-y-4">
          {/* Username */}
          <div>
            <label
              htmlFor="username"
              className="block text-gray-700 font-medium mb-1"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full px-4 py-2 rounded-xl border focus:outline-none focus:ring-2 transition-all ${
                emailError
                  ? "border-red-500 focus:ring-red-500"
                  : "border-green-200 focus:ring-green-600"
              }`}
              autoComplete="off"
              required
            />
            {emailError && (
              <p className="text-red-500 text-sm mt-1">{emailError}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-gray-700 font-medium mb-1"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full px-4 py-2 rounded-xl border focus:outline-none focus:ring-2 transition-all ${
                passwordError
                  ? "border-red-500 focus:ring-red-500"
                  : "border-green-200 focus:ring-green-600"
              }`}
              autoComplete="new-password"
              required
            />
            {passwordError && (
              <p className="text-red-500 text-sm mt-1">{passwordError}</p>
            )}
          </div>

          {/* Button */}
          <button
            type="button"
            onClick={handleClick}
            className="w-full bg-green-600 text-white py-2.5 rounded-xl font-semibold text-lg shadow-md hover:bg-green-700 transition duration-300"
          >
            SIGN IN
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
