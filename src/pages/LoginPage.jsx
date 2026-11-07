import LoginForm from "../features/auth/components/LoginForm";
import logoImage from "../assets/logo.png";
import "../styles/login.css"; 

export default function LoginPage() {
  return (
    <div className="login-screen">
      <div className="login-card">
        {/* Panel izquierdo */}
        <div className="login-left-panel">
          <div className="login-header">
            <img src={logoImage} alt="DrogIA Logo" className="login-logo" />
            <p className="login-subtitle">
              Ingresa tus credenciales para iniciar sesión
            </p>
          </div>

          <LoginForm />
        </div>

        {/* Panel derecho */}
        <div className="login-right-panel">
          <img
            src={logoImage}
            alt="DrogIA Logo Grande"
            className="login-logo-large"
          />
        </div>
      </div>
    </div>
  );
}