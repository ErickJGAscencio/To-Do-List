import { useState } from "react";
import { registerUser } from "../api/todolist.api";
import { useNavigate } from "react-router-dom";

export function RegisterPage() {

  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleSingIn = async () => {
    console.log("ASD");
    try {
      const response = await registerUser(username, password, email);
      console.log(response);
      if (response.status === 201) {
        const token = response.data.token;
        localStorage.setItem('token', token);  // Guardar el token en localStoreage
        console.log('Registration successful');
        // navigate('/home');  // Redirigir después del registro
      }
    } catch (error) {
      console.error("Signin error:", error.response);
      setError(error.response?.data || "Error during registration");
    }
  };


  return (
    <div className="container">
      <div className="main-content">
        <h1>SingIn</h1>
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
        <input
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button onClick={handleSingIn}>Sing In</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <div>
          <h3>Do you have an account?
            <span
              style={{ textDecoration: 'underline', cursor: "pointer" }}
              onClick={() => navigate('/login')}>
              Log in
            </span>
          </h3>
        </div>
      </div>
    </div>
  );
}
