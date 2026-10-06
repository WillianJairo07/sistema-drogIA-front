import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "../pages/LoginPage";
import DashboardLayout from "../layouts/DashboardLayout";
import DashboardPage from "../pages/DashboardPage";
import { ProductosPage } from "../pages/ProductosPage";
import { CotizacionesPage } from "../pages/CotizacionesPage";
import { ClientesPage } from "../pages/ClientesPage";

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