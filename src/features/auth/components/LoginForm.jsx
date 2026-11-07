import { useState } from "react";
import { Mail, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";


import { useAuth } from "../../../context/AuthContext";
import { login } from "../services/authService";

export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const { login: saveSession } = useAuth();

  const handleLogin = (e) => {
    e.preventDefault();

    const user = login(username, password);

    if (!user) {
      alert("Credenciales incorrectas");
      return;
    }

    saveSession(user);
    navigate("/dashboard");
  };

  return (
    <form onSubmit={handleLogin} className="login-form">
      <div className="input-group">
        <Mail className="input-icon" />
        <input
          type="text"
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Ingresa tu usuario"
          className="login-input"
        />
      </div>

      <div className="input-group">
        <Lock className="input-icon" />
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Ingresa tu contraseña"
          className="login-input"
        />
      </div>

      <button type="submit" className="btn-submit">
        Iniciar Sesión
      </button>
      
    </form>
  );
}