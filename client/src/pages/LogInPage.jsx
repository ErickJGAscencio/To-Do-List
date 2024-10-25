import './LoginPage.css';
import { useNavigate } from "react-router-dom";
import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { LoadingSpinner } from '../components/LoadingSpinner'; // Importa el componente LoadingSpinner

export function LogInPage() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    setLoading(true);
    if (username && password) { // Cambié '||' a '&&' para asegurar que ambos campos están llenos
      login(username, password).finally(() => {
        setLoading(false);
      });
    }
  };

  return (
    <div className="container">
      <div className="main-content">
        <h1>LogIn</h1>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleLogin} disabled={loading}>Log In</button>
        
        {loading && <LoadingSpinner />}
        
        <div>
          <h3>Do you haven't an account?
            <span
              style={{ textDecoration: 'underline', cursor: "pointer" }}
              onClick={() => navigate('/register')}
            >
              Register
            </span>
          </h3>
        </div>
      </div>
    </div>
  );
}
