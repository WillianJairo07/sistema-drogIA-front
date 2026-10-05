import LoginForm from "../features/auth/components/LoginForm";
import logoImage from "../assets/logo.png";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen w-screen items-center justify-center bg-gradient-to-b from-sky-400 via-sky-200 to-sky-100 p-4 font-lexend">
      
      <div className="flex w-full max-w-[460px] lg:max-w-[1150px] min-h-[580px] lg:h-[580px] bg-[#fcf6f4] rounded-xl shadow-2xl overflow-hidden flex-col lg:flex-row">

        {/* Panel izquierdo */}
        <div className="w-full lg:flex-1 bg-[#fcf6f4] flex flex-col items-center justify-start px-6 pt-3 pb-6 lg:px-8 lg:pt-4">

          <div className="text-center w-full mt-0">
            <img
              src={logoImage}
              alt="DrogIA Logo"
              className="w-[280px] lg:w-[310px] max-w-full h-auto mb-3 mx-auto object-contain"
            />

            <p className="text-[13px] text-slate-500 font-light">
              Ingresa tus credenciales para iniciar sesión
            </p>
          </div>

          <LoginForm />

        </div>

        {/* Panel derecho */}
        <div className="flex-1 bg-[#56ccf2] hidden lg:flex justify-center items-center p-12">
          <img
            src={logoImage}
            alt="DrogIA Logo Grande"
            className="w-[520px] lg:w-[580px] h-auto object-contain drop-shadow-xl"
          />
        </div>

      </div>
    </div>
  );
}