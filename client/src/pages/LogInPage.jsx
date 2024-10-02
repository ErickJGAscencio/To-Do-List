import './LoginPage.css';
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export function LogInPage() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (username|| password) {
      login(username, password);
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
        <button onClick={handleLogin}>Log In</button>

        <div>
          <h3>Do you haven't an account?
            <span
              style={{ textDecoration: 'underline', cursor: "pointer" }}
              onClick={() => navigate('/register')}>
              Register
            </span>
          </h3>
        </div>
      </div>
    </div>
  );
}
