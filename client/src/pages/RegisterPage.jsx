import { useContext, useState } from "react";
import { registerUser } from "../api/todolist.api";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { LoadingSpinner } from "../components/LoadingSpinner";

export function RegisterPage() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  
  // Estado para mostrar u ocultar la contraseña
  const [showPassword, setShowPassword] = useState(false);

  const handleSingIn = async () => {
    setLoading(true);
    if (password !== confirmPass) {
      console.log("Passwords don't match");
      return;
    }

    try {
      const response = await registerUser(username, password, email);
      console.log(response);

      if (response.status === 200) {
        const token = response.data.token;
        localStorage.setItem('token', token);  
        login(username, password).finally(() => {
          setLoading(false);
        });
      }
    } catch (error) {
      console.error("Signin error:", error.response);
      setError(error.response?.data || "Error during registration");
    }
  };

  return (
    <div className="container">
      <div className="main-content">
        <h1>Sign In</h1>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <div>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
        <div>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Confirm Password"
            value={confirmPass}
            onChange={(e) => setConfirmPass(e.target.value)}
          />
          <button onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
        <input
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button onClick={handleSingIn}>Sign In</button>
        {loading && <LoadingSpinner />}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <div>
          <h3>
            Do you have an account?
            <span
              style={{ textDecoration: 'underline', cursor: "pointer" }}
              onClick={() => navigate('/login')}
            >
              Log in
            </span>
          </h3>
        </div>
      </div>
    </div>
  );
}