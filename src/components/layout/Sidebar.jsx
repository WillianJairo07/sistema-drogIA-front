
import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { rolePermissions } from "../../features/auth/config/permissions";
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
  Clock3,
  LogOut,
} from "lucide-react";
import logoImage from "../../assets/logo.png";

const menuItems = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Cotizaciones",
    path: "/dashboard/cotizaciones",
    icon: FileText,
  },
  {
    label: "Clientes",
    path: "/dashboard/clientes",
    icon: Users,
  },
  {
    label: "Usuarios",
    path: "/dashboard/usuarios",
    icon: UserCog,
  },
  {
    label: "Productos",
    path: "/dashboard/productos",
    icon: Package,
  },
  {
    label: "Ventas",
    path: "/dashboard/ventas",
    icon: ShoppingCart,
  },
  {
    label: "Ventas-Compras",
    path: "/dashboard/ventas-compras",
    icon: ArrowLeftRight,
  },
  {
    label: "Inventario",
    path: "/dashboard/inventario",
    icon: Warehouse,
  },
  {
    label: "Análisis de Correos",
    path: "/dashboard/correos",
    icon: Mail,
  },
  {
    label: "Proveedores",
    path: "/dashboard/proveedores",
    icon: Truck,
  },
  {
    label: "Órdenes de Compra",
    path: "/dashboard/ordenes-compra",
    icon: ClipboardList,
  },
  {
    label: "Plazos y Penalidades",
    path: "/dashboard/plazos",
    icon: Clock3,
  },
];

export default function Sidebar({ isOpen, onClose }) {
  const { user, logout } = useAuth();

  const allowedPaths = rolePermissions[user?.role] || [];

  const visibleItems = menuItems.filter((item) =>
    allowedPaths.includes(item.path)
  );

  const handleLogout = () => {
    logout();
    window.location.href = "/login";
  };

  return (
    <aside
      className={`absolute inset-y-0 left-0 z-50 overflow-hidden bg-[#56ccf2] transition-all duration-300 lg:relative ${
        isOpen
          ? "w-64 shadow-xl lg:shadow-none"
          : "w-0 -translate-x-full lg:translate-x-0"
      }`}
    >
      <div className="flex h-full w-64 flex-col">

        {/* Logo */}
        <div className="flex h-20 shrink-0 items-center justify-center border-b border-sky-300/60 bg-[#7FCFEC]">
          <img
            src={logoImage}
            alt="DrogIA Logo"
            className="w-[210px] max-h-16 scale-200 object-contain"
          />
        </div>

        {/* Menú */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <div className="flex flex-col gap-1.5">
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
                    `flex items-center gap-3.5 rounded-lg px-4 py-3 text-sm font-medium transition-all ${
                      isActive
                        ? "bg-[#17324c] text-white shadow-md"
                        : "text-slate-800 hover:bg-[#17324c] hover:text-white"
                    }`
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
        <div className="shrink-0 border-t border-sky-400/60 p-3">
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3.5 rounded-lg px-4 py-3 text-sm font-medium text-red-700 transition-colors hover:bg-red-500/10"
          >
            <LogOut className="h-5 w-5" />
            <span>Cerrar Sesión</span>
          </button>
        </div>

      </div>
    </aside>
  );
}
