import './LoginPage.css';
import { useNavigate } from "react-router-dom";
import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { LoadingSpinner } from '../components/LoadingSpinner'; // Importa el componente LoadingSpinner
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

  const handleLogin = () => {
    setUsernameError("");
    setPasswordError("");
    
    if (!username) {
      setUsernameError("Username is required");
      return;
    }
    if (!password) {
      setPasswordError("Password is required");
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
          {usernameError && <div className="error-message">{usernameError}</div>}
          
          <p className='label-input'>Password</p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {passwordError && <div className="error-message">{passwordError}</div>}
        </div>
        <div className='btn-login'>
          {loading && <LoadingSpinner />}
          <Button handle={handleLogin} disabled={loading} label={ "Login" } />
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
