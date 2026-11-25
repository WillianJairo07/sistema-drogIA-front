import { useCallback, useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";
import { listarVentas, crearVenta, cambiarEstadoVenta } from "../features/ventas/services/ventaService";
import {
  listarSolicitudes,
  cambiarEstadoSolicitud,
} from "../features/solicitudesCompra/services/solicitudCompraService";
import {
  listarOrdenes,
  crearOrdenCompra,
  cambiarEstadoOrden,
  registrarRecepcionOrden,
} from "../features/ordenesCompra/services/ordenCompraService";
import {
  listarInventario,
  crearInventario,
  actualizarInventario,
} from "../features/inventario/services/inventarioService";
import { listarInventarioAlmacen } from "../features/inventario/services/inventarioAlmacenService";
import {
  listarDespachos,
  crearDespacho,
  cambiarEstadoDespacho,
} from "../features/despachos/services/despachoService";
import {
  listarPedidos,
  marcarPedidoTomado,
  verificarPedido,
  cambiarEstadoPedido,
} from "../features/pedidosAlmacen/services/pedidoAlmacenService";
import "../styles/dashboard.css";

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [sales, setSales] = useState([]);
  const [purchaseRequests, setPurchaseRequests] = useState([]);
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [inventarioAlmacen, setInventarioAlmacen] = useState([]);
  const [dispatches, setDispatches] = useState([]);
  const [pedidos, setPedidos] = useState([]);

  const recargar = useCallback(async () => {
    await Promise.all([
      listarVentas().then(setSales).catch(() => setSales([])),
      listarSolicitudes().then(setPurchaseRequests).catch(() => setPurchaseRequests([])),
      listarOrdenes().then(setPurchaseOrders).catch(() => setPurchaseOrders([])),
      listarInventario().then(setInventory).catch(() => setInventory([])),
      listarInventarioAlmacen()
        .then(setInventarioAlmacen)
        .catch(() => setInventarioAlmacen([])),
      listarDespachos().then(setDispatches).catch(() => setDispatches([])),
      listarPedidos().then(setPedidos).catch(() => setPedidos([])),
    ]);
  }, []);

  useEffect(() => {
    recargar();
  }, [recargar]);

  const toggleSidebar = () => {
    setSidebarOpen((current) => !current);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const handleCreateSale = async (sale) => {
    try {
      const yaExiste = sales.some((item) => item.id === sale.id);
      if (!yaExiste && !sale.cotizacionId) {
        await crearVenta(sale);
      }
      await recargar();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleSaleStatusChange = async (saleId, status) => {
    try {
      await cambiarEstadoVenta(saleId, status);
      await recargar();
    } catch (error) {
      alert(error.message);
    }
  };

  const handlePurchaseRequestStatusChange = async (requestId, status) => {
    try {
      await cambiarEstadoSolicitud(requestId, status);
      await recargar();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleCreatePurchaseOrder = async (order) => {
    try {
      await crearOrdenCompra(order);
      await recargar();
    } catch (error) {
      alert(error.message);
    }
  };

  const handlePurchaseOrderStatusChange = async (orderId, status) => {
    try {
      await cambiarEstadoOrden(orderId, status);
      await recargar();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleRegisterPurchaseReceipt = async (orderId) => {
    const order = purchaseOrders.find((item) => item.id === orderId);
    if (!order || order.receiptRegistered) {
      return;
    }

    try {
      await registrarRecepcionOrden(orderId);
      await recargar();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleAddInventoryItem = async (newItem) => {
    try {
      await crearInventario(newItem);
      await recargar();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleUpdateInventoryItem = async (updatedItem) => {
    try {
      await actualizarInventario(updatedItem.id, updatedItem);
      await recargar();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleCreateDispatch = async (dispatchRecord) => {
    try {
      await crearDespacho(dispatchRecord);
      await recargar();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleCambiarEstadoDespacho = async (despachoId, estado) => {
    try {
      await cambiarEstadoDespacho(despachoId, estado);
      await recargar();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleTomarPedido = async (pedidoId) => {
    try {
      await marcarPedidoTomado(pedidoId);
      await recargar();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleVerificarPedido = async (pedidoId, verificadoInfo, verificadoLotes) => {
    try {
      await verificarPedido(pedidoId, verificadoInfo, verificadoLotes);
      await recargar();
    } catch (error) {
      alert(error.message);
    }
  };

  const handlePedidoStatusChange = async (pedidoId, estado) => {
    try {
      await cambiarEstadoPedido(pedidoId, estado);
      await recargar();
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="dashboard-screen">
      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />

      <button
        type="button"
        onClick={toggleSidebar}
        className="sidebar-toggle-btn"
        style={{
          left: sidebarOpen ? "244px" : "-20px",
        }}
      >
        {sidebarOpen ? (
          <ChevronLeft className="h-5 w-5 stroke-[2.5]" />
        ) : (
          <ChevronRight className="h-5 w-5 stroke-[2.5]" />
        )}
      </button>

      <div className="dashboard-main-container">
        <Topbar onToggleSidebar={toggleSidebar} />

        <main className="dashboard-content-area">
          <div className="dashboard-content-wrapper">
            <Outlet
              context={{
                sales,
                onCreateSale: handleCreateSale,
                onSaleStatusChange: handleSaleStatusChange,

                purchaseRequests,
                onPurchaseRequestStatusChange:
                  handlePurchaseRequestStatusChange,

                purchaseOrders,
                onCreatePurchaseOrder: handleCreatePurchaseOrder,
                onPurchaseOrderStatusChange:
                  handlePurchaseOrderStatusChange,
                onRegisterPurchaseReceipt:
                  handleRegisterPurchaseReceipt,

                inventory,
                inventarioAlmacen,
                onAddInventoryItem: handleAddInventoryItem,
                onUpdateInventoryItem: handleUpdateInventoryItem,

                dispatches,
                onCreateDispatch: handleCreateDispatch,
                onDespachoStatusChange: handleCambiarEstadoDespacho,

                pedidos,
                onTomarPedido: handleTomarPedido,
                onVerificarPedido: handleVerificarPedido,
                onPedidoStatusChange: handlePedidoStatusChange,
              }}
            />
          </div>
        </main>
      </div>

      {sidebarOpen && (
        <div onClick={closeSidebar} className="sidebar-backdrop" />
      )}
    </div>
  );
}
