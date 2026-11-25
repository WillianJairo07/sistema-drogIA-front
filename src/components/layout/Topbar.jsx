import { useState } from "react";
import {
  AlignLeft,
  Bell,
  ChevronDown,
  LogOut,
} from "lucide-react";

export default function Topbar({ onToggleSidebar }) {
  const [showUser, setShowUser] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <header className="topbar-header">
      {/* LADO IZQUIERDO: Botón de menú y un botón extra (por ejemplo, de inicio o ayuda) */}
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

      {/* LADO DERECHO: Notificaciones y Menú de Usuario (Sin el indicador de sesión) */}
      <div className="topbar-actions-section">
        {/* Notificaciones */}
        <div style={{ position: "relative" }}>
          <button
            type="button"
            onClick={() => setShowNotifications(!showNotifications)}
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

        {/* Usuario */}
        <div style={{ position: "relative" }}>
          <button
            type="button"
            onClick={() => setShowUser(!showUser)}
            className="topbar-user-btn"
          >
            <span style={{ fontSize: "14px", fontWeight: "500", color: "#334155" }}>
              Administrador
            </span>

            <div className="user-avatar">A</div>

            <ChevronDown className="h-4 w-4 text-slate-500" />
          </button>

          {showUser && (
            <div className="user-dropdown-menu">
              <p className="user-dropdown-email">admin@drogia.com</p>

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