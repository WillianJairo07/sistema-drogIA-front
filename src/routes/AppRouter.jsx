
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
          {/* Dashboard disponible para todos los roles */}
          <Route index element={<DashboardPage />} />

          {/* Rutas según permisos del usuario */}
          <Route
            path="cotizaciones"
            element={
              <ProtectedRoute path="/dashboard/cotizaciones">
                <CotizacionesPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="clientes"
            element={
              <ProtectedRoute path="/dashboard/clientes">
                <ClientesPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="productos"
            element={
              <ProtectedRoute path="/dashboard/productos">
                <ProductosPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="ventas"
            element={
              <ProtectedRoute path="/dashboard/ventas">
                <VentasPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="ventas-compras"
            element={
              <ProtectedRoute path="/dashboard/ventas-compras">
                <VentasComprasPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="inventario"
            element={
              <ProtectedRoute path="/dashboard/inventario">
                <InventarioPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="correos"
            element={
              <ProtectedRoute path="/dashboard/correos">
                <CorreosPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="proveedores"
            element={
              <ProtectedRoute path="/dashboard/proveedores">
                <ProveedoresPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="ordenes-compra"
            element={
              <ProtectedRoute path="/dashboard/ordenes-compra">
                <OrdenesCompraPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="plazos"
            element={
              <ProtectedRoute path="/dashboard/plazos">
                <PlazosPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="usuarios"
            element={
              <ProtectedRoute path="/dashboard/usuarios">
                <UsuariosPage />
              </ProtectedRoute>
            }
          />
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

