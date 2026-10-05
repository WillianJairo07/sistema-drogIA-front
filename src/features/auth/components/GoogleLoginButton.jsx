
import googleLogo from "../../../assets/google.png";

export default function GoogleLoginButton() {
  const handleGoogleLogin = () => {
    console.log("Iniciar sesión con Google");
  };

  return (
    <button
      type="button"
      onClick={handleGoogleLogin}
      className="w-full flex items-center justify-center gap-3 py-3.5 rounded-md border border-slate-300 bg-white text-slate-700 text-[15px] font-semibold font-lexend hover:bg-slate-50 transition-colors shadow-sm"
    >
      <img
        src={googleLogo}
        alt="Google"
        className="w-5 h-5 object-contain"
       />

      <span>Continuar con Google</span>
    </button>
  );
}