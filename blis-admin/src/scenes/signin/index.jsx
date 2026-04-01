import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import photo from "../../assets/logo1.jpg";
import { db } from "../../firebase";
import {
  getAuth,
  signInWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { VisibilityOffRounded, VisibilityRounded } from "@mui/icons-material";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isOpen, setIsOpen] = useState(false);

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

  const auth = getAuth();

  const handleClick = async () => {
    if (!validateInputs()) return;

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );

      const firebaseUser = userCredential.user;


      if (!firebaseUser.emailVerified) {
        const result = await Swal.fire({
          icon: "warning",
          title: "Email Not Verified",
          text: "Your email is not verified. Would you like us to resend the verification email?",
          confirmButtonText: "Resend Email",
          confirmButtonColor: "#08651bfa",
          cancelButtonText: "Cancel",
          showCancelButton: true,
        });

        if (result.isConfirmed) {
          await sendEmailVerification(firebaseUser);

          await Swal.fire({
            icon: "success",
            title: "Verification Email Sent",
            text: "Please check your inbox (and spam folder).",
            confirmButtonText: "Ok",
            confirmButtonColor: "#08651bfa",
          });
        }

        setEmail("")
        setPassword("")
        await auth.signOut();
        return;
      }


      const userRef = doc(db, "users", firebaseUser.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        throw new Error("User record not found.");
      }

      const userData = userSnap.data();

      const status = (userData.status || "").toUpperCase();
      const role = (userData.role || "").toUpperCase();

      if (status !== "ACTIVE") {
        await Swal.fire({
          icon: "error",
          title: "Account Deactivated",
          text: "Your account has been deactivated. Please contact the administrator.",
          confirmButtonText: "Ok",
          confirmButtonColor: "#08651bfa",
        });

        auth.signOut();
        window.location.reload()
        return;
      }


      // if (role !== "ADMIN") {
      //   await Swal.fire({
      //     icon: "error",
      //     title: "Unauthorized",
      //     text: "You are not authorized to access this system.",
      //     confirmButtonText: "Ok",
      //     confirmButtonColor: "#08651bfa",
      //   });

      //   auth.signOut();
      //   return;
      // }

      // Success
      Swal.fire({
        icon: "success",
        title: `Welcome, ${userData.name}!`,
        showConfirmButton: false,
        timer: 1500,
      });

      navigate("/dashboard");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: error.message
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-900 via-green-700 to-green-400 px-4">
      <div className="bg-white/90 backdrop-blur-xl shadow-2xl rounded-3xl p-8 w-full max-w-sm transition-all duration-300">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img
            src={photo}
            alt="logo"
            className="w-24 h-24 rounded-full object-cover shadow-md ring-4 ring-green-200"
          />
        </div>

        <h1 className="text-xl font-bold text-green-800 text-center leading-snug mb-6">
          Bantay Livestock <br />
          <span className="text-sm font-medium text-gray-600">
            Information & Registration System
          </span>
        </h1>

        <form className="space-y-5">
          {/* Username */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Email
            </label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className={`w-full h-11 px-2 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-all ${
                emailError
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-green-600"
              }`}
            />
            {emailError && (
              <p className="text-red-500 text-xs mt-1">{emailError}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={isOpen ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full h-11 px-2 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-all ${passwordError ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-green-600"}`}
                placeholder="Password"
              />

              <button
                type="button"
                onClick={() => setIsOpen((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                {isOpen ? (
                  <VisibilityRounded sx={{ color: "#959595", fontSize: 14 }} />
                ) : (
                  <VisibilityOffRounded
                    sx={{ color: "#959595", fontSize: 14 }}
                  />
                )}
              </button>
            </div>

            {passwordError && (
              <p className="text-red-500 text-xs mt-1">{passwordError}</p>
            )}
          </div>

          {/* Button */}
          <button
            type="button"
            onClick={handleClick}
            className="w-full h-11 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-semibold tracking-wide shadow-lg hover:from-green-700 hover:to-green-800 active:scale-95 transition-all duration-200"
          >
            LOG IN
          </button>
        </form>

        {/* Footer */}
        <p className="text-xs text-center text-gray-500 mt-6">
          © {new Date().getFullYear()} Bantay Livestock System
        </p>
      </div>
    </div>
  );
};

export default Login;
