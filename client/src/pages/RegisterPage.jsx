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
  const [fName, setFName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleSingIn = async () => {
    setLoading(true);
    if (password != confirmPass) {
      console.log("password didn't match");
      return
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
        <div>
          <h1>SingIn</h1>
          <p className='label-input'>Full Name</p>
          <input
            type="text"
            value={fName}
            onChange={(e) => setEmail(e.target.value)}
          />
          <p className='label-input'>User</p>
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
          <p className='label-input'>Confirm Password</p>
          <input
            type="password"
            value={confirmPass}
            onChange={(e) => setConfirmPass(e.target.value)}
          />
          <p className='label-input'>Email</p>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className='btn-login'>
          <button onClick={handleSingIn}>Sing In</button>
          {loading && <LoadingSpinner />}
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <div>
            <p>Do you have an account?
              <span
                style={{ textDecoration: 'underline', cursor: "pointer" }}
                onClick={() => navigate('/login')}>
                click here
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
