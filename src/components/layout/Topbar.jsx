import { useState } from "react";
import {
  AlignLeft,
  Bell,
  ChevronDown,
  LogOut,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

function getStoredUser() {
  try {
    const rawUser =
      localStorage.getItem("user") ||
      localStorage.getItem("usuario") ||
      localStorage.getItem("authUser") ||
      localStorage.getItem("currentUser");

    if (rawUser) {
      return JSON.parse(rawUser);
    }

    const token = localStorage.getItem("token");
    if (token && token.split(".").length === 3) {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return {
        role:
          payload.role ||
          payload.rol ||
          payload.authority ||
          payload.authorities?.[0],
        email: payload.email || payload.correo || payload.sub,
        name: payload.name || payload.nombre,
      };
    }
  } catch {
    return null;
  }
  return null;
}

export default function Topbar({ onToggleSidebar }) {
  const auth = useAuth?.();
  const currentUser = auth?.user || getStoredUser();

  const [showUser, setShowUser] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const roleText =
    currentUser?.role ||
    currentUser?.rol ||
    currentUser?.roleName ||
    "Usuario";

  const emailText =
    currentUser?.email ||
    currentUser?.correo ||
    currentUser?.userEmail ||
    localStorage.getItem("userEmail") ||
    localStorage.getItem("email") ||
    "sin-correo@drogia.com";

  const avatarLetter =
    (typeof roleText === "string" && roleText.trim().charAt(0).toUpperCase()) ||
    "U";

  const logout = () => {
    auth?.logout?.();
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("usuario");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("email");
    window.location.href = "/login";
  };

  return (
    <header className="topbar-header">
      <div className="topbar-left-section">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="topbar-menu-btn"
          title="Alternar Menú"
        >
          <AlignLeft className="h-5 w-5 text-slate-700" />
        </button>
      </div>

      <div className="topbar-actions-section">
        <div style={{ position: "relative" }}>
          <button
            type="button"
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowUser(false);
            }}
            className="topbar-icon-btn"
          >
            <Bell className="h-5 w-5 text-slate-700" />
            <span className="notification-dot" />
          </button>

          {showNotifications && (
            <div className="topbar-dropdown-menu">
              <p style={{ fontSize: "14px", fontWeight: "600", margin: "0 0 8px 0" }}>
                Notificaciones
              </p>
              <p style={{ fontSize: "12px", color: "#64748b", margin: 0 }}>
                No hay nuevas notificaciones.
              </p>
            </div>
          )}
        </div>

        <div style={{ position: "relative" }}>
          <button
            type="button"
            onClick={() => {
              setShowUser(!showUser);
              setShowNotifications(false);
            }}
            className="topbar-user-btn"
          >
            <span style={{ fontSize: "14px", fontWeight: "500", color: "#334155" }}>
              {roleText}
            </span>

            <div className="user-avatar">{avatarLetter}</div>

            <ChevronDown className="h-4 w-4 text-slate-500" />
          </button>

          {showUser && (
            <div className="user-dropdown-menu">
              <p className="user-dropdown-email">{emailText}</p>

              <button
                type="button"
                onClick={logout}
                className="user-dropdown-logout"
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