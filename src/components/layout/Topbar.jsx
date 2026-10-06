import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  AlignLeft,
  Bell,
  ChevronDown,
  Clock,
  LogOut,
} from "lucide-react";

const pageTitles = {
  "/dashboard": "Panel Principal",
  "/dashboard/cotizaciones": "Gestión de Cotizaciones",
  "/dashboard/clientes": "Gestión de Clientes",
  "/dashboard/productos": "Gestión de Productos",
};

export default function Topbar({ onToggleSidebar }) {
  const [showUser, setShowUser] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [time, setTime] = useState("");

  const location = useLocation();

  useEffect(() => {
    const updateTime = () => {
      setTime(
        new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    };

    updateTime();
    const timer = setInterval(updateTime, 60000);

    return () => clearInterval(timer);
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <header className="flex h-20 items-center justify-between border-b border-slate-200 bg-white px-6 shadow-xs">
      {/* Título */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="cursor-pointer rounded-lg p-2 text-slate-700 hover:bg-slate-100"
        >
          <AlignLeft className="h-5 w-5" />
        </button>

        <h1 className="hidden text-lg font-semibold text-slate-800 sm:block">
          {pageTitles[location.pathname] || "Panel Administrativo"}
        </h1>
      </div>

      {/* Acciones */}
      <div className="flex items-center gap-3">
        <div className="hidden items-center gap-2 rounded-full bg-slate-50 px-3 py-1.5 text-xs text-slate-600 md:flex">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
          <span>Sesión Activa</span>
          <span>|</span>
          <Clock className="h-3.5 w-3.5" />
          <span>{time}</span>
        </div>

        {/* Notificaciones */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative cursor-pointer rounded-full border border-slate-200 p-2.5 hover:bg-slate-100"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute right-1.5 top-1.5 h-2.5 w-2.5 rounded-full bg-red-500" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 z-50 mt-2 w-72 rounded-xl bg-white p-4 shadow-xl">
              <p className="text-sm font-semibold">Notificaciones</p>
              <p className="mt-2 text-xs text-slate-500">
                No hay nuevas notificaciones.
              </p>
            </div>
          )}
        </div>

        {/* Usuario */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowUser(!showUser)}
            className="flex cursor-pointer items-center gap-2 rounded-full border border-slate-200 px-3 py-1.5 hover:bg-slate-100"
          >
            <span className="text-sm font-medium text-slate-700">
              Administrador
            </span>

            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#17324c] text-sm font-semibold text-white">
              A
            </div>

            <ChevronDown className="h-4 w-4 text-slate-500" />
          </button>

          {showUser && (
            <div className="absolute right-0 z-50 mt-2 w-48 rounded-lg bg-white py-1 shadow-xl">
              <p className="px-4 py-2 text-xs text-slate-500">
                admin@drogia.com
              </p>

              <button
                type="button"
                onClick={logout}
                className="flex w-full cursor-pointer items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                <LogOut className="h-4 w-4" />
                Cerrar Sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}