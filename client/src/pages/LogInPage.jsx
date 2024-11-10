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
    if (username && password) {
      login(username, password).finally(() => {
        setLoading(false);
      });
    }
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
          {loading && <LoadingSpinner />}
          <button onClick={handleLogin} disabled={loading}>Login</button>
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
