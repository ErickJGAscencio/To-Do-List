import './LoginPage.css';
import { useNavigate } from "react-router-dom";
import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import LoadingSpinner from '../components/LoadingSpinner';
import Button from '../components/atoms/Button';

export function LogInPage() {
  const { login, error } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  // Estados para los mensajes de error
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [validationError, setValidationError] = useState("");

  const handleLogin = () => {
    if (loading) return;

    setUsernameError("");
    setPasswordError("");
    setValidationError("");
    if (!username) {
      setValidationError("Username is required");
      return;
    }
    if (!password) {
      setValidationError("Password is required");
      return;
    }

    setLoading(true);
    login(username, password).finally(() => setLoading(false));
  };

  return (
    <div className="container">
      <div className="main-content">
        <div>
          <h1>Login</h1>
          <p className='label-input'>User/Email</p>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <p className='label-input'>Password</p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className='btn-login'>
          <Button
            label={"Login"}
            handle={handleLogin}
            disabled={loading}
            classStyle={"blue-button"}
          />
          {loading && <LoadingSpinner />}
          {validationError && (
            <p style={{ color: "red" }}>{validationError}</p>
          )}
          {error && <div className="error-message">{error}</div>} {/* Mostrar el error del backend */}
          <div>
            <p>Do you haven't an account?
              <span onClick={() => navigate('/register')}
              >
                click here
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
