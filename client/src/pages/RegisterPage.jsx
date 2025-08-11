import { useContext, useState } from "react";
import { registerUser } from "../services/todolist.api";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import LoadingSpinner from "../components/LoadingSpinner";
import Button from "../components/atoms/Button";

export function RegisterPage() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [fName, setFName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [validationError, setValidationError] = useState("");

  const handleSingIn = async () => {
    // Limpia los errores previos
    setError("");
    setValidationError("");

    // Validaciones iniciales
    if (password !== confirmPass) {
      setValidationError("Passwords do not match.");
      return;
    }

    if (!email) {
      setValidationError("Email is required.");
      return;
    }

    if (!username || !fName) {
      setValidationError("Full Name and Username are required.");
      return;
    }

    setLoading(true);
    try {
      const response = await registerUser(username, password, email);

      if (response.status === 200) {
        const token = response.data.token;
        localStorage.setItem("token", token);

        // Inicia sesión automáticamente después de registrarse
        await login(username, password);
        navigate("/dashboard"); // Redirige al dashboard o página deseada
      }
    } catch (error) {
      console.error("Signin error:", error.response);
      setError(error.response?.data?.w || "Error during registration");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="main-content">
        <div>
          <h1>Register</h1>
          <p className="label-input">Full Name</p>
          <input
            type="text"
            value={fName}
            onChange={(e) => setFName(e.target.value)}
          />
          <p className="label-input">Username</p>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <p className="label-input">Password</p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <p className="label-input">Confirm Password</p>
          <input
            type="password"
            value={confirmPass}
            onChange={(e) => setConfirmPass(e.target.value)}
          />
          <p className="label-input">Email</p>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="btn-login">
          <Button
            label={"Sign up"}
            handle={handleSingIn}
            disabled={loading}
            classStyle={"blue-button"}
          />
          {loading && <LoadingSpinner />}
          {validationError && (
            <p style={{ color: "red" }}>{validationError}</p>
          )}
          {error && <p style={{ color: "red" }}>{error}</p>}
          <div>
            <p>
              Already have an account?{" "}
              <span
                style={{ textDecoration: "underline", cursor: "pointer" }}
                onClick={() => navigate("/login")}
              >
                Click here
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}