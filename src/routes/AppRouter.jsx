import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "../pages/LoginPage";
import DashboardLayout from "../layouts/DashboardLayout";
import DashboardPage from "../pages/DashboardPage";
import { ProductosPage } from "../pages/ProductosPage";
import { CotizacionesPage } from "../pages/CotizacionesPage";
import { ClientesPage } from "../pages/ClientesPage";
import { VentasComprasPage } from "../pages/VentasComprasPage";
import { InventarioPage } from "../pages/InventarioPage";
import { CorreosPage } from "../pages/CorreosPage";
import { ProveedoresPage } from "../pages/ProveedoresPage";
import { OrdenesCompraPage } from "../pages/OrdenesCompraPage";
import { PlazosPage } from "../pages/PlazosPage";
import { VentasPage } from "../pages/VentasPage";
import UsuariosPage from "../pages/UsuariosPage";

import ProtectedRoute from "../components/auth/ProtectedRoute";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Login */}
        <Route path="/login" element={<LoginPage />} />

        {/* Rutas protegidas */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="cotizaciones" element={<CotizacionesPage />} />
          <Route path="clientes" element={<ClientesPage />} />
          <Route path="productos" element={<ProductosPage />} />
          <Route path="ventas" element={<VentasPage />} />
          <Route path="ventas-compras" element={<VentasComprasPage />} />
          <Route path="inventario" element={<InventarioPage />} />
          <Route path="correos" element={<CorreosPage />} />
          <Route path="proveedores" element={<ProveedoresPage />} />
          <Route path="ordenes-compra" element={<OrdenesCompraPage />} />
          <Route path="plazos" element={<PlazosPage />} />
          <Route path="usuarios" element={<UsuariosPage />} />
          
        </Route>

        {/* Cualquier ruta inexistente */}
        <Route
          path="*"
          element={<Navigate to="/login" replace />}
        />

      </Routes>
    </BrowserRouter>
  );
}