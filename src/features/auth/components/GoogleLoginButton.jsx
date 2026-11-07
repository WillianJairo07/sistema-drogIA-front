import googleLogo from "../../../assets/google.png";

export default function GoogleLoginButton() {
  const handleGoogleLogin = () => {
    console.log("Iniciar sesión con Google");
  };

  return (
    <button type="button" onClick={handleGoogleLogin} className="btn-google">
      <img src={googleLogo} alt="Google" className="google-icon" />
      <span>Continuar con Google</span>
    </button>
  );
}