import { useState } from "react";
import { Mail, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import GoogleLoginButton from "./GoogleLoginButton";

export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    if (username === "admin" && password === "123456") {
      localStorage.setItem("token", "fake-jwt-token-12345");
      navigate("/dashboard");
    } else {
      alert("Credenciales incorrectas");
    }
  };

  return (
    <form
      onSubmit={handleLogin}
      className="w-full max-w-[340px] flex flex-col gap-4 mt-5"
    >
      <div className="relative flex items-center">
        <Mail className="absolute left-3.5 text-slate-500 w-[18px] h-[18px]" />

        <input
          type="text"
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Ingresa tu usuario"
          className="w-full py-3.5 pr-4 pl-11 rounded-md border border-slate-300 bg-white text-sm font-lexend outline-none text-slate-900 focus:border-blue-900 transition-colors"
        />
      </div>

      <div className="relative flex items-center">
        <Lock className="absolute left-3.5 text-slate-500 w-[18px] h-[18px]" />

        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Ingresa tu contraseña"
          className="w-full py-3.5 pr-4 pl-11 rounded-md border border-slate-300 bg-white text-sm font-lexend outline-none text-slate-900 focus:border-blue-900 transition-colors"
        />
      </div>

      <button
        type="submit"
        className="mt-2 py-3.5 bg-[#17324c] text-white rounded-md text-[15px] font-semibold font-lexend cursor-pointer hover:bg-[#0f2235] transition-colors shadow-md"
      >
        Iniciar Sesión
      </button>

      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-slate-300" />
        <span className="text-xs text-slate-400">O</span>
        <div className="h-px flex-1 bg-slate-300" />
      </div>

      <GoogleLoginButton />
    </form>
  );
}