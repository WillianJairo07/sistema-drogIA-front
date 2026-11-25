import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { hasPermission } from "../../features/auth/config/permissions";
import {
  LayoutDashboard,
  FileText,
  Users,
  UserCog,
  Package,
  ShoppingCart,
  ArrowLeftRight,
  Warehouse,
  Mail,
  Truck,
  ClipboardList,
  Send,
  LogOut,
} from "lucide-react";
import logoImage from "../../assets/logo.png";

const menuItems = [
  { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { label: "Cotizaciones", path: "/dashboard/cotizaciones", icon: FileText },
  { label: "Clientes", path: "/dashboard/clientes", icon: Users },
  { label: "Usuarios", path: "/dashboard/usuarios", icon: UserCog },
  { label: "Productos", path: "/dashboard/productos", icon: Package },
  { label: "Ventas", path: "/dashboard/ventas", icon: ShoppingCart },
  { label: "Trazabilidad", path: "/dashboard/ventas-compras", icon: ArrowLeftRight },
  { label: "Inventario", path: "/dashboard/inventario", icon: Warehouse },
  { label: "Análisis de Correos", path: "/dashboard/correos", icon: Mail },
  { label: "Proveedores", path: "/dashboard/proveedores", icon: Truck },
  { label: "Órdenes de Compra", path: "/dashboard/ordenes-compra", icon: ClipboardList },
  { label: "Despacho", path: "/dashboard/despacho", icon: Send },
];

export default function Sidebar({ isOpen, onClose }) {
  const { user, logout } = useAuth();

  const visibleItems = menuItems.filter((item) =>
    hasPermission(user?.role, item.path)
  );

  const handleLogout = () => {
    logout();
    window.location.href = "/login";
  };

  return (
    <aside
      className={`sidebar-container ${
        isOpen ? "sidebar-open" : "sidebar-closed"
      }`}
    >
      <div className="sidebar-inner">
        {/* Logo */}
        <div className="sidebar-logo-container">
          <img
            src={logoImage}
            alt="DrogIA Logo"
            className="sidebar-logo-img"
          />
        </div>

        {/* Menú */}
        <nav className="sidebar-nav">
          <div className="sidebar-menu-list">
            {visibleItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === "/dashboard"}
                  onClick={() => {
                    if (window.innerWidth < 1024) {
                      onClose();
                    }
                  }}
                  className={({ isActive }) =>
                    `sidebar-link ${isActive ? "sidebar-link-active" : ""}`
                  }
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </div>
        </nav>

        {/* Cerrar sesión */}
        <div className="sidebar-logout-container">
          <button
            type="button"
            onClick={handleLogout}
            className="sidebar-logout-btn"
          >
            <LogOut className="h-5 w-5" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </div>
    </aside>
  );
}