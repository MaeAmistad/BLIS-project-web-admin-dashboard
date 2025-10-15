import { useState, useEffect } from "react";
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
} from "@mui/material";
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
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #2E7D32, #81C784)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        p: 2,
      }}
    >
      <Container maxWidth="xs">
        <Paper
          elevation={10}
          sx={{
            borderRadius: 4,
            p: 4,
            backdropFilter: "blur(8px)",
            backgroundColor: "rgba(255,255,255,0.9)",
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          }}
        >
          {/* Logo */}
          <Box display="flex" justifyContent="center" alignItems="center" mb={2}>
            <img
              alt="logo"
              width="100px"
              height="100px"
              src={photo}
              style={{ borderRadius: "50%" }}
            />
          </Box>

          <Typography
            variant="h5"
            fontWeight="bold"
            textAlign="center"
            color="green"
          >
            Sign In
          </Typography>

          <Box component="form" noValidate sx={{ mt: 3 }}>
            <TextField
            label="Username"
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            required
            autoComplete="off" 
            error={!!emailError}
            helperText={emailError}
            sx={{
                mb: 2,
                "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "#A5D6A7" },
                "&:hover fieldset": { borderColor: "#66BB6A" },
                "&.Mui-focused fieldset": { borderColor: "#388E3C" },
                },
                "& .MuiInputLabel-root": {
                color: "#666", // default label color
                "&:hover": {
                  color: "#66BB6A", // label color when hovered
                },
                }
            }}
            />

            <TextField
            label="Password"
            variant="outlined"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            required
            autoComplete="new-password"
            error={!!passwordError}
            helperText={passwordError}
            sx={{
                mb: 3,
                "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "#A5D6A7" },
                "&:hover fieldset": { borderColor: "#66BB6A" },
                "&.Mui-focused fieldset": { borderColor: "#388E3C" },
                },
                "& .MuiInputLabel-root": {
                color: "#666", // default label color
                "&:hover": {
                  color: "#66BB6A", // label color when hovered
                },
                }
            }}
            />



            <Button
              variant="contained"
              fullWidth
              sx={{
                backgroundColor: "#4CAF50",
                py: 1.3,
                fontWeight: "bold",
                fontSize: "16px",
                "&:hover": { backgroundColor: "#43A047" },
                transition: "all 0.3s ease",
              }}
              onClick={handleClick}
            >
              SIGN IN
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Login;
